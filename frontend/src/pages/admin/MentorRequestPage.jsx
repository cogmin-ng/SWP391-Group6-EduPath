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
  Code,
  Eye
} from 'lucide-react';
import MentorRequestDetailModal from '../../components/admin/MentorRequestDetailModal';

const MentorRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [uiStatusFilter, setUiStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableMajors, setAvailableMajors] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [data, majorsData] = await Promise.all([
        mentorApplicationService.getAllApplications(),
        mentorApplicationService.getMajors(),
      ]);

      const formattedRequests = data.map(app => {
        const matchedMajor = (majorsData || []).find(m => m.id === app.specialization);
        const specializationName = matchedMajor ? matchedMajor.name : (app.specialization || "N/A");

        return {
          id: app.id,
          name: app.user?.name || "Unknown",
          specialization: specializationName,
          currentSemester: app.currentSemester || "N/A",
          bio: app.bio || "No bio provided",
          experience: app.experience || "No experience provided",
          transcriptUrl: app.transcriptUrl || null,
          mentorSubjects: app.mentorSubjects?.map(ms => ms.subject.name) || [],
          academicRecords: app.academicRecords?.map(ar => ({ subjectName: ar.subject.name, grade: ar.grade })) || [],
          date: new Date(app.createdAt).toLocaleDateString(),
          rawDate: app.createdAt,
          status: app.status === 'APPROVED' ? 'Đã phê duyệt' : app.status === 'REJECTED' ? 'Từ chối' : 'Chờ phê duyệt',
          rawStatus: app.status
        };
      });

      setAvailableMajors(majorsData || []);
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
    { label: "Chờ phê duyệt", value: requests.filter(r => r.rawStatus === 'PENDING').length, growth: "", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Đã phê duyệt", value: requests.filter(r => r.rawStatus === 'APPROVED').length, growth: "", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Từ chối", value: requests.filter(r => r.rawStatus === 'REJECTED').length, growth: "", icon: XCircle, color: "text-rose-500", bg: "bg-rose-50" },
    { label: "Tổng số đơn", value: requests.length, growth: "", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Chờ phê duyệt': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Đã phê duyệt': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Từ chối': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSubject = subjectFilter === 'ALL' || r.specialization === subjectFilter;
    const normalizedStatus = (status) => {
      if (!status) return '';
      const s = status.toUpperCase();
      if (s === 'APPROVED') return 'APPROVED';
      if (s === 'REJECTED') return 'REJECTED';
      if (s === 'PENDING') return 'PENDING';
      return s;
    };
    const matchStatus = uiStatusFilter === 'ALL' || normalizedStatus(r.rawStatus) === uiStatusFilter;
    
    let matchDate = true;
    if (dateFilter !== 'ALL') {
      const reqDate = new Date(r.rawDate);
      const today = new Date();
      const diffDays = (today - reqDate) / (1000 * 60 * 60 * 24); 
      matchDate = diffDays <= parseInt(dateFilter, 10);
    }
    return matchSearch && matchSubject && matchStatus && matchDate;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-700">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Phê duyệt Mentor</h1>
        <p className="text-slate-500 mt-1">Xem xét và quản lý các yêu cầu trở thành Mentor từ người dùng.</p>
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
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên người đăng ký..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#fafafa] border border-slate-200 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-indigo-500
                 transition-all text-sm text-slate-600"
          />
        </div>

        {/* Filter */}
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mr-2">
            Bộ lọc:
          </span>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none pr-8 relative"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center' }}
          >
            <option value="ALL">Chuyên ngành (Tất cả)</option>
            {availableMajors.map(major => (
              <option key={major.id} value={major.name}>{major.name}</option>
            ))}
          </select>

          <select
            value={uiStatusFilter}
            onChange={(e) => setUiStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none pr-8 relative"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center' }}
          >
            <option value="ALL">Trạng thái (Tất cả)</option>
            <option value="PENDING">Chờ phê duyệt</option>
            <option value="APPROVED">Đã phê duyệt</option>
            <option value="REJECTED">Bị từ chối</option>
          </select>

          <div className="relative flex items-center">
            <span className="absolute left-3">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-8 pr-8 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none relative min-w-[130px]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center' }}
            >
              <option value="ALL">Lịch (Tất cả)</option>
              <option value="3">3 ngày qua</option>
              <option value="7">7 ngày qua</option>
              <option value="14">14 ngày qua</option>
              <option value="30">30 ngày qua</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests Table Column */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col max-h-[750px]">
          <div className="overflow-y-auto overflow-x-auto custom-scrollbar flex-1 relative">
            <table className="w-full text-left min-w-[700px]">
              <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Tên người đăng ký</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Chuyên ngành</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Ngày yêu cầu</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-400 font-medium italic">Không tìm thấy yêu cầu nào.</td>
                  </tr>
                )}
                {filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => setSelectedRequest({ ...selectedRequest, ...req })}
                    className={`group cursor-pointer hover:bg-indigo-50/30 transition-colors ${selectedRequest?.id === req.id ? 'bg-indigo-50/50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                          {req.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{req.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{req.specialization}</td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{req.date}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-block whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(req.status)}`}>
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
                    <p className="text-sm text-slate-700 font-medium p-3 bg-slate-50 rounded-lg border border-slate-100 line-clamp-3">
                      {selectedRequest.bio}
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Kinh nghiệm</label>
                    <p className="text-sm text-slate-600 italic p-3 bg-slate-50 rounded-lg border border-slate-100 leading-relaxed whitespace-pre-wrap line-clamp-3">
                      "{selectedRequest.experience}"
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> Xem chi tiết đầy đủ
                    </button>
                  </div>
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

      <MentorRequestDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
        onApprove={(id) => {
          handleStatusUpdate(id, 'APPROVED');
          setIsModalOpen(false);
        }}
        onReject={(id) => {
          handleStatusUpdate(id, 'REJECTED');
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default MentorRequestPage;
