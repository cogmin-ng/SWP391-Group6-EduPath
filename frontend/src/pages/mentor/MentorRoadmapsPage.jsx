import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMentorRoadmaps } from '../../services/roadmapService';
import toast from 'react-hot-toast';

export default function MentorRoadmapsPage() {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('APPROVED');

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const data = await getMentorRoadmaps(0, 50);
        setRoadmaps(data.roadmaps || []);
      } catch (err) {
        console.error('Failed to fetch mentor roadmaps:', err);
        toast.error('Không thể tải danh sách lộ trình');
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  const handleViewRoadmap = (roadmapId) => {
    navigate(`/mentor/roadmaps/${roadmapId}`);
  };

  const handleEditRoadmap = (roadmapId) => {
    navigate(`/mentor/roadmaps/${roadmapId}/edit`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DRAFT': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'APPROVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'PUBLISHED': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'REJECTED': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'DRAFT': return 'Nháp';
      case 'PENDING': return 'Chờ duyệt';
      case 'APPROVED': return 'Đã duyệt';
      case 'PUBLISHED': return 'Đã xuất bản';
      case 'REJECTED': return 'Bị từ chối';
      default: return status;
    }
  };

  const approvedRoadmaps = roadmaps.filter((r) => r.status === 'APPROVED');
  const pendingRoadmaps = roadmaps.filter((r) => r.status === 'PENDING');
  const draftRoadmaps = roadmaps.filter((r) => r.status === 'DRAFT');

  const getDisplayedRoadmaps = () => {
    if (activeTab === 'APPROVED') return approvedRoadmaps;
    if (activeTab === 'PENDING') return pendingRoadmaps;
    if (activeTab === 'DRAFT') return draftRoadmaps;
    return [];
  };

  const displayedRoadmaps = getDisplayedRoadmaps();

  const tabs = [
    { id: 'APPROVED', label: 'Đã duyệt', count: approvedRoadmaps.length },
    { id: 'PENDING', label: 'Chờ duyệt', count: pendingRoadmaps.length },
    { id: 'DRAFT', label: 'Nháp', count: draftRoadmaps.length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 animate-pulse font-medium">Đang tải danh sách lộ trình...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Lộ trình của tôi</h1>
        <p className="text-slate-500 mt-2">
          Quản lý và theo dõi các lộ trình bạn đã tạo.
        </p>
      </div>

      <div className="flex space-x-8 border-b border-slate-200 mb-6 px-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 border-b-2 font-semibold transition-colors ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === tab.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {displayedRoadmaps.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
          <p className="text-slate-400 font-medium">Bạn chưa có lộ trình nào trong mục này.</p>
          {activeTab === 'DRAFT' && (
            <button 
              onClick={() => navigate('/mentor/create-roadmap')}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition"
            >
              Tạo lộ trình ngay
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedRoadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group justify-between"
            >
              <div>
                <div className="relative h-28 bg-slate-900 overflow-hidden">
                  <img
                    src={roadmap.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800"}
                    alt={roadmap.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(roadmap.status)}`}>
                      {getStatusLabel(roadmap.status)}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-1.5 focus-within:ring-2 focus-within:ring-indigo-500 outline-none">
                  <h4 className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition tracking-tight line-clamp-1">
                    {roadmap.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                    {roadmap.subject?.name || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => handleViewRoadmap(roadmap.id)}
                  className="flex-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-1.5 text-xs rounded-xl font-semibold transition cursor-pointer text-center"
                >
                  Xem
                </button>
                {roadmap.status === 'PENDING' ? (
                  <button
                    disabled
                    className="flex-1 bg-slate-200 text-slate-500 py-1.5 text-xs rounded-xl font-semibold transition cursor-not-allowed text-center"
                  >
                    Đang duyệt
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditRoadmap(roadmap.id)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 text-xs rounded-xl font-semibold transition cursor-pointer text-center"
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
