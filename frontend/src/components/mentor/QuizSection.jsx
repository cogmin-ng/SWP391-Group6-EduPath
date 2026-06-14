import React from 'react';
import { Plus, CheckCircle2, Clock, Edit, Eye, LayoutList, Trophy } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const QuizSection = ({ quizzes }) => {
  const navigate = useNavigate();
  const { roadmapId, nodeId } = useParams();

  const handleCreateQuiz = () => {
    navigate(`/mentor/roadmaps/${roadmapId}/nodes/${nodeId}/quiz/create`);
  };

  const handleEditQuiz = (quizId) => {
    navigate(`/mentor/roadmaps/${roadmapId}/nodes/${nodeId}/quiz/${quizId}/edit`);
  };

  const handlePreviewQuiz = (quizId) => {
    // In a real app, this might open a modal or navigate to a preview page
    console.log('Preview quiz', quizId);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Quizzes & Assessments</h2>
        </div>
        <button
          onClick={handleCreateQuiz}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Quiz
        </button>
      </div>

      {/* Content */}
      {quizzes && quizzes.length > 0 ? (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="p-5 border border-slate-100 hover:border-indigo-100 rounded-xl bg-slate-50/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Quiz Info */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {quiz.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <LayoutList className="w-4 h-4 text-slate-400" />
                      <span>{quiz.questionCount || quiz.questions?.length || 0} Questions</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{quiz.duration} Minutes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600 font-medium">Pass Score {quiz.passingScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:shrink-0">
                  <button
                    onClick={() => handlePreviewQuiz(quiz.id)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleEditQuiz(quiz.id)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <LayoutList className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-slate-600 mb-4">Chưa có bài trắc nghiệm cho Node này.</p>
          <button
            onClick={handleCreateQuiz}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Tạo Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizSection;

