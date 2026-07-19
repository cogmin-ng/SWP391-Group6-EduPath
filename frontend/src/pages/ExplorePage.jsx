import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MenteeHeader from '../components/mentee/MenteeHeader';
import Navbar from '../components/landing/Navbar';
import { useAuth } from '../hooks/useAuth';
import ExploreFilters from './mentee/features/explore/components/ExploreFilters';
import RoadmapCard from './mentee/features/explore/components/RoadmapCard';
import MentorCard from './mentee/features/explore/components/MentorCard';
import { exploreService } from '../services/exploreService';
import { mentorService } from '../services/mentorService';
import { subjectCategoryService } from '../services/subjectCategoryService';
import { AlertCircle, RefreshCw, Flame } from 'lucide-react';

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

// ─── Skeleton Card ────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse">
      <div className="h-44 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-2/3" />
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-200 rounded-full" />
            <div className="h-4 bg-slate-200 rounded w-20" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 bg-slate-200 rounded w-10" />
            <div className="h-4 bg-slate-200 rounded w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────
function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        &lt;
      </button>

      {getPageNumbers().map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 py-2 text-sm text-slate-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        &gt;
      </button>
    </div>
  );
}

export default function ExplorePage() {
  const { isAuthenticated } = useAuth();
  const [exploreRoadmaps, setExploreRoadmaps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const cat = searchParams.get('category');
    return cat ? [cat] : [];
  });
  const [selectedMentors, setSelectedMentors] = useState([]);
  const [mentorQuery, setMentorQuery] = useState('');
  const [sortBy] = useState('popular');

  // ─── Hot Learning Paths state ───────────────────────────
  const [hotFilter, setHotFilter] = useState(null);
  const [hotData, setHotData] = useState([]);
  const [hotPagination, setHotPagination] = useState({ page: 1, limit: 6, total: 0, totalPages: 0 });
  const [hotPage, setHotPage] = useState(1);
  const [hotLoading, setHotLoading] = useState(false);
  const [hotError, setHotError] = useState(null);

  // ─── Hot Mentors state ──────────────────────────────────
  const [hotMentorData, setHotMentorData] = useState([]);
  const [hotMentorPagination, setHotMentorPagination] = useState({ page: 1, limit: 6, total: 0, totalPages: 0 });
  const [hotMentorPage, setHotMentorPage] = useState(1);
  const [hotMentorLoading, setHotMentorLoading] = useState(false);
  const [hotMentorError, setHotMentorError] = useState(null);

  // ─── Fetch categories ──────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    subjectCategoryService.getSubjectCategories()
      .then((data) => {
        if (!isMounted) return;
        setCategories(Array.isArray(data) ? data.map((c) => c.name) : []);
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
        if (isMounted) setCategories([]);
      });
    return () => { isMounted = false; };
  }, []);

  // ─── Fetch explore roadmaps (default mode) ─────────────
  useEffect(() => {
    if (hotFilter) return;

    let isMounted = true;
    exploreService.getLearningPaths()
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : [];
        setExploreRoadmaps(
          list.map((roadmap) => ({
            ...roadmap,
            cover:
              roadmap.cover ||
              'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80',
            duration: roadmap.duration || 'N/A',
          })),
        );
      })
      .catch((err) => {
        console.error('Failed to fetch explore paths:', err);
        if (isMounted) setExploreRoadmaps([]);
      });
    return () => { isMounted = false; };
  }, [hotFilter]);

  // ─── Fetch hot learning paths ──────────────────────────
  const fetchHotPaths = useCallback(async (page) => {
    setHotLoading(true);
    setHotError(null);
    try {
      const result = await exploreService.getHotLearningPaths(page, 6);
      // Guard against malformed API response
      const paths = Array.isArray(result?.learningPaths) ? result.learningPaths : [];
      const pagination = result?.pagination ?? { page: 1, limit: 6, total: 0, totalPages: 0 };
      setHotData(paths);
      setHotPagination(pagination);
    } catch (err) {
      console.error('Failed to fetch hot learning paths:', err);
      setHotError('Không thể tải lộ trình nổi bật. Vui lòng thử lại.');
      setHotData([]);
      setHotPagination({ page: 1, limit: 6, total: 0, totalPages: 0 });
    } finally {
      setHotLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hotFilter === 'hot-paths') {
      fetchHotPaths(hotPage);
    }
  }, [hotFilter, hotPage, fetchHotPaths]);

  // ─── Fetch hot mentors ─────────────────────────────────
  const fetchHotMentors = useCallback(async (page) => {
    setHotMentorLoading(true);
    setHotMentorError(null);
    try {
      const result = await mentorService.getHotMentors(page, 6);
      // Guard against malformed API response
      const mentors = Array.isArray(result?.mentors) ? result.mentors : [];
      const pagination = result?.pagination ?? { page: 1, limit: 6, total: 0, totalPages: 0 };
      setHotMentorData(mentors);
      setHotMentorPagination(pagination);
    } catch (err) {
      console.error('Failed to fetch hot mentors:', err);
      setHotMentorError('Không thể tải mentor nổi bật. Vui lòng thử lại.');
      setHotMentorData([]);
      setHotMentorPagination({ page: 1, limit: 6, total: 0, totalPages: 0 });
    } finally {
      setHotMentorLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hotFilter === 'hot-mentors') {
      fetchHotMentors(hotMentorPage);
    }
  }, [hotFilter, hotMentorPage, fetchHotMentors]);

  // ─── Hot filter handler ─────────────────────────────────
  // When selecting hot filter: clear categories and mentors
  const handleSelectHotFilter = (filter) => {
    if (hotFilter === filter) {
      // Deselect — go back to explore mode
      setHotFilter(null);
      setHotData([]);
      setHotPage(1);
      setHotError(null);
      setHotMentorData([]);
      setHotMentorPage(1);
      setHotMentorError(null);
    } else {
      // Clear category and mentor filters when selecting hot filter
      setSelectedCategories([]);
      setSelectedMentors([]);
      setMentorQuery('');
      
      setHotFilter(filter);
      setHotPage(1);
      setHotData([]);
      setHotError(null);
      setHotMentorPage(1);
      setHotMentorData([]);
      setHotMentorError(null);
    }
  };

  const handleHotPageChange = (newPage) => {
    if (hotFilter === 'hot-paths') {
      setHotPage(newPage);
    } else if (hotFilter === 'hot-mentors') {
      setHotMentorPage(newPage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Explore sidebar mentors (string names only) ────────
  const mentors = useMemo(() => {
    const names = exploreRoadmaps
      .map((r) => (typeof r.mentor === 'string' ? r.mentor : r.mentor?.name))
      .filter(Boolean);
    return [...new Set(names)];
  }, [exploreRoadmaps]);

  const filteredMentors = useMemo(() => {
    const q = mentorQuery.trim().toLowerCase();
    if (!q) return mentors;
    return mentors.filter((m) => m.toLowerCase().includes(q));
  }, [mentorQuery, mentors]);

  const filteredRoadmaps = useMemo(() => {
    const filtered = exploreRoadmaps.filter((item) => {
      const mentorName = typeof item.mentor === 'string' ? item.mentor : item.mentor?.name;
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(item.category);
      const mentorMatch =
        selectedMentors.length === 0 || selectedMentors.includes(mentorName);
      return categoryMatch && mentorMatch;
    });

    if (sortBy === 'rating') {
      return [...filtered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }
    if (sortBy === 'duration') {
      return [...filtered].sort(
        (a, b) => Number.parseInt(a.duration, 10) - Number.parseInt(b.duration, 10),
      );
    }
    return filtered;
  }, [exploreRoadmaps, selectedCategories, selectedMentors, sortBy]);

  // ─── Hot content section ───────────────────────────────
  const renderHotContent = () => (
    <section className="flex-1 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-6 h-6 text-orange-500" />
          <h1 className="text-2xl font-bold text-slate-900">Lộ trình nổi bật</h1>
        </div>
        <p className="text-slate-600 max-w-2xl">
          Khám phá các lộ trình học tập được tuyển chọn cẩn thận, tạo ra bởi các chuyên gia trong
          ngành, giúp bạn tiến xa từ người mới bắt đầu đến chuyên nghiệp.
        </p>
      </div>

      {/* Loading skeleton */}
      {hotLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error state */}
      {!hotLoading && hotError && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="inline-block mb-4 p-3 bg-red-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-slate-700 font-medium mb-2">{hotError}</p>
          <button
            onClick={() => fetchHotPaths(hotPage)}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      )}

      {/* Empty state */}
      {!hotLoading && !hotError && hotData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="inline-block mb-4 p-3 bg-slate-100 rounded-full">
            <Flame className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-700 font-medium">Chưa có lộ trình nổi bật nào</p>
          <p className="text-sm text-slate-500 mt-1">
            Các lộ trình sẽ xuất hiện khi có learner tham gia và đánh giá.
          </p>
        </div>
      )}

      {/* Cards grid */}
      {!hotLoading && !hotError && hotData.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {hotData.map((roadmap) => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} />
            ))}
          </div>
          <Pagination
            page={hotPagination.page}
            totalPages={hotPagination.totalPages}
            onPageChange={handleHotPageChange}
          />
        </>
      )}
    </section>
  );

  // ─── Hot mentors content section ─────────────────────────
  const renderHotMentorsContent = () => (
    <section className="flex-1 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-6 h-6 text-orange-500" />
          <h1 className="text-2xl font-bold text-slate-900">Mentor nổi bật</h1>
        </div>
        <p className="text-slate-600 max-w-2xl">
          Khám phá các mentor hàng đầu với kinh nghiệm sâu sắc và đánh giá cao từ học viên,
          sẵn sàng giúp bạn đạt được mục tiêu học tập.
        </p>
      </div>

      {/* Loading skeleton */}
      {hotMentorLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error state */}
      {!hotMentorLoading && hotMentorError && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="inline-block mb-4 p-3 bg-red-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-slate-700 font-medium mb-2">{hotMentorError}</p>
          <button
            onClick={() => fetchHotMentors(hotMentorPage)}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      )}

      {/* Empty state */}
      {!hotMentorLoading && !hotMentorError && hotMentorData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="inline-block mb-4 p-3 bg-slate-100 rounded-full">
            <Flame className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-slate-700 font-medium">Chưa có mentor nổi bật nào</p>
          <p className="text-sm text-slate-500 mt-1">
            Các mentor sẽ xuất hiện khi hoàn thành lộ trình và nhận được đánh giá.
          </p>
        </div>
      )}

      {/* Cards grid */}
      {!hotMentorLoading && !hotMentorError && hotMentorData.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {hotMentorData.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
          <Pagination
            page={hotMentorPagination.page}
            totalPages={hotMentorPagination.totalPages}
            onPageChange={handleHotPageChange}
          />
        </>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {isAuthenticated ? <MenteeHeader /> : <Navbar />}

      <main className="mx-auto flex w-full max-w-420 px-4 sm:px-6 lg:px-8 xl:px-10 pt-20">
        <ExploreFilters
          categories={categories}
          mentors={filteredMentors}
          selectedCategories={selectedCategories}
          selectedMentors={selectedMentors}
          mentorQuery={mentorQuery}
          onMentorQueryChange={setMentorQuery}
          onToggleCategory={(cat) => {
            // Clear hot filter when selecting category
            if (hotFilter) {
              setHotFilter(null);
              setHotData([]);
              setHotPage(1);
              setHotError(null);
              setHotMentorData([]);
              setHotMentorPage(1);
              setHotMentorError(null);
            }
            setSelectedCategories((prev) => toggleValue(prev, cat));
          }}
          onToggleMentor={(m) => {
            // Clear hot filter when selecting mentor
            if (hotFilter) {
              setHotFilter(null);
              setHotData([]);
              setHotPage(1);
              setHotError(null);
              setHotMentorData([]);
              setHotMentorPage(1);
              setHotMentorError(null);
            }
            setSelectedMentors((prev) => toggleValue(prev, m));
          }}
          hotFilter={hotFilter}
          onSelectHotFilter={handleSelectHotFilter}
        />

        {hotFilter === 'hot-paths' ? (
          renderHotContent()
        ) : hotFilter === 'hot-mentors' ? (
          renderHotMentorsContent()
        ) : (
          <section className="flex-1 p-4 md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredRoadmaps.map((roadmap) => (
                <RoadmapCard key={roadmap.id} roadmap={roadmap} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
