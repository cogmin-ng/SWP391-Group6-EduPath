import { useState, useEffect, useMemo } from 'react';
import { Star, Users, ArrowRight, Loader2, AlertCircle, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { subjectCategoryService } from '../../services/subjectCategoryService';
import { exploreService } from '../../services/exploreService';

/* ── colour palette for card gradients ── */
const GRADIENTS = [
  'from-slate-700 to-slate-900',
  'from-violet-500 to-purple-700',
  'from-blue-500 to-cyan-600',
  'from-indigo-600 to-blue-800',
  'from-emerald-500 to-teal-700',
  'from-rose-500 to-pink-700',
  'from-amber-500 to-orange-700',
  'from-fuchsia-500 to-purple-800',
];

const EMOJIS = ['💻', '🎨', '📊', '🤖', '🚀', '📱', '🧠', '🎯', '📚', '🔬'];

function formatStudents(count) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

export default function FeaturedRoadmaps() {
  const navigate = useNavigate();

  /* ── state ── */
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [categories, setCategories] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingRoadmaps, setLoadingRoadmaps] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const [errorRoadmaps, setErrorRoadmaps] = useState(null);

  /* ── fetch categories ── */
  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setErrorCategories(null);
        const data = await subjectCategoryService.getSubjectCategories();
        if (!cancelled) {
          setCategories(data.map((c) => c.name));
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        if (!cancelled) setErrorCategories('Không thể tải danh mục.');
      } finally {
        if (!cancelled) setLoadingCategories(false);
      }
    };

    fetchCategories();
    return () => { cancelled = true; };
  }, []);

  /* ── fetch roadmaps ── */
  useEffect(() => {
    let cancelled = false;

    const fetchRoadmaps = async () => {
      try {
        setLoadingRoadmaps(true);
        setErrorRoadmaps(null);
        const data = await exploreService.getLearningPaths();
        if (!cancelled) setRoadmaps(data);
      } catch (err) {
        console.error('Failed to fetch roadmaps:', err);
        if (!cancelled) setErrorRoadmaps('Không thể tải lộ trình học tập.');
      } finally {
        if (!cancelled) setLoadingRoadmaps(false);
      }
    };

    fetchRoadmaps();
    return () => { cancelled = true; };
  }, []);

  /* ── derived data ── */
  const categoryTabs = useMemo(() => ['Tất cả', ...categories], [categories]);

  const filtered = useMemo(() => {
    const list =
      activeCategory === 'Tất cả'
        ? roadmaps
        : roadmaps.filter((r) => r.category === activeCategory);
    // Only show first 4 on landing page
    return list.slice(0, 4);
  }, [roadmaps, activeCategory]);

  const isLoading = loadingCategories || loadingRoadmaps;
  const hasError = errorCategories || errorRoadmaps;

  /* ── "Xem tất cả" handler ── */
  const handleViewAll = () => {
    if (activeCategory !== 'Tất cả') {
      navigate(`/explore?category=${encodeURIComponent(activeCategory)}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <section id="roadmaps" className="py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Lộ trình học tập nổi bật
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Chọn lộ trình phù hợp để bắt đầu hành trình sự nghiệp của bạn.
          </p>
        </div>

        {/* Filter Tabs */}
        {!loadingCategories && !errorCategories && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categoryTabs.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-500 text-sm">Đang tải lộ trình học tập...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && hasError && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-slate-700 font-medium mb-1">Đã xảy ra lỗi</p>
            <p className="text-slate-500 text-sm">{errorCategories || errorRoadmaps}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasError && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-700 font-medium mb-1">Chưa có lộ trình nào</p>
            <p className="text-slate-500 text-sm">
              {activeCategory !== 'Tất cả'
                ? `Không tìm thấy lộ trình nào trong danh mục "${activeCategory}".`
                : 'Hiện chưa có lộ trình học tập nào được xuất bản.'}
            </p>
          </div>
        )}

        {/* Cards Grid */}
        {!isLoading && !hasError && filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((roadmap, index) => (
              <div
                key={roadmap.id}
                onClick={() => navigate(`/explore/${roadmap.slug}`)}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Card Image */}
                <div
                  className={`relative h-44 bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} flex items-center justify-center`}
                >
                  {roadmap.cover ? (
                    <img
                      src={roadmap.cover}
                      alt={roadmap.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                      {EMOJIS[index % EMOJIS.length]}
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {roadmap.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">{roadmap.mentor}</p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold text-slate-700">
                        {roadmap.rating ?? '–'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">
                        {formatStudents(roadmap.enrollmentCount ?? 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Link */}
        {!isLoading && !hasError && roadmaps.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={handleViewAll}
              className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 hover:gap-3 transition-all duration-200 cursor-pointer"
            >
              Xem tất cả lộ trình
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
