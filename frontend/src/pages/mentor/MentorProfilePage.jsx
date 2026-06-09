import { Edit3, Star, X, Camera, Sparkles } from 'lucide-react';
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
      title: parsed.title ?? fallback.title,
      bio: parsed.bio ?? fallback.bio,
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
    title: authUser?.title || 'Senior Design Mentor',
    avatar: authUser?.avatarUrl || authUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    bio: authUser?.bio || 'Chuyên gia về Chiến lược Sản phẩm và UI/UX với hơn 10 năm kinh nghiệm dẫn dắt các đội ngũ thiết kế tại các tập đoàn công nghệ hàng đầu toàn cầu.',
    students: '1,240+',
    roadmaps: 12,
    rating: 4.9,
    reviewCount: 2,
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
      title: baseProfile.title,
      bio: baseProfile.bio,
      avatar: baseProfile.avatar,
    }),
  );

  const [editForm, setEditForm] = useState(() => ({
    name: baseProfile.name,
    title: baseProfile.title,
    bio: baseProfile.bio,
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
      title: profile.title,
      bio: profile.bio,
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
        title: editForm.title.trim() || baseProfile.title,
        bio: editForm.bio.trim() || baseProfile.bio,
        avatar: nextAvatarUrl,
      };

      setProfileData(nextProfile);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
      if (authUser?.id) {
        updateUser({
          ...authUser,
          name: nextProfile.name,
          avatarUrl: nextAvatarUrl,
          avatar: nextAvatarUrl,
          bio: nextProfile.bio,
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
    <div className="space-y-6">
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
      {/* Profile Header Card */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex-shrink-0 overflow-hidden">
              <img 
                src={displayedAvatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">{profile.name}</h1>
              <p className="text-base text-slate-600 mt-1">{profile.title}</p>
              <p className="text-sm text-slate-600 mt-3 leading-6 max-w-xl">{profile.bio}</p>
            </div>
          </div>
          <button 
            onClick={handleEditClick}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-all flex-shrink-0">
            <Edit3 className="w-4 h-4" />
            Chỉnh sửa hồ sơ
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 border-t border-slate-200">
          <div className="px-8 py-4 border-r border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Tổng học viên</p>
            <p className="text-2xl font-bold text-indigo-600">{profile.students}</p>
          </div>
          <div className="px-8 py-4 border-r border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Lộ trình đã tạo</p>
            <p className="text-2xl font-bold text-indigo-600">{profile.roadmaps}</p>
          </div>
          <div className="px-8 py-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Đánh giá trung bình</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-indigo-600">{profile.rating}</p>
              <span className="text-xl">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - About & Specialties */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Về tôi</h2>
            <p className="text-slate-600 leading-7 mb-6">
              Triết lý giảng dạy của tôi tập trung vào "Đông chảy Nhân thức" (Cognitive Flow). Tôi tin rằng việc học không chỉ là biết thư kiến thức mà là xây dựng một hệ tu duy bằng vững. Trong hơn một thập kỷ làm việc với các chiến lược đổi từ tự duy thiết kế để các chiến lược sản phẩm phức tạp.
            </p>
            <p className="text-sm text-slate-600">
              Tại EduPath, mục tiêu của tôi là tạo ra những lộ trình học tập có nhân hoá, giúp bạn vượt qua những rào cản cần kỹ thuật để đạt tới đỉnh cao trong sự nghiệp thiết kế của mình.
            </p>
          </div>

          {/* Specialties Section */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Chuyên môn</h2>
            <div className="flex flex-wrap gap-2">
              {profile.specialties.map((item) => (
                <span 
                  key={item.label} 
                  className={`rounded-full px-4 py-2 text-sm font-medium ${item.color}`}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          {/* Roadmaps Section */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Lộ trình của tôi</h2>
              <a href="#" className="text-sm text-indigo-600 font-semibold hover:text-indigo-700">Xem tất cả →</a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {profile.roadmapList.map((roadmap) => (
                <div key={roadmap.title} className="rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition-all">
                  <div className="text-4xl mb-3">{roadmap.emoji}</div>
                  <h3 className="font-semibold text-slate-900 mb-2">{roadmap.title}</h3>
                  <p className="text-xs text-slate-500">
                    🔹 {roadmap.nodes} Nodes &nbsp;&nbsp;&nbsp; 👥 {roadmap.students} học viên
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Reviews */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Đánh giá</h2>
          <div className="space-y-6">
            {profile.reviews.map((review, idx) => (
              <div key={idx} className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(review.stars)].map((_, i) => (
                    <span key={i} className="text-base">⭐</span>
                  ))}
                  <span className="text-xs text-slate-500 ml-1">{review.count} {review.count === 1 ? 'người' : 'người'}</span>
                </div>
                <p className="text-sm text-slate-600 italic mb-2">{review.text}</p>
                <p className="text-xs text-slate-500">{review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

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
};

export default MentorProfilePage;
