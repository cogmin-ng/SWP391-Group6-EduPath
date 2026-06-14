import { useState } from 'react';
import { AlertCircle, Clock, User } from 'lucide-react';
import TipReviewModal from '../ui/TipReviewModal';
import { approveTip, rejectTip } from '../../services/roadmapService';
import toast from 'react-hot-toast';

const PendingTipsSection = ({ tips, onRefresh, isLoading }) => {
  const [selectedTip, setSelectedTip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectTip = (tip) => {
    setSelectedTip(tip);
    setIsModalOpen(true);
  };

  const handleCloseTip = () => {
    setIsModalOpen(false);
    setSelectedTip(null);
  };

  const handleApproveTip = async (tipId) => {
    setIsProcessing(true);
    try {
      await approveTip(tipId);
      if (onRefresh) onRefresh();
      handleCloseTip();
    } catch (err) {
      console.error('Error approving tip:', err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectTip = async (tipId, reason) => {
    setIsProcessing(true);
    try {
      await rejectTip(tipId, reason);
      if (onRefresh) onRefresh();
      handleCloseTip();
    } catch (err) {
      console.error('Error rejecting tip:', err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!tips || tips.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-center py-12 flex-col">
          <div className="inline-block mb-3 p-3 bg-emerald-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-slate-700 font-medium">Không có Tips chờ duyệt</p>
          <p className="text-sm text-slate-500 mt-1">Mọi Tips đã được xử lý!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-slate-50">
          <h3 className="text-lg font-semibold text-slate-900">
            Tips Chờ Duyệt ({tips.length})
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Duyệt các Tips được đóng góp từ Mentees
          </p>
        </div>

        {/* Tips List */}
        <div className="divide-y divide-slate-200">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="p-6 hover:bg-slate-50 transition-colors duration-200 cursor-pointer group"
              onClick={() => handleSelectTip(tip)}
            >
              {/* Title & Node */}
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h4 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {tip.title || '(Không có tiêu đề)'}
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Node: <span className="font-medium">{tip.node?.title || 'N/A'}</span>
                  </p>
                </div>
              </div>

              {/* Content Preview */}
              <p className="text-slate-700 text-sm mb-4 line-clamp-2">
                {tip.content}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm">
                {/* Contributor */}
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>
                    {tip.contributor?.name || 'Unknown'}
                    <span className="text-slate-500 ml-1">({tip.contributor?.email})</span>
                  </span>
                </div>

                {/* Submitted Date */}
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>{formatDate(tip.createdAt)}</span>
                </div>
              </div>

              {/* Action Hint */}
              <div className="mt-4 flex items-center justify-end">
                <span className="text-xs text-slate-500 group-hover:text-indigo-600 transition-colors">
                  Nhấn để xem chi tiết →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip Review Modal */}
      <TipReviewModal
        tip={selectedTip}
        isOpen={isModalOpen}
        onClose={handleCloseTip}
        onApprove={handleApproveTip}
        onReject={handleRejectTip}
        isLoading={isProcessing}
      />
    </>
  );
};

export default PendingTipsSection;
