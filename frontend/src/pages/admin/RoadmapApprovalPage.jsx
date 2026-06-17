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
  Play
} from 'lucide-react';
import { getPendingRoadmaps, getRoadmapStatsByAdmin, reviewRoadmap } from '../../services/roadmapService';

const RoadmapApprovalPage = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roadmaps, setRoadmaps] = useState([]);
  const [statsData, setStatsData] = useState({});
  const [loading, setLoading] = useState(true);

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
      const data = await getPendingRoadmaps(0, 50);
      setRoadmaps(data.roadmaps || []);
      if (data.roadmaps && data.roadmaps.length > 0) {
        setSelectedRoadmap(data.roadmaps[0]);
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

  const handleReview = async (roadmapId, status, feedback = '') => {
    try {
      await reviewRoadmap(roadmapId, status, feedback);
      alert(`Lộ trình đã được ${status === 'APPROVED' ? 'phê duyệt' : 'từ chối'} thành công!`);
      // Refresh data
      fetchStats();
      fetchRoadmaps();
    } catch (err) {
      console.error('Failed to review roadmap:', err);
      alert('Có lỗi xảy ra khi thực hiện đánh giá!');
    }
  };

  const stats = [
    { label: 'Chờ phê duyệt', count: statsData.PENDING || 0, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'Đã phê duyệt', count: statsData.APPROVED || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'Bị từ chối', count: statsData.REJECTED || 0, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
    { label: 'Tổng số đã gửi', count: Object.values(statsData).reduce((a, b) => a + b, 0), icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  ];

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
          <div key={idx} className={`bg-white p-6 rounded-3xl border ${stat.border} shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-300`}>
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
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Tìm kiếm lộ trình theo tiêu đề hoặc mentor..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4 text-slate-400" />
            Thể loại
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            Mentor
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-2xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT SIDE: Roadmap Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Tiêu đề</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Mentor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center">Môn học</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Ngày gửi</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {roadmaps.map((roadmap) => (
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
                    <p className="text-sm text-slate-500 font-medium">{new Date(roadmap.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-bold border ${getStatusStyles(roadmap.status)}`}>
                      {roadmap.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Đang tải danh sách lộ trình...</div>}
          {!loading && roadmaps.length === 0 && <div className="p-12 text-center text-slate-400 font-medium italic">Không có lộ trình nào đang chờ phê duyệt.</div>}
          <div className="p-4 border-t border-slate-50 flex justify-center">
              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-2">
                Xem toàn bộ đơn gửi <ChevronRight className="w-4 h-4" />
              </button>
          </div>
        </div>

        {/* RIGHT SIDE: Roadmap Preview Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
          {selectedRoadmap ? (
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
              {/* Preview Header / Image */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800" 
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
                    <button className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all">
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
                  onClick={() => handleReview(selectedRoadmap.id, 'APPROVED')}
                  className="w-full py-4 bg-emerald-600 text-white rounded-[1.25rem] text-sm font-black flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 group"
                >
                  <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Phê duyệt Lộ trình
                </button>
                <button 
                  onClick={() => handleReview(selectedRoadmap.id, 'REJECTED')}
                  className="w-full py-4 bg-white text-rose-600 border-2 border-rose-600 rounded-[1.25rem] text-sm font-black flex items-center justify-center gap-3 hover:bg-rose-50 transition-all group"
                >
                  <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Từ chối Lộ trình
                </button>
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
    </div>
  );
};

export default RoadmapApprovalPage;
