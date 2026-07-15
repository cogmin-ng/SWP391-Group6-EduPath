import { Clock, Users, CalendarDays, Sparkles } from 'lucide-react';

/**
 * Header section for the node detail page.
 * Displays badge (Node X of Y), title, description, and metadata pills.
 *
 * Props:
 * - node: { title, description, nodeNumber, totalNodes, estimatedHours, mentorGuided, updatedAt }
 */
export default function NodeHeader({ node, roadmapTitle, overallProgress = 0, isCompleted = false }) {
  if (!node) return null;

  const pills = [
    { icon: Clock, label: `${node.estimatedHours} Hours` },
    ...(node.mentorGuided
      ? [{ icon: Users, label: 'Mentor Guided' }]
      : []),
    { icon: CalendarDays, label: `Updated ${node.updatedAt}` },
  ];

  return (
    <header className={`mb-6 overflow-hidden rounded-[30px] px-6 py-6 text-white shadow-xl md:px-8 md:py-8 ${
      isCompleted
        ? 'bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-400 shadow-emerald-200/60'
        : 'bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-500 shadow-indigo-200/60'
    }`}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_180px] lg:items-center">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 font-semibold text-white/95 ring-1 ring-white/15 backdrop-blur-sm">
              <Sparkles className={`h-3.5 w-3.5 ${isCompleted ? 'text-emerald-100' : 'text-rose-200'}`} />
              Node {node.nodeNumber} of {node.totalNodes}
            </span>
            {roadmapTitle ? (
              <span className={`text-sm ${isCompleted ? 'text-emerald-50/90' : 'text-indigo-100/90'}`}>{roadmapTitle}</span>
            ) : null}
          </div>

          <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
            {node.title}
          </h1>

          <p className={`max-w-3xl text-base leading-8 ${isCompleted ? 'text-emerald-50/95' : 'text-indigo-50/92'}`}>
            {node.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {pills.map((pill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3.5 py-2 text-xs font-medium text-white ring-1 ring-white/15 backdrop-blur-sm"
              >
                <pill.icon className={`h-3.5 w-3.5 ${isCompleted ? 'text-emerald-100' : 'text-indigo-100'}`} />
                {pill.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border border-white/20 bg-white/8 backdrop-blur-sm lg:mx-0 lg:ml-auto">
          <div className="relative h-28 w-28">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#ffffff"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - overallProgress / 100)}`}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-white">{overallProgress}%</span>
               <span className={`text-xs font-medium uppercase tracking-[0.18em] ${isCompleted ? 'text-emerald-100' : 'text-indigo-100'}`}>
                 hoàn thành
               </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
