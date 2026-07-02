import { Edit3, Star, X, Camera, Sparkles, MapPin, CalendarDays, BookOpen, Award, Users, Mail, GraduationCap, Briefcase, Plus, Hash, Info } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { userService } from '../../services/userService';
import { getMentorDashboardStats, getMentorRoadmaps } from '../../services/roadmapService';
import { mentorApplicationService } from '../../services/mentorApplicationService';

// Local storage overrides are now scoped per user ID to prevent account data mixing

const getStatusBadge = (status) => {
  switch (status) {
    case 'PUBLISHED':
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Đã xuất bản</span>;
    case 'APPROVED':
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Đã duyệt</span>;
    case 'PENDING':
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Đang chờ duyệt</span>;
    case 'REJECTED':
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">Bị từ chối</span>;
    default:
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">Bản nháp</span>;
  }
};

export default function MentorProfilePage() {
  const { user: authUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [toast, setToast] = useState(null);

  // Dynamic dashboard stats state
  const [stats, setStats] = useState({
    totalRoadmaps: 0,
    approvedContributions: 0,
    totalStudents: 0,
  });

  // Dynamic roadmaps state
  const [roadmaps, setRoadmaps] = useState([]);
  const [roadmapsLoading, setRoadmapsLoading] = useState(true);

  // Dynamic advisor application details state
  const [application, setApplication] = useState(null);
  const [loadingApp, setLoadingApp] = useState(true);

  const baseProfile = {
    name: authUser?.name || 'Dr. Aris Thorne',
    email: authUser?.email || 'mentor@example.com',
    title: authUser?.title || 'Senior Design Mentor',
    avatar: authUser?.avatarUrl || authUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    bio: authUser?.bio || 'Chuyên gia về Chiến lược Sản phẩm và UI/UX với hơn 10 năm kinh nghiệm dẫn dắt các đội ngũ thiết kế tại các tập đoàn công nghệ hàng đầu toàn cầu.',
    location: authUser?.location || 'Hà Nội, Việt Nam',
    joinDate: authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString('vi-VN') : '15/03/2024',
    major: authUser?.major || 'UI/UX Design',
    termStatus: authUser?.termStatus || 'Đã tốt nghiệp',
    specialties: [
      { label: 'UI Design', color: 'bg-blue-50 text-blue-700 border-blue-200/50' },
      { label: 'UX Research', color: 'bg-purple-50 text-purple-700 border-purple-200/50' },
      { label: 'Figma Mastery', color: 'bg-pink-50 text-pink-700 border-pink-200/50' },
      { label: 'Product Strategy', color: 'bg-indigo-50 text-indigo-700 border-indigo-200/50' },
      { label: 'Agile Mentorship', color: 'bg-green-50 text-green-700 border-green-200/50' },
      { label: 'Design Systems', color: 'bg-amber-50 text-amber-700 border-amber-200/50' },
      { label: 'Prototyping', color: 'bg-red-50 text-red-700 border-red-200/50' },
    ],
    reviews: [
      {
        stars: 5,
        text: '"Cách Mentor giải thích về Design Systems thực sự mang tư duy và phương pháp học của mình lên tầm cao mới."',
        author: 'Nguyễn Anh Minh',
        date: '28/06/2026',
      },
      {
        stars: 5,
        text: '"Lộ trình học rất rõ ràng, không bị quá tải kiến thức. Mentor hỗ trợ giải đáp thắc mắc rất nhiệt tình."',
        author: 'Trần Thị Lan',
        date: '20/06/2026',
      },
    ],
  };

  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    if (authUser?.id) {
      const stored = localStorage.getItem(`mentor_profile_overrides_${authUser.id}`);
      if (stored) {
        try {
          setProfileData(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse profile overrides:', e);
        }
      } else {
        setProfileData({});
      }
    }
  }, [authUser?.id]);

  const [editForm, setEditForm] = useState(() => ({
    name: baseProfile.name,
    email: baseProfile.email,
    title: baseProfile.title,
    bio: baseProfile.bio,
    location: baseProfile.location,
    major: baseProfile.major,
    termStatus: baseProfile.termStatus,
  }));

  // Map application details if available, falling back to base/local overrides
  const profile = {
    ...baseProfile,
    title: profileData.title || baseProfile.title,
    location: profileData.location || baseProfile.location,
    major: application?.specialization || profileData.major || baseProfile.major,
    termStatus: application?.currentSemester || profileData.termStatus || baseProfile.termStatus,
    specialties: application?.mentorSubjects && application.mentorSubjects.length > 0 
      ? application.mentorSubjects.map(ms => ({ label: ms.subject.name, color: 'bg-indigo-50 text-indigo-700 border-indigo-200/50' }))
      : baseProfile.specialties,
  };

  // Fetch stats, roadmaps, and advisor application dynamically on load
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await getMentorDashboardStats();
        if (statsData) {
          setStats(statsData);
        }
      } catch (err) {
        console.error('Failed to fetch mentor dashboard stats:', err);
      }

      try {
        setRoadmapsLoading(true);
        const roadmapsData = await getMentorRoadmaps(0, 10);
        if (roadmapsData && roadmapsData.roadmaps) {
          setRoadmaps(roadmapsData.roadmaps);
        }
      } catch (err) {
        console.error('Failed to fetch mentor roadmaps:', err);
      } finally {
        setRoadmapsLoading(false);
      }

      try {
        setLoadingApp(true);
        const appData = await mentorApplicationService.getMyApplication();
        if (appData) {
          setApplication(appData);
        }
      } catch (err) {
        console.error('Failed to fetch mentor application details:', err);
      } finally {
        setLoadingApp(false);
      }
    };

    fetchDashboardData();
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
      major: application?.specialization || profile.major,
      termStatus: application?.currentSemester || profile.termStatus,
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
        const updatedUser = response.data || response;
        if (!updatedUser) {
          throw new Error("Avatar upload response is invalid");
        }
        nextAvatarUrl = updatedUser.avatarUrl || updatedUser.avatar || nextAvatarUrl;
      }

      const nextProfile = {
        title: editForm.title.trim() || baseProfile.title,
        location: editForm.location.trim() || baseProfile.location,
        major: editForm.major?.trim() || baseProfile.major,
        termStatus: editForm.termStatus?.trim() || baseProfile.termStatus,
      };

      setProfileData(nextProfile);
      if (authUser?.id) {
        localStorage.setItem(`mentor_profile_overrides_${authUser.id}`, JSON.stringify(nextProfile));

        await userService.updateUser(authUser.id, {
          name: editForm.name.trim() || baseProfile.name,
          bio: editForm.bio.trim() || baseProfile.bio,
        });

        updateUser({
          ...authUser,
          name: editForm.name.trim() || baseProfile.name,
          email: editForm.email.trim() || baseProfile.email,
          avatarUrl: nextAvatarUrl,
          avatar: nextAvatarUrl,
          bio: editForm.bio.trim() || baseProfile.bio,
        });
      }

      setToast({
        type: "success",
        message: "Cập nhật hồ sơ cá nhân thành công!",
      });
      setIsEditModalOpen(false);
      clearAvatarSelection();
    } catch (error) {
      console.error(error);
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-xl border transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-600 text-white"
              : "border-rose-200 bg-rose-600 text-white"
          }`}
        >
          <Sparkles className="h-5 w-5 text-amber-200" />
          <span>{toast.message}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          {/* Hero Banner Profile Section */}
          <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 p-6 text-white shadow-xl shadow-indigo-100 sm:p-8 md:p-10">
            {/* Background elements */}
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
            <div className="absolute bottom-[-10%] left-1/3 h-56 w-56 rounded-full bg-violet-300/20 blur-2xl" />
            
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center text-center sm:text-left">
                {/* Avatar */}
                <div className="relative mx-auto sm:mx-0 h-28 w-28 overflow-hidden rounded-3xl border-4 border-white/20 bg-slate-900 shadow-2xl transition-transform hover:scale-105 duration-300">
                  <img
                    src={displayedAvatarUrl}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Profile info */}
                <div className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-center sm:justify-start">
                    <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                      {profile.name}
                    </h1>
                    <span className="mx-auto sm:mx-0 inline-flex items-center rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-100 backdrop-blur-sm">
                      Mentor
                    </span>
                  </div>

                  <p className="text-indigo-100/90 text-sm font-semibold flex items-center justify-center sm:justify-start gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-200" />
                    <span>{profile.title}</span>
                  </p>

                  <p className="max-w-xl text-sm leading-relaxed text-indigo-50/90 font-medium">
                    {profile.bio}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-white/80 pt-1">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-indigo-300" />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4 text-indigo-300" />
                      Tham gia: {profile.joinDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit button */}
              <div className="flex-shrink-0 flex justify-center">
                <button
                  onClick={handleEditClick}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white hover:bg-slate-50 px-6 py-3.5 text-sm font-bold text-indigo-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-950/10 cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" />
                  Chỉnh sửa hồ sơ
                </button>
              </div>
            </div>
          </section>

          {/* Quick Statistics Row */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard
              icon={BookOpen}
              iconBg="bg-indigo-50 text-indigo-600"
              label="Số Lộ Trình"
              value={stats.totalRoadmaps ?? profile.roadmapCount}
              meta="Hoạt động"
            />
            <InfoCard
              icon={Award}
              iconBg="bg-emerald-50 text-emerald-600"
              label="Đóng Góp Được Duyệt"
              value={stats.approvedContributions ?? 32}
              meta="Đóng góp"
            />
            <InfoCard
              icon={Users}
              iconBg="bg-rose-50 text-rose-600"
              label="Tổng Số Học Viên"
              value={stats.totalStudents ?? 124}
              meta="Theo dõi"
            />
          </div>

          {/* Main 2-Column Grid Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Account Information Card */}
              <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Thông tin tài khoản</h2>
                  <p className="text-slate-400 text-xs mt-1">Thông tin cá nhân và chi tiết tài khoản mentor.</p>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailItem icon={Mail} label="EMAIL" value={profile.email} />
                  <DetailItem icon={GraduationCap} label="VAI TRÒ" value="Mentor" />
                  <DetailItem icon={MapPin} label="VỊ TRÍ" value={profile.location} />
                  <DetailItem icon={CalendarDays} label="NGÀY THAM GIA" value={profile.joinDate} />
                  <DetailItem icon={BookOpen} label="CHUYÊN NGÀNH" value={profile.major} />
                  <DetailItem icon={Info} label="KỲ HỌC HIỆN TẠI" value={profile.termStatus} />
                </div>
              </div>

              {/* Mentor Specialties Badges */}
              <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 md:p-8 space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Chuyên môn & kỹ năng</h2>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {profile.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center rounded-2xl border px-4 py-2 text-xs font-bold tracking-wide transition-colors ${specialty.color}`}
                    >
                      # {specialty.label}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (1/3 width) */}
            <div className="lg:col-span-1 space-y-8">
              
              {/* Mentee Testimonials / Reviews */}
              <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 md:p-8 space-y-5">
                <h2 className="text-xl font-bold text-slate-900">Đánh giá gần đây</h2>
                
                <div className="space-y-4">
                  {profile.reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex flex-col justify-between gap-3 shadow-sm hover:shadow transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[...Array(review.stars)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">{review.date}</span>
                      </div>
                      
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        {review.text}
                      </p>
                      
                      <p className="text-[11px] font-bold text-slate-800 text-right">
                        — {review.author}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal Dialog */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 px-4 py-4 backdrop-blur-sm sm:items-center sm:py-6 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl overflow-hidden rounded-[30px] bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Hồ sơ cá nhân</p>
                <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900">Chỉnh sửa hồ sơ</h3>
                <p className="mt-1 text-xs text-slate-400">Cập nhật thông tin chi tiết hiển thị trên trang hồ sơ của bạn.</p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form className="overflow-y-auto flex-1 p-6 space-y-6" onSubmit={handleProfileSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Họ và tên"
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập tên hiển thị"
                  required
                />
                <Input
                  label="Địa chỉ Email"
                  type="email"
                  value={editForm.email}
                  disabled
                  placeholder="Không thể chỉnh sửa Email"
                />
                <Input
                  label="Chức danh hiển thị"
                  value={editForm.title}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Ví dụ: Senior Design Mentor"
                />
                <Input
                  label="Vị trí làm việc"
                  value={editForm.location}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Ví dụ: Hà Nội, Việt Nam"
                />
                <Input
                  label="Chuyên ngành chính"
                  value={editForm.major}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, major: e.target.value }))}
                  placeholder="Ví dụ: UI/UX Design"
                />
                <Input
                  label="Học vị / Kỳ học hiện tại"
                  value={editForm.termStatus}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, termStatus: e.target.value }))}
                  placeholder="Ví dụ: Đang học / Đã tốt nghiệp"
                />
              </div>

              {/* Avatar Uploader Section */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-sm flex-shrink-0">
                      {displayedAvatarUrl ? (
                        <img
                          src={displayedAvatarUrl}
                          alt={profile.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-lg font-bold text-indigo-600">
                          {profile.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Ảnh đại diện</p>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                        Tải ảnh mới từ máy để đồng bộ với Cloudinary.
                      </p>
                      {avatarFile && (
                        <p className="mt-1.5 text-xs font-semibold text-indigo-600 truncate max-w-[200px]">
                          Đã chọn: {avatarFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleAvatarPick}
                      className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 shadow-sm cursor-pointer transition-colors"
                    >
                      Đổi ảnh
                    </button>
                    {avatarFile && (
                      <button
                        type="button"
                        onClick={clearAvatarSelection}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Hủy chọn
                      </button>
                    )}
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

              {/* Bio Field */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Giới thiệu bản thân</label>
                <textarea
                  rows="4"
                  value={editForm.bio}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Viết vài dòng giới thiệu ngắn gọn về thế mạnh hoặc kinh nghiệm của bạn..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditModalOpen(false)}
                  className="justify-center sm:min-w-[120px]"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  isLoading={isSavingProfile}
                  className="justify-center sm:min-w-[150px]"
                >
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components
function InfoCard({ icon: Icon, iconBg, label, value, meta }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center justify-between group hover:shadow-md hover:border-indigo-100/50 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
          <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
            {value}
          </h3>
        </div>
      </div>
      <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
        {meta}
      </span>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 hover:bg-slate-50 transition-colors flex items-center gap-3">
      <div className="h-9 w-9 bg-white border border-slate-200/50 rounded-xl flex items-center justify-center text-slate-500 shadow-sm flex-shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
        <div className="mt-1 text-sm font-semibold text-slate-800 truncate">{value || 'Chưa cập nhật'}</div>
      </div>
    </div>
  );
}
