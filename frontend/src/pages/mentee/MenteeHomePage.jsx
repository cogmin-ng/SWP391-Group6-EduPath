import { AlertCircle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import HomeView from "../../components/mentee/HomeView";
import MenteeHeader from "../../components/mentee/MenteeHeader";
import { enrollInRoadmapBySlug } from "../../services/enrollmentService";
import {
  getCachedMenteeDashboard,
  getMenteeDashboard,
} from "../../services/menteeDashboardService";
import { badgeService } from "../../services/badgeService";
import { useAuth } from "../../hooks/useAuth";

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-label="Đang tải dashboard">
      <div className="h-72 rounded-3xl bg-indigo-200" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-36 rounded-2xl bg-white" />
        ))}
      </div>
      <div className="h-72 rounded-3xl bg-white" />
    </div>
  );
}

export default function MenteeHomePage() {
  const navigate = useNavigate();
  const { user: authUser, updateUser } = useAuth();
  const [dashboard, setDashboard] = useState(() => getCachedMenteeDashboard());
  const [loading, setLoading] = useState(() => !getCachedMenteeDashboard());
  const [error, setError] = useState("");
  const [enrollingSlug, setEnrollingSlug] = useState(null);
  const [badges, setBadges] = useState([]);

  const loadDashboard = useCallback(async ({ showLoading = true } = {}) => {
    if (showLoading) setLoading(true);
    setError("");

    try {
      const data = await getMenteeDashboard();
      setDashboard(data);
    } catch (requestError) {
      console.error("Failed to load mentee dashboard:", requestError);
      setError(
        requestError.response?.data?.message ||
          "Không thể tải dữ liệu dashboard. Vui lòng thử lại.",
      );
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    getMenteeDashboard()
      .then((data) => {
        if (active) setDashboard(data);
      })
      .catch((requestError) => {
        console.error("Failed to load mentee dashboard:", requestError);
        if (active) {
          setError(
            requestError.response?.data?.message ||
              "Không thể tải dữ liệu dashboard. Vui lòng thử lại.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Fetch badges safely
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await badgeService.getMyBadges();
        if (res && res.data) {
          setBadges(res.data.badges || []);
          if (res.data.xp !== undefined && authUser && authUser.xp !== res.data.xp) {
            updateUser({ xp: res.data.xp });
          }
        }
      } catch (err) {
        console.error("Error fetching badges:", err);
      }
    };
    if (authUser?.id) {
      fetchBadges();
    }
  }, [authUser?.id]);

  const goToCourse = (course) => {
    if (course?.slug) navigate(`/roadmaps/${course.slug}/learn`);
    else navigate("/roadmaps");
  };

  const goToCurrentNode = () => {
    const course = dashboard?.continueLearning;
    goToCourse(course);
  };

  const goToCurrentQuiz = () => {
    const course = dashboard?.continueLearning;
    if (course?.slug && course.currentNode?.id && course.currentNode.hasQuiz) {
      navigate(
        `/roadmaps/${course.slug}/learn/quiz?nodeId=${course.currentNode.id}`,
      );
      return;
    }
    goToCourse(course);
  };

  const handleEnroll = async (course) => {
    if (!course?.slug || enrollingSlug) return;

    setEnrollingSlug(course.slug);
    try {
      await enrollInRoadmapBySlug(course.slug);
      toast.success(`Đã đăng ký lộ trình “${course.title}”`);
      await loadDashboard({ showLoading: false });
    } catch (requestError) {
      console.error("Failed to enroll in roadmap:", requestError);
      toast.error(
        requestError.response?.data?.message || "Không thể đăng ký lộ trình",
      );
    } finally {
      setEnrollingSlug(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-slate-800 antialiased">
      <MenteeHeader />
      <main className="mx-auto w-full max-w-400 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-10">
        {loading ? (
          <DashboardSkeleton />
        ) : error ? (
          <div className="mx-auto mt-20 max-w-lg rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
            <h1 className="mt-4 text-lg font-bold text-slate-900">
              Không thể tải dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              type="button"
              onClick={() => loadDashboard()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <RefreshCw className="h-4 w-4" />
              Thử lại
            </button>
          </div>
        ) : (
          <HomeView
            dashboard={dashboard}
            badges={badges}
            enrollingSlug={enrollingSlug}
            onContinueCourse={goToCourse}
            onExplore={() => navigate("/explore")}
            onViewRoadmaps={() => navigate("/roadmaps")}
            onViewProfile={() => navigate("/mentee/profile")}
            onViewCertificates={() => navigate("/my-certificates")}
            onViewContributions={() => navigate("/mentee/contributions")}
            onViewCurrentNode={goToCurrentNode}
            onViewCurrentQuiz={goToCurrentQuiz}
            onEnroll={handleEnroll}
          />
        )}
      </main>
    </div>
  );
}
