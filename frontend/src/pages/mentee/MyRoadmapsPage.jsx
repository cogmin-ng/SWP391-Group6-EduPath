import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Map, User } from 'lucide-react';
import MenteeHeader from '../../components/mentee/MenteeHeader';
import { getMyEnrollments } from '../../services/enrollmentService';
import { getFavorites, toggleFavorite } from './features/enrollments/favorites';
import toast from 'react-hot-toast';

export default function MyRoadmapsPage() {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [favVersion, setFavVersion] = useState(0);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const data = await getMyEnrollments();
        setEnrollments(data || []);
      } catch (err) {
        console.error('Failed to fetch enrollments:', err);
        toast.error('Không thể tải danh sách lộ trình của bạn');
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const enrolledRoadmaps = enrollments;

  const ongoing = enrolledRoadmaps.filter((r) => r.progressPercent > 0 && r.progressPercent < 100);
  const completed = enrolledRoadmaps.filter((r) => r.progressPercent >= 100);
  
  const favoriteSlugs = useMemo(() => getFavorites(), [favVersion]);
  const favorite = enrolledRoadmaps.filter((r) => favoriteSlugs.includes(r.slug));

  const tabItems = [
    { key: 'ongoing', label: 'Đang học', count: ongoing.length },
    { key: 'completed', label: 'Đã hoàn thành', count: completed.length },
    { key: 'favorite', label: 'Yêu thích', count: favorite.length },
  ];

  const activeList =
    activeTab === 'ongoing' ? ongoing : activeTab === 'completed' ? completed : favorite;

  if (loading) {
     return (
      <div className="min-h-screen bg-slate-50">
        <MenteeHeader />
        <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 text-center">
          <p className="text-slate-500 animate-pulse">Đang tải lộ trình của bạn...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <MenteeHeader />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Lộ trình của tôi</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Theo dõi và quản lý hành trình phát triển kỹ năng của bạn.
          </p>
        </div>

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

        {activeList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
              <Map className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-900">
              {activeTab === 'ongoing' ? 'Bạn chưa ghi danh lộ trình nào' : 
               activeTab === 'completed' ? 'Chưa có lộ trình hoàn thành' : 
               'Danh sách yêu thích trống'}
            </h3>
            <p className="max-w-sm text-sm text-slate-500">
              {activeTab === 'ongoing' ? 'Hãy khám phá và đăng ký lộ trình phù hợp với mục tiêu của bạn.' : 
               activeTab === 'completed' ? 'Hãy tiếp tục nỗ lực học tập để hoàn thành các lộ trình đầu tiên của bạn!' : 
               'Lưu lại những lộ trình bạn quan tâm để dễ dàng theo dõi sau này.'}
            </p>
            <Link
              to="/explore"
              className="mt-8 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-md transition-all active:scale-95"
            >
              Khám phá ngay
            </Link>
          </div>
        )}

        {activeList.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {activeList.map((enrollment) => (
              <article
                key={enrollment.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-indigo-400/50"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={enrollment.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800"}
                    alt={enrollment.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {activeTab === 'favorite' && (
                    <button
                      onClick={() => {
                        toggleFavorite(enrollment.slug);
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
                    {enrollment.title}
                  </h3>

                  <div className="mb-6 mt-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600">
                      {enrollment.mentorName.charAt(0)}
                    </div>
                    <span className="text-sm text-slate-500">{enrollment.mentorName}</span>
                  </div>

                  <div className="mt-auto">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Tiến độ</span>
                      <span className="text-xs font-bold text-indigo-600">{Math.round(enrollment.progressPercent)}%</span>
                    </div>
                    <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-1000"
                        style={{ width: `${enrollment.progressPercent}%` }}
                      />
                    </div>
                    <Link
                      to={`/roadmaps/${enrollment.slug}/learn`}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white transition-all active:scale-95"
                    >
                      Tiếp tục học
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

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
