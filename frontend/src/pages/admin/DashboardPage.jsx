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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
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

      {/* Admin Profile Section / Welcome Banner */}
      <div className="relative overflow-hidden bg-[#635BFF] rounded-3xl text-white p-5 sm:p-6 md:p-8 shadow-xl mb-8">
        <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute left-[30%] bottom-[-20%] w-56 h-56 rounded-full bg-violet-400/20 blur-2xl" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>EduPath Admin Portal • Bảng điều khiển</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold font-display tracking-tight md:text-4xl">
                Xin Chào, {profile.name} 👋
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed">
                Hôm nay là ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-[3px] border-white/20 bg-slate-900 shadow-xl">
                {displayedAvatarUrl ? (
                  <img
                    src={displayedAvatarUrl}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/10 text-xl font-bold uppercase text-white">
                    {profile.name?.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-center sm:justify-start">
                  <span className="font-bold flex items-center justify-center sm:justify-start gap-1">
                    <Shield className="h-4 w-4" /> {profile.role}
                  </span>
                  <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="h-3 w-3" /> {profile.location}
                  </span>
                </div>
                <p className="text-sm text-blue-50/90 mt-2 flex items-center justify-center sm:justify-start gap-1.5 w-full">
                  <Mail className="h-4 w-4" /> {profile.email}
                </p>
                <p className="text-sm italic text-blue-50/90 mt-1">{profile.bio}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 pt-2">
              <button
                onClick={handleEditClick}
                className="w-full sm:w-auto bg-white hover:bg-blue-50 text-indigo-700 font-semibold py-2.5 px-5 rounded-xl text-sm transition duration-200 flex items-center justify-center gap-1.5 shadow-md cursor-pointer border-0"
              >
                <Edit3 className="w-4 h-4" />
                Chỉnh sửa hồ sơ
              </button>
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-5 justify-center items-center">
            <div className="relative w-full max-w-md h-60 bg-slate-900/30 rounded-2xl flex items-center justify-center border border-white/10">
              <div className="absolute w-48 h-32 bg-indigo-950/70 border border-indigo-400/30 rounded-lg shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute top-2 left-3 flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <div className="text-left font-mono text-[10px] text-indigo-300 space-y-1.5 p-3 mt-4">
                  <p className="text-yellow-400">const role = "ADMIN";</p>
                  <p className="text-sky-300">
                    import {"{ Dashboard }"} from "edupath";
                  </p>
                  <p className="text-emerald-400">
                    console.log("Manage the platform!");
                  </p>
                </div>
              </div>
              <div className="absolute w-56 h-12 border-[3px] border-violet-400/50 rounded-full rotate-[-15deg] animate-pulse" />
              <div className="absolute right-4 bottom-4 w-12 h-12 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                <Shield className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat) => (
              <StatsCard key={stat.id} {...stat} />
            ))}
          </div>

          {/* Recent Activities */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Hoạt động gần đây</h3>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto custom-scrollbar">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-indigo-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{activity.action}</p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">{activity.user}</span>
                            <span>•</span>
                            <span>{new Date(activity.date).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                            activity.status === 'Thành công' || activity.status === 'Đã duyệt'
                              ? 'bg-emerald-50 text-emerald-600'
                              : activity.status === 'Đang chờ' || activity.status === 'Đang xem xét'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-slate-50 text-slate-600'
                          }`}
                        >
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 italic">
                    Không có hoạt động nào gần đây.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
