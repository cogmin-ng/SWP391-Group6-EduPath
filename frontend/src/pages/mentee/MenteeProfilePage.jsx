import { Award, BarChart3, BookOpen, CalendarDays, CheckCircle2, ChevronRight, Camera, Edit3, Flame, Lightbulb, MapPin, Settings, Sparkles, Star, Target, TrendingUp, X, User, Zap, Shield, Lock } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import MenteeHeader from "../../components/mentee/MenteeHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";
import { badgeService } from "../../services/badgeService";

const getRoleLabel = (roles = []) => {
  if (!Array.isArray(roles) || roles.length === 0) return "Mentee";
  if (roles.includes("MENTEE")) return "Mentee";
  if (roles.includes("MENTOR")) return "Mentor";
  if (roles.includes("ADMIN")) return "Admin";
  return roles[0];
};

const PROFILE_STORAGE_KEY = "edupath_profile_overrides";

const readStoredProfile = (fallback) => {
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!stored) return fallback;

  try {
    const parsed = JSON.parse(stored);
    return {
      ...fallback,
      name: parsed.name ?? fallback.name,
      email: parsed.email ?? fallback.email,
      bio: parsed.bio ?? fallback.bio,
      location: parsed.location ?? fallback.location,
    };
  } catch {
    return fallback;
  }
};

