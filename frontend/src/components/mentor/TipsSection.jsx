import { Plus, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import TipContributionModal from '../ui/TipContributionModal';
import { useAuth } from '../../hooks/useAuth';

const TipsSection = ({ tips, nodeId, onRefresh }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const isMentee = user && Array.isArray(user.roles) && user.roles.includes('MENTEE');

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Kinh nghiệm & Bí kíp</h2>
        </div>
        {isMentee ? (
          <button
            onClick={() => setOpen(true)}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Thêm Tip
          </button>
        ) : (
          <span className="text-sm text-slate-400">Chỉ mentee mới có thể đóng góp</span>
        )}
      </div>

      {/* Tips List */}
      <div className="space-y-3">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className="p-4 bg-amber-50 rounded-xl border border-amber-100"
          >
            <p className="text-sm text-slate-800">{tip.title}</p>
          </div>
        ))}
      </div>

      {open && (
        <TipContributionModal
          nodeId={nodeId}
          onClose={() => setOpen(false)}
          onSubmitted={() => {
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
};

export default TipsSection;
