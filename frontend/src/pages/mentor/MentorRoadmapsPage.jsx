import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMentorRoadmaps } from '../../services/roadmapService';
import { Loader2 } from 'lucide-react';

export default function MentorRoadmapsPage() {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRoadmaps() {
      try {
        setLoading(true);
        const data = await getMentorRoadmaps(0, 100);
        setRoadmaps(data.roadmaps || []);
      } catch (err) {
        console.error(err);
        setError('Không thể tải danh sách lộ trình. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    }
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
      case 'DRAFT':
        return { text: 'Nháp', className: 'bg-slate-100 text-slate-700 border-slate-200' };
      case 'PENDING':
        return { text: 'Chờ Duyệt', className: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'APPROVED':
        return { text: 'Đã Duyệt', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'REJECTED':
        return { text: 'Từ Chối', className: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'PUBLISHED':
        return { text: 'Đã Xuất Bản', className: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      default:
        return { text: status, className: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Lộ trình của tôi</h1>
        <p className="text-slate-500 mt-2">
          Quản lý và phát triển các chương trình đào tạo của bạn.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-slate-500 mt-2 text-sm">Đang tải danh sách lộ trình...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-rose-50 border border-rose-100 rounded-2xl p-6">
          <p className="text-rose-600 font-medium">{error}</p>
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-6">
          <h3 className="font-semibold text-slate-800 text-lg">Bạn chưa tạo lộ trình nào</h3>
          <p className="text-slate-500 text-sm mt-1">Hãy bắt đầu bằng việc tạo lộ trình mới.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roadmaps.map((roadmap) => {
            const badge = getStatusBadge(roadmap.status);
            return (
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
                    <span className={`absolute right-3 top-3 px-2 py-0.5 text-[10px] font-bold rounded-full border shadow-sm ${badge.className}`}>
                      {badge.text}
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h4 className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition tracking-tight line-clamp-1">
                      {roadmap.title}
                    </h4>
                    {roadmap.description && (
                      <p className="text-xs text-slate-500 line-clamp-2">{roadmap.description}</p>
                    )}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
