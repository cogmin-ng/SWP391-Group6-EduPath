function NodeCard({ node }) {
  return (
    <div className="node-card">
      <div className="node-header">
        <h4>{node.title}</h4>
        <span>{node.progress}%</span>
      </div>

      <p>{node.description}</p>

      <div className="node-tags">
        {node.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <button className="edit-btn">
        Edit Node
      </button>
    </div>
  )
}

export default NodeCard