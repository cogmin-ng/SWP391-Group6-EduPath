import {
  X,
  User,
  GraduationCap,
  Code,
  Monitor,
  CheckCircle2,
  XCircle,
  Calendar
} from 'lucide-react';

const MentorRequestDetailModal = ({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <img 
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop" 
              alt="Profile" 
              className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-100"
            />
            <div>
              <h3 className="text-xl font-bold text-slate-900 leading-snug">{request.name}</h3>
              <p className="text-sm text-slate-500 font-medium">Học kỳ {request.currentSemester} &bull; {request.specialization}</p>
            </div>
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
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Tiểu sử / Giới thiệu
            </h4>
            <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100">
              {request.bio}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Kinh nghiệm
            </h4>
            <p className="text-sm text-slate-600 italic whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100">
              "{request.experience}"
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Môn học hướng dẫn
            </h4>
            <div className="flex flex-wrap gap-2">
              {request.mentorSubjects?.map((subject, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-indigo-400" />
                  {subject}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Kết quả học tập (Điểm số)
            </h4>
            <div className="space-y-2">
              {request.academicRecords?.map((record, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <GraduationCap className="w-5 h-5 text-indigo-400" />
                    {record.subjectName}
                  </div>
                  <span className="font-bold text-slate-900">{record.grade}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ngày gửi yêu cầu:
            </h4>
            <span className="text-sm text-slate-700 font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {request.date}
            </span>
          </div>

          {request.transcriptUrl && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Bảng điểm
              </h4>
              <a 
                href={request.transcriptUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 transition-colors rounded-lg text-sm font-semibold text-slate-700"
              >
                <Monitor className="w-4 h-4" /> Xem bảng điểm đầy đủ
              </a>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {request.rawStatus === 'PENDING' && (
          <div className="sticky bottom-0 flex gap-3 p-6 bg-white border-t border-slate-100">
            <button
              onClick={() => onReject(request.id)}
              className="flex-1 py-3 bg-white text-rose-600 border-2 border-rose-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-rose-50 transition-all"
            >
              <XCircle className="w-4 h-4" />
              Từ chối
            </button>
            <button
              onClick={() => onApprove(request.id)}
              className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Phê duyệt
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorRequestDetailModal;
