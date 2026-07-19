import { Clock3, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

function formatStudents(count) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

function getMentorInfo(mentor) {
  if (typeof mentor === 'string') {
    return { name: mentor, avatar: null };
  }
  if (mentor && typeof mentor === 'object') {
    return { name: mentor.name || '', avatar: mentor.avatar || null };
  }
  return { name: '', avatar: null };
}

export default function RoadmapCard({ roadmap }) {
  const mentor = getMentorInfo(roadmap.mentor);
  const rating = roadmap.averageRating ?? roadmap.rating;
  const learnerCount = roadmap.totalLearners ?? roadmap.enrollmentCount ?? 0;

  return (
    <Link to={`/explore/${roadmap.slug}`} className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img 
          src={roadmap.cover || roadmap.thumbnail || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80'} 
          alt={roadmap.title || 'Roadmap'} 
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-indigo-700 transition-colors">{roadmap.title}</h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{roadmap.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            {mentor.avatar ? (
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
              />
            ) : (
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center ring-1 ring-slate-200">
                {mentor.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            )}
            <span className="text-sm font-medium text-slate-800">{mentor.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {rating != null && (
              <span className="inline-flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {rating}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {formatStudents(learnerCount)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

