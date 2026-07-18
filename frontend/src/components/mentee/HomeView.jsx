import {
  ArrowRight,
  Award,
  Crown,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileText,
  HelpCircle,
  Lightbulb,
  LoaderCircle,
  Medal,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
  Lock,
} from "lucide-react";
import { useMemo, useState } from "react";

const ENCOURAGEMENTS = [
  "Sự nhất quán quan trọng hơn tốc độ. Một bước nhỏ mỗi ngày vẫn tạo nên hành trình lớn.",
  "Đừng chỉ đọc code. Hãy tự viết và thử nghiệm để hiểu thật sâu.",
  "Mỗi lỗi gặp phải là thêm một kinh nghiệm giúp bạn giải quyết vấn đề nhanh hơn.",
  "Hoàn thành một nội dung nhỏ hôm nay tốt hơn trì hoãn một kế hoạch hoàn hảo.",
];

const ACTIVITY_ICONS = {
  ENROLLMENT: BookOpen,
  NODE_COMPLETED: CheckCircle2,
  QUIZ_ATTEMPT: HelpCircle,
  TIP_CONTRIBUTION: Lightbulb,
  CERTIFICATE: Award,
};

function formatRelativeTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("vi", { numeric: "auto" });
  const ranges = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let duration = seconds;
  for (const [amount, unit] of ranges) {
    if (Math.abs(duration) < amount) return formatter.format(Math.round(duration), unit);
    duration /= amount;
  }
  return "";
}

function StatCard({ icon: Icon, label, value, hint, color, onClick }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-36 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md w-full"
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-[11px] text-slate-400">{hint}</p>
    </button>
  );
}

function Thumbnail({ src, title, className = "h-32" }) {
  return (
    <div className={`relative overflow-hidden bg-linear-to-br from-indigo-700 to-violet-500 ${className}`}>
      {src ? (
        <img src={src} alt={title} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center">
          <BookOpen className="h-10 w-10 text-white/70" />
        </div>
      )}
    </div>
  );
}

