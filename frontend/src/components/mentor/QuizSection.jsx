import { Plus, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const QuizSection = ({ quizzes }) => {
  const [selectedAnswers, setSelectedAnswers] = useState(
    quizzes.reduce((acc, quiz) => {
      acc[quiz.id] = quiz.selectedAnswer;
      return acc;
    }, {})
  );

  const [showExplanation, setShowExplanation] = useState(
    quizzes.reduce((acc, quiz) => {
      acc[quiz.id] = !!quiz.selectedAnswer;
      return acc;
    }, {})
  );

  const handleSelectAnswer = (quizId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizId]: optionId,
    }));
    setShowExplanation((prev) => ({
      ...prev,
      [quizId]: true,
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Bài Kiểm Tra Node</h2>
        </div>
        <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" />
          Thêm Câu Hỏi
        </button>
      </div>

      {/* Quizzes */}
      <div className="space-y-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="p-6 border border-slate-100 rounded-xl">
            {/* Question */}
            <h3 className="text-base font-semibold text-slate-900 mb-4">
              {quiz.question}
            </h3>

            {/* Options */}
            <div className="space-y-2 mb-4">
              {quiz.options.map((option) => {
                const isSelected = selectedAnswers[quiz.id] === option.id;
                const isCorrect = option.isCorrect;
                const showCorrectness = showExplanation[quiz.id] && selectedAnswers[quiz.id];

                return (
                  <label
                    key={option.id}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                      ${
                        isSelected
                          ? showCorrectness && isCorrect
                            ? 'border-emerald-300 bg-emerald-50'
                            : showCorrectness && !isCorrect
                            ? 'border-red-300 bg-red-50'
                            : 'border-indigo-300 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name={`quiz-${quiz.id}`}
                      value={option.id}
                      checked={isSelected}
                      onChange={() => handleSelectAnswer(quiz.id, option.id)}
                      className="w-5 h-5 cursor-pointer accent-indigo-600"
                    />
                    <span className="text-sm text-slate-800 flex-1">
                      {option.label}
                    </span>
                    {isSelected && showCorrectness && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                  </label>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation[quiz.id] && selectedAnswers[quiz.id] && (
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Explanation: </span>
                  {quiz.explanation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizSection;
