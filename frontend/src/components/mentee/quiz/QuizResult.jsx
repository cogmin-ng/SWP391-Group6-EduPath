import { CheckCircle2, XCircle, HelpCircle, BrainCircuit, Star, ArrowLeft, RotateCcw } from 'lucide-react';

function findOption(options, optId) {
  return options.find((o) => o.id === optId);
}

export default function QuizResult({ questions, answers, onGoBack, onRetry }) {
  const total = questions.length;
  const answered = Object.keys(answers).length;
  const correctCount = Object.entries(answers).filter(
    ([idx, optId]) => questions[Number(idx)]?.options.find((o) => o.id === optId)?.isCorrect,
  ).length;
  const accuracy = answered > 0 ? Math.round((correctCount / answered) * 100) : 0;

  return (
    <div className="flex-grow w-full max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 mb-6 text-center">
        <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
          <BrainCircuit className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Quiz Complete!</h2>
        <p className="text-slate-500 mb-6">Here&apos;s how you performed</p>

        <div className="grid grid-cols-3 gap-4 mb-6 max-w-sm mx-auto">
          <div className="bg-indigo-50 rounded-xl p-4">
            <p className="text-3xl font-bold text-indigo-600">{correctCount}/{total}</p>
            <p className="text-xs text-slate-500 mt-1">Correct</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-3xl font-bold text-green-600">{accuracy}%</p>
            <p className="text-xs text-slate-500 mt-1">Accuracy</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="text-3xl font-bold text-amber-600">+{correctCount * 10}</p>
            <p className="text-xs text-slate-500 mt-1">XP</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={onGoBack} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline text-on-surface-variant hover:bg-surface-container transition-colors text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {onRetry && (
            <button onClick={onRetry} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-semibold">
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Detailed Review</h3>
        {questions.map((q, idx) => {
          const selectedId = answers[idx];
          const selected = selectedId ? findOption(q.options, selectedId) : null;
          const correct = q.options.find((o) => o.isCorrect);
          const isCorrect = selected?.isCorrect;

          return (
            <div key={q.id} className={`rounded-xl border p-5 ${
              isCorrect ? 'border-green-200 bg-green-50/30' : selected ? 'border-red-200 bg-red-50/30' : 'border-slate-200 bg-white'
            }`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : selected ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <HelpCircle className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-500 mb-1">Question {idx + 1}</p>
                  <p className="text-sm font-semibold text-slate-900 mb-3">{q.question}</p>

                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt) => {
                      const isSelected = selectedId === opt.id;
                      const isCorrectOpt = opt.isCorrect;
                      let optClass = 'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ';

                      if (isCorrectOpt && isSelected) optClass += 'border-green-500 bg-green-100 text-green-800';
                      else if (isCorrectOpt) optClass += 'border-green-300 bg-green-50 text-green-700';
                      else if (isSelected) optClass += 'border-red-400 bg-red-50 text-red-700';
                      else optClass += 'border-slate-200 text-slate-600';

                      return (
                        <div key={opt.id} className={optClass}>
                          {isCorrectOpt && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                          {isSelected && !isCorrectOpt && <XCircle className="w-4 h-4 shrink-0" />}
                          {!isSelected && !isCorrectOpt && <span className="w-4 shrink-0" />}
                          <span className="font-medium">{opt.id}.</span>
                          <span>{opt.label}</span>
                          {isCorrectOpt && <span className="ml-auto text-xs font-medium">Correct Answer</span>}
                          {isSelected && !isCorrectOpt && <span className="ml-auto text-xs font-medium">Your Answer</span>}
                        </div>
                      );
                    })}
                  </div>

                  {selected && (
                    <div className="mt-3 space-y-2">
                      <div className={`text-xs p-3 rounded-lg ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect
                          ? `✓ Đúng! ${correct?.label}`
                          : `✗ Sai. Đáp án đúng là ${correct?.id}: ${correct?.label}`
                        }
                      </div>
                      {q.explanation && (
                        <div className="text-xs p-3 rounded-lg bg-slate-100 text-slate-700 leading-relaxed">
                          💡 {q.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
