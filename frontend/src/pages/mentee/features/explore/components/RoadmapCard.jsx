import { Clock3, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

function formatStudents(count) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

export default function RoadmapCard({ roadmap }) {
  return (
    <Link to={`/explore/${roadmap.slug}`} className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img src={roadmap.cover} alt={roadmap.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-indigo-700 transition-colors">{roadmap.title}</h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-2">{roadmap.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm font-medium text-slate-800">{roadmap.mentor}</span>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {roadmap.rating != null && (
              <span className="inline-flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {roadmap.rating}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {formatStudents(roadmap.enrollmentCount ?? 0)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
