import { useState, useEffect, useContext, useRef } from 'react';
import {
  MessageCircle,
  Send,
  Reply,
  Pencil,
  Trash2,
  X,
  Check,
  ChevronDown,
  Loader2,
  CornerDownRight,
} from 'lucide-react';
import AuthContext from '../../../context/AuthContextValue';
import {
  getComments,
  createComment,
  createReply,
  updateComment,
  deleteComment,
} from '../../../services/nodeCommentService';

/* ──────────────────────────────────────────────
   Helper: relative time in Vietnamese
   ────────────────────────────────────────────── */
function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Vừa xong';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} tháng trước`;
  return `${Math.floor(months / 12)} năm trước`;
}

/* ──────────────────────────────────────────────
   Role badge component
   ────────────────────────────────────────────── */
function RoleBadge({ roleName }) {
  if (!roleName) return null;
  const isMentor = roleName.toUpperCase() === 'MENTOR';
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${
        isMentor
          ? 'bg-indigo-100 text-indigo-700'
          : 'bg-emerald-100 text-emerald-700'
      }`}
    >
      {isMentor ? 'Mentor' : 'Mentee'}
    </span>
  );
}

/* ──────────────────────────────────────────────
   Avatar component
   ────────────────────────────────────────────── */
function UserAvatar({ user, size = 'md' }) {
  const sizeClasses = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';
  const name = user?.name || 'U';
  const initial = name.charAt(0).toUpperCase();

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={name}
        className={`${sizeClasses} rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold ring-2 ring-white shadow-sm flex-shrink-0`}
    >
      {initial}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Inline delete confirmation
   ────────────────────────────────────────────── */
function DeleteConfirm({ onConfirm, onCancel, loading }) {
  return (
    <div className="flex items-center gap-1.5 animate-fadeIn">
      <span className="text-xs text-red-500 font-medium">Xóa?</span>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="p-1 rounded-md hover:bg-red-100 text-red-500 transition-colors disabled:opacity-50"
        title="Xác nhận xóa"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Check className="w-3.5 h-3.5" />
        )}
      </button>
      <button
        onClick={onCancel}
        className="p-1 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
        title="Hủy"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Single Reply item
   ────────────────────────────────────────────── */
function ReplyItem({ reply, currentUserId, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  const isOwner = currentUserId && currentUserId === reply.userId;

  const handleSaveEdit = async () => {
    if (!editContent.trim() || editContent.trim() === reply.content) {
      setEditing(false);
      setEditContent(reply.content);
      return;
    }
    setSaving(true);
    try {
      await onUpdate(reply.id, editContent.trim());
      setEditing(false);
    } catch (err) {
      console.error('Failed to update reply:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(reply.id);
    } catch (err) {
      console.error('Failed to delete reply:', err);
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="flex gap-2.5 group animate-fadeIn">
      <div className="flex-shrink-0 pt-0.5">
        <CornerDownRight className="w-4 h-4 text-slate-300 mt-1 mr-1 hidden sm:block" />
      </div>
      <UserAvatar user={reply.user} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-slate-800">
            {reply.user?.name || 'Ẩn danh'}
          </span>
          <RoleBadge roleName={reply.user?.role?.name} />
          <span className="text-[11px] text-slate-400">
            {timeAgo(reply.createdAt)}
          </span>
          {reply.createdAt !== reply.updatedAt && (
            <span className="text-[10px] text-slate-400 italic">(đã sửa)</span>
          )}
        </div>

        {editing ? (
          <div className="mt-1.5">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none bg-white"
              rows={2}
              maxLength={2000}
              autoFocus
            />
            <div className="flex gap-2 mt-1.5">
              <button
                onClick={handleSaveEdit}
                disabled={saving || !editContent.trim()}
                className="px-3 py-1 text-xs font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setEditContent(reply.content);
                }}
                className="px-3 py-1 text-xs font-semibold rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words">
            {reply.content}
          </p>
        )}

        {/* Actions */}
        {isOwner && !editing && (
          <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {confirmDelete ? (
              <DeleteConfirm
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(false)}
                loading={deleting}
              />
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditing(true);
                    setEditContent(reply.content);
                  }}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Chỉnh sửa"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Single Comment item (root)
   ────────────────────────────────────────────── */
function CommentItem({
  comment,
  currentUserId,
  isAuthenticated,
  onUpdate,
  onDelete,
  onReplySubmit,
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = currentUserId && currentUserId === comment.userId;
  const replies = comment.replies || [];

  const handleSaveEdit = async () => {
    if (!editContent.trim() || editContent.trim() === comment.content) {
      setEditing(false);
      setEditContent(comment.content);
      return;
    }
    setSaving(true);
    try {
      await onUpdate(comment.id, editContent.trim());
      setEditing(false);
    } catch (err) {
      console.error('Failed to update comment:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(comment.id);
    } catch (err) {
      console.error('Failed to delete comment:', err);
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    setSubmittingReply(true);
    try {
      await onReplySubmit(comment.id, replyContent.trim());
      setReplyContent('');
      setShowReplyForm(false);
    } catch (err) {
      console.error('Failed to submit reply:', err);
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex gap-3 group">
        <UserAvatar user={comment.user} />
        <div className="flex-1 min-w-0">
          {/* Meta */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-800">
              {comment.user?.name || 'Ẩn danh'}
            </span>
            <RoleBadge roleName={comment.user?.role?.name} />
            <span className="text-[11px] text-slate-400">
              {timeAgo(comment.createdAt)}
            </span>
            {comment.createdAt !== comment.updatedAt && (
              <span className="text-[10px] text-slate-400 italic">
                (đã sửa)
              </span>
            )}
          </div>

          {/* Content or Edit form */}
          {editing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none bg-white"
                rows={3}
                maxLength={2000}
                autoFocus
              />
              <div className="flex gap-2 mt-1.5">
                <button
                  onClick={handleSaveEdit}
                  disabled={saving || !editContent.trim()}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          )}

          {/* Actions bar */}
          {!editing && (
            <div className="flex items-center gap-2 mt-2">
              {isAuthenticated && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                >
                  <Reply className="w-3.5 h-3.5" />
                  Trả lời
                </button>
              )}

              {isOwner && (
                <>
                  {confirmDelete ? (
                    <DeleteConfirm
                      onConfirm={handleDelete}
                      onCancel={() => setConfirmDelete(false)}
                      loading={deleting}
                    />
                  ) : (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditing(true);
                          setEditContent(comment.content);
                        }}
                        className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Reply form */}
          {showReplyForm && (
            <div className="mt-3 flex gap-2 animate-fadeIn">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Viết câu trả lời..."
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none bg-white placeholder:text-slate-400"
                rows={2}
                maxLength={2000}
                autoFocus
              />
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={handleReplySubmit}
                  disabled={submittingReply || !replyContent.trim()}
                  className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Gửi"
                >
                  {submittingReply ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent('');
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                  title="Hủy"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {replies.length > 0 && (
        <div className="ml-6 sm:ml-10 mt-3 space-y-3 border-l-2 border-indigo-100 pl-4">
          {replies.map((r) => (
            <ReplyItem
              key={r.id}
              reply={r}
              currentUserId={currentUserId}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN: DiscussionSection
   ══════════════════════════════════════════════ */
export default function DiscussionSection({ nodeId }) {
  const { user, isAuthenticated } = useContext(AuthContext);

  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalAll, setTotalAll] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [newContent, setNewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const PAGE_SIZE = 10;
  const textareaRef = useRef(null);

  // ─── Fetch comments ──────────────────────────
  const fetchComments = async (skip = 0, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const data = await getComments(nodeId, skip, PAGE_SIZE);
      if (append) {
        setComments((prev) => [...prev, ...data.comments]);
      } else {
        setComments(data.comments);
      }
      setTotal(data.total);
      setTotalAll(data.totalAll);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [nodeId]);

  // ─── Create comment ──────────────────────────
  const handleCreateComment = async () => {
    if (!newContent.trim()) return;
    setSubmitting(true);
    try {
      await createComment(nodeId, { content: newContent.trim() });
      setNewContent('');
      // Re-fetch from top to show newest
      await fetchComments();
    } catch (err) {
      console.error('Failed to create comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Create reply ────────────────────────────
  const handleReplySubmit = async (commentId, content) => {
    await createReply(commentId, { content });
    await fetchComments();
  };

  // ─── Update comment/reply ────────────────────
  const handleUpdate = async (commentId, content) => {
    await updateComment(commentId, { content });
    await fetchComments();
  };

  // ─── Delete comment/reply ────────────────────
  const handleDelete = async (commentId) => {
    await deleteComment(commentId);
    await fetchComments();
  };

  // ─── Load more ───────────────────────────────
  const handleLoadMore = () => {
    fetchComments(comments.length, true);
  };

  const hasMore = comments.length < total;

  // ─── Render ──────────────────────────────────
  return (
    <section className="animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Thảo luận</h3>
              <p className="text-xs text-slate-400">
                Trao đổi kiến thức với cộng đồng học tập.
              </p>
            </div>
          </div>
          {totalAll > 0 && (
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold min-w-[28px]">
              {totalAll}
            </span>
          )}
        </div>

        {/* New comment form */}
        {isAuthenticated ? (
          <div className="mb-5">
            <div className="flex gap-3">
              <UserAvatar user={user} />
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none bg-slate-50 hover:bg-white transition-colors placeholder:text-slate-400"
                  rows={3}
                  maxLength={2000}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      handleCreateComment();
                    }
                  }}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-slate-400">
                    Ctrl + Enter để gửi nhanh
                  </span>
                  <button
                    onClick={handleCreateComment}
                    disabled={submitting || !newContent.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-5 rounded-xl bg-slate-50 border border-dashed border-slate-200 px-4 py-3 text-center">
            <p className="text-sm text-slate-500">
              <a
                href="/login"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Đăng nhập
              </a>{' '}
              để tham gia thảo luận.
            </p>
          </div>
        )}

        {/* Divider */}
        {comments.length > 0 && (
          <div className="border-t border-slate-100 mb-5" />
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          /* Empty state */
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-slate-100 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Chưa có bình luận nào.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Hãy là người đầu tiên chia sẻ suy nghĩ!
            </p>
          </div>
        ) : (
          /* Comments list */
          <div className="space-y-5">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
                isAuthenticated={isAuthenticated}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onReplySubmit={handleReplySubmit}
              />
            ))}

            {/* Load more */}
            {hasMore && (
              <div className="text-center pt-2">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-50"
                >
                  {loadingMore ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  Xem thêm bình luận
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
