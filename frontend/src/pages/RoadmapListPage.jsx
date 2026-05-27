import RoadmapCard from '../../components/roadmap/RoadmapCard'
import { roadmapData } from '../../data/mockData'

function RoadmapListPage() {
  return (
    <section>
      <div className="section-title">
        <h2>Your Roadmaps</h2>

        <button className="create-btn">
          + Create Roadmap
        </button>
      </div>

      <div className="roadmap-grid">
        {roadmapData.map((roadmap) => (
          <RoadmapCard
            key={roadmap.id}
            roadmap={roadmap}
          />
        ))}
      </div>
    </section>
  )
}

export default RoadmapListPage