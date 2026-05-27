function NodeDetailPage() {
  return (
    <div className="node-detail">
      <h2>Node Detail</h2>

      <div className="detail-box">
        <h3>Checklist</h3>
        <ul>
          <li>Learn Prisma schema</li>
          <li>Create migration</li>
          <li>Connect PostgreSQL</li>
        </ul>
      </div>

      <div className="detail-box">
        <h3>Materials</h3>
        <p>Upload PDF / YouTube / Docs</p>
      </div>

      <div className="detail-box">
        <h3>Quiz</h3>
        <p>Create mentor quiz here</p>
      </div>

      <div className="detail-box">
        <h3>Tip Tricks</h3>
        <p>Share real experience for learners</p>
      </div>
    </div>
  )
}

export default NodeDetailPage