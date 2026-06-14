import React from 'react';
import { PlusCircle } from 'lucide-react';

const AddQuestionButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-8 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-300 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
    >
      <PlusCircle className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform" />
      <span className="text-sm font-medium text-indigo-600">Thêm câu hỏi mới</span>
    </button>
  );
};

export default AddQuestionButton;
