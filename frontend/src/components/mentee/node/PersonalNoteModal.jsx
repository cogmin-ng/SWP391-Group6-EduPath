import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Loader2, NotebookPen, Save, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  deletePersonalNote,
  getPersonalNote,
  savePersonalNote,
} from '../../../services/personalNoteService';

const MAX_CONTENT_LENGTH = 10000;

export default function PersonalNoteModal({ nodeId, nodeTitle, onClose, onChanged }) {
  const [note, setNote] = useState(null);
  const [content, setContent] = useState('');
  const [initialContent, setInitialContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const textareaRef = useRef(null);
  const closeContextRef = useRef({
    deleting: false,
    isDirty: false,
    onClose,
    saving: false,
  });

  const isDirty = content !== initialContent;
  const trimmedContent = content.trim();

  useEffect(() => {
    closeContextRef.current = { deleting, isDirty, onClose, saving };
  }, [deleting, isDirty, onClose, saving]);

  const requestClose = useCallback(() => {
    const closeContext = closeContextRef.current;
    if (!closeContext || closeContext.saving || closeContext.deleting) return;
    if (
      closeContext.isDirty &&
      !window.confirm('Bạn có thay đổi chưa lưu. Bạn vẫn muốn đóng ghi chú?')
    ) {
      return;
    }
    closeContext.onClose();
  }, []);

  useEffect(() => {
    let active = true;

    const loadNote = async () => {
      try {
        setLoading(true);
        const data = await getPersonalNote(nodeId);
        if (!active) return;
        const existingContent = data?.content || '';
        setNote(data);
        setContent(existingContent);
        setInitialContent(existingContent);
      } catch (error) {
        if (active) {
          toast.error(error?.response?.data?.message || 'Không thể tải ghi chú.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadNote();
    return () => {
      active = false;
    };
  }, [nodeId]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement = document.activeElement;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElement?.focus?.();
    };
  }, [requestClose]);

  useEffect(() => {
    if (!loading) textareaRef.current?.focus();
  }, [loading]);

  const handleSave = async () => {
    if (!trimmedContent || saving) return;

    try {
      setSaving(true);
      const savedNote = await savePersonalNote(nodeId, trimmedContent);
      setNote(savedNote);
      setContent(savedNote.content);
      setInitialContent(savedNote.content);
      onChanged?.(savedNote);
      toast.success(note ? 'Đã cập nhật ghi chú.' : 'Đã tạo ghi chú.');
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể lưu ghi chú.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!note || deleting) return;

    try {
      setDeleting(true);
      await deletePersonalNote(nodeId);
      onChanged?.(null);
      toast.success('Đã xóa ghi chú.');
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể xóa ghi chú.');
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="personal-note-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving && !deleting) requestClose();
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <NotebookPen className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 id="personal-note-title" className="text-lg font-bold text-slate-900">
                Ghi chú cá nhân
              </h2>
              <p className="mt-0.5 truncate text-sm text-slate-500">{nodeTitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={requestClose}
            disabled={saving || deleting}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Đóng ghi chú"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="px-6 py-5">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              Đang tải ghi chú...
            </div>
          ) : (
            <>
              <label htmlFor="personal-note-content" className="sr-only">Nội dung ghi chú</label>
              <textarea
                ref={textareaRef}
                id="personal-note-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                maxLength={MAX_CONTENT_LENGTH}
                rows={12}
                placeholder="Ghi lại kiến thức quan trọng, câu hỏi hoặc điều bạn muốn ôn tập..."
                className="min-h-72 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
              <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                <span className={isDirty ? 'font-medium text-amber-600' : 'text-slate-400'}>
                  {isDirty ? 'Có thay đổi chưa lưu' : note ? 'Ghi chú đã được lưu' : 'Chưa có ghi chú'}
                </span>
                <span className={content.length >= MAX_CONTENT_LENGTH ? 'text-rose-600' : 'text-slate-400'}>
                  {content.length.toLocaleString('vi-VN')}/{MAX_CONTENT_LENGTH.toLocaleString('vi-VN')}
                </span>
              </div>
            </>
          )}
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {note && !confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                disabled={loading || saving}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Xóa ghi chú
              </button>
            ) : note && confirmDelete ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600">
                  <AlertTriangle className="h-3.5 w-3.5" /> Xác nhận xóa?
                </span>
                <button type="button" onClick={handleDelete} disabled={deleting} className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">
                  {deleting ? 'Đang xóa...' : 'Xóa'}
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)} disabled={deleting} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100">
                  Hủy
                </button>
              </div>
            ) : null}
          </div>

          <div className="flex gap-2 sm:justify-end">
            <button type="button" onClick={requestClose} disabled={saving || deleting} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 sm:flex-none">
              Đóng
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading || saving || deleting || !trimmedContent || !isDirty}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Đang lưu...' : 'Lưu ghi chú'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
