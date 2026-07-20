import { BookOpen, CheckCircle } from 'lucide-react';

const PendingReviewsSection = ({ reviews, onSelect }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <h3 className="mb-2 text-base font-semibold text-slate-900">Không có lộ trình chờ duyệt</h3>
          <p className="text-sm text-slate-500">Mọi lộ trình đã được hệ thống xử lý.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      {/* Reviews List */}
      <div className="divide-y divide-slate-100">
        {reviews.map((review) => (
          <button
            key={review.id}
            type="button"
            onClick={() => onSelect?.(review.id)}
            className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-slate-50 sm:p-5"
          >
            {/* Icon */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50">
              <BookOpen className="h-5 w-5 text-indigo-600" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="line-clamp-2 text-sm font-bold text-slate-900">{review.title}</h4>
              <p className="mt-1 text-xs text-slate-500">
                Gửi duyệt {review.submittedDate}
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex-shrink-0">
              <span className="whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                Chờ duyệt
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PendingReviewsSection;
