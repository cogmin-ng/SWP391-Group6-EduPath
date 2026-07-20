import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Layers,
  Lightbulb,
  RefreshCw,
  Search,
  Users,
} from 'lucide-react';
import PendingTipsSection from '../../components/mentor/PendingTipsSection';
import { getPendingTips } from '../../services/roadmapService';

const PAGE_SIZE = 10;

const fetchTipsPage = (skip) => getPendingTips(skip, PAGE_SIZE);

function SummaryCard({ icon: Icon, label, value, hint, tone }) {
  const tones = {
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-[11px] text-slate-400">{hint}</p>
    </div>
  );
}

export default function PendingTipsPage() {
  const [tips, setTips] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    fetchTipsPage(skip)
      .then((result) => {
        if (!active) return;
        setTips(result.tips || []);
        setTotal(result.total || 0);
        setError('');
      })
      .catch((requestError) => {
        if (!active) return;
        console.error('Failed to fetch pending tips:', requestError);
        setError(
          requestError?.message ||
            'Không thể tải danh sách đóng góp. Vui lòng thử lại.'
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [skip]);

  const refresh = async () => {
    let changingPage = false;
    setLoading(true);
    setError('');
    try {
      const result = await fetchTipsPage(skip);
      if (!result.tips?.length && skip > 0) {
        changingPage = true;
        setSkip(Math.max(0, skip - PAGE_SIZE));
        return;
      }
      setTips(result.tips || []);
      setTotal(result.total || 0);
    } catch (requestError) {
      console.error('Failed to refresh pending tips:', requestError);
      setError(
        requestError?.message ||
          'Không thể cập nhật danh sách đóng góp. Vui lòng thử lại.'
      );
    } finally {
      if (!changingPage) setLoading(false);
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const visibleTips = useMemo(() => {
    if (!normalizedSearch) return tips;

    return tips.filter((tip) =>
      [
        tip.title,
        tip.content,
        tip.contributor?.name,
        tip.contributor?.email,
        tip.node?.title,
        tip.node?.learningPath?.title,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch))
    );
  }, [normalizedSearch, tips]);

  const contributorCount = useMemo(
    () =>
      new Set(tips.map((tip) => tip.contributor?.id).filter(Boolean)).size,
    [tips]
  );
  const roadmapCount = useMemo(
    () =>
      new Set(
        tips.map((tip) => tip.node?.learningPath?.id).filter(Boolean)
      ).size,
    [tips]
  );

  const currentPage = total ? Math.floor(skip / PAGE_SIZE) + 1 : 0;
  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 0;
  const hasPrevious = skip > 0;
  const hasNext = skip + PAGE_SIZE < total;

  const goToPreviousPage = () => {
    if (!hasPrevious) return;
    setLoading(true);
    setError('');
    setSearch('');
    setSkip((current) => Math.max(0, current - PAGE_SIZE));
  };

  const goToNextPage = () => {
    if (!hasNext) return;
    setLoading(true);
    setError('');
    setSearch('');
    setSkip((current) => current + PAGE_SIZE);
  };

  return (
    <div className="space-y-8 text-slate-800">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-indigo-600 to-violet-600 p-6 text-white shadow-xl sm:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur">
              <Lightbulb className="h-3.5 w-3.5 text-yellow-300" />
              Trung tâm đóng góp
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
              Quản lý đóng góp
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-indigo-100 md:text-base">
              Xem xét những kinh nghiệm do học viên chia sẻ và lựa chọn nội dung hữu ích cho cộng đồng.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-100">
              Đang chờ bạn xử lý
            </p>
            <p className="mt-1 text-3xl font-bold text-white">{total}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={Clock3}
          label="Tổng chờ duyệt"
          value={total}
          hint="Tất cả đóng góp chưa xử lý"
          tone="amber"
        />
        <SummaryCard
          icon={Users}
          label="Học viên đóng góp"
          value={contributorCount}
          hint="Trong trang đang hiển thị"
          tone="emerald"
        />
        <SummaryCard
          icon={Layers}
          label="Lộ trình liên quan"
          value={roadmapCount}
          hint={`Trang ${currentPage}/${totalPages || 0}`}
          tone="indigo"
        />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Danh sách chờ duyệt
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Chọn một đóng góp để xem đầy đủ và đưa ra quyết định.
            </p>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <label className="relative min-w-0 flex-1 sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm trong trang hiện tại..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <button
              type="button"
              aria-label="Làm mới danh sách"
              onClick={refresh}
              disabled={loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-wait disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-center">
            <AlertCircle className="mx-auto h-7 w-7 text-rose-500" />
            <p className="mt-2 text-sm font-semibold text-rose-700">{error}</p>
            <button
              type="button"
              onClick={refresh}
              className="mt-3 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white"
            >
              Thử lại
            </button>
          </div>
        ) : search && !visibleTips.length && !loading ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
            <Search className="mx-auto h-9 w-9 text-slate-300" />
            <h3 className="mt-3 font-bold text-slate-900">
              Không tìm thấy đóng góp phù hợp
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Hãy thử từ khóa khác trong trang hiện tại.
            </p>
          </div>
        ) : (
          <PendingTipsSection
            tips={visibleTips}
            isLoading={loading}
            onRefresh={refresh}
          />
        )}
      </section>

      {totalPages > 1 ? (
        <nav className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm sm:flex-row">
          <p className="text-xs text-slate-500">
            Hiển thị {Math.min(skip + 1, total)}–{Math.min(skip + PAGE_SIZE, total)} trong {total} đóng góp
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={!hasPrevious || loading}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Trước
            </button>
            <span className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">
              {currentPage}/{totalPages}
            </span>
            <button
              type="button"
              onClick={goToNextPage}
              disabled={!hasNext || loading}
              className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Tiếp
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
