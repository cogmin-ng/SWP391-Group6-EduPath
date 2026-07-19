import { Star, Users, BookOpen } from 'lucide-react';

function formatStudents(count) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

export default function MentorCard({ mentor }) {
  const rating = mentor.averageRating ?? 0;
  const learnerCount = mentor.totalLearners ?? 0;
  const pathCount = mentor.totalLearningPaths ?? 0;
  const subjects = mentor.subjects ?? [];

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col">
      {/* Header with avatar and basic info */}
      <div className="p-5 pb-3 flex flex-col items-center text-center">
        {mentor.avatar ? (
          <img
            src={mentor.avatar}
            alt={mentor.fullName}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-200 mb-3"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 text-xl font-semibold flex items-center justify-center ring-2 ring-indigo-200 mb-3">
            {mentor.fullName?.charAt(0)?.toUpperCase() || '?'}
          </div>
        )}
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
          {mentor.fullName || 'Mentor'}
        </h3>
      </div>

      {/* Bio */}
      {mentor.bio && (
        <div className="px-5 pb-3">
          <p className="text-sm text-slate-600 line-clamp-2">
            {mentor.bio}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="px-5 py-3 border-t border-b border-slate-100 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-slate-900">{rating.toFixed(1)}</span>
            <span className="text-slate-500">({mentor.totalReviews ?? 0})</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-600" />
            <span className="text-slate-600">{formatStudents(learnerCount)} học viên</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-slate-600" />
            <span className="text-slate-600">{pathCount} lộ trình</span>
          </div>
        </div>
      </div>

      {/* Subjects */}
      {subjects && subjects.length > 0 && (
        <div className="px-5 py-3 flex-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Chuyên môn
          </p>
          <div className="flex flex-wrap gap-1.5">
            {subjects.slice(0, 3).map((subject) => (
              <span
                key={subject.id}
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200"
              >
                {subject.name}
              </span>
            ))}
            {subjects.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200">
                +{subjects.length - 3}
              </span>
            )}
          </div>
        </div>
      )}


    </div>
  );
}
