import { Award, BarChart3, BookOpen, CalendarDays, CheckCircle2, ChevronRight, Camera, Edit3, Flame, Lightbulb, MapPin, Settings, Sparkles, Star, Target, TrendingUp, X, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import MenteeHeader from "../../components/mentee/MenteeHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";

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

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!avatarPreview) return undefined;

    return () => window.URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

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
      level: 12,
      xp: 12450,
      xpTarget: 15000,
      streak: 7,
      todayMinutes: 90,
      dailyGoalMinutes: 120,
      certificates: 4,
      contributions: 32,
      quizzes: 54,
      roadmapCount: 8,
    }),
    [authUser],
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
                  value="3 huy hiệu"
                />
              </div>
            </section>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <InfoCard
                icon={TrendingUp}
                iconClassName="text-violet-600 bg-violet-50"
                label="Tổng XP đạt"
                value={profile.xp.toLocaleString()}
                meta="Cải thiện 18%"
              />
              <InfoCard
                icon={BarChart3}
                iconClassName="text-emerald-600 bg-emerald-50"
                label="Lộ trình hoàn thành"
                value={profile.roadmapCount}
                meta="Cải thiện 25%"
              />
              <InfoCard
                icon={CheckCircle2}
                iconClassName="text-rose-600 bg-rose-50"
                label="Quiz đã hoàn thành"
                value={profile.quizzes}
                meta="Cải thiện 12%"
              />
              <InfoCard
                icon={Lightbulb}
                iconClassName="text-amber-600 bg-amber-50"
                label="Đóng góp được duyệt"
                value={profile.contributions}
                meta="Cải thiện 28%"
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-slate-900">
                      Thông tin tài khoản
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Bản tóm tắt cô đọng, không lặp lại bảng điều khiển học
                      tập.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 hover:bg-indigo-50"
                    onClick={() => handleProfileAction("Xem toàn bộ hồ sơ")}
                  >
                    Xem chi tiết
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <FieldCard label="Email" value={profile.email} />
                  <FieldCard label="Vai trò" value={profile.role} />
                  <FieldCard label="Vị trí" value={profile.location} />
                  <FieldCard label="Ngày tham gia" value={profile.joinDate} />
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-slate-700">
                      Mức độ hoàn thiện hồ sơ
                    </span>
                    <span className="font-bold text-indigo-600">
                      {xpCompletion}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all"
                      style={{ width: `${xpCompletion}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{profile.xp.toLocaleString()} XP</span>
                    <span>{profile.xpTarget.toLocaleString()} XP</span>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-slate-900">
                      Mục tiêu hôm nay
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Theo dõi mục tiêu cá nhân, không phải mục tiêu dashboard
                      chung.
                    </p>
                  </div>
                  <Target className="h-5 w-5 text-indigo-600" />
                </div>

                <div className="mt-5 rounded-3xl border border-indigo-100/50 bg-linear-to-br from-indigo-50 to-violet-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Hoàn thành hôm nay
                      </p>
                      <h3 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
                        {profileCompletion}%
                      </h3>
                    </div>

                    <div className="relative h-24 w-24 rounded-full border-8 border-white bg-white shadow-inner">
                      <div
                        className="absolute inset-0 rounded-full border-8 border-indigo-600/90"
                        style={{
                          clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% ${100 - profileCompletion}%, 50% 50%)`,
                        }}
                      />
                      <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white text-center">
                        <div>
                          <div className="text-lg font-bold text-slate-900">
                            {profile.todayMinutes}
                          </div>
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            phút
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-white/70 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-700">
                        Mục tiêu ngày
                      </span>
                      <span className="text-slate-500">
                        {profile.todayMinutes}/{profile.dailyGoalMinutes} phút
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all"
                        style={{ width: `${profileCompletion}%` }}
                      />
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      Mức độ hoàn thành theo mốc tối thiểu để giữ chuỗi học tập
                      ổn định.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <ActionPill
                    icon={BookOpen}
                    label="Tài liệu cá nhân"
                    onClick={() => handleProfileAction("Tài liệu cá nhân")}
                  />
                  <ActionPill
                    icon={Award}
                    label="Chứng chỉ"
                    onClick={() => handleProfileAction("Chứng chỉ")}
                  />
                  <ActionPill
                    icon={Settings}
                    label="Cài đặt tài khoản"
                    onClick={() => handleProfileAction("Cài đặt tài khoản")}
                  />
                  <ActionPill
                    icon={Target}
                    label="Mục tiêu cá nhân"
                    onClick={() => handleProfileAction("Mục tiêu cá nhân")}
                  />
                </div>
              </section>
            </div>
          </div>

          {/* Right sidebar removed to center profile content */}
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
