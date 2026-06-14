import { useState } from 'react';
import { Eye, Edit2, Layers, Users } from 'lucide-react';

const MentorRoadmapCard = ({ roadmap, onView, onEdit }) => {
  const [imageError, setImageError] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
      case 'Đã Phê Duyệt':
        return 'bg-emerald-50 text-emerald-600';
      case 'Pending':
      case 'Chờ Duyệt':
        return 'bg-amber-50 text-amber-600';
      case 'Draft':
      case 'Nháp':
        return 'bg-slate-100 text-slate-600';
      case 'Rejected':
      case 'Từ Chối':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-slate-50 text-slate-600';
    }
  };

  const hasImage = roadmap.image && !imageError;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Card Image Section */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        {hasImage ? (
          <img
            src={roadmap.image}
            alt={roadmap.title}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
            <span className="text-5xl opacity-20">📚</span>
          </div>
        )}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(roadmap.status)}`}>
          {roadmap.status}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {roadmap.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mt-2">{roadmap.description}</p>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 mt-4 py-4 border-t border-slate-100">
          {/* Node Count */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Layers className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Nút</p>
              <p className="text-sm font-bold text-slate-900">{roadmap.nodeCount}</p>
            </div>
          </div>

          {/* Student Count */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Học Viên</p>
              <p className="text-sm font-bold text-slate-900">{roadmap.studentCount}</p>
            </div>
          </div>
        </div>

        {/* Updated Date */}
        <p className="text-xs text-slate-400 mb-4">Cập Nhật {roadmap.updatedAt}</p>
      </div>

      {/* Card Footer with Actions */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex gap-3">
        <button
          onClick={() => onView?.(roadmap.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors font-medium text-sm"
        >
          <Eye className="w-4 h-4" />
          Xem
        </button>
        <button
          onClick={() => onEdit?.(roadmap.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
        >
          <Edit2 className="w-4 h-4" />
          Chỉnh Sửa
        </button>
      </div>
    </div>
  );
};

export default MentorRoadmapCard;
