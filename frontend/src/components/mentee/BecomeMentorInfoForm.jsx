import { ChevronDown, User } from "lucide-react";
import {
  EXPERIENCE_OPTIONS,
  SPECIALIZATION_OPTIONS,
} from "../../mock/becomeMentorData";

/**
 * Mentor personal / professional information form section.
 *
 * @param {{ register: Function, errors: Object }} props
 *   – `register` and `errors` come from react-hook-form's useForm().
 */
export default function BecomeMentorInfoForm({ register, errors }) {
  /* shared input class builder */
  const inputCls = (hasError) =>
    `w-full rounded-xl border bg-white text-slate-800 text-sm placeholder:text-slate-400 px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
      hasError
        ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
        : "border-slate-200 hover:border-slate-300"
    }`;

  const selectCls = (hasError) =>
    `w-full appearance-none rounded-xl border bg-white text-slate-800 text-sm px-4 py-3 pr-10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer ${
      hasError
        ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
        : "border-slate-200 hover:border-slate-300"
    }`;

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm mb-6 animate-fadeIn">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600">
          <User className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Thông tin Mentor
        </h2>
      </div>

      <div className="space-y-5">
        {/* Họ và tên */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nguyễn Văn A"
            {...register("fullName", {
              required: "Vui lòng nhập họ và tên.",
            })}
            className={inputCls(errors.fullName)}
          />
          {errors.fullName && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Row: Số năm + Chuyên môn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Số năm làm việc */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Số năm làm việc <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                {...register("experienceYears", {
                  required: "Vui lòng chọn số năm kinh nghiệm.",
                })}
                className={selectCls(errors.experienceYears)}
              >
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            {errors.experienceYears && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.experienceYears.message}
              </p>
            )}
          </div>

          {/* Chuyên môn chính */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Chuyên môn chính <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                {...register("specialization", {
                  required: "Vui lòng chọn lĩnh vực chuyên môn.",
                })}
                className={selectCls(errors.specialization)}
              >
                {SPECIALIZATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            {errors.specialization && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.specialization.message}
              </p>
            )}
          </div>
        </div>

        {/* Kinh nghiệm chuyên ngành */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Kinh nghiệm chuyên ngành{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            placeholder="Chia sẻ chi tiết về kinh nghiệm của bạn ......"
            {...register("description", {
              required: "Vui lòng mô tả kinh nghiệm chuyên ngành.",
              minLength: {
                value: 50,
                message: "Mô tả phải có ít nhất 50 ký tự.",
              },
            })}
            className={`${inputCls(errors.description)} resize-none`}
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
