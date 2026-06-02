import {
  ChevronDown,
  BarChart2,
  Compass,
  Award,
  FileText,
  Home,
  GraduationCap,
  Lightbulb,
  LogOut,
  Map,
  Menu,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import HomeView from "../../components/mentee/HomeView";

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
  const { logout, user: authUser } = useAuth();
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
  const [badges] = useState(() =>
    readStoredState("edupath_badges", INITIAL_BADGES),
  );
  const [activities, setActivities] = useState(() =>
    readStoredState("edupath_activities", INITIAL_ACTIVITIES),
  );
  const [, setCertificates] = useState(() =>
    readStoredState("edupath_certificates", INITIAL_CERTIFICATES),
  );

  const [toast, setToast] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const displayUser = useMemo(
    () => ({
      ...user,
      name: authUser?.name || "Học viên",
      avatarUrl: authUser?.avatarUrl || authUser?.avatar || user.avatarUrl,
    }),
    [authUser, user],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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

  const headerNavItems = useMemo(
    () => [
      { label: "Khám phá" },
      { label: "Lộ trình" },
      { label: "Mentor" },
      { label: "Bảng giá" },
      { label: "Cộng đồng" },
    ],
    [],
  );

  const accountMenuItems = useMemo(
    () => [
      { label: "Trang chủ", icon: Home, to: "/mentee/homepage" },
      { label: "Hồ sơ cá nhân", icon: User, to: "/mentee/profile" },
      { label: "Lộ trình của tôi", icon: Map, action: "placeholder" },
      { label: "Kho lộ trình", icon: Compass, action: "placeholder" },
      { label: "Tiến độ học tập", icon: BarChart2, action: "placeholder" },
      { label: "Đăng kí mentor", icon: GraduationCap, to: "/profile/become-mentor" },
      { label: "Đóng góp", icon: Lightbulb, action: "placeholder" },
      { label: "Thành tích", icon: Award, action: "placeholder" },
      { label: "Chứng chỉ của tôi", icon: FileText, action: "placeholder" },
      { label: "Cài đặt", icon: Settings, action: "placeholder" },
      { label: "Đăng xuất", icon: LogOut, action: "logout" },
    ],
    [],
  );

  const handleAccountMenuAction = async (item) => {
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);

    if (item.to) {
      navigate(item.to);
      return;
    }

    if (item.action === "logout") {
      triggerToast("Bạn đã đăng xuất khỏi EduPath.", "success");
      await logout();
      return;
    }

    triggerToast(`${item.label} sẽ được bạn tự triển khai sau.`, "success");
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

      <header
        className={`sticky top-0 z-40 border-b border-slate-200/70 transition-all ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-sm"
            : "bg-white/80 backdrop-blur-xl"
        }`}
      >
        <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="h-16 lg:h-18 flex items-center justify-between gap-4 relative">
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 group select-none">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  EduPath
                </span>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {headerNavItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50/60 transition-all duration-200"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3 shrink-0 relative">
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-2xl border border-slate-200 bg-white/80 hover:bg-slate-50 transition-shadow shadow-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold overflow-hidden shrink-0">
                  {displayUser?.avatarUrl ? (
                    <img
                      src={displayUser.avatarUrl}
                      alt={displayUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4.5 h-4.5" />
                  )}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <p className="text-sm font-semibold text-slate-800 leading-none">
                    {displayUser.name}
                  </p>
                  <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-1">
                    Mentee
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 top-14 z-50 w-[min(20rem,calc(100vw-2rem))] max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {displayUser.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {displayUser.level
                        ? `Level ${displayUser.level}`
                        : "Tài khoản học viên"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    {accountMenuItems.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleAccountMenuAction(item)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <item.icon className="w-4.5 h-4.5 text-slate-400" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden pb-4 border-t border-slate-100 mt-2 pt-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {headerNavItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-2">
                {accountMenuItems.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleAccountMenuAction(item)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <item.icon className="w-4.5 h-4.5 text-slate-400" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

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
          onPlaceholderClick={() => {}}
        />
      </main>
    </div>
  );
}
