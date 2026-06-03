import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getContributionHistory } from '../../services/roadmapService';
import { ChevronRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ContributionHistoryPage = () => {
  const { user } = useAuth();
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ skip: 0, take: 10 });
  const [total, setTotal] = useState(0);

  // ─── Fetch contribution history ─────────────────────────
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const result = await getContributionHistory(pagination.skip, pagination.take);
        setContributions(result.tips || []);
        setTotal(result.total || 0);
      } catch (err) {
        toast.error('Không thể tải lịch sử đóng góp');
        console.error('Failed to fetch contribution history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [pagination]);

  // ─── Status badge styling ───────────────────────────────
  const getStatusBadge = (status) => {
    const baseClass = 'px-3 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'PENDING':
        return `${baseClass} bg-amber-100 text-amber-800`;
      case 'APPROVED':
        return `${baseClass} bg-emerald-100 text-emerald-800`;
      case 'REJECTED':
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-slate-100 text-slate-800`;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ duyệt';
      case 'APPROVED':
        return 'Đã duyệt';
      case 'REJECTED':
        return 'Bị từ chối';
      default:
        return status;
    }
  };

  // ─── Format date ───────────────────────────────────────
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  const currentPage = Math.floor(pagination.skip / pagination.take) + 1;
  const totalPages = Math.ceil(total / pagination.take);
  const hasNextPage = pagination.skip + pagination.take < total;
  const hasPrevPage = pagination.skip > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Lịch sử đóng góp Tips</h1>
          <p className="text-slate-600">
            Xem tất cả các Tips bạn đã đóng góp và trạng thái duyệt của chúng
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Tổng cộng</p>
            <p className="text-2xl font-bold text-slate-900">{total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Chờ duyệt</p>
            <p className="text-2xl font-bold text-amber-600">
              {contributions.filter((c) => c.status === 'PENDING').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-sm text-slate-600 mb-1">Đã duyệt</p>
            <p className="text-2xl font-bold text-emerald-600">
              {contributions.filter((c) => c.status === 'APPROVED').length}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-slate-600">Đang tải...</p>
            </div>
          ) : contributions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-block mb-4 p-3 bg-slate-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-slate-600 font-medium">Bạn chưa đóng góp Tips nào</p>
              <p className="text-sm text-slate-500 mt-1">
                Hãy vào một lộ trình đang học và nhấn nút "Thêm Tip"
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {contributions.map((tip) => (
                <div
                  key={tip.id}
                  className="p-6 hover:bg-slate-50 transition-colors duration-200"
                >
                  {/* Title & Status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {tip.title || '(Không có tiêu đề)'}
                      </h3>
                      <p className="text-sm text-slate-600">
                        Node: <span className="font-medium">{tip.node?.title || 'N/A'}</span>
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className={getStatusBadge(tip.status)}>
                        {getStatusLabel(tip.status)}
                      </span>
                    </div>
                  </div>

                  {/* Content preview */}
                  <p className="text-slate-700 mb-4 line-clamp-2">
                    {tip.content}
                  </p>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                    <div>
                      <span className="text-slate-500">Gửi:</span>{' '}
                      <span className="font-medium">{formatDate(tip.createdAt)}</span>
                    </div>
                    {tip.reviewedAt && (
                      <div>
                        <span className="text-slate-500">Duyệt:</span>{' '}
                        <span className="font-medium">{formatDate(tip.reviewedAt)}</span>
                      </div>
                    )}
                  </div>

                  {/* Rejection reason */}
                  {tip.status === 'REJECTED' && tip.rejectReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        <span className="font-semibold">Lý do từ chối:</span> {tip.rejectReason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {contributions.length > 0 && totalPages > 1 && (
            <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
              <button
                onClick={handlePrevPage}
                disabled={!hasPrevPage}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Trước
              </button>
              <p className="text-sm text-slate-600">
                Trang {currentPage} của {totalPages}
              </p>
              <button
                onClick={handleNextPage}
                disabled={!hasNextPage}
                className="px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Tiếp <ChevronRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContributionHistoryPage;
