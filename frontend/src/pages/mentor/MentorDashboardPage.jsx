import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import MentorWelcomeBanner from '../../components/mentor/MentorWelcomeBanner';
import MentorStatsCard from '../../components/mentor/MentorStatsCard';
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
    toast.success('Đang chuyển đến trang lộ trình của tôi...');
    navigate('/mentor/roadmaps');
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
    navigate(`/mentor/roadmaps/${roadmapId}`);
  };

  const handleLearnRoadmap = (roadmapId) => {
    navigate(`/mentor/roadmaps/${roadmapId}/learn`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Banner */}
      <MentorWelcomeBanner />

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
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                Lộ trình của tôi
              </h3>
            </div>

            {/* Roadmaps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {myRoadmaps.slice(0, 4).map((roadmap) => (
                <div
                  key={roadmap.id}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group justify-between"
                >
                  <div>
                    <div className="relative h-28 bg-slate-900 overflow-hidden">
                      <img
                        src={roadmap.image}
                        alt={roadmap.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span
                        className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          roadmap.level === "Advanced"
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : roadmap.level === "Intermediate"
                              ? "bg-blue-50 text-blue-600 border border-blue-100"
                              : "bg-green-50 text-green-600 border border-green-100"
                        }`}
                      >
                        {roadmap.level}
                      </span>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h4 className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition tracking-tight line-clamp-1">
                        {roadmap.title}
                      </h4>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => handleViewRoadmap(roadmap.id)}
                      className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-1.5 text-xs rounded-xl font-semibold transition cursor-pointer text-center"
                    >
                      Xem
                    </button>
                    <button
                      onClick={() => handleLearnRoadmap(roadmap.id)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 text-xs rounded-xl font-semibold transition cursor-pointer text-center"
                    >
                      Xem lộ trình
                    </button>
                  </div>
                </div>
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
      </div>
    </div>
  );
};

export default MentorDashboardPage;
