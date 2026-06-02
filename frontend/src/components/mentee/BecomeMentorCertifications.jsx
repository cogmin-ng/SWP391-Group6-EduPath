import { useState } from "react";
import { Award, Plus, X } from "lucide-react";

/**
 * Certifications tag-input section.
 *
 * @param {{
 *   certifications: string[],
 *   setCertifications: Function,
 * }} props
 */
export default function BecomeMentorCertifications({
  certifications,
  setCertifications,
}) {
  const [certInput, setCertInput] = useState("");

  const addCertification = () => {
    const trimmed = certInput.trim();
    if (!trimmed) return;
    if (certifications.includes(trimmed)) return;
    setCertifications((prev) => [...prev, trimmed]);
    setCertInput("");
  };

  const removeCertification = (cert) => {
    setCertifications((prev) => prev.filter((c) => c !== cert));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCertification();
    }
  };

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm mb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 text-amber-600">
          <Award className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Chứng chỉ chuyên môn
        </h2>
      </div>
      <p className="text-sm text-slate-500 mb-5">
        Thêm các chứng chỉ liên quan để tăng độ tin cậy cho hồ sơ của bạn (vd:
        AWS, Google Cloud, PMP...).
      </p>

      {/* Input + Add button */}
      <div className="flex gap-3">
        <input
          type="text"
          value={certInput}
          onChange={(e) => setCertInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tên chứng chỉ..."
          className="flex-1 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300"
        />
        <button
          type="button"
          onClick={addCertification}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Thêm
        </button>
      </div>

      {/* Tags */}
      {certifications.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {certifications.map((cert) => (
            <span
              key={cert}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-200"
            >
              {cert}
              <button
                type="button"
                onClick={() => removeCertification(cert)}
                className="rounded-full p-0.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
