import { CheckCircle2, Lock, Timer } from 'lucide-react';

const phaseStyles = {
  completed: {
    dot: 'border-indigo-600',
    badge: 'text-indigo-600',
    card: 'border-indigo-100 bg-white',
    icon: <CheckCircle2 className="h-4 w-4 text-indigo-600" />,
    label: 'Completed',
  },
  active: {
    dot: 'border-violet-600',
    badge: 'text-violet-700',
    card: 'border-violet-200 bg-violet-50/40',
    icon: <span className="h-2.5 w-2.5 rounded-full bg-violet-600" />,
    label: 'Active',
  },
  locked: {
    dot: 'border-slate-300',
    badge: 'text-slate-500',
    card: 'border-slate-200 bg-slate-50',
    icon: <Lock className="h-3.5 w-3.5 text-slate-500" />,
    label: 'Locked',
  },
};

export default function RoadmapTimeline({ phases = [] }) {
  return (
    <section className="mx-auto mt-12 w-full max-w-4xl">
      <div className="mb-6 border-b border-slate-200 pb-3">
        <h2 className="text-2xl font-bold text-slate-900">Curriculum Path</h2>
        <p className="mt-1 text-sm text-slate-600">{phases.length} phases with practical milestones</p>
      </div>

      <div className="relative pl-7">
        <div className="absolute left-3 top-2 bottom-3 w-px bg-slate-200" />

        <div className="space-y-6">
          {phases.map((phase, index) => {
            const style = phaseStyles[phase.status] || phaseStyles.locked;
            return (
              <article key={phase.name} className="relative">
                <div className={`absolute -left-7 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white ${style.dot}`}>
                  {style.icon}
                </div>

                <div className={`rounded-xl border p-4 ${style.card}`}>
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wide ${style.badge}`}>Phase {index + 1} - {style.label}</p>
                      <h3 className="text-lg font-semibold text-slate-900">{phase.name}</h3>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs text-slate-600 border border-slate-200">
                      <Timer className="h-3.5 w-3.5" />
                      {phase.weeks}
                    </span>
                  </div>

                  <ul className="space-y-1.5 text-sm text-slate-700">
                    {phase.highlights?.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
