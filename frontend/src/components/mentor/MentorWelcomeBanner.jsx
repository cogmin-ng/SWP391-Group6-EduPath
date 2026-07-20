import { useState } from 'react';
import { ArrowRight, Plus, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const INSPIRATIONS = [
  'Một lộ trình rõ ràng giúp học viên biến mục tiêu lớn thành những bước tiến nhỏ mỗi ngày.',
  'Kiến thức được chia sẻ đúng lúc có thể thay đổi cả hành trình học tập của một người.',
  'Phản hồi tốt không chỉ sửa một bài làm, mà còn mở ra một cách tư duy mới.',
  'Lộ trình tốt nhất là lộ trình giúp học viên biết mình đang ở đâu và cần đi tiếp thế nào.',
];

export default function MentorWelcomeBanner({
  totalRoadmaps,
  totalStudents,
  pendingActions,
  onCreateRoadmap,
  onManageRoadmaps,
  onViewLearners,
  onViewPending,
}) {
  const { user } = useAuth();
  const [inspirationIndex, setInspirationIndex] = useState(0);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#635BFF] p-5 text-white shadow-xl sm:p-7 lg:p-8">
      <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-300/15 blur-3xl" />

      <div className="relative grid items-center gap-8 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
            Dashboard mentor
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Chào bạn, {user?.name || 'Mentor'} 👋
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-indigo-100 md:text-base">
              Theo dõi lộ trình, đồng hành cùng học viên và xử lý những nội dung đang chờ bạn.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 text-xs italic text-indigo-50 sm:text-sm">
            <span>“{INSPIRATIONS[inspirationIndex]}”</span>
            <button
              type="button"
              onClick={() =>
                setInspirationIndex(
                  (current) => (current + 1) % INSPIRATIONS.length
                )
              }
              className="shrink-0 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold not-italic transition hover:bg-white/25"
            >
              Câu khác
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCreateRoadmap}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-md transition hover:bg-indigo-50"
            >
              <Plus className="h-4 w-4" />
              Tạo lộ trình mới
            </button>
            <button
              type="button"
              onClick={onManageRoadmaps}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-2.5 text-sm font-medium transition hover:bg-white/10"
            >
              Quản lý lộ trình
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1">
          <button
            type="button"
            onClick={onManageRoadmaps}
            className="rounded-2xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur transition hover:bg-white/15"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wide text-indigo-100">
              Lộ trình đã tạo
            </span>
            <strong className="mt-1 block text-2xl text-white">{totalRoadmaps}</strong>
          </button>
          <button
            type="button"
            onClick={onViewLearners}
            className="rounded-2xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur transition hover:bg-white/15"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wide text-indigo-100">
              Học viên đang đồng hành
            </span>
            <strong className="mt-1 block text-2xl text-white">{totalStudents}</strong>
          </button>
          <button
            type="button"
            onClick={onViewPending}
            className="rounded-2xl border border-white/15 bg-white/10 p-4 text-left backdrop-blur transition hover:bg-white/15"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wide text-indigo-100">
              Đóng góp cần duyệt
            </span>
            <strong className="mt-1 block text-2xl text-white">{pendingActions}</strong>
          </button>
        </div>
      </div>
    </section>
  );
}
