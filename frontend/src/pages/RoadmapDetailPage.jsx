import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Clock3, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import Button from '../components/ui/Button';
import RoadmapTimeline from '../features/explore/components/RoadmapTimeline';
import { getRoadmapBySlug } from '../features/explore/data/roadmaps';
import { enrollRoadmap, isEnrolled } from '../features/enrollments/storage';

export default function RoadmapDetailPage() {
  const { slug } = useParams();
  const roadmap = getRoadmapBySlug(slug);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (roadmap?.slug) {
      setEnrolled(isEnrolled(roadmap.slug));
    }
  }, [roadmap?.slug]);

  if (!roadmap) {
    return <Navigate to="/explore" replace />;
  }

  const handleEnroll = () => {
    enrollRoadmap(roadmap.slug);
    setEnrolled(true);
    toast.success('Enrolled successfully. Check My Roadmaps.');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-8 lg:p-10">
            <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url(${roadmap.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/70" />

            <div className="relative z-10 max-w-2xl">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">{roadmap.levelLabel || roadmap.difficulty}</span>
                <span className="inline-flex items-center gap-1 text-sm text-slate-600"><Clock3 className="h-4 w-4" />{roadmap.duration}</span>
                <span className="inline-flex items-center gap-1 text-sm text-slate-600"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{roadmap.rating}</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{roadmap.title}</h1>
              <p className="mt-4 text-base leading-7 text-slate-600">{roadmap.description}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {enrolled ? (
                  <Link to="/roadmaps">
                    <Button className="gap-2">Go to My Roadmaps <ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                ) : (
                  <Button className="gap-2" onClick={handleEnroll}>Enroll Now <ArrowRight className="h-4 w-4" /></Button>
                )}
                <Button variant="secondary">Save Path</Button>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lead Mentor</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{roadmap.mentor}</h3>
            <p className="text-sm text-slate-600">{roadmap.mentorRole || 'Senior Mentor @ EduPath'}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(roadmap.skills || [roadmap.category]).map((skill) => (
                <span key={skill} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-700">{skill}</span>
              ))}
            </div>

            <p className="mt-4 text-sm text-slate-600">"{roadmap.mentorQuote || 'Build with intent, verify with data, and improve continuously.'}"</p>
          </aside>
        </section>

        <RoadmapTimeline phases={roadmap.phases} />
      </main>

      <Footer />
    </div>
  );
}
