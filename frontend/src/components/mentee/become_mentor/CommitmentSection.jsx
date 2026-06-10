import { ShieldCheck } from "lucide-react";

/**
 * Section 6 – Cam kết Mentor.
 *
 * Two checkboxes the applicant must agree to before submitting.
 *
 * @param {{
 *   commitments: { quality: boolean, responsibility: boolean },
 *   setCommitments: Function,
 *   error: string | null,
 * }} props
 */
export default function CommitmentSection({
  commitments,
  setCommitments,
  error,
}) {
  const toggle = (key) => {
    setCommitments((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const checkboxCls =
    "w-4.5 h-4.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2 cursor-pointer accent-indigo-600";

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm mb-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-rose-50 text-rose-600">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Cam kết
        </h2>
      </div>

      <div className="space-y-4">
        {/* Checkbox 1 */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={commitments.quality}
            onChange={() => toggle("quality")}
            className={checkboxCls}
          />
          <span className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
            Tôi cam kết cung cấp thông tin chính xác và trung thực trong đơn
            đăng ký này.
          </span>
        </label>

        {/* Checkbox 2 */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={commitments.responsibility}
            onChange={() => toggle("responsibility")}
            className={checkboxCls}
          />
          <span className="text-sm text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
            Tôi đồng ý tuân thủ các quy định và chính sách của EduPath dành cho
            Mentor, bao gồm hỗ trợ Mentee một cách có trách nhiệm.
          </span>
        </label>
      </div>

      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
    </section>
  );
}
