import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import QuizForm from '../../components/mentor/quiz/QuizForm';
import QuestionCard from '../../components/mentor/quiz/QuestionCard';
import AddQuestionButton from '../../components/mentor/quiz/AddQuestionButton';
import QuizOverviewCard from '../../components/mentor/quiz/QuizOverviewCard';
import { createQuiz, getQuizById, updateQuiz } from '../../services/quizService';

const CreateQuizPage = () => {
  const { roadmapId, nodeId, quizId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!quizId;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    passingScore: 80,
    xpReward: 50,
    questions: [
      {
        question: '',
        explanation: '',
        options: [
          { content: '', isCorrect: true },
          { content: '', isCorrect: false },
          { content: '', isCorrect: false },
          { content: '', isCorrect: false },
        ],
      },
    ],
  });

  // Load quiz data when editing
  useEffect(() => {
    if (!isEditing) return;

    const fetchQuiz = async () => {
      setLoading(true);
      setError(null);
      try {
        const quiz = await getQuizById(quizId);
        setQuizData({
          title: quiz.title || '',
          description: quiz.description || '',
          passingScore: quiz.passingScore || 80,
          xpReward: quiz.xpReward ?? 50,
          questions: quiz.questions.map((q) => ({
            question: q.question || '',
            explanation: q.explanation || '',
            options: q.options.map((opt) => ({
              content: opt.content || '',
              isCorrect: opt.isCorrect || false,
            })),
          })),
        });
      } catch (err) {
        const msg = err?.response?.data?.error?.message || err.message || 'Failed to load quiz';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [isEditing, quizId]);

  const handleQuizDataChange = (newData) => {
    setQuizData(newData);
  };

  const handleAddQuestion = () => {
    setQuizData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: '',
          explanation: '',
          options: [
            { content: '', isCorrect: true },
            { content: '', isCorrect: false },
            { content: '', isCorrect: false },
            { content: '', isCorrect: false },
          ],
        },
      ],
    }));
  };

  const handleQuestionChange = (index, newQuestionData) => {
    setQuizData((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = newQuestionData;
      return { ...prev, questions: newQuestions };
    });
  };

  const handleDeleteQuestion = (index) => {
    if (quizData.questions.length <= 1) return;
    setQuizData((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions.splice(index, 1);
      return { ...prev, questions: newQuestions };
    });
  };

  const validateForm = () => {
    if (!quizData.title.trim()) {
      return 'Tiêu đề bài trắc nghiệm là bắt buộc';
    }
    if (!quizData.passingScore || quizData.passingScore <= 0) {
      return 'Điểm đạt phải lớn hơn 0';
    }
    if (quizData.xpReward < 0) {
      return 'XP Reward phải lớn hơn hoặc bằng 0';
    }
    if (quizData.questions.length === 0) {
      return 'Quiz phải có ít nhất 1 câu hỏi';
    }
    for (let i = 0; i < quizData.questions.length; i++) {
      const q = quizData.questions[i];
      if (!q.question.trim()) {
        return `Câu hỏi ${i + 1}: Nội dung câu hỏi là bắt buộc`;
      }
      if (q.options.length < 2) {
        return `Câu hỏi ${i + 1}: Phải có ít nhất 2 đáp án`;
      }
      const correctCount = q.options.filter((opt) => opt.isCorrect).length;
      if (correctCount !== 1) {
        return `Câu hỏi ${i + 1}: Phải có đúng 1 đáp án đúng`;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].content.trim()) {
          return `Câu hỏi ${i + 1}, Đáp án ${j + 1}: Nội dung đáp án là bắt buộc`;
        }
      }
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        title: quizData.title.trim(),
        description: quizData.description?.trim() || null,
        passingScore: quizData.passingScore,
        xpReward: quizData.xpReward,
        questions: quizData.questions.map((q) => ({
          question: q.question.trim(),
          explanation: q.explanation?.trim() || null,
          options: q.options.map((opt) => ({
            content: opt.content.trim(),
            isCorrect: opt.isCorrect,
          })),
        })),
      };

      if (isEditing) {
        await updateQuiz(quizId, payload);
      } else {
        payload.nodeId = nodeId;
        await createQuiz(payload);
      }

      navigate(`/mentor/roadmaps/${roadmapId}/nodes/${nodeId}`);
    } catch (err) {
      const details = err?.response?.data?.error?.details;
      if (details?.fields?.length) {
        setError(details.fields.map((f) => f.message).join(', '));
      } else {
        setError(
          err?.response?.data?.error?.message || err.message || 'Đã xảy ra lỗi khi lưu quiz'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/mentor/roadmaps/${roadmapId}/nodes/${nodeId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Đang tải dữ liệu quiz...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {isEditing ? 'Chỉnh sửa bài trắc nghiệm' : 'Tạo bài trắc nghiệm cho Node'}
          </h1>
          <p className="text-slate-600">
            Thiết lập bài kiểm tra đánh giá kiến thức cho node học tập này.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Form */}
          <div className="lg:col-span-2 space-y-8">
            <QuizForm quizData={quizData} onChange={handleQuizDataChange} />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Danh sách câu hỏi</h2>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full">
                  {quizData.questions.length} Câu hỏi
                </span>
              </div>
              
              <div className="space-y-6">
                {quizData.questions.map((question, index) => (
                  <QuestionCard
                    key={index}
                    index={index}
                    question={question}
                    onChange={(newQ) => handleQuestionChange(index, newQ)}
                    onDelete={() => handleDeleteQuestion(index)}
                  />
                ))}
                
                <AddQuestionButton onClick={handleAddQuestion} />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 flex justify-center">
              <button
                onClick={handleSave}
                disabled={submitting}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium transition-all shadow-sm shadow-indigo-200"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Lưu bài trắc nghiệm
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <QuizOverviewCard
              totalQuestions={quizData.questions.length}
              passScore={quizData.passingScore}
              xpReward={quizData.xpReward}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizPage;
