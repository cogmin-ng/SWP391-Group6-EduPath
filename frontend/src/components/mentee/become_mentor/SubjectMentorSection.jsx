import { useState, useEffect } from "react";
import { BookOpen, X, ChevronDown, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { subjectCategoryService } from "../../../services/subjectCategoryService";
import { mentorApplicationService } from "../../../services/mentorApplicationService";

/**
 * Section 2 – Môn học muốn Mentor.
 *
 * Cho phép chọn Category -> lấy danh sách Subject -> Thêm vào list.
 *
 * @param {{
 *   subjects: Array<{ id: string, name: string }>,
 *   setSubjects: Function,
 *   error: string | null,
 * }} props
 */
export default function SubjectMentorSection({
  subjects,
  setSubjects,
  error,
}) {
  // Category state
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loadingCategory, setLoadingCategory] = useState(true);

  // Subject state
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loadingSubject, setLoadingSubject] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await subjectCategoryService.getSubjectCategories();
        setCategories(data || []);
      } catch (err) {
        toast.error("Không thể tải danh sách chuyên mục.");
      } finally {
        setLoadingCategory(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle category change
  const handleCategoryChange = async (e) => {
    const catId = e.target.value;
    setSelectedCategory(catId);

    // Reset subject state
    setSelectedSubject("");
    setAvailableSubjects([]);

    if (!catId) return;

    setLoadingSubject(true);
    try {
      const data = await mentorApplicationService.getSubjects(catId);
      setAvailableSubjects(data || []);
    } catch (err) {
      toast.error("Không thể tải danh sách môn học.");
    } finally {
      setLoadingSubject(false);
    }
  };

  // Filter out already-selected subjects
  const filteredOptions = availableSubjects.filter(
    (s) => !subjects.some((sel) => sel.id === s.id)
  );

  const addSubject = () => {
    if (!selectedCategory || !selectedSubject) return;

    const found = availableSubjects.find((s) => s.id === selectedSubject);
    if (!found) return;

    if (subjects.some((s) => s.id === found.id)) {
      toast.error("Môn học này đã được thêm.");
      return;
    }

    setSubjects((prev) => [...prev, { id: found.id, name: found.name }]);
    setSelectedSubject("");
  };

  const removeSubject = (id) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
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
              key={subject.id}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 border border-indigo-100 transition-colors"
            >
              {subject.name}
              <button
                type="button"
                onClick={() => removeSubject(subject.id)}
                className="rounded-full p-0.5 text-indigo-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown + Add button */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category Dropdown */}
        <div className="relative flex-1">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            disabled={loadingCategory}
            className={`w-full appearance-none rounded-xl border bg-white text-slate-800 text-sm px-4 py-3 pr-10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer ${loadingCategory ? "opacity-70 cursor-not-allowed bg-slate-50" : ""
              } border-slate-200 hover:border-slate-300`}
          >
            <option value="">
              {loadingCategory ? "Đang tải chuyên mục..." : "Chọn chuyên mục..."}
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {loadingCategory ? (
            <Loader2 className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 animate-spin" />
          ) : (
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          )}
        </div>

        {/* Subject Dropdown */}
        <div className="relative flex-1">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedCategory || loadingSubject || (selectedCategory && filteredOptions.length === 0)}
            className={`w-full appearance-none rounded-xl border bg-white text-slate-800 text-sm px-4 py-3 pr-10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer ${(!selectedCategory || loadingSubject || (selectedCategory && filteredOptions.length === 0)) ? "opacity-70 cursor-not-allowed bg-slate-50" : ""
              } ${error
                ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                : "border-slate-200 hover:border-slate-300"
              }`}
          >
            <option value="">
              {loadingSubject
                ? "Đang tải môn học..."
                : (selectedCategory && filteredOptions.length === 0)
                  ? "No available subjects"
                  : "Chọn môn học..."}
            </option>
            {filteredOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {loadingSubject ? (
            <Loader2 className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 animate-spin" />
          ) : (
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          )}
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={addSubject}
          disabled={!selectedCategory || !selectedSubject}
          className="px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Thêm
        </button>
      </div>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </section>
  );
}
