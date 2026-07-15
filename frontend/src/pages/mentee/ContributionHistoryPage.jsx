import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Lightbulb,
  LoaderCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MenteeHeader from "../../components/mentee/MenteeHeader";
import { getContributionHistory } from "../../services/roadmapService";

const PAGE_SIZE = 8;

const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ duyệt",
    classes: "border-amber-200 bg-amber-50 text-amber-700",
    icon: Clock3,
  },
  APPROVED: {
    label: "Đã duyệt",
    classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Bị từ chối",
    classes: "border-rose-200 bg-rose-50 text-rose-700",
    icon: XCircle,
  },
};

const FILTERS = [
  { value: "", label: "Tất cả", statKey: "total" },
  { value: "PENDING", label: "Chờ duyệt", statKey: "pending" },
  { value: "APPROVED", label: "Đã duyệt", statKey: "approved" },
  { value: "REJECTED", label: "Từ chối", statKey: "rejected" },
];

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function createRoadmapSlug(title) {
  return String(title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function StatCard({ icon: Icon, label, value, colorClasses }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClasses}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function ContributionHistoryPage() {
  const [contributions, setContributions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [activeStatus, setActiveStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    const skip = (page - 1) * PAGE_SIZE;

    getContributionHistory(skip, PAGE_SIZE, activeStatus || undefined)
      .then((result) => {
        if (!active) return;
        setContributions(result.tips || []);
        setTotal(result.total || 0);
        setStats(
          result.stats || {
            total: result.total || 0,
            pending: 0,
            approved: 0,
            rejected: 0,
          },
        );
        setError("");
      })
      .catch((requestError) => {
        if (!active) return;
        console.error("Failed to fetch contribution history:", requestError);
        setContributions([]);
        setError(
          requestError.cause?.response?.data?.message ||
            requestError.message ||
            "Không thể tải lịch sử đóng góp.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [activeStatus, page, retryKey]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentFilter = useMemo(
    () => FILTERS.find((item) => item.value === activeStatus) || FILTERS[0],
    [activeStatus],
  );

  const selectStatus = (status) => {
    if (status === activeStatus) return;
    setLoading(true);
    setActiveStatus(status);
    setPage(1);
  };

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    setLoading(true);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const retry = () => {
    setLoading(true);
    setRetryKey((value) => value + 1);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-slate-800">
      <MenteeHeader />

      <main className="mx-auto w-full max-w-400 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-10">
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-700 via-indigo-600 to-violet-600 p-6 text-white shadow-lg sm:p-8">
          <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                <Lightbulb className="h-3.5 w-3.5 text-amber-300" />
                Không gian chia sẻ kiến thức
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Đóng góp của tôi
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-indigo-100 sm:text-base">
                Theo dõi các tip bạn đã gửi, phản hồi từ mentor và những chia sẻ đã được công bố cho cộng đồng học tập.
              </p>
            </div>
            <Link
              to="/roadmaps"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-md transition hover:bg-indigo-50 lg:self-auto"
            >
              Chọn lộ trình để đóng góp
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          <StatCard icon={FileText} label="Tổng đóng góp" value={stats.total} colorClasses="bg-indigo-50 text-indigo-600" />
          <StatCard icon={Clock3} label="Đang chờ duyệt" value={stats.pending} colorClasses="bg-amber-50 text-amber-600" />
          <StatCard icon={CheckCircle2} label="Đã được duyệt" value={stats.approved} colorClasses="bg-emerald-50 text-emerald-600" />
          <StatCard icon={XCircle} label="Bị từ chối" value={stats.rejected} colorClasses="bg-rose-50 text-rose-600" />
        </section>

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 pt-5 sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Lịch sử gửi tip</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {stats[currentFilter.statKey]} đóng góp {currentFilter.label.toLowerCase()}
                </p>
              </div>
            </div>
            <div className="mt-5 flex gap-6 overflow-x-auto">
              {FILTERS.map((filter) => (
                <button
                  key={filter.value || "all"}
                  type="button"
                  onClick={() => selectStatus(filter.value)}
                  className={`shrink-0 border-b-2 pb-3 text-sm font-semibold transition ${
                    activeStatus === filter.value
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {filter.label}
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${activeStatus === filter.value ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-500"}`}>
                    {stats[filter.statKey]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-80 flex-col items-center justify-center gap-3 px-6 py-16">
              <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-sm font-medium text-slate-500">Đang tải đóng góp...</p>
            </div>
          ) : error ? (
            <div className="flex min-h-80 flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
                <AlertCircle className="h-7 w-7 text-rose-500" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">Không thể tải dữ liệu</h3>
              <p className="mt-1 max-w-md text-sm text-slate-500">{error}</p>
              <button type="button" onClick={retry} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
                <RefreshCw className="h-4 w-4" />
                Thử lại
              </button>
            </div>
          ) : contributions.length === 0 ? (
            <div className="flex min-h-80 flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                <Lightbulb className="h-8 w-8 text-indigo-500" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {activeStatus ? `Không có tip ở trạng thái “${currentFilter.label}”` : "Bạn chưa có đóng góp nào"}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                Mở một lộ trình đang học, chọn nội dung phù hợp và sử dụng mục Tip Trick để chia sẻ kinh nghiệm của bạn.
              </p>
              <Link to="/roadmaps" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
                Đi tới lộ trình của tôi
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {contributions.map((tip) => {
                const status = STATUS_CONFIG[tip.status] || STATUS_CONFIG.PENDING;
                const StatusIcon = status.icon;
                const roadmapTitle = tip.node?.learningPath?.title;
                const roadmapSlug = createRoadmapSlug(roadmapTitle);

                return (
                  <article key={tip.id} className="p-4 transition hover:bg-slate-50/70 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.classes}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {status.label}
                          </span>
                          <time className="text-[11px] text-slate-400">Gửi lúc {formatDate(tip.createdAt)}</time>
                        </div>
                        <h3 className="mt-3 text-base font-bold text-slate-900 sm:text-lg">
                          {tip.title || "Tip chưa có tiêu đề"}
                        </h3>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                          {tip.content}
                        </p>
                      </div>
                      {roadmapSlug && (
                        <Link to={`/roadmaps/${roadmapSlug}/learn`} className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600">
                          Mở lộ trình
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 rounded-xl bg-slate-50 px-3.5 py-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-indigo-500" />{roadmapTitle || "Lộ trình chưa xác định"}</span>
                      <span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-violet-500" />{tip.node?.title || "Nội dung chưa xác định"}</span>
                      {tip.reviewedAt && <span>Duyệt lúc {formatDate(tip.reviewedAt)}</span>}
                    </div>

                    {tip.status === "REJECTED" && tip.rejectReason && (
                      <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50/70 p-3.5">
                        <p className="text-xs font-bold text-rose-700">Phản hồi từ mentor</p>
                        <p className="mt-1 text-sm leading-6 text-rose-700/90">{tip.rejectReason}</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-4 sm:flex-row sm:px-6">
              <p className="text-xs text-slate-500">
                Trang <strong className="text-slate-700">{page}</strong> / {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => changePage(page - 1)} disabled={page === 1} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </button>
                <button type="button" onClick={() => changePage(page + 1)} disabled={page === totalPages} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
                  Tiếp
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
