import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Lightbulb,
  Map,
} from 'lucide-react';
import TipReviewModal from '../ui/TipReviewModal';
import { approveTip, rejectTip } from '../../services/roadmapService';

function formatDate(value) {
  if (!value) return 'Gần đây';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function ContributorAvatar({ contributor }) {
  const name = contributor?.name || contributor?.email || '?';
  if (contributor?.avatar) {
    return (
      <img
        src={contributor.avatar}
        alt={name}
        className="h-9 w-9 rounded-xl object-cover"
      />
    );
  }

  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

export default function PendingTipsSection({
  tips,
  onRefresh,
  isLoading,
  compact = false,
}) {
  const [selectedTip, setSelectedTip] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApproveTip = async (tipId) => {
    setIsProcessing(true);
    try {
      await approveTip(tipId);
      await onRefresh?.();
    } catch (error) {
      console.error('Error approving tip:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectTip = async (tipId, reason) => {
    setIsProcessing(true);
    try {
      await rejectTip(tipId, reason);
      await onRefresh?.();
    } catch (error) {
      console.error('Error rejecting tip:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`grid gap-4 ${compact ? '' : 'md:grid-cols-2'}`}>
        {Array.from({ length: compact ? 2 : 4 }, (_, index) => (
          <div
            key={index}
            className="h-48 animate-pulse rounded-2xl border border-slate-100 bg-white shadow-sm"
          />
        ))}
      </div>
    );
  }

  if (!tips?.length) {
    return (
      <div className="rounded-3xl border border-dashed border-emerald-200 bg-white px-6 py-12 text-center shadow-sm">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <h3 className="mt-4 font-bold text-slate-900">
          Không có đóng góp chờ duyệt
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Mọi đóng góp đã được xử lý. Danh sách mới sẽ xuất hiện tại đây.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={
          compact
            ? 'divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm'
            : 'grid gap-4 md:grid-cols-2'
        }
      >
        {tips.map((tip) => {
          const contributorName = tip.contributor?.name || 'Học viên ẩn danh';
          const roadmapTitle = tip.node?.learningPath?.title;

          return (
            <button
              key={tip.id}
              type="button"
              onClick={() => setSelectedTip(tip)}
              className={`group text-left transition ${
                compact
                  ? 'w-full p-4 hover:bg-slate-50 sm:p-5'
                  : 'rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Lightbulb className="h-5 w-5" />
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                  <Clock3 className="h-3 w-3" />
                  Chờ duyệt
                </span>
              </div>

              <h3 className="mt-4 line-clamp-1 text-sm font-bold text-slate-900 transition group-hover:text-indigo-600">
                {tip.title || 'Đóng góp chưa có tiêu đề'}
              </h3>
              <p
                className={`mt-2 line-clamp-2 leading-relaxed text-slate-500 ${
                  compact ? 'text-xs' : 'min-h-10 text-sm'
                }`}
              >
                {tip.content}
              </p>

              <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                <Map className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
                <span className="min-w-0 text-xs text-slate-500">
                  {roadmapTitle ? (
                    <span className="block truncate font-medium text-slate-700">
                      {roadmapTitle}
                    </span>
                  ) : null}
                  <span className="block truncate">
                    {tip.node?.title || 'Nội dung chưa xác định'}
                  </span>
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                <ContributorAvatar contributor={tip.contributor} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-slate-800">
                    {contributorName}
                  </span>
                  <span className="block truncate text-[10px] text-slate-400">
                    {formatDate(tip.createdAt)}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500" />
              </div>
            </button>
          );
        })}
      </div>

      <TipReviewModal
        tip={selectedTip}
        isOpen={Boolean(selectedTip)}
        onClose={() => setSelectedTip(null)}
        onApprove={handleApproveTip}
        onReject={handleRejectTip}
        isLoading={isProcessing}
      />
    </>
  );
}
