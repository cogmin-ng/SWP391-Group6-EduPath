import { ChevronDown, UserCircle } from "lucide-react";
import {
  SPECIALIZATION_OPTIONS,
  SEMESTER_OPTIONS,
} from "../../../mock/becomeMentorData";

/**
 * Section 1 – Mentor personal information form.
 *
 * Fields: Họ và tên, Chuyên ngành (dropdown), Kỳ học hiện tại (dropdown).
 *
 * @param {{ register: Function, errors: Object }} props
 */
export default function MentorInfoSection({ register, errors }) {
  const selectCls = (hasError) =>
    `w-full appearance-none rounded-xl border bg-white text-slate-800 text-sm px-4 py-3 pr-10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer ${hasError
      ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
      : "border-slate-200 hover:border-slate-300"
    }`;

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm mb-6 animate-fadeIn">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600">
          <UserCircle className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Thông tin Mentor
        </h2>
      </div>

      <div className="space-y-5">

        {/* Row: Chuyên ngành + Kỳ học */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Chuyên ngành */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Chuyên ngành <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                {...register("specialization", {
                  required: "Vui lòng chọn chuyên ngành.",
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

          {/* Kỳ học hiện tại */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Kỳ học hiện tại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                {...register("semester", {
                  required: "Vui lòng chọn kỳ học.",
                })}
                className={selectCls(errors.semester)}
              >
                {SEMESTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            {errors.semester && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.semester.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
