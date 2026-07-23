import { useState } from 'react';
import {
  AlertCircle,
  Check,
  Clock3,
  Lightbulb,
  Loader2,
  Map,
  User,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

function formatDate(value) {
  if (!value) return 'Gần đây';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function TipReviewModal({
  tip,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isLoading,
}) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!isOpen || !tip) return null;

  const closeModal = () => {
    if (isLoading) return;
    setRejectReason('');
    setShowRejectForm(false);
    onClose();
  };

  const handleApprove = async () => {
    try {
      await onApprove(tip.id);
      toast.success('Đóng góp đã được duyệt và công bố');
      closeModal();
    } catch (error) {
      toast.error(error?.message || 'Không thể duyệt đóng góp');
    }
  };

  const handleReject = async () => {
    const reason = rejectReason.trim();
    if (reason.length < 5) {
      toast.error('Lý do từ chối phải có ít nhất 5 ký tự');
      return;
    }

    try {
      await onReject(tip.id, reason);
      toast.success('Đã từ chối đóng góp');
      closeModal();
    } catch (error) {
      toast.error(error?.message || 'Không thể từ chối đóng góp');
    }
  };

  const contributorName = tip.contributor?.name || 'Học viên ẩn danh';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Đóng cửa sổ duyệt đóng góp"
        onClick={closeModal}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-indigo-100 bg-linear-to-r from-indigo-50 via-white to-violet-50 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Lightbulb className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Đóng góp đang chờ duyệt
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                Xem xét nội dung
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={closeModal}
            disabled={isLoading}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 font-semibold text-amber-700">
              <Clock3 className="h-3.5 w-3.5" />
              {formatDate(tip.createdAt)}
            </span>
            <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 font-semibold text-indigo-700">
              <Map className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {tip.node?.title || 'Nội dung chưa xác định'}
              </span>
            </span>
          </div>

          <div className="mt-5">
            <h3 className="text-xl font-bold leading-snug text-slate-900">
              {tip.title || 'Đóng góp chưa có tiêu đề'}
            </h3>
            {tip.node?.learningPath?.title ? (
              <p className="mt-1 text-xs font-medium text-indigo-600">
                {tip.node.learningPath.title}
              </p>
            ) : null}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Nội dung chia sẻ
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {tip.content}
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            {tip.contributor?.avatar ? (
              <img
                src={tip.contributor.avatar}
                alt={contributorName}
                className="h-11 w-11 rounded-xl object-cover"
              />
            ) : (
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                <User className="h-5 w-5" />
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                {contributorName}
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {tip.contributor?.email || 'Không có email'}
              </p>
            </div>
          </div>

          {showRejectForm ? (
            <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
              <label
                htmlFor="tip-reject-reason"
                className="text-sm font-bold text-slate-900"
              >
                Lý do từ chối <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="tip-reject-reason"
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                placeholder="Giải thích rõ nội dung cần cải thiện để học viên có thể đóng góp tốt hơn..."
                rows={4}
                maxLength={500}
                className="mt-2 w-full resize-none rounded-xl border border-rose-200 bg-white p-3 text-sm text-slate-700 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
              />
              <div className="mt-2 flex justify-between gap-3 text-[11px] text-slate-500">
                <span>Học viên sẽ nhận được lý do này.</span>
                <span>{rejectReason.length}/500</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          {showRejectForm ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectReason('');
                }}
                disabled={isLoading}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-wait disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                Xác nhận từ chối
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={closeModal}
                disabled={isLoading}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => setShowRejectForm(true)}
                disabled={isLoading}
                className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
              >
                Từ chối
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Duyệt và công bố
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
