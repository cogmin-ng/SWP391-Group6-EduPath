import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { getEnrollments } from '../features/enrollments/storage';
import { roadmaps } from '../features/explore/data/roadmaps';

function getStatus(progress) {
  if (progress >= 100) return 'Completed';
  if (progress > 0) return 'In progress';
  return 'Not started';
}

export default function MyRoadmapsPage() {
  const enrollments = getEnrollments();
  const enrolledRoadmaps = enrollments
    .map((enrollment) => {
      const roadmap = roadmaps.find((item) => item.slug === enrollment.slug);
      if (!roadmap) return null;
      return {
        ...roadmap,
        progress: enrollment.progress,
      };
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Roadmaps</h1>
          <p className="mt-2 text-slate-600">Courses you enrolled in with your completion progress.</p>
        </header>

        {enrolledRoadmaps.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-slate-700">You have not enrolled in any roadmap yet.</p>
            <Link to="/explore" className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
              Explore roadmaps
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {enrolledRoadmaps.map((roadmap) => (
              <article key={roadmap.slug} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <img src={roadmap.cover} alt={roadmap.title} className="h-40 w-full object-cover" />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">{roadmap.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{roadmap.mentor}</p>

                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                      <span>{getStatus(roadmap.progress)}</span>
                      <span>{roadmap.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${roadmap.progress}%` }} />
                    </div>
                  </div>

                  <Link to={`/roadmaps/${roadmap.slug}/learn`} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
