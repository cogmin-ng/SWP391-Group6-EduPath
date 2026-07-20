import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  HelpCircle,
  Layers,
  Plus,
  RefreshCw,
  Star,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import MentorWelcomeBanner from '../../components/mentor/MentorWelcomeBanner';
import MentorStatsCard from '../../components/mentor/MentorStatsCard';
import PendingReviewsSection from '../../components/mentor/PendingReviewsSection';
import PendingTipsSection from '../../components/mentor/PendingTipsSection';
import {
  getMentorDashboardStats,
  getMentorRoadmaps,
  getPendingTips,
} from '../../services/roadmapService';

const EMPTY_STATS = {
  totalRoadmaps: 0,
  approvedContributions: 0,
  contributionsTrend: '0%',
  totalStudents: 0,
  studentsTrend: '0%',
  averageRating: 0,
  ratingTrend: '+0.0',
};

const STATUS_STYLES = {
  APPROVED: 'bg-emerald-50 text-emerald-700',
  PUBLISHED: 'bg-indigo-50 text-indigo-700',
  PENDING: 'bg-amber-50 text-amber-700',
  DRAFT: 'bg-slate-100 text-slate-600',
  REJECTED: 'bg-rose-50 text-rose-700',
};

const STATUS_LABELS = {
  APPROVED: 'Đã duyệt',
  PUBLISHED: 'Đã xuất bản',
  PENDING: 'Chờ duyệt',
  DRAFT: 'Bản nháp',
  REJECTED: 'Bị từ chối',
};

const fetchDashboardData = () =>
  Promise.all([
    getMentorRoadmaps(0, 100),
    getPendingTips(0, 4),
    getMentorDashboardStats(),
  ]);

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-label="Đang tải dashboard mentor">
      <div className="h-80 rounded-3xl bg-indigo-200" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-36 rounded-2xl bg-white" />
        ))}
      </div>
      <div className="h-72 rounded-3xl bg-white" />
    </div>
  );
}

