import { useNavigate } from 'react-router-dom';
import { BrainCircuit, HelpCircle, Clock } from 'lucide-react';

/**
 * Quiz section — displays a single quiz card with metadata.
 * Clicking "Start" navigates to the full quiz page or fires onStart.
 *
 * Props:
 * - quiz: { id, title, questionCount, durationMinutes }
 * - roadmapId: string — parent roadmap ID for the quiz route
 * - nodeId: string — current node ID for the quiz route
 * - onStart: function — callback to handle start inline (overrides navigation)
 */
export default function QuizSection({ quiz, roadmapId, nodeId, onStart, compact = false }) {
  const navigate = useNavigate();
  const canStart = Boolean(quiz) && (Boolean(onStart) || (Boolean(roadmapId) && Boolean(nodeId)));

  const handleStart = () => {
    if (!quiz) return;

    if (onStart) {
      onStart();
    } else if (roadmapId && nodeId) {
      navigate(`/mentee/roadmaps/${roadmapId}/nodes/${nodeId}/quiz`);
    }
  };

  if (compact) {
    return (
      <section className="animate-fadeIn rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/60">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50">
            <BrainCircuit className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Bài kiểm tra</h3>
            <p className="text-xs text-slate-400">Đánh giá nhanh mức độ nắm vững kiến thức của node này.</p>
          </div>
        </div>

        {quiz ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-sm font-bold text-slate-900">{quiz.title}</h4>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5" />
                {quiz.questionCount} câu hỏi
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {quiz.durationMinutes} phút
              </span>
            </div>
            <button
              onClick={handleStart}
              disabled={!canStart}
              className="mt-4 w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all duration-200 hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600"
            >
              Bắt đầu
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4">
            <p className="text-sm font-semibold text-slate-900">Chưa có bài kiểm tra</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Node này hiện chưa có quiz để làm, nhưng khu vực bài kiểm tra vẫn được giữ nguyên trong bố cục học tập.
            </p>
            <button
              disabled
              className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-400"
            >
              Chưa khả dụng
            </button>
          </div>
        )}
      </section>
    );
  }

  if (!quiz) return null;

  return (
    <section className="animate-fadeIn">
      {/* Section title */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
          <BrainCircuit className="w-5 h-5 text-indigo-600" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Bài kiểm tra & đánh giá
        </h3>
      </div>

      {/* Quiz card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between hover:shadow-md hover:border-indigo-100 transition-all duration-200">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <BrainCircuit className="w-6 h-6 text-indigo-600" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              {quiz.title}
            </h4>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                {quiz.questionCount} câu hỏi
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {quiz.durationMinutes} phút
              </span>
            </div>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={!canStart}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all duration-200 shadow-sm shadow-indigo-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
        >
          Bắt đầu
        </button>
      </div>
    </section>
  );
}
