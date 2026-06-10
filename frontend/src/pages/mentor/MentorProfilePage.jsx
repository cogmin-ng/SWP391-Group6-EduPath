import { Edit3, Star, X, Camera, Sparkles, MapPin, CalendarDays, BookOpen, Award, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { userService } from '../../services/userService';

const PROFILE_STORAGE_KEY = "mentor_profile_overrides";

const readStoredProfile = (fallback) => {
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!stored) return fallback;

  try {
    const parsed = JSON.parse(stored);
    return {
      ...fallback,
      name: parsed.name ?? fallback.name,
      email: parsed.email ?? fallback.email,
        major: parsed.major ?? fallback.major,
        termStatus: parsed.termStatus ?? fallback.termStatus,
      title: parsed.title ?? fallback.title,
      bio: parsed.bio ?? fallback.bio,
      location: parsed.location ?? fallback.location,
      avatar: parsed.avatar ?? fallback.avatar,
    };
  } catch {
    return fallback;
  }
};

const MentorProfilePage = () => {
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

  const baseProfile = {
    name: authUser?.name || 'Dr. Aris Thorne',
    email: authUser?.email || 'mentor@example.com',
    title: authUser?.title || 'Senior Design Mentor',
    avatar: authUser?.avatarUrl || authUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    bio: authUser?.bio || 'Chuyên gia về Chiến lược Sản phẩm và UI/UX với hơn 10 năm kinh nghiệm dẫn dắt các đội ngũ thiết kế tại các tập đoàn công nghệ hàng đầu toàn cầu.',
    location: authUser?.location || 'Hà Nội, Việt Nam',
    joinDate: authUser?.joinDate || '15/03/2024',
    students: '124',
    roadmaps: 12,
    rating: 4.9,
    reviewCount: 2,
    major: authUser?.major || 'UI/UX Design',
    termStatus: authUser?.termStatus || 'Đã tốt nghiệp',
    contributions: 32,
    roadmapCount: 12,
    xp: 12450,
    quizzes: 54,
    specialties: [
      { label: 'UI Design', color: 'bg-blue-100 text-blue-700' },
      { label: 'UX Research', color: 'bg-purple-100 text-purple-700' },
      { label: 'Figma', color: 'bg-pink-100 text-pink-700' },
      { label: 'Product Strategy', color: 'bg-indigo-100 text-indigo-700' },
      { label: 'Mentorship', color: 'bg-green-100 text-green-700' },
      { label: 'Design Systems', color: 'bg-amber-100 text-amber-700' },
      { label: 'Prototyping', color: 'bg-red-100 text-red-700' },
    ],
    reviews: [
      {
        stars: 5,
        count: 2,
        text: '"Cách Dr. Aris giải thích về Design Systems thực sự mang tư duy của mình."',
        author: '— Nguyễn Anh Minh',
      },
      {
        stars: 5,
        count: 1,
        text: '"Lộ trình học rất rõ ràng, không bị ngoài kiến thức. Mentor hỗ trợ rất nhiệt tình."',
        author: '— Trần Thị Lan',
      },
    ],
    roadmapList: [
      { title: 'UI Fundamentals', nodes: 24, emoji: '🎨', students: 450 },
      { title: 'Advanced Prototyping', nodes: 18, emoji: '🎭', students: 320 },
      { title: 'Design Systems at Scale', nodes: 32, emoji: '◆', students: 210 },
      { title: 'Career in UX Strategy', nodes: 15, emoji: '🚀', students: 580 },
    ],
  };

  const [profileData, setProfileData] = useState(() =>
    readStoredProfile({
      name: baseProfile.name,
      email: baseProfile.email,
      major: baseProfile.major,
      termStatus: baseProfile.termStatus,
      title: baseProfile.title,
      bio: baseProfile.bio,
      location: baseProfile.location,
      avatar: baseProfile.avatar,
    }),
  );

  const [editForm, setEditForm] = useState(() => ({
    name: baseProfile.name,
    email: baseProfile.email,
    title: baseProfile.title,
    bio: baseProfile.bio,
    location: baseProfile.location,
    major: baseProfile.major,
    termStatus: baseProfile.termStatus,
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
      title: profile.title,
      bio: profile.bio,
      location: profile.location,
      major: profile.major,
      termStatus: profile.termStatus,
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
        title: editForm.title.trim() || baseProfile.title,
        bio: editForm.bio.trim() || baseProfile.bio,
        location: editForm.location.trim() || baseProfile.location,
        major: editForm.major?.trim() || baseProfile.major,
        termStatus: editForm.termStatus?.trim() || baseProfile.termStatus,
        avatar: nextAvatarUrl,
      };

      setProfileData(nextProfile);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
      if (authUser?.id) {
        updateUser({
          ...authUser,
          name: nextProfile.name,
          email: nextProfile.email,
          avatarUrl: nextAvatarUrl,
          avatar: nextAvatarUrl,
          bio: nextProfile.bio,
          location: nextProfile.location,
          major: nextProfile.major,
          termStatus: nextProfile.termStatus,
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
    <div className="min-h-screen bg-[#F6F8FC] text-slate-900">
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

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <section className="relative overflow-hidden rounded-[2rem] bg-[#635BFF] p-6 text-white shadow-xl sm:p-8">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute bottom-[-12%] left-1/4 h-56 w-56 rounded-full bg-violet-400/20 blur-2xl" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white/20 bg-slate-900 shadow-2xl shadow-slate-950/10 sm:h-28 sm:w-28">
                  <img
                    src={displayedAvatarUrl}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-3 text-center sm:text-left">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                      {profile.name}
                    </h1>
                    <span className="mx-auto rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-100 sm:mx-0">
                      Mentor
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
                <button
                  onClick={handleEditClick}
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  <Edit3 className="h-4 w-4" />
                  Chỉnh sửa hồ sơ
                </button>
              </div>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <InfoCard
              icon={BookOpen}
              iconClassName="text-indigo-600 bg-indigo-50"
              label="Số Lộ Trình"
              value={profile.roadmapCount}
              meta="Cải thiện 18%"
            />
            <InfoCard
              icon={Award}
              iconClassName="text-emerald-600 bg-emerald-50"
              label="Đóng Góp Được Duyệt"
              value={profile.contributions}
              meta="Cải thiện 25%"
            />
            <InfoCard
              icon={Users}
              iconClassName="text-rose-600 bg-rose-50"
              label="Tổng Số Học Viên"
              value={profile.students}
              meta="Cải thiện 12%"
            />
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Thông tin tài khoản</h2>
                <p className="text-sm text-slate-500 mt-2">
                  Thông tin cá nhân và chi tiết tài khoản mentor.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Email
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {profile.email}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Vai trò
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Mentor
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Vị trí
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {profile.location}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Ngày tham gia
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {profile.joinDate}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Chuyên ngành
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {profile.major}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Kỳ học hiện tại
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  {profile.termStatus}
                </div>
              </div>
            </div>
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
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder="Nhập email"
                />
                <Input
                  label="Chức danh"
                  value={editForm.title}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Ví dụ: Senior Design Mentor"
                />
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
                <Input
                  label="Chuyên ngành"
                  value={editForm.major}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      major: event.target.value,
                    }))
                  }
                  placeholder="Ví dụ: UI/UX Design"
                />
                <Input
                  label="Kì học / Trạng thái"
                  value={editForm.termStatus}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      termStatus: event.target.value,
                    }))
                  }
                  placeholder="Ví dụ: Đang học / Đã tốt nghiệp"
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

export default MentorProfilePage;
