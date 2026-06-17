import React from 'react';
import { Trash2, PlusCircle } from 'lucide-react';
import QuestionOption from './QuestionOption';

const QuestionCard = ({ question, index, onChange, onDelete }) => {
  const optionLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = { ...newOptions[optionIndex], content: value };
    onChange({ ...question, options: newOptions });
  };

  const handleCorrectAnswerChange = (optionIndex) => {
    const newOptions = question.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === optionIndex,
    }));
    onChange({ ...question, options: newOptions });
  };

  const handleAddOption = () => {
    onChange({
      ...question,
      options: [...question.options, { content: '', isCorrect: false }],
    });
  };

  const handleDeleteOption = (optionIndex) => {
    if (question.options.length <= 2) return;
    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    // If deleted option was the correct one, reset to first
    const hasCorrect = newOptions.some((opt) => opt.isCorrect);
    if (!hasCorrect && newOptions.length > 0) {
      newOptions[0] = { ...newOptions[0], isCorrect: true };
    }
    onChange({ ...question, options: newOptions });
  };

  return (
    <div className="p-6 border border-slate-100 rounded-xl bg-white space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Câu hỏi {index + 1}</h3>
        <button
          onClick={onDelete}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Xóa câu hỏi"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Question Text */}
      <div>
        <textarea
          value={question.question}
          onChange={(e) => onChange({ ...question, question: e.target.value })}
          placeholder="Nhập nội dung câu hỏi..."
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none min-h-[100px]"
        />
      </div>

      {/* Options */}
      <div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Các lựa chọn đáp án
        </div>
        <div className="space-y-3">
          {question.options.map((option, optIndex) => (
            <QuestionOption
              key={optIndex}
              label={`q${index}`}
              option={optionLabels[optIndex] || `${optIndex + 1}`}
              value={option.content}
              isCorrect={option.isCorrect}
              onChange={(e) => handleOptionChange(optIndex, e.target.value)}
              onSelectCorrect={() => handleCorrectAnswerChange(optIndex)}
              onDelete={() => handleDeleteOption(optIndex)}
              canDelete={question.options.length > 2}
            />
          ))}
        </div>
        <button
          onClick={handleAddOption}
          className="mt-3 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Thêm đáp án
        </button>
      </div>

      {/* Explanation */}
      <div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Giải thích (Không bắt buộc)
        </div>
        <textarea
          value={question.explanation}
          onChange={(e) => onChange({ ...question, explanation: e.target.value })}
          placeholder="Giải thích đáp án giúp học viên hiểu rõ hơn sau khi hoàn thành bài kiểm tra."
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none min-h-[80px]"
        />
      </div>
    </div>
  );
};

export default QuestionCard;
