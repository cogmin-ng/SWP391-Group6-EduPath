function RoadmapCard({ roadmap }) {
  return (
    <div className="roadmap-card">
      <div className="roadmap-top">
        <span className="badge">
          {roadmap.category}
        </span>
      </div>

      <h3>{roadmap.title}</h3>

      <p>{roadmap.description}</p>

      <div className="roadmap-footer">
        <span>{roadmap.nodes} Nodes</span>
        <span>{roadmap.students} Students</span>
      </div>
    </div>
  )
}

export default RoadmapCard