export default function MenteeProfilePage() {
  const { user: authUser, updateUser } = useAuth();
  const avatarInputRef = useRef(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [toast, setToast] = useState(null);

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

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!avatarPreview) return undefined;

    return () => window.URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  useEffect(() => {
    const handleHashScroll = () => {
      if (window.location.hash === "#badges-section") {
        const element = document.getElementById("badges-section");
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      }
    };
    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, []);

  const baseProfile = useMemo(
    () => ({
      name: authUser?.name || "Nguyễn Minh",
      email: authUser?.email || "minh.nguyen@example.com",
      avatarUrl: authUser?.avatarUrl || authUser?.avatar || "",
      role: getRoleLabel(authUser?.roles),
      bio:
        authUser?.bio ||
        "Đam mê công nghệ và không ngừng học hỏi. Mục tiêu trở thành Fullstack Developer.",
      location: authUser?.location || "Hà Nội, Việt Nam",
      joinDate: authUser?.joinDate || "15/03/2024",
      level: levelInfo.level,
      xp: authUser?.xp ?? 0,
      xpTarget: levelInfo.maxXp,
      streak: 7,
      todayMinutes: 90,
      dailyGoalMinutes: 120,
      certificates: 4,
      contributions: 32,
      quizzes: 54,
      roadmapCount: 8,
      badgesCount: badges.filter((b) => b.isUnlocked).length,
    }),
    [authUser, levelInfo, badges],
  );

  const [profileData, setProfileData] = useState(() =>
    readStoredProfile({
      name: baseProfile.name,
      email: baseProfile.email,
      bio: baseProfile.bio,
      location: baseProfile.location,
    }),
  );

  const [editForm, setEditForm] = useState(() => ({
    name: baseProfile.name,
    email: baseProfile.email,
    bio: baseProfile.bio,
    location: baseProfile.location,
  }));

  const profile = useMemo(
    () => ({
      ...baseProfile,
      ...profileData,
    }),
    [baseProfile, profileData],
  );

  const displayedAvatarUrl =
    avatarPreview || authUser?.avatarUrl || authUser?.avatar || "";

  const handleProfileAction = (label) => {
    if (label === "Chỉnh sửa hồ sơ" || label === "Cập nhật ảnh đại diện") {
      if (avatarPreview) {
        window.URL.revokeObjectURL(avatarPreview);
      }

      setAvatarFile(null);
      setAvatarPreview(null);
      setEditForm({
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
        location: profile.location,
      });
      setIsEditModalOpen(true);
      return;
    }

    setToast({ type: "info", message: `${label} đang ở chế độ xem trước.` });
  };

  const handleAvatarPick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (avatarPreview) {
      window.URL.revokeObjectURL(avatarPreview);
    }

    setAvatarFile(file);
    setAvatarPreview(file ? window.URL.createObjectURL(file) : null);
  };

  const clearAvatarSelection = () => {
    if (avatarPreview) {
      window.URL.revokeObjectURL(avatarPreview);
    }

    setAvatarFile(null);
    setAvatarPreview(null);
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setIsSavingProfile(true);

    try {
      let nextAvatarUrl = profile.avatarUrl;

      if (avatarFile && authUser?.id) {
        const response = await userService.updateAvatar(
          authUser.id,
          avatarFile,
        );
        const updatedUser = response.data;

        if (!updatedUser) {
          throw new Error("Avatar upload response is invalid");
        }

        updateUser(updatedUser);
        nextAvatarUrl =
          updatedUser.avatarUrl || updatedUser.avatar || nextAvatarUrl;
      }

      const nextProfile = {
        name: editForm.name.trim() || baseProfile.name,
        email: editForm.email.trim() || baseProfile.email,
        bio: editForm.bio.trim() || baseProfile.bio,
        location: editForm.location.trim() || baseProfile.location,
      };

      setProfileData(nextProfile);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
      if (authUser?.id) {
        updateUser({
          ...authUser,
          name: nextProfile.name,
          email: nextProfile.email,
          bio: nextProfile.bio,
          location: nextProfile.location,
          avatarUrl: nextAvatarUrl,
          avatar: nextAvatarUrl,
        });
      }
      setToast({
        type: "success",
        message: "Đã lưu thay đổi hồ sơ.",
      });
      setIsEditModalOpen(false);
      clearAvatarSelection();
    } catch (error) {
      setToast({
        type: "error",
        message:
          error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          "Không thể cập nhật ảnh đại diện.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const profileCompletion = Math.min(
    100,
    Math.round((profile.todayMinutes / profile.dailyGoalMinutes) * 100),
  );
  const xpCompletion = Math.min(
    100,
    Math.round((profile.xp / profile.xpTarget) * 100),
  );

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-slate-800 font-sans selection:bg-indigo-600/10 antialiased">
      {toast ? (
        <div
          className={`fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-xl ${
            toast.type === "success"
              ? "border-emerald-300 bg-emerald-600 text-white"
              : "border-indigo-200 bg-white text-slate-700"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>{toast.message}</span>
        </div>
      ) : null}

      <MenteeHeader />

      <main className="max-w-400 mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 lg:py-10">
        <div className="grid gap-6">
          <div className="space-y-6">
            <section className="relative overflow-hidden rounded-3xl bg-[#635BFF] p-5 text-white shadow-xl sm:p-6 lg:p-8">
              <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl" />
              <div className="absolute bottom-[-24%] left-[28%] h-56 w-56 rounded-full bg-violet-400/20 blur-2xl" />

              <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="relative mx-auto shrink-0 sm:mx-0">
                    <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white/20 shadow-xl shadow-black/10 sm:h-28 sm:w-28">
                      {displayedAvatarUrl ? (
                        <img
                          src={displayedAvatarUrl}
                          alt={profile.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-white/15 text-3xl font-bold">
                          {profile.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleProfileAction("Cập nhật ảnh đại diện")
                      }
                      className="absolute -bottom-0.5 -right-0.5 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-slate-100 text-slate-900 shadow-xl transition duration-200 hover:scale-105 hover:bg-white sm:h-10 sm:w-10"
                    >
                      <Camera className="h-3 w-3 sm:h-4.5 sm:w-4.5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-center sm:text-left">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                        {profile.name}
                      </h1>
                      <span className="mx-auto rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-100 sm:mx-0">
                        {profile.role}
                      </span>
                    </div>

                    <p className="flex items-center justify-center gap-1 text-sm font-medium text-indigo-100 sm:justify-start">
                      <span>✉️</span>
                      {profile.email}
                    </p>

                    <p className="max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
                      {profile.bio}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-xs font-medium text-white/85 sm:justify-start">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {profile.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Tham gia: {profile.joinDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Button
                    variant="white"
                    size="sm"
                    className="justify-center text-white"
                    onClick={() => handleProfileAction("Chỉnh sửa hồ sơ")}
                  >
                    <Edit3 className="h-4 w-4" />
                    Chỉnh sửa hồ sơ
                  </Button>
                </div>
              </div>

              <div className="relative z-10 mt-6 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2 xl:grid-cols-4">
                <MetricPill
                  icon={<span className="text-lg">🛡️</span>}
                  label="Cấp độ hiện tại"
                  value={`Lv. ${profile.level}`}
                />
                <MetricPill
                  icon={<Star className="h-4.5 w-4.5" />}
                  label="Tổng XP đã tích lũy"
                  value={`${profile.xp.toLocaleString()} XP`}
                />
                <MetricPill
                  icon={<Flame className="h-4.5 w-4.5" />}
                  label="Chuỗi học tập"
                  value={`${profile.streak} ngày`}
                />
                <MetricPill
                  icon={<span className="text-lg">🏆</span>}
                  label="Huy hiệu nổi bật"
                  value={`${profile.badgesCount} huy hiệu`}
                />
              </div>
            </section>

              {/* Premium Badges Gallery */}
              <section id="badges-section" className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                      <span className="text-2xl">🏆</span> Bộ sưu tập Huy hiệu
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Mở khoá các cột mốc ý nghĩa trên con đường học tập cùng EduPath.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full self-start md:self-auto">
                    Đã mở khoá: {profile.badgesCount}/{badges.length}
                  </div>
                </div>

                {isLoadingBadges ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {badges.map((badge) => {
                      const isUnlocked = badge.isUnlocked;
                      return (
                        <div
                          key={badge.id}
                          className={`relative rounded-2xl border p-5 flex flex-col items-center text-center transition-all duration-300 group hover:shadow-md ${
                            isUnlocked
                              ? "bg-linear-to-br from-indigo-50/50 to-violet-50/50 border-indigo-100 hover:scale-105"
                              : "bg-slate-50/50 border-slate-100 opacity-60"
                          }`}
                        >
                          {/* Glow effect on hover */}
                          {isUnlocked && (
                            <div className="absolute inset-0 -z-10 bg-linear-to-r from-indigo-500/10 to-violet-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                          )}

                          {/* Badge Icon Wrapper */}
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-inner ${
                              isUnlocked
                                ? badge.iconName === "zap"
                                  ? "bg-amber-100 text-amber-600"
                                  : badge.iconName === "award"
                                    ? "bg-emerald-100 text-emerald-600"
                                    : badge.iconName === "star"
                                      ? "bg-purple-100 text-purple-600"
                                      : "bg-indigo-100 text-indigo-600"
                                : "bg-slate-200 text-slate-400"
                            }`}
                          >
                            {badge.iconName === "zap" ? (
                              <Zap className="w-8 h-8 animate-pulse" />
                            ) : badge.iconName === "award" ? (
                              <Award className="w-8 h-8" />
                            ) : badge.iconName === "star" ? (
                              <Star className="w-8 h-8" />
                            ) : badge.iconName === "shield" ? (
                              <Shield className="w-8 h-8" />
                            ) : (
                              <Award className="w-8 h-8" />
                            )}
                          </div>

                          {/* Badge Status Indicator */}
                          {!isUnlocked && (
                            <div className="absolute top-3 right-3 text-slate-400 bg-white rounded-full p-1 border border-slate-100 shadow-xs">
                              <Lock className="w-3.5 h-3.5" />
                            </div>
                          )}

                          <h3 className={`font-bold text-sm leading-tight ${isUnlocked ? "text-slate-800" : "text-slate-500"}`}>
                            {badge.title}
                          </h3>
                          
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed flex-1">
                            {badge.description}
                          </p>

                          <div className="mt-4 pt-3 border-t border-slate-100/60 w-full flex items-center justify-between text-[11px] font-semibold">
                            <span className={`${isUnlocked ? "text-emerald-600" : "text-slate-400"}`}>
                              +{badge.xpReward} XP
                            </span>
                            {isUnlocked ? (
                              <span className="text-indigo-600 font-medium bg-white px-2 py-0.5 rounded-md shadow-xs">
                                Đã nhận ✨
                              </span>
                            ) : (
                              <span className="text-slate-400 font-normal">Chưa đạt</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>

      {isEditModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-6">
          <div className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-slate-200/70">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Hồ sơ cá nhân
                </p>
                <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                  Chỉnh sửa hồ sơ
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Cập nhật thông tin hiển thị trên hồ sơ của bạn.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Đóng form chỉnh sửa hồ sơ"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              className="grid gap-5 px-5 py-5 sm:px-6"
              onSubmit={handleProfileSubmit}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Tên hiển thị"
                  value={editForm.name}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Nhập tên của bạn"
                />
                <Input
                  label="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder="Nhập email"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white bg-white shadow-sm">
                      {displayedAvatarUrl ? (
                        <img
                          src={displayedAvatarUrl}
                          alt={profile.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-indigo-50 text-lg font-bold text-indigo-600">
                          {profile.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Ảnh đại diện
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Chọn file ảnh từ máy để upload lên Cloudinary.
                      </p>
                      {avatarFile ? (
                        <p className="mt-1 text-xs font-medium text-indigo-600">
                          Đã chọn: {avatarFile.name}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleAvatarPick}
                    >
                      Chọn file
                    </Button>
                    {avatarFile ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearAvatarSelection}
                      >
                        Xóa chọn
                      </Button>
                    ) : null}
                  </div>
                </div>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <Input
                label="Vị trí"
                value={editForm.location}
                onChange={(event) =>
                  setEditForm((prev) => ({
                    ...prev,
                    location: event.target.value,
                  }))
                }
                placeholder="Ví dụ: Hà Nội, Việt Nam"
              />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Giới thiệu bản thân
                </label>
                <textarea
                  rows="4"
                  value={editForm.bio}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      bio: event.target.value,
                    }))
                  }
                  placeholder="Viết vài dòng giới thiệu ngắn gọn"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditModalOpen(false)}
                  className="justify-center sm:min-w-32"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  isLoading={isSavingProfile}
                  className="justify-center sm:min-w-40"
                >
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InfoCard({ icon: Icon, iconClassName, label, value, meta }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
          {meta}
        </span>
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </h3>
      </div>
    </div>
  );
}

function FieldCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-900 wrap-break-word">
        {value}
      </div>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <div>
        <div className="text-xs font-medium text-slate-500">{label}</div>
        <div className="mt-1 text-sm font-bold text-slate-900">{value}</div>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
        <Star className="h-4.5 w-4.5" />
      </div>
    </div>
  );
}

function MetricPill({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-medium text-white/60">{label}</div>
        <div className="text-sm font-bold text-white">{value}</div>
      </div>
    </div>
  );
}

function ActionPill({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50/40"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon className="h-4.5 w-4.5" />
        </span>
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-slate-400" />
    </button>
  );
}

function KeyValueRow({ label, value, valueClassName = "text-slate-700" }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <span className={`font-semibold ${valueClassName}`}>{value}</span>
    </div>
  );
}
