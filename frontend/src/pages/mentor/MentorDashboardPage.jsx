import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import MentorWelcomeBanner from '../../components/mentor/MentorWelcomeBanner';
import MentorStatsCard from '../../components/mentor/MentorStatsCard';
import PendingReviewsSection from '../../components/mentor/PendingReviewsSection';
import PendingTipsSection from '../../components/mentor/PendingTipsSection';
import { mentorStats, pendingReviews } from '../../mock/mentorDashboardData';
import { getPendingTips, getMentorRoadmaps } from '../../services/roadmapService';
import { Loader2 } from 'lucide-react';

const MentorDashboardPage = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loadingRoadmaps, setLoadingRoadmaps] = useState(true);
  const [pendingTips, setPendingTips] = useState([]);
  const [loadingTips, setLoadingTips] = useState(false);
  const navigate = useNavigate();

  // Fetch pending tips and roadmaps on mount
  useEffect(() => {
    const fetchPendingTips = async () => {
      setLoadingTips(true);
      try {
        const result = await getPendingTips(0, 5); // Show top 5
        setPendingTips(result.tips || []);
      } catch (err) {
        console.error('Failed to fetch pending tips:', err);
      } finally {
        setLoadingTips(false);
      }
    };

    const fetchRoadmaps = async () => {
      setLoadingRoadmaps(true);
      try {
        const result = await getMentorRoadmaps(0, 100);
        setRoadmaps(result.roadmaps || []);
      } catch (err) {
        console.error('Failed to fetch roadmaps:', err);
      } finally {
        setLoadingRoadmaps(false);
      }
    };

    fetchPendingTips();
    fetchRoadmaps();
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
  };

  const handleViewRoadmap = (roadmapId) => {
    navigate(`/mentor/roadmaps/${roadmapId}`);
  };

  const handleEditRoadmap = (roadmapId) => {
    toast.success('Đang chuyển đến trang chỉnh sửa lộ trình...');
    navigate(`/mentor/roadmaps/${roadmapId}/edit`);
  };

  const handleLearnRoadmap = (roadmapId) => {
    navigate(`/mentor/roadmaps/${roadmapId}/learn`);
  };

  const dynamicStats = [
    {
      id: 1,
      label: 'Số Lộ Trình',
      value: loadingRoadmaps ? '...' : roadmaps.length.toString(),
      icon: 'Layers',
      color: 'bg-indigo-500',
      trend: 'Thời gian thực',
    },
    ...mentorStats.slice(1)
  ];

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
            {dynamicStats.map((stat) => (
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
            {loadingRoadmaps ? (
              <div className="flex flex-col items-center justify-center py-10 bg-white border border-slate-100 rounded-2xl">
                <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
                <p className="text-slate-500 mt-2 text-xs">Đang tải danh sách lộ trình...</p>
              </div>
            ) : roadmaps.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 border border-slate-200 border-dashed rounded-2xl">
                <h3 className="font-semibold text-slate-800 text-sm">Bạn chưa tạo lộ trình nào</h3>
                <p className="text-slate-500 text-xs mt-1">Hãy bắt đầu tạo lộ trình đầu tiên của bạn.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {roadmaps.slice(0, 4).map((roadmap) => (
                  <div
                    key={roadmap.id}
                    className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group justify-between"
                  >
                    <div>
                      <div className="relative h-28 bg-slate-900 overflow-hidden">
                        <img
                          src={roadmap.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'}
                          alt={roadmap.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
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
                        onClick={() => handleEditRoadmap(roadmap.id)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 text-xs rounded-xl font-semibold transition cursor-pointer text-center"
                      >
                        Chỉnh sửa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
