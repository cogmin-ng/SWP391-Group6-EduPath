import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Clock, Star, Pause, X,
  HelpCircle, BrainCircuit,
} from 'lucide-react';
import { getQuiz } from '../../services/roadmapService';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizPage() {
  const { roadmapId, nodeId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuiz(nodeId);
        setQuiz(data);
        setTimeLeft(data.durationMinutes * 60);
      } catch (err) {
        console.error('Failed to load quiz:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [nodeId]);

  useEffect(() => {
    if (loading || submitted) return;
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
  }, [loading, submitted]);

  const handleSelect = useCallback((optionId) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionId,
    }));
  }, [currentIndex, submitted]);

  const handleSubmit = useCallback(() => {
    clearInterval(timerRef.current);
    setSubmitted(true);
  }, []);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Đang tải bài kiểm tra...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-slate-500">Không tìm thấy bài kiểm tra.</p>
      </div>
    );
  }

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

  const handleGoBack = () => {
    navigate(`/mentee/roadmaps/${roadmapId}/nodes/${nodeId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-primary">EduPath</span>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold tabular-nums">{formatTime(timeLeft)}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-on-surface-variant">
                Question {currentIndex + 1} of {totalQuestions}
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
              +{totalQuestions * 10} XP Potential
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {}}
              className="p-2 text-on-surface-variant hover:bg-primary-container/10 rounded-lg transition-colors"
              title="Tạm dừng"
            >
              <Pause className="w-4 h-4" />
            </button>
            <button
              onClick={handleGoBack}
              className="p-2 text-error hover:bg-error-container/20 rounded-lg transition-colors flex items-center gap-1"
              title="Thoát"
            >
              <X className="w-4 h-4" />
              <span className="text-xs font-semibold hidden md:inline">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      {submitted ? (
        /* ── Results Screen ── */
        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <BrainCircuit className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Quiz Complete!</h2>
            <p className="text-slate-500 mb-6">Here&apos;s how you performed</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-indigo-600">{correctCount}/{totalQuestions}</p>
                <p className="text-xs text-slate-500 mt-1">Correct</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-green-600">{accuracy}%</p>
                <p className="text-xs text-slate-500 mt-1">Accuracy</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 bg-amber-50 rounded-xl p-4 mb-8">
              <Star className="w-5 h-5 text-amber-500 fill-current" />
              <span className="text-lg font-bold text-amber-700">+{correctCount * 10} XP</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGoBack}
                className="flex-1 px-4 py-3 rounded-xl border border-outline text-on-surface-variant hover:bg-surface-container transition-colors text-sm font-semibold"
              >
                Back to Node
              </button>
              <button
                onClick={() => {
                  setAnswers({});
                  setCurrentIndex(0);
                  setSubmitted(false);
                  setTimeLeft(quiz.durationMinutes * 60);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-semibold"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── Active Quiz ── */
        <div className="flex-grow w-full max-w-screen-2xl mx-auto px-4 md:px-6 py-6 flex flex-col lg:flex-row gap-6">
          {/* Left: Question Canvas */}
          <div className="flex-grow flex flex-col gap-4">
            {/* Question Card */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 md:p-8">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-3 block">
                {quiz.title}
              </span>

              <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-6">
                {currentQuestion?.question}
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {currentQuestion?.options.map((option) => {
                  const isSelected = selectedAnswer === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option.id)}
                      className={`flex items-center gap-3 p-4 rounded-lg border text-left w-full transition-all duration-200 ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-600 shadow-sm'
                          : 'bg-surface border-outline-variant hover:border-indigo-400 hover:shadow-sm hover:-translate-y-0.5'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-semibold transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-outline-variant text-on-surface-variant group-hover:border-indigo-400 group-hover:text-indigo-600'
                        }`}
                      >
                        {option.id}
                      </div>
                      <span className="text-sm md:text-base text-on-surface">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-semibold shadow-sm"
                >
                  Next Question
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-semibold shadow-sm"
                >
                  <Star className="w-4 h-4" />
                  Submit Quiz
                </button>
              )}
            </div>
          </div>

          {/* Right: Navigator & Stats */}
          <aside className="w-full lg:w-72 flex flex-col gap-4 flex-shrink-0">
            {/* Question Navigator */}
            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Question Navigator</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const ans = answers[idx];
                  const isCurrent = idx === currentIndex;
                  let btnClass =
                    'aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-all';

                  if (isCurrent) {
                    btnClass +=
                      ' bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600 ring-offset-2 ring-offset-white';
                  } else if (ans) {
                    btnClass += ' bg-indigo-50 text-indigo-700 border border-indigo-200';
                  } else {
                    btnClass +=
                      ' bg-surface-container text-on-surface-variant hover:bg-surface-container-high';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={btnClass}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Session Stats */}
            <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/50">
              <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
                Session Stats
              </h4>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface">Answered</span>
                  <span className="text-sm font-semibold text-indigo-600">
                    {answeredCount}/{totalQuestions}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface">Accuracy</span>
                  <span className="text-sm font-semibold text-green-600">{accuracy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface">Time</span>
                  <span className="text-sm font-semibold text-on-surface">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            {/* Submit Early */}
            {answeredCount < totalQuestions && (
              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-lg border border-outline text-on-surface-variant hover:bg-surface-container transition-colors text-sm font-semibold"
              >
                Submit Quiz Early
              </button>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
