import Header from '../../components/layout/Header'
import Sidebar from '../../components/layout/Sidebar'
import RoadmapListPage from './RoadmapListPage'
import RoadmapBuilderPage from './RoadmapBuilderPage'

function Dashboard() {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        <Header />

        <RoadmapListPage />

        <RoadmapBuilderPage />
      </div>
    </div>
  )
}

export default Dashboard