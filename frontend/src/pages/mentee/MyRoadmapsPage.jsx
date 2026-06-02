import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Map, User } from 'lucide-react';
import MenteeHeader from '../../components/mentee/MenteeHeader';
import { getEnrollments } from './features/enrollments/storage';
import { getFavorites, toggleFavorite } from './features/enrollments/favorites';
import { roadmaps } from './features/explore/data/roadmaps';

export default function MyRoadmapsPage() {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [favVersion, setFavVersion] = useState(0);

  const enrollments = getEnrollments();
  const enrolledRoadmaps = useMemo(
    () =>
      enrollments
        .map((enrollment) => {
          const roadmap = roadmaps.find((item) => item.slug === enrollment.slug);
          if (!roadmap) return null;
          return { ...roadmap, progress: enrollment.progress };
        })
        .filter(Boolean),
    [enrollments],
  );

  const ongoing = enrolledRoadmaps.filter((r) => r.progress > 0 && r.progress < 100);
  const completed = enrolledRoadmaps.filter((r) => r.progress >= 100);
  const favoriteSlugs = useMemo(() => getFavorites(), [favVersion]);
  const favorite = useMemo(
    () => roadmaps.filter((r) => favoriteSlugs.includes(r.slug)),
    [favoriteSlugs],
  );

  const tabItems = [
    { key: 'ongoing', label: 'Đang học', count: ongoing.length },
    { key: 'completed', label: 'Đã hoàn thành', count: completed.length },
    { key: 'favorite', label: 'Yêu thích', count: favorite.length },
  ];

  const activeList =
    activeTab === 'ongoing' ? ongoing : activeTab === 'completed' ? completed : favorite;

  return (
    <div className="min-h-screen bg-slate-50">
      <MenteeHeader />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Lộ trình của tôi</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Theo dõi và quản lý hành trình phát triển kỹ năng của bạn.
          </p>
        </div>

        {/* Tab System */}
        <div className="mb-8 flex items-center space-x-8 border-b border-slate-200">
          {tabItems.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-4 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'border-b-2 border-indigo-600 font-bold text-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${
                    activeTab === tab.key
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Empty States */}
        {activeTab === 'favorite' && favorite.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
              <Heart className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-900">Danh sách yêu thích trống</h3>
            <p className="max-w-sm text-sm text-slate-500">
              Lưu lại những lộ trình bạn quan tâm để dễ dàng theo dõi sau này.
            </p>
            <Link
              to="/explore"
              className="mt-8 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-md transition-all active:scale-95"
            >
              Khám phá ngay
            </Link>
          </div>
        )}

        {activeTab === 'completed' && completed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
              <Map className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-900">Chưa có lộ trình hoàn thành</h3>
            <p className="max-w-sm text-sm text-slate-500">
              Hãy tiếp tục nỗ lực học tập để hoàn thành các lộ trình đầu tiên của bạn!
            </p>
            <button
              onClick={() => setActiveTab('ongoing')}
              className="mt-8 rounded-lg border border-indigo-600 px-6 py-2 text-sm font-medium text-indigo-600 transition-all hover:bg-indigo-50"
            >
              Quay lại đang học
            </button>
          </div>
        )}

        {activeTab === 'ongoing' && ongoing.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
              <Map className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-900">Bạn chưa ghi danh lộ trình nào</h3>
            <p className="max-w-sm text-sm text-slate-500">
              Hãy khám phá và đăng ký lộ trình phù hợp với mục tiêu của bạn.
            </p>
            <Link
              to="/explore"
              className="mt-8 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-md transition-all active:scale-95"
            >
              Khám phá ngay
            </Link>
          </div>
        )}

        {/* Card Grid */}
        {activeList.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {activeList.map((roadmap) => (
              <article
                key={roadmap.slug}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-indigo-400/50"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={roadmap.cover}
                    alt={roadmap.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-indigo-600 shadow-sm backdrop-blur-md">
                    {roadmap.category}
                  </span>
                  {activeTab === 'favorite' && (
                    <button
                      onClick={() => {
                        toggleFavorite(roadmap.slug);
                        setFavVersion((v) => v + 1);
                      }}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white active:scale-90"
                    >
                      <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                    </button>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                    {roadmap.title}
                  </h3>

                  <div className="mb-6 mt-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600">
                      {roadmap.mentor.charAt(0)}
                    </div>
                    <span className="text-sm text-slate-500">{roadmap.mentor}</span>
                  </div>

                  <div className="mt-auto">
                    {activeTab === 'favorite' ? (
                      <Link
                        to={`/explore/${roadmap.slug}`}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-600 py-3 text-sm font-medium text-indigo-600 transition-all hover:bg-indigo-50 active:scale-95"
                      >
                        Xem chi tiết
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    ) : (
                      <>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs text-slate-500">Tiến độ</span>
                          <span className="text-xs font-bold text-indigo-600">{roadmap.progress}%</span>
                        </div>
                        <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-indigo-600 transition-all duration-1000"
                            style={{ width: `${roadmap.progress}%` }}
                          />
                        </div>
                        <Link
                          to={`/roadmaps/${roadmap.slug}/learn`}
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white transition-all active:scale-95"
                        >
                          Tiếp tục học
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-slate-200 bg-white px-4 shadow-lg md:hidden">
        <button className="flex flex-col items-center text-slate-500">
          <Map className="h-5 w-5" />
          <span className="text-[10px]">Lộ trình</span>
        </button>
        <button className="flex flex-col items-center font-bold text-indigo-600">
          <Map className="h-5 w-5" />
          <span className="text-[10px]">Roadmaps</span>
        </button>
        <button className="flex flex-col items-center text-slate-500">
          <Map className="h-5 w-5" />
          <span className="text-[10px]">Khám phá</span>
        </button>
        <button className="flex flex-col items-center text-slate-500">
          <User className="h-5 w-5" />
          <span className="text-[10px]">Hồ sơ</span>
        </button>
      </nav>
    </div>
  );
}
