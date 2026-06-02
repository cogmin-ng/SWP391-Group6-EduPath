import { BookOpen, CheckCircle } from 'lucide-react';

const PendingReviewsSection = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">All Roadmaps Approved!</h3>
          <p className="text-slate-500">You have no pending reviews at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Reviews List */}
      <div className="divide-y divide-slate-100">
        {reviews.map((review) => (
          <div key={review.id} className="p-6 hover:bg-slate-50/50 transition-colors flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold text-slate-900">{review.title}</h4>
              <p className="text-sm text-slate-500 mt-1">
                Submitted: {review.submittedDate}
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex-shrink-0">
              <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-semibold whitespace-nowrap">
                Pending Approval
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingReviewsSection;
