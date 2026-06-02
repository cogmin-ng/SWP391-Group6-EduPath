import { useState } from 'react';
import { Lightbulb, Send } from 'lucide-react';

/**
 * Tips & Tricks section with community tips and a submit form.
 *
 * Props:
 * - tips: [{ id, content }]
 * - onSubmitTip: (content: string) => void
 */
export default function TipsSection({ tips: initialTips, onSubmitTip }) {
  const [tips, setTips] = useState(initialTips);
  const [newTip, setNewTip] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = newTip.trim();
    if (!trimmed) return;

    const newTipItem = {
      id: `tip-${Date.now()}`,
      content: trimmed,
    };

    setTips((prev) => [...prev, newTipItem]);
    onSubmitTip?.(trimmed);
    setNewTip('');
  };

  return (
    <section className="animate-fadeIn">
      {/* Card wrapper with subtle purple border */}
      <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/30 rounded-2xl border border-indigo-100 p-6">
        {/* Section title */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
            <Lightbulb className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Kinh nghiệm & Bí kíp (Tips & Tricks)
          </h3>
        </div>

        {/* Tips list */}
        <ul className="space-y-2.5 mb-5">
          {tips.map((tip) => (
            <li
              key={tip.id}
              className="bg-white rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed border border-slate-100 shadow-sm"
            >
              {tip.content}
            </li>
          ))}
        </ul>

        {/* Submit form */}
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">
            Đóng góp bí kíp của bạn
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newTip}
              onChange={(e) => setNewTip(e.target.value)}
              placeholder="Chia sẻ kinh nghiệm của bạn..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <button
              type="submit"
              disabled={!newTip.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all duration-200 shadow-sm shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Gửi bí kíp
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
