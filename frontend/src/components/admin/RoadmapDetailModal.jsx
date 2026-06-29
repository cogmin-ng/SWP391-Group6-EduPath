import { useState } from 'react';
import {
  X,
  User,
  BookOpen,
  Layers,
  BarChart,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,

} from 'lucide-react';
import NodeDetailModal from './NodeDetailModal';

const getStatusStyles = (status) => {
  switch (status) {
    case 'APPROVED':
    case 'PUBLISHED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'REJECTED':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const RoadmapDetailModal = ({
  roadmap,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isProcessing,
}) => {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!isOpen || !roadmap) return null;

  const nodes = roadmap.nodes || [];
  const isPending = roadmap.status === 'PENDING';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-100">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusStyles(
                  roadmap.status
                )}`}
              >
                {roadmap.status}
              </span>
              {roadmap.subject?.name && (
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-200">
                  {roadmap.subject.name}
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 leading-snug">
              {roadmap.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {roadmap.description && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Mô tả
              </h4>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {roadmap.description}
              </p>
            </div>
          )}

          {/* Thumbnail Preview */}
          {roadmap.thumbnail && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Ảnh đại diện
              </h4>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200">
                <img 
                  src={roadmap.thumbnail} 
                  alt={roadmap.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}



          {/* Quick info grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Mentor
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 truncate">
                {roadmap.mentor?.name || 'Không rõ'}
              </p>
              {roadmap.mentor?.email && (
                <p className="text-xs text-slate-500 truncate">
                  {roadmap.mentor.email}
                </p>
              )}
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Môn học
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 truncate">
                {roadmap.subject?.name || 'N/A'}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Layers className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Số bước (Node)
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900">
                {nodes.length} Bước
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <BarChart className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Phần thưởng XP
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900">
                {roadmap.xpReward || 0} XP
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Ngày gửi: {formatDate(roadmap.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Cập nhật: {formatDate(roadmap.updatedAt)}</span>
            </div>
          </div>

          {/* Node list */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Cấu trúc lộ trình
            </h4>
            {nodes.length === 0 ? (
              <p className="text-sm text-slate-400 italic">
                Lộ trình này chưa có node nào.
              </p>
            ) : (
              <div className="space-y-3">
                {nodes.map((node, idx) => (
                  <div
                    key={node.id || idx}
                    className="flex gap-3 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 group hover:bg-indigo-100/50 transition-all"
                  >
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-indigo-700">
                        {node.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {node.description || 'Chưa có mô tả.'}
                      </p>
                      {/* Sub-info badges */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {node.checklists && node.checklists.length > 0 && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            {node.checklists.length} checklist
                          </span>
                        )}
                        {node.materials && node.materials.length > 0 && (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                            {node.materials.length} tài liệu
                          </span>
                        )}
                        {node.quizzes && node.quizzes.length > 0 && (
                          <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100">
                            {node.quizzes.length} quiz
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNode(node);
                      }}
                      className="flex-shrink-0 self-center p-2 rounded-xl text-indigo-400 hover:text-indigo-700 hover:bg-indigo-100 opacity-0 group-hover:opacity-100 transition-all"
                      title="Xem chi tiết node"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions (only for PENDING roadmaps) */}
        {isPending && (
          <div className="sticky bottom-0 flex gap-3 p-6 bg-white border-t border-slate-100">
            <button
              onClick={() => onReject(roadmap.id)}
              disabled={isProcessing}
              className="flex-1 py-3 bg-white text-rose-600 border-2 border-rose-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <XCircle className="w-4 h-4" />
              Từ chối
            </button>
            <button
              onClick={() => onApprove(roadmap.id)}
              disabled={isProcessing}
              className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isProcessing ? 'Đang xử lý...' : 'Phê duyệt'}
            </button>
          </div>
        )}
      </div>

      {/* Node Detail Modal */}
      <NodeDetailModal
        nodeId={selectedNode?.id}
        nodeTitle={selectedNode?.title}
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
};

export default RoadmapDetailModal;
