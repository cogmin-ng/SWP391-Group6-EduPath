import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Award,
  BellRing,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  RefreshCw,
  Search,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import ReminderModal from '../../components/mentor/ReminderModal';
import {
  getMentorLearners,
  sendLearnerReminder,
} from '../../services/mentorLearnerService';

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'ACTIVE', label: 'Đang học' },
  { value: 'COMPLETED', label: 'Đã hoàn thành' },
];

const initialData = {
  learners: [],
  stats: { totalLearners: 0, completedLearners: 0 },
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

function formatDate(value) {
  if (!value) return 'Chưa có hoạt động';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function LearnerAvatar({ learner }) {
  const fallback = (learner.name || learner.email || '?').trim().charAt(0).toUpperCase();
  return learner.avatar ? (
    <img
      src={learner.avatar}
      alt={`Ảnh đại diện của ${learner.name || learner.email}`}
      className="h-10 w-10 rounded-full object-cover"
    />
  ) : (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
      {fallback}
    </span>
  );
}

function StatusBadge({ status }) {
  const completed = status === 'COMPLETED';
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        completed
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-indigo-50 text-indigo-700'
      }`}
    >
      {completed ? 'Đã hoàn thành' : 'Đang học'}
    </span>
  );
}

function ProgressBar({ value }) {
  const progress = Math.min(100, Math.max(0, Math.round(value || 0)));
  return (
    <div className="min-w-28">
      <div className="mb-1 flex justify-between text-xs text-slate-500">
        <span>Tiến độ</span><span className="font-semibold text-slate-700">{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-indigo-600" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export default function MentorLearnersPage() {
  const [data, setData] = useState(initialData);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const fetchLearners = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getMentorLearners({ page, limit: 10, search, status });
      setData(result);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Không thể tải danh sách học viên. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    // Data fetching intentionally synchronizes this page with query state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLearners();
  }, [fetchLearners]);

  const pageNumbers = useMemo(() => {
    const total = data.pagination.totalPages;
    if (total <= 1) return [];
    const start = Math.max(1, Math.min(page - 1, total - 2));
    return Array.from({ length: Math.min(3, total) }, (_, index) => start + index);
  }, [data.pagination.totalPages, page]);

  const handleSendReminder = async (payload) => {
    if (!selectedLearner || isSending) return;
    setIsSending(true);
    try {
      await sendLearnerReminder(selectedLearner.enrollmentId, payload);
      toast.success('Đã gửi lời nhắc đến học viên');
      setSelectedLearner(null);
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'Không thể gửi lời nhắc');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Quản lý học viên</h1>
        <p className="mt-2 text-slate-500">Theo dõi học viên trên các lộ trình của bạn.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2" aria-label="Thống kê học viên">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-slate-500">Tổng học viên</p><p className="mt-2 text-3xl font-bold text-slate-900">{data.stats.totalLearners}</p></div>
            <span className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><Users className="h-6 w-6" /></span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-slate-500">Học viên hoàn thành</p><p className="mt-2 text-3xl font-bold text-slate-900">{data.stats.completedLearners}</p></div>
            <span className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><CheckCircle2 className="h-6 w-6" /></span>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <label className="relative block w-full sm:max-w-md">
            <span className="sr-only">Tìm theo tên hoặc email</span>
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Tìm theo tên hoặc email..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>
          <div className="flex gap-2 overflow-x-auto" aria-label="Lọc trạng thái">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => { setStatus(option.value); setPage(1); }}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${status === option.value ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 p-5" aria-label="Đang tải danh sách">
            {Array.from({ length: 5 }, (_, index) => <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-100" />)}
          </div>
        ) : error ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button type="button" onClick={fetchLearners} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"><RefreshCw className="h-4 w-4" /> Thử lại</button>
          </div>
        ) : data.learners.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
            <span className="rounded-full bg-slate-100 p-4 text-slate-400"><Users className="h-8 w-8" /></span>
            <h2 className="mt-4 font-bold text-slate-800">Không tìm thấy học viên</h2>
            <p className="mt-1 text-sm text-slate-500">Hãy thử thay đổi từ khóa hoặc bộ lọc trạng thái.</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Học viên</th><th className="px-4 py-4">Lộ trình</th><th className="px-4 py-4">Tiến độ</th><th className="px-4 py-4">Node hiện tại</th><th className="px-4 py-4">Quiz</th><th className="px-4 py-4">Chứng chỉ</th><th className="px-4 py-4">Lần học gần nhất</th><th className="px-5 py-4 text-right">Thao tác</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {data.learners.map((item) => (
                    <tr key={item.enrollmentId} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4"><div className="flex items-center gap-3"><LearnerAvatar learner={item.learner} /><div className="min-w-0"><p className="max-w-48 truncate font-semibold text-slate-900">{item.learner.name || 'Chưa cập nhật tên'}</p><p className="max-w-48 truncate text-xs text-slate-500">{item.learner.email}</p></div></div></td>
                      <td className="max-w-52 px-4 py-4"><p className="truncate font-medium text-slate-700">{item.learningPath.title}</p><div className="mt-1"><StatusBadge status={item.status} /></div></td>
                      <td className="px-4 py-4"><ProgressBar value={item.progressPercent} /></td>
                      <td className="max-w-48 px-4 py-4 text-slate-600"><span className="line-clamp-2">{item.currentNode?.title || 'Chưa có Node'}</span></td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{item.quizzes.completed}/{item.quizzes.total}</td>
                      <td className="px-4 py-4"><span className={`inline-flex items-center gap-1 text-xs font-semibold ${item.certificate.status === 'ISSUED' ? 'text-emerald-700' : 'text-slate-400'}`}><Award className="h-4 w-4" />{item.certificate.status === 'ISSUED' ? 'Đã cấp' : 'Chưa cấp'}</span></td>
                      <td className="px-4 py-4 text-xs text-slate-500">{formatDate(item.lastActivityAt)}</td>
                      <td className="px-5 py-4 text-right"><button type="button" onClick={() => setSelectedLearner(item)} className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"><BellRing className="h-4 w-4" /> Gửi lời nhắc</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-100 lg:hidden">
              {data.learners.map((item) => (
                <article key={item.enrollmentId} className="space-y-4 p-5">
                  <div className="flex items-start gap-3"><LearnerAvatar learner={item.learner} /><div className="min-w-0 flex-1"><p className="truncate font-bold text-slate-900">{item.learner.name || 'Chưa cập nhật tên'}</p><p className="truncate text-sm text-slate-500">{item.learner.email}</p></div><StatusBadge status={item.status} /></div>
                  <div className="rounded-xl bg-slate-50 p-3"><p className="flex items-center gap-2 font-semibold text-slate-800"><BookOpen className="h-4 w-4 text-indigo-600" />{item.learningPath.title}</p></div>
                  <ProgressBar value={item.progressPercent} />
                  <dl className="grid grid-cols-2 gap-3 text-sm"><div><dt className="text-xs text-slate-400">Node hiện tại</dt><dd className="mt-1 font-medium text-slate-700">{item.currentNode?.title || 'Chưa có Node'}</dd></div><div><dt className="text-xs text-slate-400">Quiz đã đạt</dt><dd className="mt-1 font-medium text-slate-700">{item.quizzes.completed}/{item.quizzes.total}</dd></div><div><dt className="text-xs text-slate-400">Chứng chỉ</dt><dd className="mt-1 font-medium text-slate-700">{item.certificate.status === 'ISSUED' ? 'Đã cấp' : 'Chưa cấp'}</dd></div><div><dt className="flex items-center gap-1 text-xs text-slate-400"><Clock3 className="h-3 w-3" /> Gần nhất</dt><dd className="mt-1 text-xs font-medium text-slate-700">{formatDate(item.lastActivityAt)}</dd></div></dl>
                  <button type="button" onClick={() => setSelectedLearner(item)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"><BellRing className="h-4 w-4" /> Gửi lời nhắc</button>
                </article>
              ))}
            </div>
          </>
        )}

        {!loading && !error && data.pagination.totalPages > 1 && (
          <nav className="flex items-center justify-between border-t border-slate-100 px-4 py-4 sm:px-5" aria-label="Phân trang">
            <p className="hidden text-sm text-slate-500 sm:block">{data.pagination.total} enrollment</p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} aria-label="Trang trước" className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
              {pageNumbers.map((pageNumber) => <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} aria-current={pageNumber === page ? 'page' : undefined} className={`h-9 min-w-9 rounded-lg text-sm font-semibold ${pageNumber === page ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{pageNumber}</button>)}
              <button type="button" onClick={() => setPage((value) => Math.min(data.pagination.totalPages, value + 1))} disabled={page === data.pagination.totalPages} aria-label="Trang sau" className="rounded-lg border border-slate-200 p-2 text-slate-600 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </nav>
        )}
      </section>

      {selectedLearner && (
        <ReminderModal
          learner={selectedLearner}
          isSubmitting={isSending}
          onClose={() => setSelectedLearner(null)}
          onSubmit={handleSendReminder}
        />
      )}
    </div>
  );
}
