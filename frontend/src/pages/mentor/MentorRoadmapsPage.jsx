import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMentorRoadmaps } from '../../services/roadmapService';

export default function MentorRoadmapsPage() {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const data = await getMentorRoadmaps();
        setRoadmaps(data.roadmaps || []);
      } catch (err) {
        console.error('Failed to fetch roadmaps:', err);
        setError('Không thể tải danh sách lộ trình');
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

  const handleLearnRoadmap = (roadmapId) => {
    navigate(`/mentor/roadmaps/${roadmapId}/learn`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-slate-500">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-red-500">{error}</p>
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

      {roadmaps.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500">Bạn chưa có lộ trình nào.</p>
          <button
            onClick={() => navigate('/mentor/create-roadmap')}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold transition"
          >
            Tạo lộ trình mới
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group justify-between"
            >
              <div>
                <div className="relative h-28 bg-slate-900 overflow-hidden">
                  <img
                    src={roadmap.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}
                    alt={roadmap.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 space-y-1.5">
                  <h4 className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition tracking-tight line-clamp-1">
                    {roadmap.title}
                  </h4>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                    roadmap.status === 'PUBLISHED' || roadmap.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-700'
                      : roadmap.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-700'
                      : roadmap.status === 'REJECTED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {roadmap.status === 'PUBLISHED' || roadmap.status === 'APPROVED'
                      ? 'Đã Phê Duyệt'
                      : roadmap.status === 'PENDING'
                      ? 'Chờ Duyệt'
                      : roadmap.status === 'REJECTED'
                      ? 'Bị Từ Chối'
                      : 'Nháp'}
                  </span>
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
  );
}

