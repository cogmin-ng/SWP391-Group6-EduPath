const NodeDetailHeader = ({ node }) => {
  return (
    <div className="mb-8">
      {/* Badges */}
      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
          {node.category}
        </span>
        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold">
          Node {node.nodeNumber} of {node.totalNodes}
        </span>
      </div>

      {/* Title and Description */}
      <h1 className="text-4xl font-bold text-slate-900 mb-3">{node.title}</h1>
      <p className="text-lg text-slate-600 max-w-2xl">{node.description}</p>
    </div>
  );
};

export default NodeDetailHeader;