export default function HomeView({
  dashboard,
  badges = [],
  leaderboard = { top: [], currentUserRank: null, period: "week" },
  leaderboardPeriod = "week",
  enrollingSlug,
  onChangeLeaderboardPeriod,
  onContinueCourse,
  onExplore,
  onViewRoadmaps,
  onViewProfile,
  onViewCertificates,
  onViewContributions,
  onViewCurrentNode,
  onViewCurrentQuiz,
  onEnroll,
}) {
  const [encouragementIndex, setEncouragementIndex] = useState(0);
  const { user, stats, continueLearning, enrollments, recentActivities, recommendations } =
    dashboard;

  const visibleEnrollments = useMemo(() => enrollments.slice(0, 4), [enrollments]);
  const progress = Math.round(continueLearning?.progressPercent || 0);
  const leaderboardTop = leaderboard?.top || [];
  const currentUserRank = leaderboard?.currentUserRank || null;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-[#635BFF] p-5 text-white shadow-xl sm:p-7 lg:p-8">
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur">
              <Zap className="h-3.5 w-3.5 text-yellow-300" />
              Dashboard học viên
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Chào bạn, {user.name} 👋
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-indigo-100 md:text-base">
                Theo dõi tiến độ thật của bạn và tiếp tục hành trình học tập ngay từ nơi đã dừng lại.
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 text-xs italic text-indigo-50 sm:text-sm">
              <span>“{ENCOURAGEMENTS[encouragementIndex]}”</span>
              <button
                type="button"
                onClick={() =>
                  setEncouragementIndex((current) => (current + 1) % ENCOURAGEMENTS.length)
                }
                className="shrink-0 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold not-italic hover:bg-white/25"
              >
                Câu khác
              </button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => (continueLearning ? onContinueCourse(continueLearning) : onExplore())}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-md hover:bg-indigo-50 cursor-pointer"
              >
                {continueLearning ? "Tiếp tục học" : "Khám phá lộ trình"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onViewRoadmaps}
                className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-medium hover:bg-white/10 cursor-pointer"
              >
                Xem lộ trình của tôi
              </button>
            </div>
            <div className="grid gap-3 sm:max-w-xl sm:grid-cols-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-100">Level hiện tại</p>
                <p className="mt-1 text-2xl font-bold text-white">Level {user.level}</p>
                <p className="mt-1 text-xs text-indigo-100">{user.xp.toLocaleString("vi-VN")} XP tổng</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wide text-indigo-100">
                  <span>Tiến độ level</span>
                  <span>{user.progressPercent}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-white" style={{ width: `${user.progressPercent}%` }} />
                </div>
                <p className="mt-2 text-xs text-indigo-100">Còn {user.xpToNextLevel} XP để lên level {user.level + 1}</p>
              </div>
            </div>
          </div>
          <div className="hidden justify-center lg:col-span-4 lg:flex">
            <div className="flex h-48 w-full max-w-sm items-center justify-center rounded-3xl border border-white/10 bg-slate-950/20">
              <div className="flex h-28 w-40 flex-col justify-center rounded-xl border border-indigo-300/30 bg-indigo-950/70 p-4 font-mono text-[9px] shadow-2xl">
                <span className="text-yellow-300">const progress = {progress};</span>
                <span className="mt-2 text-sky-300">learn(today);</span>
                <span className="mt-2 text-emerald-300">keepGoing();</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookOpen} label="Lộ trình đang học" value={stats.activeEnrollmentCount} hint={`${stats.completedEnrollmentCount} lộ trình đã hoàn thành`} color="indigo" onClick={onViewRoadmaps} />
        <StatCard icon={TrendingUp} label="Tiến độ trung bình" value={`${Math.round(stats.averageProgress)}%`} hint={`Tính trên ${enrollments.length} lộ trình đã đăng ký`} color="emerald" onClick={onViewRoadmaps} />
        <StatCard icon={Zap} label="Tổng XP" value={user.xp.toLocaleString("vi-VN")} hint="Điểm kinh nghiệm hiện có" color="amber" onClick={onViewProfile} />
        <StatCard icon={Award} label="Chứng chỉ đã nhận" value={stats.certificateCount} hint={`${stats.passedQuizCount} lượt quiz đã vượt qua`} color="violet" onClick={onViewCertificates} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            Tiếp tục học tập
          </h2>
          <button type="button" onClick={onViewRoadmaps} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer">Xem tất cả</button>
        </div>
        {continueLearning ? (
          <div className="grid overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm lg:grid-cols-12">
            <Thumbnail src={continueLearning.thumbnail} title={continueLearning.title} className="h-56 lg:col-span-4 lg:h-full" />
            <div className="space-y-5 p-5 sm:p-6 lg:col-span-8 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{continueLearning.subjectName}</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">{continueLearning.title}</h3>
                <p className="mt-1 text-xs text-slate-500">Hướng dẫn bởi {continueLearning.mentorName}</p>
              </div>
              <div className="my-2">
                <div className="mb-2 flex justify-between text-xs"><span className="font-medium text-slate-600">Tiến trình học tập</span><strong className="text-indigo-600">{progress}%</strong></div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${progress}%` }} /></div>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3 my-2">
                <div><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Nội dung tiếp theo</p><p className="mt-0.5 text-sm font-bold text-indigo-950">{continueLearning.currentNode?.title || "Roadmap chưa có nội dung"}</p></div>
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-indigo-600 shrink-0">{continueLearning.completedNodeCount}/{continueLearning.nodeCount} nội dung</span>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row mt-2">
                <button type="button" onClick={() => onContinueCourse(continueLearning)} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 cursor-pointer">Tiếp tục học</button>
                <button type="button" onClick={onViewCurrentNode} disabled={!continueLearning.currentNode} className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer">Xem nội dung hiện tại</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 font-bold text-slate-900">Bạn chưa có lộ trình đang học</h3>
            <p className="mt-1 text-sm text-slate-500">Khám phá các lộ trình phù hợp và bắt đầu học ngay.</p>
            <button type="button" onClick={onExplore} className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white cursor-pointer">Khám phá lộ trình</button>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">Truy cập nhanh</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            [BookOpen, "Lộ trình của tôi", "Tiến độ và học tập", onViewRoadmaps, "bg-blue-50 text-blue-600"],
            [FileText, "Nội dung hiện tại", "Tài liệu, checklist và tips", onViewCurrentNode, "bg-emerald-50 text-emerald-600"],
            [HelpCircle, "Làm quiz", continueLearning?.currentNode?.hasQuiz ? "Quiz của nội dung hiện tại" : "Xem quiz trong lộ trình", onViewCurrentQuiz, "bg-amber-50 text-amber-600"],
            [Lightbulb, "Đóng góp của tôi", "Theo dõi tip đã đóng góp", onViewContributions, "bg-rose-50 text-rose-600"],
          ].map(([Icon, title, description, action, colorClasses]) => (
            <button key={title} type="button" onClick={action} className="group rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
              <div className={`flex h-11 w-11 items-center justify-center rounded-full ${colorClasses}`}><Icon className="h-5 w-5" /></div>
              <p className="mt-3 text-sm font-bold text-slate-900">{title}</p><p className="mt-1 text-xs text-slate-500">{description}</p><ArrowRight className="mt-3 h-4 w-4 text-indigo-500 transition group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">Lộ trình của tôi</h2><button type="button" onClick={onViewRoadmaps} className="text-xs font-semibold text-indigo-600 cursor-pointer">Xem tất cả</button></div>
        {visibleEnrollments.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {visibleEnrollments.map((course) => (
              <article key={course.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md">
                <Thumbnail src={course.thumbnail} title={course.title} className="h-28" />
                <div className="p-4"><h3 className="line-clamp-2 min-h-10 text-sm font-bold text-slate-900">{course.title}</h3><p className="mt-1 text-[11px] text-slate-400">{course.mentorName}</p><div className="mt-4 flex justify-between text-[10px]"><span className="text-slate-500">Tiến độ</span><strong>{Math.round(course.progressPercent)}%</strong></div><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${course.progressPercent}%` }} /></div><button type="button" onClick={() => onContinueCourse(course)} className="mt-4 w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">{course.status === "COMPLETED" ? "Xem lại" : "Tiếp tục học"}</button></div>
              </article>
            ))}
          </div>
        ) : <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Chưa có lộ trình nào.</p>}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-7">
          <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-base font-bold text-slate-900"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Hoạt động gần đây</h2></div>
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white px-4 shadow-sm">
            {recentActivities.length ? recentActivities.map((activity) => {
              const Icon = ACTIVITY_ICONS[activity.type] || Sparkles;
              return <div key={activity.id} className="flex items-start gap-3 py-4"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"><Icon className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-slate-800">{activity.title}</p><p className="mt-0.5 truncate text-[11px] text-slate-400">{activity.description}</p></div><time className="shrink-0 text-[10px] text-slate-400">{formatRelativeTime(activity.occurredAt)}</time></div>;
            }) : <p className="py-10 text-center text-sm text-slate-400">Chưa có hoạt động học tập nào.</p>}
          </div>
        </div>

        <div className="space-y-4 xl:col-span-5">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900">Huy hiệu & Thành tích</h2>
            <button
              type="button"
              onClick={onViewProfile}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              Xem tất cả
            </button>
          </div>
          <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {[[Medal, stats.completedEnrollmentCount, "Hoàn thành"], [ClipboardCheck, stats.passedQuizCount, "Quiz đạt"], [Award, stats.certificateCount, "Chứng chỉ"]].map(([Icon, value, label]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><Icon className="mx-auto h-5 w-5 text-indigo-600" /><strong className="mt-2 block text-lg text-slate-900">{value}</strong><span className="text-[10px] text-slate-500">{label}</span></div>)}
            </div>

            {/* Badges row */}
            {badges && badges.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Huy hiệu mới nhất
                </p>
                <div
                  id="latest_badges_row"
                  className="flex items-center gap-3 flex-wrap"
                >
                  {badges.slice(0, 5).map((badge) => (
                    <div
                      key={badge.id}
                      className={`w-11 h-11 rounded-full flex items-center justify-center border transition relative group cursor-pointer shrink-0 ${
                        badge.isUnlocked
                          ? "bg-violet-50 text-violet-600 border-violet-100 hover:bg-violet-100"
                          : "bg-slate-50 text-slate-300 border-slate-100"
                      }`}
                    >
                      {badge.iconName === "award" ? (
                        <Award className="w-5 h-5" />
                      ) : badge.iconName === "star" ? (
                        <Star className="w-5 h-5" />
                      ) : badge.iconName === "zap" ? (
                        <Zap className="w-5 h-5" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 bg-slate-800 text-white text-[10px] rounded-lg p-2 opacity-0 pointer-events-none group-hover:opacity-100 transition z-50 shadow-lg text-center font-normal">
                        <strong className="block font-bold">{badge.title}</strong>
                        {badge.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Latest certificate row */}
            {dashboard.latestCertificate ? (
              <button
                type="button"
                onClick={onViewCertificates}
                className="flex w-full items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3 text-left pt-2 mt-2 cursor-pointer"
              >
                <Award className="h-6 w-6 shrink-0 text-amber-600" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-semibold uppercase text-amber-700">
                    Chứng chỉ mới nhất
                  </span>
                  <span className="block truncate text-xs font-bold text-slate-800">
                    {dashboard.latestCertificate.learningPathTitle}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-amber-600" />
              </button>
            ) : (
              <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-500 mt-2">
                Hoàn thành lộ trình để nhận chứng chỉ đầu tiên.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Crown className="h-5 w-5 text-amber-500" />
                Bảng xếp hạng mentee
              </h2>
              <p className="mt-1 text-sm text-slate-500">Xếp hạng theo XP kiếm được trong kỳ.</p>
            </div>
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {[
                ["week", "Tuần"],
                ["month", "Tháng"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChangeLeaderboardPeriod?.(value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    leaderboardPeriod === value
                      ? "bg-indigo-600 text-white"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            {leaderboardTop.length ? (
              <div className="divide-y divide-slate-100">
                {leaderboardTop.map((entry) => (
                  <div
                    key={entry.userId}
                    className={`flex items-center gap-3 px-4 py-4 sm:px-5 ${entry.isCurrentUser ? "bg-indigo-50/60" : ""}`}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${entry.rank <= 3 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                      {entry.rank}
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 font-semibold text-indigo-700">
                      {entry.avatarUrl ? (
                        <img src={entry.avatarUrl} alt={entry.name} className="h-full w-full object-cover" />
                      ) : (
                        entry.name?.slice(0, 1)?.toUpperCase() || "M"
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900">{entry.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">Level {entry.level} · Tổng {entry.totalXp.toLocaleString("vi-VN")} XP</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-indigo-700">+{entry.xpEarned.toLocaleString("vi-VN")} XP</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">trong {leaderboardPeriod === "week" ? "tuần" : "tháng"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-10 text-center text-sm text-slate-500">
                Chưa có dữ liệu leaderboard cho kỳ này.
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-5">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Vị trí của bạn</h3>
            {currentUserRank ? (
              <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Hạng hiện tại</p>
                    <p className="mt-1 text-3xl font-bold text-slate-900">#{currentUserRank.rank}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-indigo-700">+{currentUserRank.xpEarned.toLocaleString("vi-VN")} XP</p>
                    <p className="mt-1 text-xs text-slate-500">Level {currentUserRank.level}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Bạn đang có {currentUserRank.totalXp.toLocaleString("vi-VN")} XP tổng và đang được xếp hạng trong {leaderboardPeriod === "week" ? "tuần" : "tháng"} này.
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
                Bạn chưa kiếm được XP nào trong kỳ này.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-lg font-bold text-slate-900">Đề xuất dành cho bạn</h2><button type="button" onClick={onExplore} className="text-xs font-semibold text-indigo-600 cursor-pointer">Xem tất cả</button></div>
        {recommendations.length ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{recommendations.map((course) => <article key={course.id} className="flex min-h-80 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"><div className="relative"><Thumbnail src={course.thumbnail} title={course.title} className="h-32" />{course.rating !== null && <span className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-slate-950/65 px-2 py-1 text-[10px] text-white"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{course.rating}</span>}</div><div className="flex flex-1 flex-col p-4"><p className="text-[10px] font-semibold uppercase text-indigo-600">{course.subjectName}</p><h3 className="mt-1 line-clamp-2 text-sm font-bold text-slate-900">{course.title}</h3><p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{course.description || "Chưa có mô tả."}</p><p className="mt-3 text-[10px] text-slate-400">{course.enrollmentCount} học viên · {course.nodeCount} nội dung</p><button type="button" disabled={enrollingSlug === course.slug} onClick={() => onEnroll(course)} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-50 py-2.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-600 hover:text-white disabled:cursor-wait disabled:opacity-60 cursor-pointer">{enrollingSlug === course.slug ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{enrollingSlug === course.slug ? "Đang đăng ký..." : "Đăng ký ngay"}</button></div></article>)}</div> : <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center"><CheckCircle2 className="mx-auto h-9 w-9 text-emerald-500" /><p className="mt-2 text-sm font-semibold text-slate-800">Bạn đã đăng ký tất cả lộ trình hiện có.</p></div>}
      </section>
    </div>
  );
}
