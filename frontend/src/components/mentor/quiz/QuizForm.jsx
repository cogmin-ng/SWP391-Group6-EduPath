import React from 'react';

const QuizForm = ({ quizData, onChange }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6 mb-8">
      <h2 className="text-lg font-bold text-slate-900">Thông tin bài trắc nghiệm</h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Tiêu đề bài trắc nghiệm
          </label>
          <input
            type="text"
            value={quizData.title}
            onChange={(e) => onChange({ ...quizData, title: e.target.value })}
            placeholder="Ví dụ: JavaScript Fundamentals Assessment"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Thời gian làm bài (Phút)
            </label>
            <input
              type="number"
              min="1"
              value={quizData.duration}
              onChange={(e) => onChange({ ...quizData, duration: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Điểm đạt (%)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={quizData.passingScore}
              onChange={(e) => onChange({ ...quizData, passingScore: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizForm;
