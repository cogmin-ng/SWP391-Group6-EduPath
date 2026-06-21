import { useState, useEffect, useCallback, useRef } from 'react';
import { Navigate, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Clock, Loader2, Star, X,
} from 'lucide-react';
import QuizResult from '../../components/mentee/quiz/QuizResult';
import { getRoadmapBySlug } from '../../services/roadmapService';
import { getNodeDetails } from '../../services/nodeService';
import { getQuizById, submitQuizAttempt } from '../../services/quizService';

function normalizeQuiz(quiz) {
  return {
    ...quiz,
    questions: (quiz.questions || []).map((question) => ({
      ...question,
      options: (question.options || []).map((option, index) => ({
        id: String.fromCharCode(65 + index),
        value: option.id,
        label: option.content,
        isCorrect: option.isCorrect,
      })),
    })),
    durationMinutes: Math.max(5, (quiz.questions?.length || 0) * 2),
  };
}

export default function RoadmapQuizPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const nodeId = searchParams.get('nodeId');

  const [roadmap, setRoadmap] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const loadQuiz = async () => {
      try {
        setLoading(true);
        const roadmapData = await getRoadmapBySlug(slug);
        if (!isMounted) return;
        setRoadmap(roadmapData);

        let resolvedNodeId = nodeId;
        if (!resolvedNodeId) {
          const firstIncomplete = roadmapData.nodes.find((node) => !node.completed);
          resolvedNodeId = firstIncomplete?.id || roadmapData.nodes[0]?.id;
        }

        if (!resolvedNodeId) {
          setQuiz(null);
          return;
        }

        const nodeData = await getNodeDetails(resolvedNodeId);
        const node = nodeData.data || nodeData;
        const firstQuiz = node.quizzes?.[0];

        if (!firstQuiz) {
          setQuiz(null);
          return;
        }

        const quizData = await getQuizById(firstQuiz.id);
        if (!isMounted) return;
        const normalizedQuiz = normalizeQuiz(quizData);
        setQuiz(normalizedQuiz);
        setTimeLeft(normalizedQuiz.durationMinutes * 60);
      } catch (error) {
        if (!isMounted) return;
        console.error('Failed to load roadmap quiz:', error);
        setQuiz(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadQuiz();

    return () => {
      isMounted = false;
    };
  }, [slug, nodeId]);

  const handleSubmit = useCallback(async () => {
    clearInterval(timerRef.current);
    if (!quiz || submitting) return;

    setSubmitting(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(answers)
          .map(([index, optionId]) => {
            const question = quiz.questions[Number(index)];
            const option = question?.options.find((item) => item.id === optionId);
            return [question.id, option?.value];
          })
          .filter(([, optionValue]) => Boolean(optionValue))
      );

      await submitQuizAttempt(quiz.id, payload);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  }, [answers, quiz, submitting]);

  useEffect(() => {
    if (loading || submitted || !quiz) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [handleSubmit, loading, submitted, quiz]);

  const handleSelect = useCallback((optionId) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionId,
    }));
  }, [currentIndex, submitted]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleGoBack = () => {
    navigate(`/roadmaps/${slug}/learn`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-slate-500">Đang tải bài kiểm tra...</p>
      </div>
    );
  }

  if (!roadmap || !quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-slate-500">Không tìm thấy bài kiểm tra.</p>
      </div>
    );
  }

  if (!roadmap.enrollment) return <Navigate to={`/explore/${slug}`} replace />;

  const questions = quiz.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentIndex] || null;

  const answeredCount = Object.keys(answers).length;
  const correctCount = submitted
    ? Object.entries(answers).filter(
        ([idx, optId]) =>
          questions[Number(idx)]?.options.find((o) => o.id === optId)?.isCorrect
      ).length
    : 0;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleGoBack} className="p-1.5 -ml-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-bold text-primary">EduPath</span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold tabular-nums">{formatTime(timeLeft)}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-on-surface-variant">
                Câu {currentIndex + 1} / {totalQuestions}
              </span>
              <div className="w-24 h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 to-secondary transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1.5 bg-secondary px-3 py-1 rounded-full text-on-secondary text-xs font-semibold shadow-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              +{totalQuestions * 10} XP tiềm năng
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleGoBack} className="p-2 text-error hover:bg-error-container/20 rounded-lg transition-colors flex items-center gap-1" title="Thoát">
              <X className="w-4 h-4" />
              <span className="text-xs font-semibold hidden md:inline">Thoát</span>
            </button>
          </div>
        </div>
      </header>

      {submitted ? (
        <QuizResult
          questions={questions}
          answers={answers}
          onGoBack={handleGoBack}
          onRetry={() => {
            setAnswers({});
            setCurrentIndex(0);
            setSubmitted(false);
            setTimeLeft(quiz.durationMinutes * 60);
          }}
        />
      ) : (
        <div className="flex-grow w-full max-w-screen-2xl mx-auto px-4 md:px-6 py-6 flex flex-col lg:flex-row gap-6">
          <div className="flex-grow flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 md:p-8">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3 block">{quiz.title}</span>
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-6">{currentQuestion?.question}</h2>
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion?.options.map((option) => {
                  const isSelected = selectedAnswer === option.id;
                  return (
                    <button key={option.id} onClick={() => handleSelect(option.id)}
                      className={`flex items-center gap-3 p-4 rounded-lg border text-left w-full transition-all duration-200 ${
                        isSelected ? 'bg-indigo-50 border-indigo-600 shadow-sm' : 'bg-surface border-outline-variant hover:border-indigo-400 hover:shadow-sm hover:-translate-y-0.5'
                      }`}>
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-semibold transition-colors ${
                        isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'border-outline-variant text-on-surface-variant'
                      }`}>{option.id}</div>
                      <span className="text-sm md:text-base text-on-surface">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))} disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
                <ArrowLeft className="w-4 h-4" /> Câu trước
              </button>
              {currentIndex < totalQuestions - 1 ? (
                <button onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-semibold shadow-sm">
                  Câu tiếp theo <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm font-semibold shadow-sm">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
                  {submitting ? 'Đang nộp...' : 'Nộp bài'}
                </button>
              )}
            </div>
          </div>
          <aside className="w-full lg:w-72 flex flex-col gap-4 flex-shrink-0">
            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Danh sách câu hỏi</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const ans = answers[idx];
                  const isCurrent = idx === currentIndex;
                  let btnClass = 'aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-all';
                  if (isCurrent) btnClass += ' bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600 ring-offset-2 ring-offset-white';
                  else if (ans) btnClass += ' bg-indigo-50 text-indigo-700 border border-indigo-200';
                  else btnClass += ' bg-surface-container text-on-surface-variant hover:bg-surface-container-high';
                  return (
                    <button key={q.id} onClick={() => setCurrentIndex(idx)} className={btnClass}>{idx + 1}</button>
                  );
                })}
              </div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/50">
              <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Thống kê</h4>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface">Đã trả lời</span>
                  <span className="text-sm font-semibold text-indigo-600">{answeredCount}/{totalQuestions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface">Độ chính xác</span>
                  <span className="text-sm font-semibold text-green-600">{accuracy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface">Thời gian</span>
                  <span className="text-sm font-semibold text-on-surface">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
            {answeredCount < totalQuestions && (
              <button onClick={handleSubmit} disabled={submitting}
                className="w-full py-3 rounded-lg border border-outline text-on-surface-variant hover:bg-surface-container disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {submitting ? 'Đang nộp...' : 'Nộp bài ngay'}
              </button>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
