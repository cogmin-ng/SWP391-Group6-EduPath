import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import MentorWelcomeBanner from '../../components/mentor/MentorWelcomeBanner';
import MentorStatsCard from '../../components/mentor/MentorStatsCard';
import MentorRoadmapCard from '../../components/mentor/MentorRoadmapCard';
import QuickActionsSidebar from '../../components/mentor/QuickActionsSidebar';
import PendingReviewsSection from '../../components/mentor/PendingReviewsSection';
import PendingTipsSection from '../../components/mentor/PendingTipsSection';
import { mentorStats, myRoadmaps, pendingReviews } from '../../mock/mentorDashboardData';
import { getPendingTips } from '../../services/roadmapService';

const MentorDashboardPage = () => {
  const [pendingTips, setPendingTips] = useState([]);
  const [loadingTips, setLoadingTips] = useState(false);
  const navigate = useNavigate();

  // Fetch pending tips on mount
  useEffect(() => {
    const fetchPendingTips = async () => {
      setLoadingTips(true);
      try {
        const result = await getPendingTips(0, 5); // Show top 5
        setPendingTips(result.tips || []);
      } catch (err) {
        console.error('Failed to fetch pending tips:', err);
        // Silently fail, dashboard still shows other content
      } finally {
        setLoadingTips(false);
      }
    };

    fetchPendingTips();
  }, []);

  const handleRefreshTips = async () => {
    setLoadingTips(true);
    try {
      const result = await getPendingTips(0, 5);
      setPendingTips(result.tips || []);
      toast.success('Đã cập nhật danh sách Tips');
    } catch (err) {
      toast.error('Không thể cập nhật danh sách Tips');
    } finally {
      setLoadingTips(false);
    }
  };

  const handleCreateNew = () => {
    toast.success('Đang chuyển đến trang tạo lộ trình...');
    navigate('/mentor/create-roadmap');
  };

  const handleManageRoadmaps = () => {
    toast.success('Đang chuyển đến trình quản lý lộ trình...');
    // Navigate to manage roadmaps page
  };

  const handleViewProfile = () => {
    toast.success('Chuyển đến trang hồ sơ mentor...');
    navigate('/mentor/profile');
  };

  const handleNotifications = () => {
    toast.success('Đang mở thông báo...');
    // Open notifications modal or navigate
  };

  const handleViewRoadmap = (roadmapId) => {
    toast.success(`Đang xem lộ trình ${roadmapId}`);
    // Navigate to roadmap view
  };

  const handleEditRoadmap = (roadmapId) => {
    toast.success(`Đang chuyển đến trang chỉnh sửa lộ trình...`);
    navigate(`/mentor/roadmaps/${roadmapId}/edit`);
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
                <h2 className="text-2xl font-bold text-slate-900">Lộ Trình Của Tôi</h2>
                <p className="text-slate-500 text-sm mt-1">{myRoadmaps.length} lộ trình đã tạo</p>
              </div>
              <button className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors text-sm">
                Xem Tất Cả →
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

          {/* Pending Tips Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Tips Cần Duyệt ({pendingTips.length})
              </h2>
              <button className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors text-sm">
                Xem tất cả →
              </button>
            </div>
            <PendingTipsSection 
              tips={pendingTips} 
              isLoading={loadingTips}
              onRefresh={handleRefreshTips}
            />
          </div>

          {/* Pending Reviews Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Duyệt Lộ Trình</h2>
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
