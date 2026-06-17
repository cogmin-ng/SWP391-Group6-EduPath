import React, { useState, useEffect } from 'react';
import { mentorApplicationService } from '../../services/mentorApplicationService';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Bell, 
  Filter, 
  ChevronDown, 
  Calendar,
  Mail,
  GraduationCap,
  Briefcase,
  Monitor,
  Code
} from 'lucide-react';

const MentorRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await mentorApplicationService.getAllApplications();
      
      const formattedRequests = data.map(app => ({
        id: app.id,
        name: app.user?.name || "Unknown",
        specialization: app.specialization || "N/A",
        currentSemester: app.currentSemester || "N/A",
        bio: app.bio || "No bio provided",
        experience: app.experience || "No experience provided",
        transcriptUrl: app.transcriptUrl || null,
        mentorSubjects: app.mentorSubjects?.map(ms => ms.subject.name) || [],
        academicRecords: app.academicRecords?.map(ar => ({ subjectName: ar.subject.name, grade: ar.grade })) || [],
        date: new Date(app.createdAt).toLocaleDateString(),
        status: app.status === 'APPROVED' ? 'Đã chấp nhận' : app.status === 'REJECTED' ? 'Đã từ chối' : 'Đang chờ',
        rawStatus: app.status
      }));

      setRequests(formattedRequests);
      if (formattedRequests.length > 0) {
        setSelectedRequest(formattedRequests[0]);
      }
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await mentorApplicationService.updateApplicationStatus(id, status);
      fetchRequests();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const stats = [
    { label: "Yêu cầu đang chờ", value: requests.filter(r => r.rawStatus === 'PENDING').length, growth: "", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Đã chấp nhận", value: requests.filter(r => r.rawStatus === 'APPROVED').length, growth: "", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Đã từ chối", value: requests.filter(r => r.rawStatus === 'REJECTED').length, growth: "", icon: XCircle, color: "text-rose-500", bg: "bg-rose-50" },
    { label: "Tổng số đơn", value: requests.length, growth: "", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang chờ': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Đã chấp nhận': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Đã từ chối': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header (if Topbar doesn't fully cover it based on visual) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên người đăng ký..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
            <Mail className="w-5 h-5" />
          </button>
          <button className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <span className="text-lg leading-none">+</span> Phiên làm việc
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stat.growth.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.growth}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Bộ lọc:</span>
        <div className="flex flex-wrap gap-2">
          {['Mục tiêu', 'Danh mục', 'Trạng thái'].map((filter) => (
            <button key={filter} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 flex items-center gap-2 hover:border-indigo-500 hover:text-indigo-600 transition-colors">
              {filter}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          ))}
          <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 flex items-center gap-2 hover:bg-slate-100 transition-colors ml-auto lg:ml-0">
            <Calendar className="w-4 h-4" />
            30 ngày qua
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests Table Column */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên người đăng ký</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Chuyên môn</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày yêu cầu</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {requests.map((req) => (
                  <tr 
                    key={req.id} 
                    onClick={() => setSelectedRequest({...selectedRequest, ...req})}
                    className={`group cursor-pointer hover:bg-indigo-50/30 transition-colors ${selectedRequest.id === req.id ? 'bg-indigo-50/50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                          {req.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{req.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{req.specialization}</td>
                    <td className="px-6 py-4 text-slate-500">{req.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel Column */}
        <div className="lg:col-span-1 space-y-6">
          {selectedRequest ? (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden sticky top-24">
              <div className="p-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4 mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop" 
                  alt="Profile" 
                  className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-100"
                />
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{selectedRequest.name}</h4>
                  <p className="text-sm text-slate-500 font-medium">Học kỳ {selectedRequest.currentSemester} &bull; {selectedRequest.specialization}</p>
                </div>
              </div>

              {/* Detail Items */}
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Tiểu sử / Giới thiệu</label>
                  <p className="text-sm text-slate-700 font-medium p-3 bg-slate-50 rounded-lg border border-slate-100">
                    {selectedRequest.bio}
                  </p>
                </div>

                 <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Kinh nghiệm</label>
                  <p className="text-sm text-slate-600 italic p-3 bg-slate-50 rounded-lg border border-slate-100 leading-relaxed whitespace-pre-wrap">
                    "{selectedRequest.experience}"
                  </p>
                </div>

                 <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Môn học hướng dẫn</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.mentorSubjects.map((subject, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                        <Code className="w-3 h-3 text-indigo-400" />
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Kết quả học tập (Điểm số)</label>
                  <div className="space-y-2">
                    {selectedRequest.academicRecords.map((record, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                          <GraduationCap className="w-4 h-4 text-indigo-400" />
                          {record.subjectName}
                        </div>
                        <span className="font-bold text-slate-900">{record.grade}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedRequest.transcriptUrl && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Bảng điểm</label>
                    <a 
                      href={selectedRequest.transcriptUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 transition-colors rounded-lg text-sm font-semibold text-slate-700"
                    >
                      <Monitor className="w-4 h-4" /> Xem bảng điểm đầy đủ
                    </a>
                  </div>
                )}
              </div>

               {/* Action Buttons */}
              {selectedRequest.rawStatus === 'PENDING' && (
                <div className="mt-8 space-y-3">
                  <button 
                    onClick={() => handleStatusUpdate(selectedRequest.id, 'APPROVED')}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-[0.98]">
                    Chấp nhận yêu cầu
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedRequest.id, 'REJECTED')}
                    className="w-full py-2.5 text-rose-600 font-bold text-sm hover:bg-rose-50 rounded-lg transition-all">
                    Từ chối yêu cầu
                  </button>
                </div>
              )}
            </div>
          </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 text-center text-slate-500">
              Chọn một đơn đăng ký để xem chi tiết.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorRequestPage;
