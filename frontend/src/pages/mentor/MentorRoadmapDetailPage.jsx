import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Star, StarHalf, User } from 'lucide-react';
import Button from '../../components/ui/Button';
import { myRoadmaps } from '../../mock/mentorDashboardData';

const initialReviews = [
  {
    id: 1,
    name: 'Alex M.',
    avatar: '',
    rating: 5,
    text: '"Amazing course! The practical projects really solidified my understanding of React and Node.js."',
  },
  {
    id: 2,
    name: 'Jamie L.',
    avatar: '',
    rating: 4.5,
    text: '"Dr. Jenkins is a fantastic mentor. Highly recommend this roadmap for aspiring fullstack devs."',
  },
];

export default function MentorRoadmapDetailPage() {
  const { roadmapId } = useParams();
  const roadmap = myRoadmaps.find((r) => r.id === parseInt(roadmapId));
  
  const [reviews] = useState(initialReviews);

  if (!roadmap) {
    return <Navigate to="/mentor/roadmaps" replace />;
  }

  // Calculate average rating from phases if available
  const averageRating = 4.8;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-8 lg:p-10">
            <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url(${roadmap.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/70" />

            <div className="relative z-10 max-w-2xl">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {averageRating}
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                  <User className="h-4 w-4" />
                  {roadmap.studentCount} học viên
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

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Thông tin lộ trình</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{roadmap.title}</h3>
            <p className="text-sm text-slate-600">Tạo bởi {roadmap.tutor}</p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Số bài học:</span>
                <span className="text-sm font-semibold text-slate-900">{roadmap.nodeCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Học viên:</span>
                <span className="text-sm font-semibold text-slate-900">{roadmap.studentCount}</span>
              </div>
            </div>
          </aside>
        </section>

        {/* Curriculum Path */}
        <section className="mx-auto mt-16 w-full max-w-4xl">
          <div className="mb-6 border-b border-slate-200 pb-3">
            <h2 className="text-2xl font-bold text-slate-900">Curriculum Path</h2>
            <p className="mt-1 text-sm text-slate-500">{roadmap.phases?.length || 0} Nodes</p>
          </div>

          <div className="space-y-4">
            {roadmap.phases?.map((phase, index) => {
              const isActive = phase.status === 'active';
              const isLocked = phase.status === 'locked';

              return (
                <div key={phase.name} className="relative last:mb-0 group cursor-pointer">
                  <div
                    className={`rounded-xl border p-4 transition-all group-hover:shadow-md ${
                      isActive
                        ? 'border-indigo-200 bg-white'
                        : isLocked
                          ? 'border-slate-200 bg-slate-50'
                          : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wide text-indigo-600">
                          Node {index + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-slate-900">{phase.name}</h3>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {phase.highlights?.join(', ') || phase.description || 'Complete this phase to unlock the next node.'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Feedback & Community */}
        <section className="mx-auto mt-16 w-full max-w-4xl">
          <div className="mb-6 border-b border-slate-200 pb-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Feedback &amp; Cộng đồng</h2>
            <p className="mt-1 text-sm text-slate-500">Đánh giá từ người học</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Reviews List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Đánh giá</h3>
              {reviews.map((review) => (
                <div key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{review.name}</p>
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star}>
                            {star <= Math.floor(review.rating) ? (
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ) : star - 0.5 === review.rating ? (
                              <StarHalf className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ) : (
                              <Star className="h-4 w-4 text-slate-300" />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
