import { useEffect, useRef, useState } from 'react';
import { BellRing, Send, X } from 'lucide-react';

const TITLE_LIMIT = 120;
const CONTENT_LIMIT = 1000;

export default function ReminderModal({ learner, isSubmitting, onClose, onSubmit }) {
  const [title, setTitle] = useState(
    () => `Lời nhắc học tập: ${learner.learningPath.title}`
  );
  const [content, setContent] = useState(
    () =>
      `Chào ${learner.learner.name || 'bạn'}, hãy tiếp tục lộ trình “${learner.learningPath.title}” để duy trì tiến độ học tập nhé.`
  );
  const titleRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => titleRef.current?.focus(), 0);
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  useEffect(() => {
    if (!learner) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isSubmitting) onClose();
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled])'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitting, learner, onClose]);

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid || isSubmitting) return;
    onSubmit({ title: title.trim(), content: content.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reminder-title"
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <BellRing className="h-5 w-5" />
            </span>
            <div>
              <h2 id="reminder-title" className="font-bold text-slate-900">
                Gửi lời nhắc
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {learner.learner.name || learner.learner.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Đóng hộp thoại"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Tiêu đề</span>
            <input
              ref={titleRef}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={TITLE_LIMIT}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50"
            />
            <span className="mt-1 block text-right text-xs text-slate-400">
              {title.length}/{TITLE_LIMIT}
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Nội dung</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={CONTENT_LIMIT}
              rows={6}
              disabled={isSubmitting}
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50"
            />
            <span className="mt-1 block text-right text-xs text-slate-400">
              {content.length}/{CONTENT_LIMIT}
            </span>
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? 'Đang gửi...' : 'Gửi lời nhắc'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
