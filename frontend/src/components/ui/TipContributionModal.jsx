import { useState } from 'react';
import { X, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitTip } from '../../services/roadmapService';

const TipContributionModal = ({ nodeId, onClose, onSubmitted }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Vui lòng nhập tiêu đề và nội dung');
      return;
    }

    setLoading(true);
    try {
      await submitTip(nodeId, { title, content });
      toast.success('Gửi đóng góp thành công. Chờ duyệt bởi Mentor.');
      setTitle('');
      setContent('');
      if (onSubmitted) onSubmitted();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gửi đóng góp thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl z-10 overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/30 border-b border-indigo-100 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Lightbulb className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Đóng góp Tip</h3>
              <p className="text-xs text-slate-500 mt-0.5">Chia sẻ kinh nghiệm và mẹo hữu ích</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tiêu đề</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="Tiêu đề ngắn gọn..."
              />
            </div>

            {/* Content Textarea - compact */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nội dung</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                rows={4}
                placeholder="Mô tả chi tiết, ví dụ: mẹo, thủ thuật, lưu ý..."
              />
            </div>

            {/* Buttons - Always visible */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all duration-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all duration-200 shadow-sm shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang gửi
                  </>
                ) : (
                  'Gửi đề xuất'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TipContributionModal;
