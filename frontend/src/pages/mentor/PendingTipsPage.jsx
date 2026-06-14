import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getPendingTips } from '../../services/roadmapService';
import PendingTipsSection from '../../components/mentor/PendingTipsSection';
import { ChevronRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PendingTipsPage = () => {
  const { user } = useAuth();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ skip: 0, take: 10 });
  const [total, setTotal] = useState(0);

  // ─── Fetch pending tips ─────────────────────────────────
  useEffect(() => {
    const fetchPendingTips = async () => {
      setLoading(true);
      try {
        const result = await getPendingTips(pagination.skip, pagination.take);
        setTips(result.tips || []);
        setTotal(result.total || 0);
      } catch (err) {
        toast.error('Không thể tải danh sách Tips chờ duyệt');
        console.error('Failed to fetch pending tips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingTips();
  }, [pagination]);

  // ─── Pagination handlers ────────────────────────────────
  const handleNextPage = () => {
    setPagination((prev) => ({
      ...prev,
      skip: prev.skip + prev.take,
    }));
  };

  const handlePrevPage = () => {
    setPagination((prev) => ({
      ...prev,
      skip: Math.max(0, prev.skip - prev.take),
    }));
  };

  const handleRefresh = () => {
    setPagination({ skip: 0, take: 10 });
  };

  const currentPage = Math.floor(pagination.skip / pagination.take) + 1;
  const totalPages = Math.ceil(total / pagination.take);
  const hasNextPage = pagination.skip + pagination.take < total;
  const hasPrevPage = pagination.skip > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Quản lý Tips - Duyệt Đóng góp
          </h1>
          <p className="text-slate-600">
            Xem xét và duyệt các Tips được Mentees đóng góp cho lộ trình của bạn
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Tổng cộng</p>
            <p className="text-2xl font-bold text-slate-900">{total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Chờ duyệt</p>
            <p className="text-2xl font-bold text-amber-600">{tips.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Trang</p>
            <p className="text-2xl font-bold text-indigo-600">
              {totalPages > 0 ? currentPage : 0} / {totalPages}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Mentor</p>
            <p className="text-lg font-bold text-slate-900">{user?.name || 'N/A'}</p>
          </div>
        </div>

        {/* Pending Tips Section */}
        <div className="mb-6">
          <PendingTipsSection
            tips={tips}
            isLoading={loading}
            onRefresh={handleRefresh}
          />
        </div>

        {/* Pagination Controls */}
        {tips.length > 0 && totalPages > 1 && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm px-6 py-4 flex items-center justify-between">
            <button
              onClick={handlePrevPage}
              disabled={!hasPrevPage}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Trước
            </button>
            <div className="text-center">
              <p className="text-sm text-slate-600">
                Đang hiển thị {Math.min(pagination.skip + 1, total)} đến{' '}
                {Math.min(pagination.skip + pagination.take, total)} của {total} Tips
              </p>
            </div>
            <button
              onClick={handleNextPage}
              disabled={!hasNextPage}
              className="px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              Tiếp <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Empty State with No Tips */}
        {!loading && tips.length === 0 && total === 0 && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center">
            <div className="inline-block mb-4 p-3 bg-emerald-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-slate-700 font-medium">Không có Tips chờ duyệt</p>
            <p className="text-sm text-slate-600 mt-2">
              Mọi Tips đã được xử lý. Quay lại sau để xem các đóng góp mới!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingTipsPage;
