import { CheckSquare, Square, ClipboardList } from 'lucide-react';

/**
 * Interactive checklist card.
 * Mentee can tick/untick items; progress recalculates automatically.
 *
 * Props:
 * - items: [{ id, title, completed }]
 * - onToggle: (id) => void
 */
export default function ChecklistSection({ items, onToggle }) {
  const completedCount = items.filter((i) => i.completed).length;
  const total = items.length;
  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Checklist Học Tập
            </h3>
            <p className="text-xs text-slate-400">
              Hoàn thành các mục tiêu cốt lõi.
            </p>
          </div>
        </div>
        <span className="text-xl font-bold text-indigo-600">
          {completedCount}
          <span className="text-slate-300">/{total}</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mb-5 overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Items */}
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onToggle(item.id)}
              className={`
                flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl
                transition-all duration-200 group cursor-pointer
                ${
                  item.completed
                    ? 'bg-indigo-50/60 border border-indigo-100'
                    : 'bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30'
                }
              `}
            >
              {item.completed ? (
                <CheckSquare className="w-5 h-5 text-indigo-600 flex-shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
              )}
              <span
                className={`text-sm font-medium ${
                  item.completed
                    ? 'text-indigo-700'
                    : 'text-slate-700'
                }`}
              >
                {item.title}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
