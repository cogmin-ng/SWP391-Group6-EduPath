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
export default function QuizSection({ quiz, roadmapId, nodeId, onStart }) {
  const navigate = useNavigate();

  if (!quiz) return null;

  const handleStart = () => {
    if (onStart) {
      onStart();
    } else if (roadmapId && nodeId) {
      navigate(`/mentee/roadmaps/${roadmapId}/nodes/${nodeId}/quiz`);
    }
  };

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
          disabled={!onStart && (!roadmapId || !nodeId)}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all duration-200 shadow-sm shadow-indigo-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
        >
          Bắt đầu
        </button>
      </div>
    </section>
  );
}
