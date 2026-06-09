import { Eye, Edit2, Layers, Users } from 'lucide-react';

const MentorRoadmapCard = ({ roadmap, onView, onEdit }) => {
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

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Card Header with Status */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex-1 line-clamp-2">
            {roadmap.title}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${getStatusColor(roadmap.status)}`}>
            {roadmap.status}
          </span>
        </div>
        <p className="text-sm text-slate-500 line-clamp-2">{roadmap.description}</p>
      </div>

      {/* Card Body with Stats */}
      <div className="p-6 bg-slate-50/50">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Node Count */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Nút</p>
              <p className="text-sm font-bold text-slate-900">{roadmap.nodeCount}</p>
            </div>
          </div>

          {/* Student Count */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
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
      <div className="px-6 py-4 bg-white border-t border-slate-100 flex gap-3">
        <button
          onClick={() => onView?.(roadmap.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
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
