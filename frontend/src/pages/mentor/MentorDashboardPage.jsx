import toast from 'react-hot-toast';
import MentorWelcomeBanner from '../../components/mentor/MentorWelcomeBanner';
import MentorStatsCard from '../../components/mentor/MentorStatsCard';
import MentorRoadmapCard from '../../components/mentor/MentorRoadmapCard';
import QuickActionsSidebar from '../../components/mentor/QuickActionsSidebar';
import PendingReviewsSection from '../../components/mentor/PendingReviewsSection';
import { mentorStats, myRoadmaps, pendingReviews } from '../../mock/mentorDashboardData';

const MentorDashboardPage = () => {
  const handleCreateNew = () => {
    toast.success('Redirecting to roadmap creator...');
    // Navigate to create roadmap page
  };

  const handleManageRoadmaps = () => {
    toast.success('Redirecting to roadmap manager...');
    // Navigate to manage roadmaps page
  };

  const handleViewProfile = () => {
    toast.success('Redirecting to profile...');
    // Navigate to profile page
  };

  const handleNotifications = () => {
    toast.success('Opening notifications...');
    // Open notifications modal or navigate
  };

  const handleViewRoadmap = (roadmapId) => {
    toast.success(`Viewing roadmap ${roadmapId}`);
    // Navigate to roadmap view
  };

  const handleEditRoadmap = (roadmapId) => {
    toast.success(`Editing roadmap ${roadmapId}`);
    // Navigate to roadmap editor
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Banner */}
      <MentorWelcomeBanner onCreateNew={handleCreateNew} />

      {/* Main Content Area with Sidebar */}
      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {mentorStats.map((stat) => (
              <MentorStatsCard key={stat.id} {...stat} />
            ))}
          </div>

          {/* My Roadmaps Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">My Roadmaps</h2>
                <p className="text-slate-500 text-sm mt-1">{myRoadmaps.length} roadmaps created</p>
              </div>
              <button className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors text-sm">
                View All →
              </button>
            </div>

            {/* Roadmaps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {myRoadmaps.slice(0, 4).map((roadmap) => (
                <MentorRoadmapCard
                  key={roadmap.id}
                  roadmap={roadmap}
                  onView={handleViewRoadmap}
                  onEdit={handleEditRoadmap}
                />
              ))}
            </div>
          </div>

          {/* Pending Reviews Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Pending Reviews</h2>
            <PendingReviewsSection reviews={pendingReviews} />
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <QuickActionsSidebar
          onCreateNew={handleCreateNew}
          onManage={handleManageRoadmaps}
          onProfile={handleViewProfile}
          onNotifications={handleNotifications}
        />
      </div>
    </div>
  );
};

export default MentorDashboardPage;
