import React, { useState, useEffect } from 'react';
import { X, Save, PlusCircle, AlertCircle } from 'lucide-react';
import QuizForm from './quiz/QuizForm';
import QuestionCard from './quiz/QuestionCard';
import AddQuestionButton from './quiz/AddQuestionButton';
import { getRoadmapById } from '../../services/roadmapService';
import ImportQuestionsModal from './ImportQuestionsModal';

const QuizModalEditor = ({ isOpen, onClose, onSave, initialData, roadmapId, subjectId }) => {
  const [quizData, setQuizData] = useState(initialData || {
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

  const [error, setError] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [finalSubjectId, setFinalSubjectId] = useState(subjectId || '');

  useEffect(() => {
    if (subjectId) {
      setFinalSubjectId(subjectId);
    } else if (roadmapId) {
      const fetchRoadmap = async () => {
        try {
          const roadmap = await getRoadmapById(roadmapId);
          setFinalSubjectId(roadmap.subjectId || '');
        } catch (err) {
          console.error('Failed to load roadmap details for subjectId in modal:', err);
        }
      };
      fetchRoadmap();
    }
  }, [subjectId, roadmapId, isOpen]);

  if (!isOpen) return null;

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

  const handleImportQuestions = (importedQuestions) => {
    const formatted = importedQuestions.map(bq => ({
      question: bq.question,
      explanation: bq.explanation || '',
      bankQuestionId: bq.id,
      options: bq.options.map(opt => ({
        content: opt.content,
        isCorrect: opt.isCorrect
      }))
    }));

    setQuizData(prev => {
      // If we only have 1 initial blank question, replace it. Otherwise append.
      const isInitialBlank = prev.questions.length === 1 && 
                             !prev.questions[0].question.trim() && 
                             prev.questions[0].options.every(opt => !opt.content.trim());
      
      return {
        ...prev,
        questions: isInitialBlank ? formatted : [...prev.questions, ...formatted]
      };
    });
  };

  const validateForm = () => {
    if (!quizData.title.trim()) return 'Tiêu đề bài trắc nghiệm là bắt buộc';
    if (!quizData.passingScore || quizData.passingScore <= 0) return 'Điểm đạt phải lớn hơn 0';
    if (quizData.questions.length === 0) return 'Quiz phải có ít nhất 1 câu hỏi';
    
    for (let i = 0; i < quizData.questions.length; i++) {
      const q = quizData.questions[i];
      if (!q.question.trim()) return `Câu hỏi ${i + 1}: Nội dung câu hỏi là bắt buộc`;
      const correctCount = q.options.filter((opt) => opt.isCorrect).length;
      if (correctCount !== 1) return `Câu hỏi ${i + 1}: Phải có đúng 1 đáp án đúng`;
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].content.trim()) return `Câu hỏi ${i + 1}, Đáp án ${j + 1}: Nội dung đáp án là bắt buộc`;
      }
    }
    return null;
  };

  const handleSave = () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    onSave(quizData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-slate-50 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {initialData ? 'Chỉnh sửa Quiz' : 'Thêm Quiz mới'}
            </h2>
            <p className="text-sm text-slate-500">Thiết lập bài kiểm tra đính kèm vào Node này</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <QuizForm quizData={quizData} onChange={setQuizData} />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Danh sách câu hỏi</h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(true)}
                  className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg font-semibold transition"
                >
                  Chọn từ ngân hàng
                </button>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-full">
                  {quizData.questions.length} Câu hỏi
                </span>
              </div>
            </div>

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

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-xl font-medium transition-all shadow-sm shadow-indigo-200"
          >
            <Save className="w-4 h-4" />
            Lưu Quiz
          </button>
        </div>
      </div>

      <ImportQuestionsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportQuestions}
        subjectId={finalSubjectId}
        excludeBankQuestionIds={quizData.questions.map(q => q.bankQuestionId).filter(Boolean)}
      />
    </div>
  );
};

export default QuizModalEditor;
