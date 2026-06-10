import { Trophy, Trash2, Plus } from "lucide-react";

/**
 * Section 3 – Thành tích học tập.
 *
 * Multiple rows, each with: subject name, grade, and delete button.
 * A "Thêm môn học" button appends a new empty row.
 *
 * @param {{
 *   achievements: Array<{ subject: string, grade: string }>,
 *   setAchievements: Function,
 * }} props
 */
export default function AcademicAchievementSection({
  achievements,
  setAchievements,
}) {
  const updateRow = (index, field, value) => {
    setAchievements((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const removeRow = (index) => {
    setAchievements((prev) => prev.filter((_, i) => i !== index));
  };

  const addRow = () => {
    setAchievements((prev) => [...prev, { subject: "", grade: "" }]);
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300";

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm mb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 text-amber-600">
          <Trophy className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Thành tích học tập
        </h2>
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {achievements.map((row, index) => (
          <div key={index} className="flex items-center gap-3">
            {/* Subject */}
            <input
              type="text"
              value={row.subject}
              onChange={(e) => updateRow(index, "subject", e.target.value)}
              placeholder="Tên môn học"
              className={`flex-1 ${inputCls}`}
            />

            {/* Grade */}
            <input
              type="text"
              value={row.grade}
              onChange={(e) => updateRow(index, "grade", e.target.value)}
              placeholder="Điểm"
              className={`w-20 sm:w-24 text-center ${inputCls}`}
            />

            {/* Delete */}
            <button
              type="button"
              onClick={() => removeRow(index)}
              className="shrink-0 rounded-lg p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add row button */}
      <button
        type="button"
        onClick={addRow}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Thêm môn học
      </button>
    </section>
  );
}
