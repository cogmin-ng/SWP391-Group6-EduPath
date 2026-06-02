/**
 * Right-side progress card showing node completion status.
 * Displays checklist %, materials read %, quizzes done, and overall progress.
 *
 * Props:
 * - checklistProgress: number (0-100)
 * - materialsRead: number (0-100)
 * - quizzesDone: string e.g. "0/1"
 * - overallProgress: number (0-100)
 */
export default function ProgressCard({
  checklistProgress = 0,
  materialsRead = 0,
  quizzesDone = '0/1',
  overallProgress = 0,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-6 animate-fadeIn">
      <h3 className="text-base font-bold text-slate-900 mb-5">Node Status</h3>

      {/* Stats rows */}
      <div className="space-y-3.5 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Checklist</span>
          <span className="text-sm font-bold text-indigo-600">
            {checklistProgress}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Materials Read</span>
          <span className="text-sm font-bold text-indigo-600">
            {materialsRead}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Quizzes</span>
          <span className="text-sm font-bold text-indigo-600">
            {quizzesDone}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 mb-5" />

      {/* Overall progress */}
      <div className="text-center">
        <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-2">
          Current Progress
        </p>
        <div className="relative w-28 h-28 mx-auto mb-1">
          {/* Background circle */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - overallProgress / 100)}`}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-extrabold text-slate-900 font-display">
              {overallProgress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
