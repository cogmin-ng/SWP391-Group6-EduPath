import { useState } from "react";
import { BookOpen, X } from "lucide-react";

/**
 * Section 2 – Môn học muốn Mentor.
 *
 * Tag-based input that lets users add multiple subjects.
 * Press Enter to add a tag. Click X on a tag to remove it.
 *
 * @param {{
 *   subjects: string[],
 *   setSubjects: Function,
 *   error: string | null,
 * }} props
 */
export default function SubjectMentorSection({ subjects, setSubjects, error }) {
  const [input, setInput] = useState("");

  const addSubject = () => {
    const trimmed = input.trim().toUpperCase();
    if (!trimmed) return;
    if (subjects.includes(trimmed)) return;
    setSubjects((prev) => [...prev, trimmed]);
    setInput("");
  };

  const removeSubject = (subject) => {
    setSubjects((prev) => prev.filter((s) => s !== subject));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubject();
    }
  };

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm mb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600">
          <BookOpen className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Môn học muốn Mentor
        </h2>
      </div>

      {/* Tags */}
      {subjects.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {subjects.map((subject) => (
            <span
              key={subject}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 border border-indigo-100 transition-colors"
            >
              {subject}
              <button
                type="button"
                onClick={() => removeSubject(subject)}
                className="rounded-full p-0.5 text-indigo-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Thêm môn học khác..."
        className={`w-full rounded-xl border bg-white text-slate-800 text-sm placeholder:text-slate-400 px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
          error
            ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
            : "border-slate-200 hover:border-slate-300"
        }`}
      />

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </section>
  );
}
