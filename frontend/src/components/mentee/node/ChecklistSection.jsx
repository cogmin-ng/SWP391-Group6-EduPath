import { Check, ClipboardList, Circle } from 'lucide-react';

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
    <section className="animate-fadeIn rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50">
            <ClipboardList className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-[1.1rem] font-bold text-slate-900">Checklist Học Tập</h3>
            <p className="text-sm text-slate-400">Theo dõi các mục tiêu cần hoàn thành trong node này.</p>
          </div>
        </div>
        <span className="text-3xl font-bold text-indigo-600">
          {completedCount}
          <span className="text-slate-300">/{total}</span>
        </span>
      </div>

      <div className="mb-6 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className={`group flex items-center gap-2 rounded-2xl border px-2 py-2 transition-all duration-200 ${
              item.completed
                ? 'border-emerald-100 bg-emerald-50/70 hover:border-emerald-200'
                : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30'
            }`}
          >
            <button
              type="button"
              onClick={() => onToggle(item.id)}
              className="flex min-w-0 flex-1 items-center gap-4 rounded-xl px-2 py-2 text-left"
            >
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border ${
                  item.completed
                    ? 'border-emerald-200 bg-emerald-500 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-400 group-hover:border-indigo-200 group-hover:text-indigo-500'
                }`}
              >
                {item.completed ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4 fill-current" />}
              </div>

              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${item.completed ? 'text-slate-700' : 'text-slate-900'}`}>
                  {item.title}
                </p>
              </div>

              <span
                className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex ${
                  item.completed
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {item.completed ? 'Completed' : 'In Progress'}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
        <p className="text-sm text-slate-500">
          {completedCount}/{total} mục đã hoàn thành
        </p>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </section>
  );
}
