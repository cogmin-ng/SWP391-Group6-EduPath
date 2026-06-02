import { BookOpen, Clock, Users, CalendarDays } from 'lucide-react';

/**
 * Header section for the node detail page.
 * Displays badge (Node X of Y), title, description, and metadata pills.
 *
 * Props:
 * - node: { title, description, nodeNumber, totalNodes, level, estimatedHours, mentorGuided, updatedAt }
 */
export default function NodeHeader({ node }) {
  if (!node) return null;

  const pills = [
    { icon: BookOpen, label: node.level },
    { icon: Clock, label: `${node.estimatedHours} Hours` },
    ...(node.mentorGuided
      ? [{ icon: Users, label: 'Mentor Guided' }]
      : []),
    { icon: CalendarDays, label: `Updated ${node.updatedAt}` },
  ];

  return (
    <header className="mb-8 animate-fadeIn">
      {/* Badge */}
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
        📌 Node {node.nodeNumber} of {node.totalNodes}
      </span>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 font-display">
        {node.title}
      </h1>

      {/* Description */}
      <p className="text-slate-500 text-base leading-relaxed mb-5 max-w-2xl">
        {node.description}
      </p>

      {/* Meta pills */}
      <div className="flex flex-wrap gap-2">
        {pills.map((pill, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-600 shadow-sm"
          >
            <pill.icon className="w-3.5 h-3.5 text-slate-400" />
            {pill.label}
          </span>
        ))}
      </div>
    </header>
  );
}
