import { useState } from 'react';
import { Lightbulb, Plus } from 'lucide-react';
import TipContributionModal from '../../ui/TipContributionModal';

/**
 * Tips & Tricks section with list and a modal-based contribution flow.
 * Props:
 * - tips: Array of tips
 * - nodeId: current node id
 * - onRefresh: callback to refresh tips after submission
 */
export default function TipsSection({ tips: initialTips, nodeId, onRefresh }) {
  const [open, setOpen] = useState(false);
  const tips = initialTips || [];

  const tipCount = tips?.length || 0;

  return (
    <section className="animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Tip Trick</h3>
              <p className="text-xs text-slate-400">Cộng đồng chia sẻ và học hỏi lẫn nhau.</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Đóng góp
          </button>
        </div>

        {/* Tips list */}
        {tipCount > 0 ? (
          <ul className="space-y-2.5">
            {tips.map((tip) => (
              <li
                key={tip.id}
                className="bg-slate-50 rounded-lg px-4 py-3 text-sm text-slate-700 leading-relaxed border border-slate-100 hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {tip.title ? (
                      <>
                    <div className="font-semibold text-slate-900 mb-1">{tip.title}</div>
                    <div className="text-slate-600">{tip.content}</div>
                      </>
                    ) : (
                      <div>{tip.content}</div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-slate-400">
            <p className="text-sm">Chưa có bí kíp nào. Hãy là người đầu tiên chia sẻ!</p>
          </div>
        )}

        {open && (
          <TipContributionModal
            nodeId={nodeId}
            onClose={() => setOpen(false)}
            onSubmitted={() => {
              setOpen(false);
              if (onRefresh) onRefresh();
            }}
          />
        )}
      </div>
    </section>
  );
}
