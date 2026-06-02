import { Play, Check, Circle } from 'lucide-react';

/**
 * Left sidebar showing the roadmap name, overall progress,
 * and a clickable list of nodes with status indicators.
 *
 * Props:
 * - roadmap: { title, progress, nodes[] }
 * - currentNodeId: string – highlights the active node
 * - onNodeClick: (nodeId) => void – navigation callback
 */
export default function NodeSidebar({ roadmap, currentNodeId, onNodeClick }) {
  if (!roadmap) return null;

  const getStatusIcon = (node) => {
    if (node.status === 'completed') {
      return (
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
      );
    }
    if (node.id === currentNodeId) {
      return (
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
          <Play className="w-3 h-3 text-white fill-white" />
        </div>
      );
    }
    return <Circle className="flex-shrink-0 w-5 h-5 text-slate-300" />;
  };

  return (
    <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-6">
        {/* Current Path */}
        <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1">
          Current Path
        </p>
        <h2 className="text-base font-bold text-slate-900 leading-tight mb-4">
          {roadmap.title}
        </h2>

        {/* Roadmap progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-500">
              Path Progress
            </span>
            <span className="text-xs font-bold text-indigo-600">
              {roadmap.progress}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${roadmap.progress}%` }}
            />
          </div>
        </div>

        {/* Nodes heading */}
        <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-3">
          Nodes
        </p>

        {/* Nodes list */}
        <nav className="flex flex-col gap-1">
          {roadmap.nodes.map((node) => {
            const isActive = node.id === currentNodeId;
            return (
              <button
                key={node.id}
                onClick={() => onNodeClick(node.id)}
                className={`
                  flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl
                  transition-all duration-200 group cursor-pointer
                  ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }
                `}
              >
                {getStatusIcon(node)}
                <span
                  className={`text-sm font-medium truncate ${
                    isActive ? 'text-white' : 'text-slate-700'
                  }`}
                >
                  {node.title}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
