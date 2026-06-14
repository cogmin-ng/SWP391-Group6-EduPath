import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import QuizForm from '../../components/mentor/quiz/QuizForm';
import QuestionCard from '../../components/mentor/quiz/QuestionCard';
import AddQuestionButton from '../../components/mentor/quiz/AddQuestionButton';
import QuizOverviewCard from '../../components/mentor/quiz/QuizOverviewCard';

const CreateQuizPage = () => {
  const { roadmapId, nodeId, quizId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!quizId;

  const [quizData, setQuizData] = useState({
    title: isEditing ? 'JavaScript Fundamentals Assessment' : '',
    duration: isEditing ? 30 : 30,
    passingScore: isEditing ? 80 : 80,
    questions: [
      {
        question: isEditing ? 'Sự khác biệt chính giữa `let` và `var` trong JavaScript là gì?' : '',
        options: isEditing ? [
          '`let` có scope block, `var` có scope function.',
          '`let` có thể khai báo lại, `var` thì không.',
          '`var` được hoisting, `let` thì không hoàn toàn.',
          'Nhập nội dung đáp án D...'
        ] : ['', '', '', ''],
        correctAnswer: isEditing ? 0 : 0,
        explanation: isEditing ? 'Giải thích đáp án giúp học viên hiểu rõ hơn sau khi hoàn thành bài kiểm tra.' : ''
      }
    ]
  });

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
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: ''
        }
      ]
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
    setQuizData((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions.splice(index, 1);
      return { ...prev, questions: newQuestions };
    });
  };

  const handleSave = () => {
    console.log('Saved Quiz Data:', quizData);
    // In a real app, this would call an API, then navigate back
    navigate(`/mentor/roadmaps/${roadmapId}/nodes/${nodeId}`);
  };

  const handleBack = () => {
    navigate(`/mentor/roadmaps/${roadmapId}/nodes/${nodeId}`);
  };

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
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-sm shadow-indigo-200"
              >
                <Save className="w-5 h-5" />
                Lưu bài trắc nghiệm
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <QuizOverviewCard
              totalQuestions={quizData.questions.length}
              estimatedTime={quizData.duration}
              passScore={quizData.passingScore}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizPage;
