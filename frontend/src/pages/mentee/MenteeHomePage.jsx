import { Sparkles } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenteeHeader from "../../components/mentee/MenteeHeader";

import HomeView from "../../components/mentee/HomeView";
import { badgeService } from "../../services/badgeService";

import {
  INITIAL_ACTIVITIES,
  INITIAL_BADGES,
  INITIAL_CERTIFICATES,
  INITIAL_COURSES,
  INITIAL_USER,
  SUGGESTED_COURSES,
} from "../../mock/menteeData";
import { useAuth } from "../../hooks/useAuth";

const saveState = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const readStoredState = (key, fallback) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

export default function MenteeHomePage() {
  const { user: authUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(() =>
    readStoredState("edupath_user", INITIAL_USER),
  );
  const [courses, setCourses] = useState(() =>
    readStoredState("edupath_courses", INITIAL_COURSES),
  );
  const [suggestedCourses, setSuggestedCourses] = useState(() =>
    readStoredState("edupath_suggested", SUGGESTED_COURSES),
  );
  const [badges, setBadges] = useState([]);
  const [isLoadingBadges, setIsLoadingBadges] = useState(true);

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
      } finally {
        setIsLoadingBadges(false);
      }
    };
    if (authUser?.id) {
      fetchBadges();
    }
  }, [authUser?.id]);

  const levelInfo = useMemo(() => {
    const xp = authUser?.xp ?? 0;
    let level = 1;
    let currentXp = xp;
    let maxXp = 500;
    while (currentXp >= maxXp) {
      currentXp -= maxXp;
      level += 1;
      maxXp = Math.round(maxXp * 1.2);
    }
    return { level, currentXp, maxXp };
  }, [authUser]);

  const [activities, setActivities] = useState(() =>
    readStoredState("edupath_activities", INITIAL_ACTIVITIES),
  );
  const [, setCertificates] = useState(() =>
    readStoredState("edupath_certificates", INITIAL_CERTIFICATES),
  );

  const [toast, setToast] = useState(null);

  const displayUser = useMemo(
    () => ({
      ...user,
      name: authUser?.name || "Học viên",
      avatarUrl: authUser?.avatarUrl || authUser?.avatar || user.avatarUrl,
      level: levelInfo.level,
      currentXp: levelInfo.currentXp,
      maxXp: levelInfo.maxXp,
      xp: authUser?.xp ?? 0,
    }),
    [authUser, user, levelInfo],
  );

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const firstCourse = useMemo(
    () => courses.find((course) => course.isEnrolled),
    [courses],
  );

  const handleGoToRoadmaps = () => navigate("/roadmaps");
  const handleGoToProfile = () => navigate("/mentee/profile");
  const handleGoToCourse = (course) => {
    if (course?.id) {
      navigate(`/roadmaps/${course.id}/learn`);
    } else {
      handleGoToRoadmaps();
    }
  };
  const handleGoToQuiz = () => {
    if (firstCourse?.id) {
      navigate(`/roadmaps/${firstCourse.id}/learn/quiz`);
    } else {
      handleGoToRoadmaps();
    }
  };
  const handleGoToNodeView = () => {
    if (firstCourse?.id) {
      navigate(`/roadmaps/${firstCourse.id}/learn`);
    } else {
      handleGoToRoadmaps();
    }
  };
  const handleGoToTipContribution = () => {
    const firstNodeId = firstCourse?.nodes?.[0]?.id;
    if (firstCourse?.id && firstNodeId) {
      navigate(`/mentee/roadmaps/${firstCourse.id}/nodes/${firstNodeId}`);
    } else {
      handleGoToRoadmaps();
    }
  };
  const handleViewSuggestedCourses = () => navigate("/roadmaps");
  const handleViewAllActivities = () => navigate("/roadmaps");
  const handleViewAllAchievements = () => navigate("/mentee/profile#badges-section");

  const handleUpdateXp = (xpGained, message) => {
    if (xpGained <= 0) return;

    setUser((prev) => {
      let nextXp = prev.currentXp + xpGained;
      let nextLevel = prev.level;
      let maxXp = prev.maxXp;
      let leveledUp = false;

      while (nextXp >= maxXp) {
        nextXp -= maxXp;
        nextLevel += 1;
        maxXp = Math.round(maxXp * 1.22);
        leveledUp = true;
      }

      const updated = {
        ...prev,
        level: nextLevel,
        currentXp: nextXp,
        maxXp: maxXp,
      };

      saveState("edupath_user", updated);

      if (leveledUp) {
        setTimeout(
          () =>
            triggerToast(
              `🎉 Chúc mừng! Bạn đã tích luỹ đủ kiến thức và tăng lên Cấp độ ${nextLevel}!`,
              "level",
            ),
          500,
        );
      } else {
        triggerToast(`+${xpGained} XP: ${message}`, "xp");
      }

      return updated;
    });
  };

  const handleEnrollCourse = (courseId) => {
    let target = suggestedCourses.find((c) => c.id === courseId);
    let inBaseline = courses.find((c) => c.id === courseId);

    if (inBaseline && inBaseline.isEnrolled) {
      triggerToast("Bạn đã tham gia lộ trình học này rồi!", "success");
      return;
    }

    let updatedCourses = [...courses];

    if (target) {
      const activeEnrollObj = {
        ...target,
        isEnrolled: true,
        nodes: [
          {
            id: `node-${courseId}-1`,
            label: "Nhập môn căn bản",
            description: `Chào mừng bạn tới khóa học ${target.title}. Làm quen các thuật ngữ cơ sở và cú pháp then chốt.`,
            completed: false,
            checklist: [
              {
                id: `c-${courseId}-1`,
                label: "Xem video bài giảng hướng dẫn nhập môn",
                completed: false,
                xpValue: 10,
              },
              {
                id: `c-${courseId}-2`,
                label: "Tải bộ tài liệu cheatsheet kỹ thuật về máy",
                completed: false,
                xpValue: 15,
              },
              {
                id: `c-${courseId}-3`,
                label: "Hoàn tất bài thực tập viết đoạn mã khai mạc",
                completed: false,
                xpValue: 20,
              },
            ],
          },
          {
            id: `node-${courseId}-2`,
            label: "Thực hành module nâng cao",
            description:
              "Giải bài tập tình huống thực chiến, kết nối các nguồn thư viện bên thứ 3.",
            completed: false,
            checklist: [
              {
                id: `c-${courseId}-4`,
                label: "Đọc bài viết thủ thuật đính kèm",
                completed: false,
                xpValue: 20,
              },
              {
                id: `c-${courseId}-5`,
                label: "Làm bài trắc nghiệm thu hoạch kiến thuật",
                completed: false,
                xpValue: 25,
              },
            ],
          },
        ],
      };

      updatedCourses.push(activeEnrollObj);
      setCourses(updatedCourses);

      const leftover = suggestedCourses.filter((c) => c.id !== courseId);
      setSuggestedCourses(leftover);
      saveState("edupath_suggested", leftover);
    } else if (inBaseline) {
      updatedCourses = courses.map((c) =>
        c.id === courseId ? { ...c, isEnrolled: true } : c,
      );
      setCourses(updatedCourses);
    }

    saveState("edupath_courses", updatedCourses);
    triggerToast(
      `🎉 Đăng ký thành công lộ trình "${target?.title || inBaseline?.title}"!`,
      "success",
    );
    handleUpdateXp(30, "Đăng ký ghi danh lộ trình mới");

    setActivities((prevActs) => {
      const added = [
        {
          id: `act-${Date.now()}`,
          title: "Đăng ký thành công khóa học mới",
          description: `Ghi danh học tập: ${target?.title || inBaseline?.title}`,
          timeAgo: "Vừa xong",
          xpGained: 30,
          iconType: "join",
        },
        ...prevActs,
      ];
      saveState("edupath_activities", added);
      return added;
    });

    setCertificates((prev) => {
      const added = [
        ...prev,
        {
          id: `cert-${courseId}-${Date.now()}`,
          courseTitle: target?.title || inBaseline?.title || "",
          issueDate: "",
          credentialId: "EDP-PENDING",
          isUnlocked: false,
          tutor: target?.tutor || inBaseline?.tutor || "",
        },
      ];
      saveState("edupath_certificates", added);
      return added;
    });
  };

  return (
    <div
      id="edupath_application_root"
      className="min-h-screen bg-[#F6F8FC] text-slate-800 font-sans selection:bg-indigo-600/10 antialiased"
    >
      {toast && (
        <div
          id="toast_alert_banner"
          className={`fixed top-4 left-1/2 -translate-x-1/2 p-4 rounded-2xl shadow-xl z-50 flex items-center gap-2 border text-xs font-semibold animate-slideDown ${
            toast.type === "level"
              ? "bg-linear-to-r from-amber-500 to-yellow-500 text-slate-900 border-amber-300"
              : toast.type === "xp"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-indigo-600 text-white border-indigo-500"
          }`}
        >
          <Sparkles className="w-4 h-4 text-white animate-spin" />
          <span>{toast.message}</span>
        </div>
      )}

      <MenteeHeader />

      <main
        id="main_layout_workspace"
        className="max-w-400 mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 lg:py-10"
      >
        <HomeView
          user={displayUser}
          courses={courses}
          activities={activities}
          badges={badges}
          suggestedCourses={suggestedCourses}
          onEnrollGame={handleEnrollCourse}
          onUpdateXp={handleUpdateXp}
          onContinueStudy={handleGoToRoadmaps}
          onViewMyPath={handleGoToRoadmaps}
          onViewAllLearning={handleGoToRoadmaps}
          onContinueCourse={handleGoToCourse}
          onViewRoadmap={handleGoToCourse}
          onViewAllActivities={handleViewAllActivities}
          onViewAllAchievements={handleViewAllAchievements}
          onQuickPath={handleGoToRoadmaps}
          onQuickNode={handleGoToNodeView}
          onQuickQuiz={handleGoToQuiz}
          onQuickTip={handleGoToTipContribution}
          onViewXP={handleGoToProfile}
          onViewCertificates={handleGoToProfile}
          onViewSuggestedCourses={handleViewSuggestedCourses}
        />
      </main>
    </div>
  );
}
