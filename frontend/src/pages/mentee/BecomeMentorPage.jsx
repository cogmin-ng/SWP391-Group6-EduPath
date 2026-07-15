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

  /* ---- tabs ---- */
  const [activeTab, setActiveTab] = useState("form");

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
        // Auto switch to status tab if application is pending
        if (myApp && myApp.status === "PENDING") {
          setActiveTab("status");
        }
      } catch {
        setAvailableSubjects([]);
        setExistingApplication(null);
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ---- auto-hide toast ---- */
  useEffect(() => {
    if (submitResult) {
      const timer = setTimeout(() => {
        setSubmitResult(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [submitResult]);

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
      setActiveTab("status");
    } catch (err) {
      const errorData = err?.response?.data;
      let msg =
        errorData?.error?.message ||
        errorData?.message ||
        "Có lỗi xảy ra khi gửi đơn. Vui lòng thử lại sau.";

      const validationFields =
        errorData?.error?.details?.fields ||
        errorData?.error?.fields ||
        errorData?.details?.fields;

      if (Array.isArray(validationFields)) {
        const details = validationFields.map((f) => f.message).join(", ");
        msg = `Validation failed: ${details}`;
      }

      setSubmitResult({
        type: "error",
        message: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================================================================ */
  /*  HELPERS                                                          */
  /* ================================================================ */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "PENDING":
        return {
          badgeBg: "bg-indigo-50",
          badgeText: "text-indigo-600",
          icon: Clock,
          label: "Đang chờ duyệt",
          descStatus: "Đang được xem xét",
          description: "Đơn đăng ký của bạn đang được Admin xem xét. Bạn sẽ nhận được thông báo khi có kết quả.",
        };
      case "APPROVED":
        return {
          badgeBg: "bg-emerald-50",
          badgeText: "text-emerald-600",
          icon: CheckCircle2,
          label: "Đã được duyệt",
          descStatus: "Đã được duyệt",
          description: "Chúc mừng! Đơn đăng ký Mentor của bạn đã được phê duyệt. Bạn có thể bắt đầu tạo roadmap và hỗ trợ mentee.",
        };
      case "REJECTED":
        return {
          badgeBg: "bg-red-50",
          badgeText: "text-red-600",
          icon: XCircle,
          label: "Bị từ chối",
          descStatus: "Bị từ chối",
          description: "Rất tiếc, đơn đăng ký Mentor của bạn chưa được phê duyệt.",
        };
      default:
        return {
          badgeBg: "bg-slate-50",
          badgeText: "text-slate-600",
          icon: Clock,
          label: "Chưa rõ",
          descStatus: "Chưa rõ",
          description: "",
        };
    }
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

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

  return (
    <div className="min-h-screen bg-[#F6F8FC] font-sans antialiased">
      {/* ---- Toast / Result banner ---- */}
      {submitResult && (
        <div
          className={`fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold shadow-xl animate-slideDown ${submitResult.type === "success"
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
        <MentorHero />

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab("form")}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 transition-colors ${activeTab === "form"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
          >
            Đăng ký mentor
          </button>
          <button
            onClick={() => setActiveTab("status")}
            className={`pb-4 px-6 text-sm font-semibold border-b-2 transition-colors ${activeTab === "status"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
          >
            Trạng thái đơn
          </button>
        </div>

        {activeTab === "form" ? (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {existingApplication?.status === "APPROVED" && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-start gap-3 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Bạn đã là Mentor!</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Bạn đã được phê duyệt làm Mentor trước đó. Bạn vẫn có thể đăng ký bổ sung các môn học hoặc chuyên ngành khác bằng cách điền và gửi đơn bên dưới.
                  </p>
                </div>
              </div>
            )}
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
              subjects={subjects}
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
            <div className="flex flex-col items-center pb-10">
              {availableSubjects.length === 0 && (
                <div className="mb-4 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200 text-sm text-center max-w-lg">
                  Bạn đã đăng ký Mentor cho tất cả các môn học hiện có.
                </div>
              )}
              {existingApplication?.status === "PENDING" && availableSubjects.length > 0 && (
                <div className="mb-4 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 text-sm text-center max-w-lg">
                  Bạn đang có một đơn đăng ký Mentor đang chờ xét duyệt. Vui lòng chờ kết quả trước khi gửi đơn mới.
                </div>
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={existingApplication?.status === "PENDING" || availableSubjects.length === 0}
                isLoading={isSubmitting}
                className="min-w-[240px] text-base font-semibold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gửi đăng ký Mentor
              </Button>
            </div>
          </form>
        ) : (
          <div className="w-full">
            {!existingApplication ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-slate-500">Bạn chưa có đơn đăng ký nào.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Đơn đăng ký Mentor</h3>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${getStatusConfig(existingApplication.status).badgeBg} ${getStatusConfig(existingApplication.status).badgeText} text-sm font-medium`}>
                    {(() => {
                      const Icon = getStatusConfig(existingApplication.status).icon;
                      return <Icon className="w-4 h-4" />;
                    })()}
                    {getStatusConfig(existingApplication.status).label}
                  </div>
                </div>

                <div className="border-t border-slate-100" />

                {/* Details */}
                <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ngày gửi</p>
                    <p className="text-sm font-medium text-slate-900">{formatDate(existingApplication.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Trạng thái</p>
                    <p className={`text-sm font-medium ${getStatusConfig(existingApplication.status).badgeText}`}>
                      {getStatusConfig(existingApplication.status).descStatus}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100" />

                {/* Description */}
                <div className="p-6 sm:p-8">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {getStatusConfig(existingApplication.status).description}
                  </p>
                  {existingApplication.status === "REJECTED" && existingApplication.rejectReason && (
                    <div className="mt-4 rounded-xl bg-red-50 border border-red-100 p-4 text-left">
                      <p className="text-sm font-semibold text-red-700 mb-1">
                        Lý do từ chối:
                      </p>
                      <p className="text-sm text-slate-600">
                        {existingApplication.rejectReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

