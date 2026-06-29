import React from 'react';
import { X } from 'lucide-react';

const QuestionOption = ({ label, option, value, isCorrect, onChange, onSelectCorrect, onDelete, canDelete }) => {
  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-lg border transition-all
        ${
          isCorrect
            ? 'border-indigo-600 bg-indigo-50/50'
            : 'border-slate-200 hover:border-slate-300'
        }
      `}
    >
      <input
        type="radio"
        name={`correct-answer-${label}`}
        checked={isCorrect}
        onChange={onSelectCorrect}
        className="w-5 h-5 cursor-pointer accent-indigo-600"
      />
      <div className="flex items-center justify-center w-8 h-8 rounded bg-slate-100 text-slate-600 font-medium text-sm">
        {option}
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={`Nhập nội dung đáp án ${option}...`}
        className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400 focus:ring-0"
      />
      {canDelete && (
        <button
          onClick={onDelete}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          title="Xóa đáp án"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default QuestionOption;
