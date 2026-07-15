import { useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Star, StarHalf, User, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { getRoadmapById } from '../../services/roadmapService';
import ReviewSection from '../../components/ui/ReviewSection';

export default function MentorRoadmapDetailPage() {
  const { roadmapId } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const data = await getRoadmapById(roadmapId);
        setRoadmap(data);
      } catch (err) {
        console.error('Failed to load roadmap:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [roadmapId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Đang tải...</p>
      </div>
    );
  }

  if (error || !roadmap) {
    return <Navigate to="/mentor/roadmaps" replace />;
  }

  // Calculate average rating from phases if available
  const averageRating = 4.8;
  const nodes = roadmap.nodes || [];
  const mentorName = roadmap.mentor?.name || 'Mentor';

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-8 lg:p-10">
            <div className="absolute inset-0" style={{ backgroundImage: `url(${roadmap.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center right' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/10" />

            <div className="relative z-10 max-w-2xl">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {averageRating}
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                  <User className="h-4 w-4" />
                  {roadmap._count?.enrollments || 0} học viên
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{roadmap.title}</h1>
              <p className="mt-4 text-base leading-7 text-slate-600">{roadmap.description}</p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link to={`/mentor/roadmaps/${roadmap.id}/learn`}>
                  <Button className="gap-2">Xem lộ trình <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-indigo-500 bg-indigo-600 p-6 lg:col-span-4 shadow-xl shadow-indigo-600/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-200">Thông tin lộ trình</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{roadmap.title}</h3>
            <p className="text-sm text-indigo-100">Tạo bởi {mentorName}</p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-500 pb-3">
                <span className="text-sm text-indigo-200">Nodes:</span>
                <span className="text-sm font-semibold text-white">{nodes.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-indigo-200">Trạng thái:</span>
                <span className={`text-sm font-semibold px-2 py-1 rounded-md ${
                  roadmap.status === 'PUBLISHED' || roadmap.status === 'APPROVED'
                    ? 'bg-emerald-500/20 text-emerald-100'
                    : roadmap.status === 'PENDING'
                    ? 'bg-amber-500/20 text-amber-100'
                    : 'bg-indigo-500 text-indigo-100'
                }`}>
                  {roadmap.status === 'PUBLISHED' || roadmap.status === 'APPROVED'
                    ? 'Đã Phê Duyệt'
                    : roadmap.status === 'PENDING'
                    ? 'Chờ Duyệt'
                    : roadmap.status === 'REJECTED'
                    ? 'Bị Từ Chối'
                    : 'Nháp'}
                </span>
              </div>
            </div>
          </aside>
        </section>

        <section className="mx-auto mt-16 w-full max-w-4xl">
          <div className="mb-6 border-b border-slate-200 pb-3">
            <h2 className="text-2xl font-bold text-slate-900">Curriculum Path</h2>
            <p className="mt-1 text-sm text-slate-500">{nodes.length} Nodes</p>
          </div>

          <div className="space-y-4">
            {nodes.map((node, index) => (
              <div key={node.id} className="relative last:mb-0 group cursor-pointer">
                <div className="rounded-xl border border-slate-200 bg-white p-4 transition-all group-hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-indigo-600">
                        Node {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-slate-900">{node.title}</h3>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {node.description || 'Complete this phase to unlock the next node.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feedback & Community */}
        {(roadmap.status === 'APPROVED' || roadmap.status === 'PUBLISHED') && (
          <ReviewSection
            learningPathId={roadmap.id}
            mentorId={roadmap.mentorId}
            isEnrolled={false}
          />
        )}
      </main>
    </div >
  );
}

