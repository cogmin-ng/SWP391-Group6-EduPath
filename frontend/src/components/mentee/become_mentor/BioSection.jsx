import { FileText } from "lucide-react";

/**
 * Section 4 – Giới thiệu bản thân.
 *
 * Two textarea fields: Bio and Kinh nghiệm hỗ trợ học tập.
 *
 * @param {{ register: Function, errors: Object }} props
 */
export default function BioSection({ register, errors }) {
  const textareaCls = (hasError) =>
    `w-full rounded-xl border bg-white text-slate-800 text-sm placeholder:text-slate-400 px-4 py-3 resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
      hasError
        ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
        : "border-slate-200 hover:border-slate-300"
    }`;

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm mb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-violet-50 text-violet-600">
          <FileText className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Giới thiệu bản thân
        </h2>
      </div>

      <div className="space-y-5">
        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Bio <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Hãy giới thiệu ngắn gọn về bản thân, thành tích học tập và lý do bạn muốn trở thành Mentor."
            {...register("bio", {
              required: "Vui lòng nhập giới thiệu bản thân.",
              minLength: {
                value: 30,
                message: "Bio phải có ít nhất 30 ký tự.",
              },
            })}
            className={textareaCls(errors.bio)}
          />
          {errors.bio && (
            <p className="mt-1.5 text-xs text-red-500">{errors.bio.message}</p>
          )}
        </div>

        {/* Kinh nghiệm hỗ trợ học tập */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Kinh nghiệm hỗ trợ học tập <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            placeholder={"Hỗ trợ bạn bè học tập,\nReview assignment,\nHướng dẫn đồ án,\nChia sẻ kinh nghiệm học tập."}
            {...register("supportExperience", {
              required: "Vui lòng nhập kinh nghiệm hỗ trợ học tập.",
              minLength: {
                value: 30,
                message: "Kinh nghiệm hỗ trợ học tập phải có ít nhất 30 ký tự.",
              },
            })}
            className={textareaCls(errors.supportExperience)}
          />
          {errors.supportExperience && (
            <p className="mt-1.5 text-xs text-red-500">{errors.supportExperience.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