function SectionHeading({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      {onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
        >
          {actionLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}

export default function MentorDashboardPage() {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [pendingTips, setPendingTips] = useState([]);
  const [pendingTipTotal, setPendingTipTotal] = useState(0);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [loadingTips, setLoadingTips] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [roadmapResult, tipResult, statsResult] =
        await fetchDashboardData();
      setRoadmaps(roadmapResult.roadmaps || []);
      setPendingTips(tipResult.tips || []);
      setPendingTipTotal(tipResult.total || 0);
      setStats({ ...EMPTY_STATS, ...statsResult });
    } catch (requestError) {
      console.error('Failed to load mentor dashboard:', requestError);
      setError(
        requestError?.response?.data?.message ||
          'Không thể tải dữ liệu dashboard. Vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    fetchDashboardData()
      .then(([roadmapResult, tipResult, statsResult]) => {
        if (!active) return;
        setRoadmaps(roadmapResult.roadmaps || []);
        setPendingTips(tipResult.tips || []);
        setPendingTipTotal(tipResult.total || 0);
        setStats({ ...EMPTY_STATS, ...statsResult });
      })
      .catch((requestError) => {
        if (!active) return;
        console.error('Failed to load mentor dashboard:', requestError);
        setError(
          requestError?.response?.data?.message ||
            'Không thể tải dữ liệu dashboard. Vui lòng thử lại.'
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const refreshTips = async () => {
    setLoadingTips(true);
    try {
      const result = await getPendingTips(0, 4);
      setPendingTips(result.tips || []);
      setPendingTipTotal(result.total || 0);
    } catch (requestError) {
      console.error('Failed to refresh pending tips:', requestError);
      toast.error('Không thể cập nhật danh sách đóng góp');
    } finally {
      setLoadingTips(false);
    }
  };

  const pendingRoadmaps = useMemo(
    () =>
      roadmaps
        .filter((roadmap) => roadmap.status === 'PENDING')
        .map((roadmap) => ({
          id: roadmap.id,
          title: roadmap.title,
          submittedDate: roadmap.updatedAt
            ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(
                new Date(roadmap.updatedAt)
              )
            : 'Gần đây',
        })),
    [roadmaps]
  );

  const visibleRoadmaps = useMemo(
    () => roadmaps.slice(0, 4),
    [roadmaps]
  );

  const statCards = [
    {
      label: 'Tổng số lộ trình',
      value: stats.totalRoadmaps,
      hint: 'Xem và quản lý toàn bộ lộ trình',
      icon: Layers,
      tone: 'indigo',
      onClick: () => navigate('/mentor/roadmaps'),
    },
    {
      label: 'Đóng góp chờ duyệt',
      value: pendingTipTotal,
      hint: `${stats.approvedContributions} đóng góp đã được duyệt`,
      icon: CheckCircle2,
      tone: 'emerald',
      onClick: () => navigate('/mentor/reviews'),
    },
    {
      label: 'Tổng số học viên',
      value: stats.totalStudents,
      hint: `${stats.studentsTrend} học viên mới theo tháng`,
      icon: Users,
      tone: 'amber',
      onClick: () => navigate('/mentor/learners'),
    },
    {
      label: 'Đánh giá trung bình',
      value: Number(stats.averageRating || 0).toFixed(1),
      hint: `${stats.ratingTrend} điểm so với trước đó`,
      icon: Star,
      tone: 'violet',
      onClick: () => navigate('/mentor/profile'),
    },
  ];

  const quickActions = [
    {
      title: 'Tạo lộ trình',
      description: 'Xây dựng nội dung học mới',
      icon: Plus,
      style: 'bg-indigo-50 text-indigo-600',
      path: '/mentor/create-roadmap',
    },
    {
      title: 'Quản lý học viên',
      description: 'Theo dõi tiến độ và nhắc nhở',
      icon: Users,
      style: 'bg-emerald-50 text-emerald-600',
      path: '/mentor/learners',
    },
    {
      title: 'Duyệt đóng góp',
      description: `${pendingTipTotal} tip đang chờ xử lý`,
      icon: ClipboardCheck,
      style: 'bg-amber-50 text-amber-600',
      path: '/mentor/reviews',
    },
    {
      title: 'Ngân hàng câu hỏi',
      description: 'Quản lý câu hỏi dùng lại',
      icon: HelpCircle,
      style: 'bg-violet-50 text-violet-600',
      path: '/mentor/question-bank',
    },
  ];

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="mx-auto mt-20 max-w-lg rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
        <h1 className="mt-4 text-lg font-bold text-slate-900">
          Không thể tải dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
        <button
          type="button"
          onClick={loadDashboard}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <RefreshCw className="h-4 w-4" />
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-slate-800">
      <MentorWelcomeBanner
        totalRoadmaps={stats.totalRoadmaps}
        totalStudents={stats.totalStudents}
        pendingActions={pendingTipTotal}
        onCreateRoadmap={() => navigate('/mentor/create-roadmap')}
        onManageRoadmaps={() => navigate('/mentor/roadmaps')}
        onViewLearners={() => navigate('/mentor/learners')}
        onViewPending={() => navigate('/mentor/reviews')}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <MentorStatsCard key={card.label} {...card} />
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">Truy cập nhanh</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <button
              key={action.title}
              type="button"
              onClick={() => navigate(action.path)}
              className="group rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full ${action.style}`}
              >
                <action.icon className="h-5 w-5" />
              </span>
              <span className="mt-3 block text-sm font-bold text-slate-900">
                {action.title}
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                {action.description}
              </span>
              <ArrowRight className="mt-3 h-4 w-4 text-indigo-500 transition group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Lộ trình của tôi"
          description="Các lộ trình bạn đang xây dựng và vận hành"
          actionLabel="Xem tất cả"
          onAction={() => navigate('/mentor/roadmaps')}
        />

        {visibleRoadmaps.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {visibleRoadmaps.map((roadmap) => (
              <article
                key={roadmap.id}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => navigate(`/mentor/roadmaps/${roadmap.id}`)}
                  className="block w-full text-left"
                >
                  <div className="relative h-32 overflow-hidden bg-linear-to-br from-indigo-700 to-violet-500">
                    {roadmap.thumbnail ? (
                      <img
                        src={roadmap.thumbnail}
                        alt={roadmap.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-10 w-10 text-white/70" />
                      </div>
                    )}
                    <span
                      className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold ${STATUS_STYLES[roadmap.status] || STATUS_STYLES.DRAFT}`}
                    >
                      {STATUS_LABELS[roadmap.status] || roadmap.status}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 min-h-10 text-sm font-bold text-slate-900 transition group-hover:text-indigo-600">
                      {roadmap.title}
                    </h3>
                    <p className="mt-2 text-[11px] text-slate-400">
                      {roadmap._count?.enrollments || 0} học viên ·{' '}
                      {roadmap.nodes?.length || 0} nội dung
                    </p>
                  </div>
                </button>
                <div className="flex gap-2 border-t border-slate-100 bg-slate-50/70 p-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/mentor/roadmaps/${roadmap.id}`)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Xem chi tiết
                  </button>
                  {roadmap.status !== 'PENDING' ? (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/mentor/roadmaps/${roadmap.id}/edit`)
                      }
                      className="flex-1 rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
                    >
                      Chỉnh sửa
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 font-bold text-slate-900">
              Bạn chưa có lộ trình nào
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Bắt đầu xây dựng lộ trình đầu tiên để đồng hành cùng học viên.
            </p>
            <button
              type="button"
              onClick={() => navigate('/mentor/create-roadmap')}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Tạo lộ trình
            </button>
          </div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-7">
          <SectionHeading
            title={`Đóng góp chờ duyệt (${pendingTipTotal})`}
            description="Những chia sẻ mới từ học viên cần phản hồi của bạn"
            actionLabel="Quản lý đóng góp"
            onAction={() => navigate('/mentor/reviews')}
          />
          <PendingTipsSection
            tips={pendingTips}
            isLoading={loadingTips}
            onRefresh={refreshTips}
            compact
          />
        </div>

        <div className="space-y-4 xl:col-span-5">
          <SectionHeading
            title={`Lộ trình chờ duyệt (${pendingRoadmaps.length})`}
            description="Theo dõi các lộ trình đã gửi lên hệ thống"
            actionLabel="Xem lộ trình"
            onAction={() => navigate('/mentor/roadmaps')}
          />
          <PendingReviewsSection
            reviews={pendingRoadmaps}
            onSelect={(roadmapId) =>
              navigate(`/mentor/roadmaps/${roadmapId}`)
            }
          />
        </div>
      </section>
    </div>
  );
}
