import { Award, CheckCircle2, ExternalLink, Sparkles, X } from "lucide-react";
import { useEffect } from "react";

export default function CertificateEarnedModal({
  certificate,
  roadmapTitle,
  onClose,
  onViewCertificate,
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-earned-title"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-zoomIn">
        <div className="relative overflow-hidden bg-linear-to-br from-indigo-700 via-violet-600 to-fuchsia-600 px-6 pb-20 pt-8 text-center text-white">
          <div className="absolute left-8 top-8 h-3 w-3 rounded-full bg-amber-300" />
          <div className="absolute right-12 top-14 h-2 w-2 rounded-full bg-cyan-300" />
          <div className="absolute bottom-10 left-16 h-2.5 w-2.5 rotate-45 bg-emerald-300" />
          <Sparkles className="absolute right-20 top-8 h-6 w-6 text-amber-300" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
            aria-label="Đóng thông báo"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-100">
            Hoàn thành xuất sắc
          </p>
          <h2 id="certificate-earned-title" className="mt-3 text-2xl font-bold sm:text-3xl">
            Chúc mừng bạn! 🎉
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-indigo-100">
            Bạn đã hoàn thành toàn bộ lộ trình và chính thức nhận được chứng chỉ từ EduPath.
          </p>
        </div>

        <div className="relative -mt-12 px-5 pb-6 sm:px-7 sm:pb-7">
          <div className="rounded-2xl border border-amber-200 bg-linear-to-br from-amber-50 to-white p-5 text-center shadow-lg shadow-slate-900/10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-300/40">
              <Award className="h-8 w-8" />
            </div>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-amber-700">
              Chứng chỉ hoàn thành
            </p>
            <h3 className="mx-auto mt-2 max-w-sm text-lg font-bold text-slate-900">
              {certificate?.learningPathTitle || roadmapTitle}
            </h3>
            {certificate?.verificationId && (
              <p className="mt-3 text-[11px] text-slate-400">
                Mã xác thực: {certificate.verificationId}
              </p>
            )}
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl bg-emerald-50 p-3.5 text-left">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <p className="text-xs leading-5 text-emerald-800">
              Chứng chỉ đã được lưu vào hồ sơ của bạn và có thể xem lại bất cứ lúc nào.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row-reverse">
            <button
              type="button"
              onClick={onViewCertificate}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Xem chứng chỉ
              <ExternalLink className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Ở lại lộ trình
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
