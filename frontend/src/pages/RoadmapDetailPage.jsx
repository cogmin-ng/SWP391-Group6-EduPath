import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Clock3, Heart, Loader2, Star, StarHalf, User } from 'lucide-react';
import toast from 'react-hot-toast';
import MenteeHeader from '../components/mentee/MenteeHeader';
import Button from '../components/ui/Button';
import RoadmapTimeline from './mentee/features/explore/components/RoadmapTimeline';
import { isFavorited, toggleFavorite } from './mentee/features/enrollments/favorites';
import { enrollInRoadmapBySlug } from '../services/enrollmentService';
import { getRoadmapBySlug } from '../services/roadmapService';
import ReviewSection from '../components/ui/ReviewSection';

export default function RoadmapDetailPage() {
  const { slug } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(() => isFavorited(slug));

  useEffect(() => {
    let isMounted = true;

    const loadRoadmap = async () => {
      try {
        setLoading(true);
        const data = await getRoadmapBySlug(slug);
        if (!isMounted) return;
        setRoadmap(data);
        setEnrolled(Boolean(data.enrollment));
      } catch (error) {
        if (!isMounted) return;
        console.error('Failed to load roadmap detail:', error);
        setRoadmap(null);
        setEnrolled(false);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRoadmap();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const roadmapView = useMemo(() => {
    if (!roadmap) return null;

    const nodes = roadmap.nodes || [];
    const defaultRating = '4.8';

    return {
      ...roadmap,
      cover: roadmap.thumbnail || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80',
      duration: `${Math.max(4, nodes.length * 2)} tuần`,
      rating: defaultRating,
      mentor: roadmap.mentor?.name || 'Mentor EduPath',
      mentorRole: `${roadmap.subject?.name || 'Lộ trình'} Mentor @ EduPath`,
      mentorQuote: 'Học chắc nền tảng, luyện đều từng bước và kiểm chứng bằng thực hành.',
      skills: [
        roadmap.subject?.name,
        ...nodes.slice(0, 2).map((node) => node.title),
      ].filter(Boolean),
      category: roadmap.subject?.name || 'Lộ trình học',
      phases: nodes.map((node, index) => ({
        name: node.title,
        status: node.completed ? 'completed' : index === 0 ? 'active' : 'locked',
        description: node.description,
        highlights: node.description
          ? node.description
            .split(/[,.]/)
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 3)
          : [],
      })),
    };
  }, [roadmap]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-500">Đang tải chi tiết lộ trình...</p>
      </div>
    );
  }

  if (!roadmapView) {
    return <Navigate to="/explore" replace />;
  }

  const handleEnroll = async () => {
    try {
      await enrollInRoadmapBySlug(roadmapView.slug);
      setEnrolled(true);
      setRoadmap((prev) => (prev ? { ...prev, enrollment: { ...(prev.enrollment || {}), status: 'ACTIVE' } } : prev));
      toast.success('Đã đăng ký thành công. Xem lộ trình của tôi.');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể đăng ký lộ trình này.');
    }
  };

  const handleToggleFavorite = () => {
    toggleFavorite(roadmapView.slug);
    const next = !favorited;
    setFavorited(next);
    toast.success(next ? 'Đã lưu vào yêu thích.' : 'Đã bỏ yêu thích.');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MenteeHeader />

      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-8 lg:p-10">
            <div className="absolute inset-0" style={{ backgroundImage: `url(${roadmapView.cover})`, backgroundSize: 'cover', backgroundPosition: 'center right' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/10" />

            <div className="relative z-10 max-w-2xl">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1 text-sm text-slate-600"><Clock3 className="h-4 w-4" />{roadmapView.duration}</span>
                <span className="inline-flex items-center gap-1 text-sm text-slate-600"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{roadmapView.rating}</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{roadmapView.title}</h1>
              <p className="mt-4 text-base leading-7 text-slate-600">{roadmapView.description}</p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {enrolled ? (
                  <Link to={`/roadmaps/${roadmapView.slug}/learn`}>
                    <Button className="gap-2">Học tập ngay <ArrowRight className="h-4 w-4" /></Button>
                  </Link>
                ) : (
                  <Button className="gap-2" onClick={handleEnroll}>Đăng ký <ArrowRight className="h-4 w-4" /></Button>
                )}
                <button
                  onClick={handleToggleFavorite}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all active:scale-95 ${favorited
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  <Heart
                    className={`h-4 w-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`}
                  />
                  {favorited ? 'Đã lưu' : 'Lưu vào yêu thích'}
                </button>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-indigo-500 bg-indigo-600 p-6 lg:col-span-4 shadow-xl shadow-indigo-600/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-200">Mentor chính</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{roadmapView.mentor}</h3>
            <p className="text-sm text-indigo-100">{roadmapView.mentorRole}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(roadmapView.skills || [roadmapView.category]).map((skill) => (
                <span key={skill} className="rounded-md bg-indigo-500/50 border border-indigo-400 px-2.5 py-1 text-xs text-indigo-50">{skill}</span>
              ))}
            </div>

            <p className="mt-4 text-sm italic text-indigo-100">"{roadmapView.mentorQuote}"</p>
          </aside>
        </section>

        <RoadmapTimeline phases={roadmapView.phases} />

        <ReviewSection
          learningPathId={roadmapView.id}
          mentorId={roadmap.mentorId}
          isEnrolled={enrolled}
        />
      </main>

    </div>
  );
}
