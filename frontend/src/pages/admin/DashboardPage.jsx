import { useEffect, useRef, useState } from 'react';
import { Edit3, Camera, Sparkles, MapPin, CalendarDays, X, Shield, Mail } from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard';
import { useAuth } from '../../hooks/useAuth';
import { adminService } from '../../services/adminService';
import { userService } from '../../services/userService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const PROFILE_STORAGE_KEY = "admin_profile_overrides";

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
      avatar: parsed.avatar ?? fallback.avatar,
    };
  } catch {
    return fallback;
  }
};

const DashboardPage = () => {
  const { user: authUser, updateUser } = useAuth();
  const avatarInputRef = useRef(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [toast, setToast] = useState(null);

  const [dashboardStats, setDashboardStats] = useState([
    { id: 1, label: 'Tổng người dùng', value: '...', icon: 'Users', color: 'bg-blue-500', trend: '' },
    { id: 2, label: 'Tổng người hướng dẫn', value: '...', icon: 'UserCheck', color: 'bg-emerald-500', trend: '' },
    { id: 3, label: 'Tổng người học', value: '...', icon: 'GraduationCap', color: 'bg-indigo-500', trend: '' },
    { id: 4, label: 'Tổng lộ trình', value: '...', icon: 'Map', color: 'bg-amber-500', trend: '' },
  ]);

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await adminService.getDashboardStats();
        setDashboardStats([
          { id: 1, label: 'Tổng người dùng', value: stats.totalUsers ?? 0, icon: 'Users', color: 'bg-blue-500', trend: '' },
          { id: 2, label: 'Tổng người hướng dẫn', value: stats.totalMentors ?? 0, icon: 'UserCheck', color: 'bg-emerald-500', trend: '' },
          { id: 3, label: 'Tổng người học', value: stats.totalMentees ?? 0, icon: 'GraduationCap', color: 'bg-indigo-500', trend: '' },
          { id: 4, label: 'Tổng lộ trình', value: stats.totalRoadmaps ?? 0, icon: 'Map', color: 'bg-amber-500', trend: '' },
        ]);
        if (stats.recentActivities) {
          setActivities(stats.recentActivities);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!avatarPreview) return undefined;
    return () => window.URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  const baseProfile = {
    name: authUser?.name || 'Administrator',
    email: authUser?.email || 'admin@edupath.vn',
    avatar: authUser?.avatarUrl || authUser?.avatar || '',
    bio: authUser?.bio || 'Ban quản trị hệ thống EduPath. Quản lý, điều phối hoạt động dạy học, phê duyệt lộ trình và hỗ trợ người dùng.',
    location: authUser?.location || 'Hà Nội, Việt Nam',
    joinDate: authUser?.joinDate ? new Date(authUser.joinDate).toLocaleDateString('vi-VN') : '01/01/2026',
    role: 'Quản trị viên',
  };

  const [profileData, setProfileData] = useState(() =>
    readStoredProfile({
      name: baseProfile.name,
      email: baseProfile.email,
      bio: baseProfile.bio,
      location: baseProfile.location,
      avatar: baseProfile.avatar,
    })
  );

  const [editForm, setEditForm] = useState(() => ({
    name: baseProfile.name,
    email: baseProfile.email,
    bio: baseProfile.bio,
    location: baseProfile.location,
  }));

  const profile = {
    ...baseProfile,
    ...profileData,
  };

  const displayedAvatarUrl = avatarPreview || profile.avatar;

  const handleEditClick = () => {
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
      let nextAvatarUrl = profile.avatar;

      if (avatarFile && authUser?.id) {
        const response = await userService.updateAvatar(authUser.id, avatarFile);
        const updatedUser = response.data;
        if (!updatedUser) {
          throw new Error("Avatar upload response is invalid");
        }
        updateUser(updatedUser);
        nextAvatarUrl = updatedUser.avatarUrl || updatedUser.avatar || nextAvatarUrl;
      }

      const nextProfile = {
        name: editForm.name.trim() || baseProfile.name,
        email: editForm.email.trim() || baseProfile.email,
        bio: editForm.bio.trim() || baseProfile.bio,
        location: editForm.location.trim() || baseProfile.location,
        avatar: nextAvatarUrl,
      };

      setProfileData(nextProfile);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
      if (authUser?.id) {
        // Also update backend database
        await userService.updateUser(authUser.id, {
          name: nextProfile.name,
          email: nextProfile.email,
          bio: nextProfile.bio,
          location: nextProfile.location,
        });

        updateUser({
          ...authUser,
          name: nextProfile.name,
          email: nextProfile.email,
          avatarUrl: nextAvatarUrl,
          avatar: nextAvatarUrl,
          bio: nextProfile.bio,
          location: nextProfile.location,
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
          "Không thể cập nhật hồ sơ.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {toast ? (
        <div
          className={`fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-xl ${toast.type === "success"
            ? "border-emerald-300 bg-emerald-600 text-white"
            : "border-indigo-200 bg-white text-slate-700"
            }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>{toast.message}</span>
        </div>
      ) : null}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tổng quan Bảng điều khiển</h1>
        <p className="text-sm text-slate-500 mt-1">
          Xin chào, hôm nay là ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Admin Profile Section */}
      <div className="grid gap-6 lg:grid-cols-3 items-start">
        {/* Profile Card Summary */}
        <section className="lg:col-span-2 relative overflow-hidden rounded-[2rem] bg-[#635BFF] p-6 text-white shadow-xl flex flex-col justify-between">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute bottom-[-12%] left-1/4 h-48 w-48 rounded-full bg-violet-400/20 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="relative h-20 w-20 shrink-0 mx-auto sm:mx-0 overflow-hidden rounded-full border-[3px] border-white/20 bg-slate-900 shadow-2xl">
              {displayedAvatarUrl ? (
                <img
                  src={displayedAvatarUrl}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/10 text-xl font-bold uppercase">
                  {profile.name
                    ?.split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              )}
            </div>
            <div className="space-y-2.5 text-center sm:text-left flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                  {profile.name}
                </h2>
                <span className="mx-auto rounded-full border border-white/20 bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-100 sm:mx-0 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {profile.role}
                </span>
              </div>
              <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-indigo-100 sm:justify-start">
                <Mail className="h-4 w-4" />
                {profile.email}
              </p>
              <p className="text-sm leading-relaxed text-white/90">
                {profile.bio}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-0.5 text-xs font-medium text-white/85 sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex justify-end mt-5 sm:mt-3">
            <button
              onClick={handleEditClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 shadow-sm cursor-pointer border-0"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Chỉnh sửa hồ sơ
            </button>
          </div>
        </section>

        {/* Recent Activities */}
        <section className="rounded-[2rem] bg-white border border-slate-200/80 shadow-sm p-6 flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Hoạt động gần đây</h3>
          </div>
          <div className="flex-1 space-y-4 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
            {activities.length > 0 ? activities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{activity.user}</span>
                    <span>•</span>
                    <span>{new Date(activity.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${activity.status === 'Thành công' || activity.status === 'Đã duyệt'
                    ? 'bg-emerald-100 text-emerald-700'
                    : activity.status === 'Đang chờ' || activity.status === 'Đang xem xét'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-700'
                    }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-sm text-slate-500 italic">Không có hoạt động nào gần đây.</p>
            )}
          </div>
        </section>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-6 animate-in fade-in duration-200">
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
                  Cập nhật thông tin hiển thị của Admin.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 cursor-pointer border-0 bg-transparent flex items-center justify-center"
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
                  label="Tên"
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
                  readOnly
                  disabled
                  className="font-bold border-slate-300 bg-slate-100 text-slate-700"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white bg-white shadow-sm shrink-0">
                      {displayedAvatarUrl ? (
                        <img
                          src={displayedAvatarUrl}
                          alt={profile.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-indigo-50 text-lg font-bold text-indigo-600">
                          {profile.name
                            ?.split(" ")
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
};

export default DashboardPage;
