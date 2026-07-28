import React, { useState, useEffect } from 'react';
import { XCircle, AlertTriangle, X } from 'lucide-react';

const RejectRoadmapModal = ({
  isOpen,
  onClose,
  onConfirm,
  roadmapTitle = '',
  mentorName = '',
  loading = false,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Vui lòng nhập lý do từ chối.');
      return;
    }
    setError('');
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-rose-50/50">
          <div className="flex items-center gap-3 text-rose-700 font-bold text-lg">
            <div className="p-2 bg-rose-100 rounded-xl">
              <XCircle className="w-5 h-5 text-rose-600" />
            </div>
            <span>Từ chối phê duyệt Lộ trình</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Bạn đang từ chối lộ trình{' '}
            <span className="font-bold text-slate-900">"{roadmapTitle || 'Lộ trình'}"</span>
            {mentorName && (
              <>
                {' '}do mentor <span className="font-bold text-slate-900">{mentorName}</span> biên soạn
              </>
            )}. Vui lòng nhập lý do từ chối dưới đây.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Lý do từ chối <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ví dụ: Cấu trúc lộ trình chưa đủ chi tiết, tài liệu tham khảo chưa hợp lệ..."
              rows={4}
              className={`w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50 rounded-xl border ${
                error ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-200 focus:ring-indigo-500'
              } focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none`}
            />
            {error && (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Phản hồi này sẽ giúp mentor biết cần chỉnh sửa lại nội dung lộ trình.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-rose-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Xác nhận từ chối
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectRoadmapModal;
