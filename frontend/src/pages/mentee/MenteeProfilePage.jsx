import {
  AlertCircle,
  Award,
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Edit3,
  FileQuestion,
  GraduationCap,
  Lightbulb,
  LoaderCircle,
  Mail,
  RefreshCw,
  Route,
  ShieldCheck,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import MenteeHeader from "../../components/mentee/MenteeHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getInitials(name) {
  return String(name || "Học viên")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(-2)
    .join("")
    .toUpperCase();
}

function MetricCard({ icon: Icon, label, value, description, colorClasses }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${colorClasses}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-slate-500">{label}</p>
          <p className="mt-0.5 text-xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
      <p className="mt-2 truncate text-[10px] text-slate-400">{description}</p>
    </div>
  );
}

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1.5 break-words text-sm font-semibold text-slate-800">{value || "Chưa cập nhật"}</p>
    </div>
  );
}

export default function MenteeProfilePage() {
  const { updateUser: updateAuthUser } = useAuth();
  const avatarInputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [editForm, setEditForm] = useState({ name: "", bio: "" });

  useEffect(() => {
    let active = true;
    userService
      .getMyMenteeProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setError("");
      })
      .catch((requestError) => {
        if (!active) return;
        console.error("Failed to load mentee profile:", requestError);
        setError(
          requestError.response?.data?.message ||
            "Không thể tải hồ sơ cá nhân.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [retryKey]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const openEdit = () => {
    if (!profile?.user) return;
    setEditForm({
      name: profile.user.name || "",
      bio: profile.user.bio || "",
    });
    setAvatarFile(null);
    setAvatarPreview("");
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    if (isSaving) return;
    setIsEditOpen(false);
    setAvatarFile(null);
    setAvatarPreview("");
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn một tệp hình ảnh");
      return;
    }
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = editForm.name.trim();
    const bio = editForm.bio.trim();
    if (name.length < 2) {
      toast.error("Tên hiển thị cần có ít nhất 2 ký tự");
      return;
    }

    setIsSaving(true);
    try {
      const userId = profile.user.id;
      const profileResponse = await userService.updateUser(userId, {
        name,
        bio: bio || null,
      });
      let updatedUser = profileResponse.data;

      if (avatarFile) {
        const avatarResponse = await userService.updateAvatar(userId, avatarFile);
        updatedUser = avatarResponse.data;
      }

      const refreshedProfile = await userService.getMyMenteeProfile();
      setProfile(refreshedProfile);
      updateAuthUser({
        ...updatedUser,
        avatarUrl: updatedUser.avatar || updatedUser.avatarUrl,
      });
      setIsEditOpen(false);
      setAvatarFile(null);
      setAvatarPreview("");
      toast.success("Đã cập nhật hồ sơ cá nhân");
    } catch (requestError) {
      console.error("Failed to update profile:", requestError);
      toast.error(
        requestError.response?.data?.message || "Không thể cập nhật hồ sơ",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F8FC]">
        <MenteeHeader />
        <main className="flex min-h-120 flex-col items-center justify-center gap-3">
          <LoaderCircle className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">Đang tải hồ sơ...</p>
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#F6F8FC]">
        <MenteeHeader />
        <main className="mx-auto flex min-h-120 max-w-lg flex-col items-center justify-center px-4 text-center">
          <AlertCircle className="h-10 w-10 text-rose-500" />
          <h1 className="mt-4 text-lg font-bold text-slate-900">Không thể tải hồ sơ</h1>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setRetryKey((value) => value + 1);
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </button>
        </main>
      </div>
    );
  }

  const { user, stats, recentCertificates } = profile;
  const displayedAvatar = avatarPreview || user.avatarUrl;
  const completedFields = [user.name, user.email, user.bio, user.avatarUrl].filter(Boolean).length;
  const profileCompletion = Math.round((completedFields / 4) * 100);
  const levelProgress = user.progressPercent ?? 0;

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-slate-800">
      <MenteeHeader />
      <main className="mx-auto w-full max-w-400 space-y-4 px-4 py-4 sm:px-6 sm:py-5 lg:px-8 xl:px-10">
        <section className="relative overflow-hidden rounded-3xl bg-[#635BFF] p-5 text-white shadow-xl sm:p-6">
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
              <div className="relative shrink-0">
                <div className="flex h-22 w-22 items-center justify-center overflow-hidden rounded-full border-4 border-white/20 bg-white/15 text-2xl font-bold shadow-xl">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                <button type="button" onClick={openEdit} className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-slate-700 shadow-lg hover:bg-white" aria-label="Cập nhật ảnh đại diện">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{user.name}</h1>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide">{user.role}</span>
                </div>
                <p className="mt-2 flex items-center justify-center gap-2 text-sm text-indigo-100 sm:justify-start"><Mail className="h-4 w-4" />{user.email}</p>
                <p className="mt-2 max-w-2xl text-sm leading-5 text-white/90">
                  {user.bio || "Bạn chưa thêm phần giới thiệu bản thân."}
                </p>
                <div className="mt-3 max-w-md rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-white">Level {user.level}</span>
                    <span className="text-indigo-100">{user.xpToNextLevel} XP để lên level {user.level + 1}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
                    <div className="h-full rounded-full bg-white" style={{ width: `${levelProgress}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-indigo-100">{user.xp.toLocaleString("vi-VN")} XP · Mốc tiếp theo {user.nextLevelXp.toLocaleString("vi-VN")} XP</p>
                </div>
                <p className="mt-2 text-xs text-indigo-100">Tham gia EduPath từ {formatDate(user.createdAt)}</p>
              </div>
            </div>
            <Button variant="white" size="sm" onClick={openEdit} className="justify-center text-white">
              <Edit3 className="h-4 w-4" />
              Chỉnh sửa hồ sơ
            </Button>
          </div>

          <div className="relative mt-5 grid grid-cols-2 gap-2.5 border-t border-white/10 pt-4 lg:grid-cols-4">
            {[
              [Star, "Tổng XP", user.xp.toLocaleString("vi-VN")],
              [TrendingUp, "Level", user.level],
              [Route, "Đã đăng ký", stats.enrolledRoadmapCount],
              [CheckCircle2, "Đã hoàn thành", stats.completedRoadmapCount],
            ].map(([Icon, label, value]) => (
              <div key={label} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10"><Icon className="h-4.5 w-4.5" /></div>
                <div><p className="text-[10px] text-white/60">{label}</p><p className="text-sm font-bold">{value}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={TrendingUp} label="Tiến độ trung bình" value={`${Math.round(stats.averageProgress)}%`} description={`Tính trên ${stats.enrolledRoadmapCount} lộ trình`} colorClasses="bg-violet-50 text-violet-600" />
          <MetricCard icon={BookOpen} label="Lộ trình đang học" value={stats.activeRoadmapCount} description="Các lộ trình chưa hoàn thành" colorClasses="bg-blue-50 text-blue-600" />
          <MetricCard icon={FileQuestion} label="Quiz đã vượt qua" value={stats.passedQuizCount} description="Số bài quiz khác nhau đã đạt" colorClasses="bg-emerald-50 text-emerald-600" />
          <MetricCard icon={Lightbulb} label="Đóng góp được duyệt" value={stats.approvedContributionCount} description={`${stats.totalContributionCount} đóng góp đã gửi`} colorClasses="bg-amber-50 text-amber-600" />
        </section>

        <section className="grid gap-4 xl:grid-cols-12">
          <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm xl:col-span-7 sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div><h2 className="text-lg font-bold text-slate-900">Thông tin tài khoản</h2><p className="mt-1 text-sm text-slate-500">Thông tin được lưu trong tài khoản EduPath của bạn.</p></div>
                <button type="button" onClick={openEdit} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">Chỉnh sửa</button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <DetailItem icon={Mail} label="Email" value={user.email} />
                <DetailItem icon={GraduationCap} label="Vai trò" value={user.role} />
                <DetailItem icon={ShieldCheck} label="Trạng thái" value={user.status === "ACTIVE" ? "Đang hoạt động" : user.status} />
                <DetailItem icon={CircleUserRound} label="Ngày tham gia" value={formatDate(user.createdAt)} />
              </div>
              <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
                <div className="flex items-center justify-between text-sm"><span className="font-semibold text-slate-700">Mức độ hoàn thiện hồ sơ</span><strong className="text-indigo-600">{profileCompletion}%</strong></div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${profileCompletion}%` }} /></div>
                {profileCompletion < 100 && <p className="mt-2 text-xs text-slate-500">Thêm ảnh đại diện và giới thiệu để hoàn thiện hồ sơ.</p>}
              </div>
          </div>

          <div className="xl:col-span-5">
            <div className="h-full rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between"><div><h2 className="text-lg font-bold text-slate-900">Chứng chỉ gần đây</h2><p className="mt-1 text-sm text-slate-500">Các lộ trình bạn đã hoàn thành.</p></div><Award className="h-5 w-5 text-amber-500" /></div>
              {recentCertificates.length ? (
                <div className="mt-4 space-y-2.5">
                  {recentCertificates.map((certificate) => (
                    <Link key={certificate.id} to={`/my-certificates/${certificate.id}`} className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-indigo-200 hover:bg-indigo-50/40">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600"><Award className="h-5 w-5" /></div>
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800 group-hover:text-indigo-700">{certificate.learningPathTitle}</p><p className="mt-1 text-[11px] text-slate-400">Cấp ngày {formatDate(certificate.issuedAt)}</p></div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                  ))}
                  <Link to="/my-certificates" className="flex items-center justify-center gap-2 pt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800">Xem tất cả chứng chỉ<ChevronRight className="h-4 w-4" /></Link>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-200 py-7 text-center">
                  <Award className="mx-auto h-9 w-9 text-slate-300" />
                  <p className="mt-3 text-sm font-semibold text-slate-700">Bạn chưa có chứng chỉ</p>
                  <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-500">Hoàn thành một lộ trình để nhận chứng chỉ đầu tiên.</p>
                  <Link to="/roadmaps" className="mt-4 inline-block text-xs font-semibold text-indigo-600">Tiếp tục học</Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {isEditOpen && (
        <div className="fixed inset-0 z-60 flex items-end justify-center bg-slate-950/50 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
              <div><p className="text-xs font-bold uppercase tracking-wide text-indigo-600">Hồ sơ cá nhân</p><h2 id="edit-profile-title" className="mt-1 text-xl font-bold text-slate-900">Chỉnh sửa thông tin</h2><p className="mt-1 text-sm text-slate-500">Tên, giới thiệu và ảnh đại diện sẽ được lưu vào tài khoản.</p></div>
              <button type="button" onClick={closeEdit} className="rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Đóng"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-indigo-100 font-bold text-indigo-700">
                    {displayedAvatar ? <img src={displayedAvatar} alt={user.name} className="h-full w-full object-cover" /> : getInitials(editForm.name)}
                  </div>
                  <div><p className="text-sm font-semibold text-slate-900">Ảnh đại diện</p><p className="mt-1 text-xs text-slate-500">Chọn ảnh JPG, PNG hoặc WebP.</p>{avatarFile && <p className="mt-1 max-w-52 truncate text-xs font-medium text-indigo-600">{avatarFile.name}</p>}</div>
                </div>
                <Button type="button" variant="secondary" size="sm" onClick={() => avatarInputRef.current?.click()}>Chọn ảnh</Button>
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Tên hiển thị" value={editForm.name} onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))} placeholder="Nhập tên của bạn" />
                <Input label="Email" type="email" value={user.email} disabled readOnly />
              </div>
              <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Giới thiệu bản thân</label><textarea rows="5" maxLength="500" value={editForm.bio} onChange={(event) => setEditForm((current) => ({ ...current, bio: event.target.value }))} placeholder="Chia sẻ ngắn gọn về bản thân và mục tiêu học tập" className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" /><p className="mt-1 text-right text-[11px] text-slate-400">{editForm.bio.length}/500</p></div>
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end"><Button type="button" variant="secondary" onClick={closeEdit}>Hủy</Button><Button type="submit" isLoading={isSaving}>Lưu thay đổi</Button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
