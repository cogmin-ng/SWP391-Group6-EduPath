import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronRight, Circle, Lock } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import Button from '../components/ui/Button';
import { getRoadmapBySlug } from '../features/explore/data/roadmaps';
import { getEnrollmentBySlug, isEnrolled, updateEnrollmentProgress } from '../features/enrollments/storage';

function statusText(progress) {
  if (progress >= 100) return 'Completed';
  if (progress > 0) return 'In progress';
  return 'Not started';
}

export default function RoadmapLearningPage() {
  const { slug } = useParams();
  const roadmap = getRoadmapBySlug(slug);
  const enrollment = getEnrollmentBySlug(slug);
  const [progress, setProgress] = useState(enrollment?.progress ?? 0);

  const phases = roadmap?.phases || [];
  const activePhase = useMemo(() => phases.find((p) => p.status === 'active') || phases[0], [phases]);

  if (!roadmap) return <Navigate to="/explore" replace />;
  if (!isEnrolled(slug)) return <Navigate to={`/explore/${slug}`} replace />;

  const handleContinue = () => {
    const next = Math.min(progress + 5, 100);
    setProgress(next);
    updateEnrollmentProgress(slug, next);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-12 pt-24 lg:flex-row sm:px-6 lg:px-8">
        <main className="flex-1">
          <nav className="mb-4 flex items-center gap-1 text-xs text-slate-500">
            <Link to="/roadmaps" className="hover:text-indigo-600">My Roadmaps</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-slate-700">{roadmap.title}</span>
          </nav>

          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{roadmap.title}</h1>
              <p className="mt-2 max-w-2xl text-slate-600">{roadmap.description}</p>
            </div>
            <div className="hidden rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 md:block">
              {statusText(progress)} - {progress}%
            </div>
          </div>

          <div className="relative ml-2 border-l-2 border-slate-200 pl-8">
            {phases.map((phase, index) => {
              const completed = phase.status === 'completed';
              const active = phase.status === 'active';
              const locked = phase.status === 'locked';

              return (
                <article key={phase.name} className="relative mb-8">
                  <div className="absolute -left-[42px] top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-sm bg-white">
                    {completed && <CheckCircle2 className="h-5 w-5 text-indigo-600" />}
                    {active && <Circle className="h-5 w-5 fill-indigo-600 text-indigo-600" />}
                    {locked && <Lock className="h-4 w-4 text-slate-400" />}
                  </div>

                  <div className={`rounded-xl border p-4 ${active ? 'border-indigo-200 bg-indigo-50/40' : 'border-slate-200 bg-white'} ${locked ? 'opacity-60' : ''}`}>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className={`text-lg font-semibold ${active ? 'text-indigo-700' : 'text-slate-900'}`}>Phase {index + 1}: {phase.name}</h3>
                      <span className="text-xs text-slate-500">{phase.weeks}</span>
                    </div>
                    <ul className="space-y-1.5 text-sm text-slate-700">
                      {phase.highlights.map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>

                    {active && (
                      <div className="mt-4 rounded-lg border border-indigo-200 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Current Module</p>
                        <p className="mt-1 text-sm text-slate-700">{activePhase.highlights?.[0]}</p>
                        <div className="mt-3 h-2 rounded-full bg-slate-100">
                          <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${progress}%` }} />
                        </div>
                        <Button className="mt-3 gap-2" onClick={handleContinue}>Continue Learning <ArrowRight className="h-4 w-4" /></Button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </main>

        <aside className="w-full shrink-0 lg:w-80">
          <div className="sticky top-24 space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Track Progress</h2>
              <p className="mt-1 text-sm text-slate-500">{roadmap.mentor}</p>
            </div>

            <div>
              <div className="mb-2 flex items-end justify-between">
                <span className="text-sm text-slate-600">Roadmap Status</span>
                <span className="text-2xl font-bold text-indigo-600">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Module Checklist</h3>
              <ul className="space-y-2 text-sm">
                {(activePhase?.highlights || []).map((item, idx) => (
                  <li key={item} className="flex items-start gap-2 text-slate-700">
                    {idx === 0 ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-indigo-600" /> : <Circle className="mt-0.5 h-4 w-4 text-slate-300" />}
                    <span className={idx === 0 ? 'line-through opacity-70' : ''}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm italic text-slate-600">
              "{roadmap.mentorQuote || 'Keep moving, small consistent wins compound quickly.'}"
            </div>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
