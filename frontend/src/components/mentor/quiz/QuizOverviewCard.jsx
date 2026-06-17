import React from 'react';
import { LayoutList, Trophy, Star } from 'lucide-react';

const QuizOverviewCard = ({ totalQuestions, passScore, xpReward }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm sticky top-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
          <LayoutList className="w-4 h-4 text-indigo-600" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Tổng quan Quiz</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <span className="text-sm text-slate-600">Tổng số câu hỏi</span>
          <span className="font-semibold text-slate-900">{totalQuestions}</span>
        </div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-slate-600">Điểm đạt</span>
          </div>
          <span className="font-semibold text-emerald-600">{passScore}%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-slate-600">XP Reward</span>
          </div>
          <span className="font-semibold text-amber-600">{xpReward} XP</span>
        </div>
      </div>
    </div>
  );
};

export default QuizOverviewCard;
