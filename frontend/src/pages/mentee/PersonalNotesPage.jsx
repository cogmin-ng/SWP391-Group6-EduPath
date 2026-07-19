import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  NotebookPen,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import MenteeHeader from '../../components/mentee/MenteeHeader';
import PersonalNoteModal from '../../components/mentee/node/PersonalNoteModal';
import {
  exportRoadmapNotesPdf,
  getPersonalNotes,
} from '../../services/personalNoteService';

function formatDate(value) {
  return new Date(value).toLocaleString('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

async function resolveExportError(error) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data instanceof Blob) {
    try {
      const payload = JSON.parse(await error.response.data.text());
      return payload.message;
    } catch {
      return null;
    }
  }
  return null;
}

function downloadBlob(blob, filename) {
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 0);
}

export default function PersonalNotesPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [exportingRoadmapId, setExportingRoadmapId] = useState(null);

  const loadNotes = async () => {
    try {
      const result = await getPersonalNotes();
      setNotes(result.notes || []);
      setTotal(result.total || 0);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Không thể tải danh sách ghi chú.');
    }
  };

  useEffect(() => {
    let active = true;
    getPersonalNotes()
      .then((result) => {
        if (!active) return;
        setNotes(result.notes || []);
        setTotal(result.total || 0);
      })
      .catch((error) => {
        if (active) {
          toast.error(error?.response?.data?.message || 'Không thể tải danh sách ghi chú.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const roadmapGroups = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase('vi-VN');
    const filteredNotes = keyword
      ? notes.filter((note) =>
          [
            note.content,
            note.node.title,
            note.node.learningPath.title,
          ].some((value) => value.toLocaleLowerCase('vi-VN').includes(keyword))
        )
      : notes;

    const groups = new Map();
    filteredNotes.forEach((note) => {
      const roadmap = note.node.learningPath;
      if (!groups.has(roadmap.id)) {
        groups.set(roadmap.id, { roadmap, notes: [] });
      }
      groups.get(roadmap.id).notes.push(note);
    });
    return [...groups.values()];
  }, [notes, search]);

  const handleExport = async (roadmapId) => {
    if (exportingRoadmapId) return;
    try {
      setExportingRoadmapId(roadmapId);
      const { blob, filename } = await exportRoadmapNotesPdf(roadmapId);
      downloadBlob(blob, filename);
      toast.success('Đã xuất ghi chú PDF.');
    } catch (error) {
      const message = await resolveExportError(error);
      toast.error(message || 'Không thể xuất ghi chú PDF.');
    } finally {
      setExportingRoadmapId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MenteeHeader />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-violet-600 to-fuchsia-600 p-6 text-white shadow-xl shadow-indigo-200/50 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-indigo-50">
                <NotebookPen className="h-3.5 w-3.5" /> Personal Learning Notes
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Ghi chú của tôi</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
                Xem, chỉnh sửa và xuất những kiến thức bạn đã ghi lại trong các lộ trình đang học.
              </p>
            </div>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/15">
              <NotebookPen className="h-10 w-10" />
            </div>
          </div>
        </section>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Tất cả ghi chú</h2>
            <p className="mt-1 text-sm text-slate-500">{total} ghi chú trong {roadmapGroups.length} lộ trình</p>
          </div>
          <label className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100 sm:w-80">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="sr-only">Tìm kiếm ghi chú</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo nội dung, Node, lộ trình..."
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        {loading ? (
          <div className="flex min-h-80 items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white text-sm text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" /> Đang tải ghi chú...
          </div>
        ) : roadmapGroups.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{search ? 'Không tìm thấy ghi chú phù hợp' : 'Bạn chưa có ghi chú nào'}</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search ? 'Hãy thử từ khóa khác.' : 'Mở một Node trong lộ trình và chọn “Ghi chú Node” để bắt đầu.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {roadmapGroups.map(({ roadmap, notes: roadmapNotes }) => (
              <section key={roadmap.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <header className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-slate-900">{roadmap.title}</h3>
                      <p className="text-xs text-slate-500">{roadmapNotes.length} ghi chú</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExport(roadmap.id)}
                    disabled={Boolean(exportingRoadmapId)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-100 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-50"
                  >
                    {exportingRoadmapId === roadmap.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {exportingRoadmapId === roadmap.id ? 'Đang xuất...' : 'Xuất PDF'}
                  </button>
                </header>

                <div className="divide-y divide-slate-100">
                  {roadmapNotes.map((note) => (
                    <article key={note.id} className="p-5 transition hover:bg-slate-50/60">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-indigo-600">
                              Node {note.node.orderIndex + 1}
                            </span>
                            <h4 className="font-bold text-slate-900">{note.node.title}</h4>
                          </div>
                          <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{note.content}</p>
                          <p className="mt-3 text-xs text-slate-400">Cập nhật {formatDate(note.updatedAt)}</p>
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedNote(note)}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
                          >
                            <NotebookPen className="h-4 w-4" /> Xem / sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/roadmaps/${roadmap.slug}/learn?nodeId=${note.node.id}&note=open`)}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                          >
                            <ExternalLink className="h-4 w-4" /> Xem trong Node
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {selectedNote ? (
        <PersonalNoteModal
          nodeId={selectedNote.node.id}
          nodeTitle={selectedNote.node.title}
          onClose={() => setSelectedNote(null)}
          onChanged={() => loadNotes()}
        />
      ) : null}
    </div>
  );
}
