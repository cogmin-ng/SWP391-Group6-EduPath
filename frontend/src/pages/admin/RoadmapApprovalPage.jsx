import { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Filter,
  Clock,
  Layers,
  BarChart,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  User,
  MoreVertical,
  Bell,
  Eye,
  Play,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getPendingRoadmaps, getRoadmapStatsByAdmin, reviewRoadmap } from '../../services/roadmapService';
import RoadmapDetailModal from '../../components/admin/RoadmapDetailModal';

const RoadmapApprovalPage = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [uiStatusFilter, setUiStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [roadmaps, setRoadmaps] = useState([]);
  const [statsData, setStatsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await getRoadmapStatsByAdmin();
      setStatsData(data || {});
    } catch (err) {
      console.error('Failed to fetch roadmap stats:', err);
    }
  };

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const data = await getPendingRoadmaps(0, 50, 'ALL');
      const filteredData = (data.roadmaps || []).filter(r => r.status?.toUpperCase() !== 'DRAFT');
      setRoadmaps(filteredData);
      if (filteredData.length > 0) {
        setSelectedRoadmap(filteredData[0]);
      } else {
        setSelectedRoadmap(null);
      }
    } catch (err) {
      console.error('Failed to fetch pending roadmaps:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRoadmaps();
  }, []);

  const uniqueSubjects = ['ALL', ...new Set(roadmaps.map(r => r.subject?.name).filter(Boolean))];

  const filteredRoadmaps = roadmaps.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.mentor?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchSubject = subjectFilter === 'ALL' || r.subject?.name === subjectFilter;
    const normalizedStatus = (status) => {
      if (!status) return '';
      const s = status.toUpperCase();
      if (s === 'PUBLISHED' || s === 'APPROVED') return 'APPROVED';
      if (s === 'REJECTED') return 'REJECTED';
      if (s === 'PENDING') return 'PENDING';
      return s;
    };
    const matchStatus = uiStatusFilter === 'ALL' || normalizedStatus(r.status) === uiStatusFilter;
    
    let matchDate = true;
    if (dateFilter !== 'ALL') {
      const roadmapDate = new Date(r.createdAt);
      const today = new Date();
      const diffDays = (today - roadmapDate) / (1000 * 60 * 60 * 24); 
      matchDate = diffDays <= parseInt(dateFilter, 10);
    }

    return matchSearch && matchSubject && matchStatus && matchDate;
  });

  const handleReview = async (roadmapId, status, feedback = '') => {
    const isReject = status === 'REJECTED';
    if (isReject && !window.confirm('Bạn có chắc muốn từ chối lộ trình này?')) {
      return;
    }

    try {
      setProcessing(true);
      await reviewRoadmap(roadmapId, status, feedback);
      toast.success(
        `Lộ trình đã được ${isReject ? 'từ chối' : 'phê duyệt'} thành công!`
      );
      setDetailOpen(false);
      // Refresh data
      fetchStats();
      fetchRoadmaps();
    } catch (err) {
      console.error('Failed to review roadmap:', err);
      toast.error(err?.message || 'Có lỗi xảy ra khi thực hiện đánh giá!');
    } finally {
      setProcessing(false);
    }
  };

  const stats = [
    { label: 'Chờ phê duyệt', count: statsData.PENDING || 0, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', filterValue: 'PENDING' },
    { label: 'Đã phê duyệt', count: statsData.APPROVED || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', filterValue: 'APPROVED' },
    { label: 'Bị từ chối', count: statsData.REJECTED || 0, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', filterValue: 'REJECTED' },
    { label: 'Tổng số đã gửi', count: Object.values(statsData).reduce((a, b) => a + b, 0), icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', filterValue: 'ALL' },
  ];

  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'Approved':
      case 'PUBLISHED':
        return 'Đã phê duyệt';
      case 'REJECTED':
      case 'Rejected':
        return 'Từ chối';
      case 'PENDING':
      case 'Pending':
        return 'Chờ phê duyệt';
      default:
        return status;
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'Approved':
      case 'PUBLISHED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'REJECTED':
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'PENDING':
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Phê duyệt Lộ trình</h1>
        <p className="text-slate-500 mt-1">Xem xét và quản lý các nội dung lộ trình học tập do Mentor gửi lên.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`bg-white p-6 rounded-3xl border ${stat.border} shadow-sm transition-all duration-300`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stat.count}</p>
              </div>
              <div className={`${stat.bg} p-3 rounded-2xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm lộ trình theo tiêu đề hoặc mentor..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Filters */}
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mr-2">BỘ LỌC:</span>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none pr-8 relative"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center' }}
          >
            <option value="ALL">Môn Học (Tất cả)</option>
            {uniqueSubjects.filter(s => s !== 'ALL').map(subject => (
              <option key={subject} value={subject}>{subject}</option>
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

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT SIDE: Roadmap Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[750px]">
          <div className="overflow-y-auto overflow-x-auto custom-scrollbar flex-1 relative">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm">
                <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Tiêu đề</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Mentor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center">Môn học</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Ngày gửi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRoadmaps.map((roadmap) => (
                <tr
                  key={roadmap.id}
                  onClick={() => setSelectedRoadmap(roadmap)}
                  className={`cursor-pointer transition-all hover:bg-slate-50/80 ${selectedRoadmap?.id === roadmap.id ? 'bg-indigo-50/50' : ''}`}
                >
                  <td className="px-6 py-5">
                    <p className={`font-bold text-sm ${selectedRoadmap?.id === roadmap.id ? 'text-indigo-600' : 'text-slate-900'}`}>{roadmap.title}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold uppercase overflow-hidden">
                        {roadmap.mentor?.avatar ? (
                          <img src={roadmap.mentor.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          roadmap.mentor?.name?.[0] || <User className="w-4 h-4" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-700">{roadmap.mentor?.name || 'Unknown'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                      {roadmap.subject?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-slate-500 font-medium">{new Date(roadmap.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className={`inline-block whitespace-nowrap px-4 py-1.5 rounded-xl text-xs font-bold border ${getStatusStyles(roadmap.status)}`}>
                      {getStatusText(roadmap.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Đang tải danh sách lộ trình...</div>}
          {!loading && filteredRoadmaps.length === 0 && <div className="p-12 text-center text-slate-400 font-medium italic">Không tìm thấy lộ trình nào.</div>}
          </div>
        </div>

        {/* RIGHT SIDE: Roadmap Preview Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
          {selectedRoadmap ? (
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
              {/* Preview Header / Image */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  src={selectedRoadmap.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800"}
                  alt={selectedRoadmap.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
                        {selectedRoadmap.subject?.name || 'N/A'}
                      </span>
                      <h3 className="text-xl font-black text-white leading-tight">
                        {selectedRoadmap.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setDetailOpen(true)}
                      title="Xem chi tiết"
                      className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="p-6 grid grid-cols-2 gap-4 border-b border-slate-100">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-3 mb-1">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mentor</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 truncate">{selectedRoadmap.mentor?.name || 'Không rõ'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-3 mb-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thời gian</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">Linh hoạt</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-3 mb-1">
                    <Layers className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Số bước (Node)</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{selectedRoadmap.nodes?.length || 0} Bước</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-3 mb-1">
                    <BarChart className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phần thưởng XP</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{selectedRoadmap.xpReward || 0} XP</p>
                </div>
              </div>

              {/* Structure Preview */}
              <div className="p-6">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                  Cấu trúc lộ trình
                </h4>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {(selectedRoadmap.nodes || []).map((node, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 group transition-all hover:bg-indigo-100/50">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-black text-indigo-700">{node.title}</p>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{node.description || 'Chưa có mô tả.'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="p-6 pt-0 flex flex-col gap-3">
                <button
                  onClick={() => setDetailOpen(true)}
                  className="w-full py-3 bg-slate-100 text-slate-700 rounded-[1.25rem] text-sm font-black flex items-center justify-center gap-3 hover:bg-slate-200 transition-all group"
                >
                  <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Xem chi tiết
                </button>
                {selectedRoadmap.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleReview(selectedRoadmap.id, 'APPROVED')}
                      disabled={processing}
                      className="w-full py-4 bg-emerald-600 text-white rounded-[1.25rem] text-sm font-black flex items-center justify-center gap-3 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-emerald-200 group"
                    >
                      <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      {processing ? 'Đang xử lý...' : 'Phê duyệt Lộ trình'}
                    </button>
                    <button
                      onClick={() => handleReview(selectedRoadmap.id, 'REJECTED')}
                      disabled={processing}
                      className="w-full py-4 bg-white text-rose-600 border-2 border-rose-600 rounded-[1.25rem] text-sm font-black flex items-center justify-center gap-3 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
                    >
                      <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Từ chối Lộ trình
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-300 h-[600px] flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                <Layers className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Chưa chọn lộ trình</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-[240px]">Chọn một lộ trình từ danh sách bên cạnh để xem trước nội dung và bắt đầu đánh giá.</p>
            </div>
          )}
        </div>

      </div>

      {/* Roadmap Detail Modal */}
      <RoadmapDetailModal
        roadmap={selectedRoadmap}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        onApprove={(id) => handleReview(id, 'APPROVED')}
        onReject={(id) => handleReview(id, 'REJECTED')}
        isProcessing={processing}
      />
    </div>
  );
};

export default RoadmapApprovalPage;
