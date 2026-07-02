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
  const stats = [
    { label: 'Checklist', value: `${checklistProgress}%` },
    { label: 'Tài liệu đã học', value: `${materialsRead}%` },
    { label: 'Bài kiểm tra', value: quizzesDone },
  ];

  return (
    <div className="animate-fadeIn rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/60">
      <h3 className="mb-5 text-xl font-bold text-slate-900">Trạng thái bài học</h3>

      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between text-sm">
            <span className="text-slate-500">{stat.label}</span>
            <span className="font-bold text-indigo-600">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="my-6 h-px bg-slate-100" />

      <div className="text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Tiến độ hiện tại
        </p>
        <div className="relative mx-auto mb-3 h-32 w-32">
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
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <div className="text-3xl font-extrabold text-slate-900 font-display">
                {overallProgress}%
              </div>
              <div className="mt-1 text-xs font-medium text-slate-400">Hoàn thành</div>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-500">
          {overallProgress >= 100
            ? 'Bạn đã hoàn thành toàn bộ lộ trình này.'
            : overallProgress >= 50
              ? 'Bạn đang học rất tốt. Giữ đúng nhịp hiện tại.'
              : 'Tiếp tục từng bước nhỏ để tăng tiến độ ổn định.'}
        </p>
      </div>
    </div>
  );
}
