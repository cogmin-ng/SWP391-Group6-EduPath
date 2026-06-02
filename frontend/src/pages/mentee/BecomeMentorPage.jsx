import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { GraduationCap, X } from "lucide-react";

import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { mentorApplicationService } from "../../services/mentorApplicationService";

import BecomeMentorHero from "../../components/mentee/BecomeMentorHero";
import BecomeMentorInfoForm from "../../components/mentee/BecomeMentorInfoForm";
import BecomeMentorCertifications from "../../components/mentee/BecomeMentorCertifications";
import BecomeMentorLinks from "../../components/mentee/BecomeMentorLinks";
import BecomeMentorUpload from "../../components/mentee/BecomeMentorUpload";

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
      experienceYears: "",
      specialization: "",
      description: "",
      linkedinUrl: "",
      githubUrl: "",
      portfolioUrl: "",
      personalWebsiteUrl: "",
    },
  });

  /* ---- component states ---- */
  const [certifications, setCertifications] = useState([]);
  
  const [cvFile, setCvFile] = useState(null);
  const [cvError, setCvError] = useState("");

  /* ---- submit ---- */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { type, message }

  const onSubmit = async (data) => {
    // Validate CV
    if (!cvFile) {
      setCvError("Vui lòng tải lên CV của bạn.");
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      await mentorApplicationService.submit({
        ...data,
        certifications,
        cvFile,
      });

      setSubmitResult({
        type: "success",
        message:
          "Đơn đăng ký Mentor của bạn đã được gửi thành công! Chúng tôi sẽ xem xét và phản hồi sớm nhất.",
      });

      // Scroll to top to show the success banner
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitResult({
        type: "error",
        message:
          err?.response?.data?.message ||
          "Có lỗi xảy ra khi gửi đơn. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          
          <BecomeMentorHero />

          <BecomeMentorInfoForm register={register} errors={errors} />

          <BecomeMentorCertifications 
            certifications={certifications}
            setCertifications={setCertifications}
          />

          <BecomeMentorLinks register={register} />

          <BecomeMentorUpload 
            cvFile={cvFile}
            setCvFile={setCvFile}
            cvError={cvError}
            setCvError={setCvError}
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
              className="min-w-[220px] text-base font-semibold shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
            >
              Gửi đăng ký Mentor
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
