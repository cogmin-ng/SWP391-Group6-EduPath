import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { GraduationCap, X, Clock, CheckCircle2, XCircle } from "lucide-react";

import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { mentorApplicationService } from "../../services/mentorApplicationService";

import {
  MentorHero,
  MentorInfoSection,
  SubjectMentorSection,
  AcademicAchievementSection,
  BioSection,
  EvidenceUploadSection,
} from "../../components/mentee/become_mentor";

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function BecomeMentorPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  /* ---- react-hook-form ---- */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.name || "",
      specialization: "",
      semester: "",
      bio: "",
      supportExperience: "",
    },
  });

  /* ---- data from API ---- */
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [existingApplication, setExistingApplication] = useState(undefined); // undefined = loading, null = none
  const [pageLoading, setPageLoading] = useState(true);

  /* ---- component states ---- */
  const [subjects, setSubjects] = useState([]);
  const [subjectError, setSubjectError] = useState(null);

  const [achievements, setAchievements] = useState([
    { subjectId: "", grade: "" },
  ]);

  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState("");

  /* ---- submit ---- */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { type, message }

  /* ---- fetch subjects + existing application on mount ---- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectList, myApp] = await Promise.all([
          mentorApplicationService.getSubjects(),
          mentorApplicationService.getMyApplication(),
        ]);
        setAvailableSubjects(subjectList || []);
        setExistingApplication(myApp || null);
      } catch {
        setAvailableSubjects([]);
        setExistingApplication(null);
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ---- submit handler ---- */
  const onSubmit = async (data) => {
    let hasError = false;

    // Validate subjects
    if (subjects.length === 0) {
      setSubjectError("Vui lòng thêm ít nhất 1 môn học muốn mentor.");
      hasError = true;
    } else {
      setSubjectError(null);
    }

    // Validate upload file
    if (!uploadFile) {
      setUploadError("Vui lòng tải lên bảng điểm hoặc minh chứng học tập.");
      hasError = true;
    }

    // Validate academic records
    const validRecords = achievements.filter(
      (a) => a.subjectId && a.grade !== ""
    );
    if (validRecords.length === 0) {
      hasError = true;
    }

    if (hasError) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      // 1. Upload transcript file first
      let transcriptUrl = "";
      if (uploadFile) {
        const uploaded = await mentorApplicationService.uploadTranscript(uploadFile);
        transcriptUrl = uploaded.url;
      }

      // 2. Submit the application
      await mentorApplicationService.submit({
        specialization: data.specialization,
        currentSemester: data.semester,
        bio: data.bio,
        experience: data.supportExperience,
        transcriptUrl,
        subjectIds: subjects.map((s) => s.id),
        academicRecords: validRecords.map((r) => ({
          subjectId: r.subjectId,
          grade: parseFloat(r.grade),
        })),
      });

      // 3. Refresh application status
      const myApp = await mentorApplicationService.getMyApplication();
      setExistingApplication(myApp || null);

      setSubmitResult({
        type: "success",
        message:
          "Đơn đăng ký Mentor của bạn đã được gửi thành công! Chúng tôi sẽ xem xét và phản hồi sớm nhất.",
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        "Có lỗi xảy ra khi gửi đơn. Vui lòng thử lại sau.";
      setSubmitResult({
        type: "error",
        message: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================================================================ */
  /*  STATUS BANNER (when application already exists)                  */
  /* ================================================================ */

  const statusConfig = {
    PENDING: {
      icon: Clock,
      color: "amber",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-500",
      textColor: "text-amber-800",
      title: "Đơn đang chờ duyệt",
      description:
        "Đơn đăng ký Mentor của bạn đã được gửi và đang chờ Admin xem xét. Chúng tôi sẽ phản hồi sớm nhất có thể.",
    },
    APPROVED: {
      icon: CheckCircle2,
      color: "emerald",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconColor: "text-emerald-500",
      textColor: "text-emerald-800",
      title: "Đơn đã được duyệt",
      description:
        "Chúc mừng! Đơn đăng ký Mentor của bạn đã được phê duyệt. Bạn có thể bắt đầu tạo roadmap và hỗ trợ mentee.",
    },
    REJECTED: {
      icon: XCircle,
      color: "red",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-500",
      textColor: "text-red-800",
      title: "Đơn đã bị từ chối",
      description:
        "Rất tiếc, đơn đăng ký Mentor của bạn chưa được phê duyệt.",
    },
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  // Loading state
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  // If user already has an application, show status
  if (existingApplication && existingApplication.status) {
    const config = statusConfig[existingApplication.status];
    const StatusIcon = config?.icon || Clock;

    return (
      <div className="min-h-screen bg-[#F6F8FC] font-sans antialiased">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-sm">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
            <div className="h-16 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate("/mentee/homepage")}
                className="flex items-center gap-2 group select-none cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                  <GraduationCap className="w-4.5 h-4.5" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  EduPath
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Thoát</span>
              </button>
            </div>
          </div>
        </header>

        {/* Status content */}
        <main className="max-w-[700px] mx-auto w-full px-4 sm:px-6 py-16 sm:py-24">
          <div
            className={`rounded-3xl border ${config?.borderColor} ${config?.bgColor} p-8 sm:p-12 text-center animate-fadeIn`}
          >
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${config?.bgColor} ${config?.iconColor} mb-6`}
            >
              <StatusIcon className="w-8 h-8" />
            </div>
            <h2
              className={`text-2xl font-bold ${config?.textColor} mb-3 tracking-tight`}
            >
              {config?.title}
            </h2>
            <p className="text-slate-600 leading-relaxed max-w-md mx-auto">
              {config?.description}
            </p>

            {existingApplication.status === "REJECTED" &&
              existingApplication.rejectReason && (
                <div className="mt-6 rounded-xl bg-white border border-red-100 p-4 text-left">
                  <p className="text-sm font-semibold text-red-700 mb-1">
                    Lý do từ chối:
                  </p>
                  <p className="text-sm text-slate-600">
                    {existingApplication.rejectReason}
                  </p>
                </div>
              )}

            <button
              type="button"
              onClick={() => navigate("/mentee/homepage")}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors cursor-pointer"
            >
              Quay về trang chủ
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Default: show the application form
  return (
    <div className="min-h-screen bg-[#F6F8FC] font-sans antialiased">
      {/* ---- Toast / Result banner ---- */}
      {submitResult && (
        <div
          className={`fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold shadow-xl animate-slideDown ${
            submitResult.type === "success"
              ? "border-emerald-300 bg-emerald-600 text-white"
              : "border-red-300 bg-red-600 text-white"
          }`}
        >
          <span>{submitResult.message}</span>
          <button
            type="button"
            onClick={() => setSubmitResult(null)}
            className="ml-2 rounded-full p-0.5 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ================================================================ */}
      {/*  HEADER                                                          */}
      {/* ================================================================ */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <button
              type="button"
              onClick={() => navigate("/mentee/homepage")}
              className="flex items-center gap-2 group select-none cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                <GraduationCap className="w-4.5 h-4.5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                EduPath
              </span>
            </button>

            {/* Exit */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Thoát</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================================================================ */}
      {/*  MAIN CONTENT                                                    */}
      {/* ================================================================ */}
      <main className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-8 sm:py-12">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <MentorHero />

          <MentorInfoSection register={register} errors={errors} />

          <SubjectMentorSection
            subjects={subjects}
            setSubjects={setSubjects}
            error={subjectError}
            availableSubjects={availableSubjects}
          />

          <AcademicAchievementSection
            achievements={achievements}
            setAchievements={setAchievements}
            availableSubjects={availableSubjects}
          />

          <BioSection register={register} errors={errors} />

          <EvidenceUploadSection
            uploadFile={uploadFile}
            setUploadFile={setUploadFile}
            uploadError={uploadError}
            setUploadError={setUploadError}
          />

          {/* ---------------------------------------------------------- */}
          {/*  SUBMIT BUTTON                                              */}
          {/* ---------------------------------------------------------- */}
          <div className="flex justify-center pb-10">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="min-w-[240px] text-base font-semibold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 rounded-2xl"
            >
              Gửi đăng ký Mentor
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
