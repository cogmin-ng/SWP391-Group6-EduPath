import { Play, Check, Circle, ChevronDown } from 'lucide-react';

/**
 * Left sidebar showing the roadmap name, overall progress,
 * and a clickable list of nodes with status indicators.
 *
 * Props:
 * - roadmap: { title, progress, nodes[] }
 * - currentNodeId: string – highlights the active node
 * - onNodeClick: (nodeId) => void – navigation callback
 */
export default function NodeSidebar({ roadmap, currentNodeId, onNodeClick, hideProgress = false }) {
  if (!roadmap) return null;

  const getStatusIcon = (node) => {
    if (node.status === 'completed') {
      return (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-600 shadow-sm shadow-indigo-200">
          <Check className="h-4 w-4 text-white" strokeWidth={3} />
        </div>
      );
    }
    if (node.id === currentNodeId) {
      return (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 shadow-sm shadow-indigo-200">
          <Play className="h-4 w-4 fill-white text-white" />
        </div>
      );
    }
    return (
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Circle className="h-4 w-4" />
      </div>
    );
  };

  return (
    <aside className="w-full xl:sticky xl:top-6 xl:self-start">
      <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60">
        <p className="mb-2 text-sm font-medium text-slate-500">Lộ trình của bạn</p>
        <h2 className="text-2xl font-bold leading-tight text-slate-900">
          {roadmap.title}
        </h2>

        {!hideProgress && (
          <div className="mt-6 mb-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Path Progress
              </span>
              <span className="text-lg font-bold text-indigo-600">
                {roadmap.progress}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all duration-500 ease-out"
                style={{ width: `${roadmap.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className={`mb-4 flex items-center justify-between ${hideProgress ? 'mt-6' : ''}`}>
          <p className="text-sm font-semibold text-slate-900">Các chặng học</p>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
            {roadmap.nodes.length} nodes
          </span>
        </div>

        <nav className="space-y-3">
          {roadmap.nodes.map((node) => {
            const isActive = node.id === currentNodeId;
            const summary = node.summary?.total ? `${node.summary.completed}/${node.summary.total}` : null;

            return (
              <button
                key={node.id}
                onClick={() => onNodeClick(node.id)}
                className={`flex w-full items-start gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all duration-200 ${
                  isActive
                    ? 'border-indigo-200 bg-indigo-50/80 shadow-sm shadow-indigo-100'
                    : 'border-slate-200 bg-white hover:border-indigo-100 hover:bg-slate-50'
                }`}
              >
                {getStatusIcon(node)}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold ${
                          isActive ? 'bg-white text-indigo-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {node.index}
                        </span>
                        {summary ? (
                          <span className="text-xs font-semibold text-slate-400">{summary}</span>
                        ) : null}
                      </div>
                      <p className={`line-clamp-2 text-sm font-semibold ${isActive ? 'text-indigo-700' : 'text-slate-800'}`}>
                        {node.title}
                      </p>
                    </div>
                    <ChevronDown className={`mt-1 h-4 w-4 flex-shrink-0 ${isActive ? 'text-indigo-500' : 'text-slate-300'}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {!hideProgress && (
          <div className="mt-6 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4">
            <p className="text-sm font-semibold text-slate-900">Hoàn thành lộ trình</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Tiếp tục đều tay để mở khóa thêm nội dung và tiến gần hơn đến chứng chỉ hoàn thành.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
