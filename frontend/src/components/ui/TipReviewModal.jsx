import { useState } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const TipReviewModal = ({ tip, isOpen, onClose, onApprove, onReject, isLoading }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  if (!isOpen || !tip) return null;

  const handleApprove = async () => {
    try {
      await onApprove(tip.id);
      toast.success('Tip đã được duyệt!');
      setRejectReason('');
      onClose();
    } catch (err) {
      toast.error(err?.message || 'Lỗi khi duyệt tip');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }

    if (rejectReason.trim().length < 5) {
      toast.error('Lý do từ chối phải ít nhất 5 ký tự');
      return;
    }

    try {
      setIsRejecting(true);
      await onReject(tip.id, rejectReason);
      toast.success('Tip đã bị từ chối');
      setRejectReason('');
      onClose();
    } catch (err) {
      toast.error(err?.message || 'Lỗi khi từ chối tip');
    } finally {
      setIsRejecting(false);
    }
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10 p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Duyệt Tip</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tip Content */}
        <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          {/* Title */}
          <h4 className="text-lg font-semibold text-slate-900 mb-2">
            {tip.title || '(Không có tiêu đề)'}
          </h4>

          {/* Metadata */}
          <div className="mb-4 flex flex-wrap gap-4 text-sm text-slate-600">
            <div>
              <span className="text-slate-500">Người đóng góp:</span>{' '}
              <span className="font-medium">
                {tip.contributor?.name || 'Unknown User'}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Node:</span>{' '}
              <span className="font-medium">{tip.node?.title || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500">Ngày gửi:</span>{' '}
              <span className="font-medium">{formatDate(tip.createdAt)}</span>
            </div>
          </div>

          {/* Content */}
          <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200">
            <p className="text-slate-800 whitespace-pre-wrap">{tip.content}</p>
          </div>

          {/* Contributor Avatar & Bio (optional) */}
          {tip.contributor && (
            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-3">
              {tip.contributor.avatar && (
                <img
                  src={tip.contributor.avatar}
                  alt={tip.contributor.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-sm font-medium text-slate-900">{tip.contributor.name}</p>
                <p className="text-xs text-slate-600">{tip.contributor.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Rejection Reason (if showing reject form) */}
        {isRejecting ? (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Lý do từ chối <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối (tối thiểu 5 ký tự)..."
              className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none h-24"
            />
            <p className="text-xs text-slate-500 mt-1">
              Mentee sẽ nhận được thông báo với lý do này
            </p>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading || isRejecting}
            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRejecting ? 'Quay lại' : 'Đóng'}
          </button>

          {isRejecting ? (
            <>
              <button
                onClick={() => setIsRejecting(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                {isLoading ? 'Đang xử lý...' : 'Từ chối'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsRejecting(true)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg border border-red-300 text-red-700 font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Từ chối
              </button>
              <button
                onClick={handleApprove}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                {isLoading ? 'Đang xử lý...' : 'Duyệt'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TipReviewModal;
