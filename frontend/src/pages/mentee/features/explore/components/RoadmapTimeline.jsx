export default function RoadmapTimeline({ phases = [] }) {
  return (
    <section className="mx-auto mt-12 w-full max-w-6xl">
      <div className="mb-6 border-b border-slate-200 pb-3">
        <h2 className="text-2xl font-bold text-slate-900">Curriculum Path</h2>
        <p className="mt-1 text-sm text-slate-500">{phases.length} Nodes</p>
      </div>

      <div className="space-y-4">
        {phases.map((phase, index) => {
          const isActive = phase.status === 'active';
          const isLocked = phase.status === 'locked';

          return (
            <div key={phase.name} className="relative last:mb-0 group cursor-pointer">
              <div
                className={`rounded-xl border p-4 transition-all group-hover:shadow-md ${
                  isActive
                    ? 'border-indigo-200 bg-white'
                    : isLocked
                      ? 'border-slate-200 bg-slate-50'
                      : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-indigo-600">
                      Node {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900">{phase.name}</h3>
                  </div>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {phase.highlights?.join(', ') || phase.description || 'Complete this phase to unlock the next node.'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
