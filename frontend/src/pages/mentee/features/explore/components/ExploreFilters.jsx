import { Search } from 'lucide-react';

export default function ExploreFilters({
  categories,
  mentors,
  selectedCategories,
  selectedMentors,
  mentorQuery,
  onMentorQueryChange,
  onToggleCategory,
  onToggleMentor,
}) {
  return (
    <aside className="hidden md:block md:w-72 shrink-0 border-r border-slate-200 bg-white">
      <div className="sticky top-24 p-6 space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Bộ lọc</h2>
          <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase mb-3">Danh mục</h3>
          <div className="space-y-2.5">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => onToggleCategory(category)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase mb-3">Mentor</h3>
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={mentorQuery}
              onChange={(event) => onMentorQueryChange(event.target.value)}
              placeholder="Tìm mentor..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {mentors.map((mentor) => (
              <label key={mentor} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedMentors.includes(mentor)}
                  onChange={() => onToggleMentor(mentor)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{mentor}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
