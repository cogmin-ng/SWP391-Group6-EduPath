import NodeCard from '../../components/roadmap/NodeCard'
import { nodeData } from '../../data/mockData'

function RoadmapBuilderPage() {
  return (
    <section className="builder-section">
      <div className="section-title">
        <h2>Roadmap Builder</h2>

        <button className="create-btn">
          + Add Node
        </button>
      </div>

      <div className="node-grid">
        {nodeData.map((node) => (
          <NodeCard
            key={node.id}
            node={node}
          />
        ))}
      </div>
    </section>
  )
}

export default RoadmapBuilderPage