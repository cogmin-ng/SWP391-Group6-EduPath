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

const RoadmapApprovalPage = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Pending Approval', count: 12, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'Approved', count: 145, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'Rejected', count: 8, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
    { label: 'Total Submitted', count: 165, icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  ];

  const roadmaps = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      advisor: 'Sarah Jenkins',
      category: 'Development',
      submitted: 'Oct 12, 2024',
      status: 'Pending',
      duration: '6 Weeks',
      modulesCount: 8,
      difficulty: 'Advanced',
      image: '/api/placeholder/400/225', // Fallback
      modules: [
        { title: 'Module 1: Hooks & Composition', lessons: ['Deep Dive into Custom Hooks', 'Component Injection Patterns'] },
        { title: 'Module 2: State Management', lessons: ['Context API', 'Reducer Patterns'] },
      ]
    },
    {
      id: 2,
      title: 'UI Design Fundamentals',
      advisor: 'Marcus Chen',
      category: 'Design',
      submitted: 'Oct 11, 2024',
      status: 'Approved',
      duration: '4 Weeks',
      modulesCount: 6,
      difficulty: 'Beginner',
    },
    {
      id: 3,
      title: 'Product Management 101',
      advisor: 'Elena Rodriguez',
      category: 'Business',
      submitted: 'Oct 10, 2024',
      status: 'Pending',
      duration: '5 Weeks',
      modulesCount: 7,
      difficulty: 'Intermediate',
    },
    {
      id: 4,
      title: 'Data Science Basics',
      advisor: 'Dr. Jane Doe',
      category: 'Technology',
      submitted: 'Oct 08, 2024',
      status: 'Approved',
      duration: '8 Weeks',
      modulesCount: 12,
      difficulty: 'Intermediate',
    }
  ];

  useEffect(() => {
    if (roadmaps.length > 0) {
      setSelectedRoadmap(roadmaps[0]);
    }
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-100';
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
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Roadmap Approval</h1>
        <p className="text-slate-500 mt-1">Review and manage curriculum submissions from advisors.</p>
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
            placeholder="Search roadmaps by title or advisor..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4 text-slate-400" />
            Categories
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            Advisor
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-2xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            Export Report
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
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Advisor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Submitted</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-right">Status</th>
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
                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <User className="w-4 h-4" />
                       </div>
                       <p className="text-sm font-medium text-slate-700">{roadmap.advisor}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                      {roadmap.category}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-slate-500 font-medium">{roadmap.submitted}</p>
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
          <div className="p-4 border-t border-slate-50 flex justify-center">
              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-2">
                View All Submissions <ChevronRight className="w-4 h-4" />
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
                        {selectedRoadmap.category}
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
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Advisor</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 truncate">{selectedRoadmap.advisor}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-3 mb-1">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{selectedRoadmap.duration || '6 Weeks'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-3 mb-1">
                    <Layers className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Modules</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{selectedRoadmap.modulesCount || 8} Modules</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-3 mb-1">
                    <BarChart className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Level</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{selectedRoadmap.difficulty || 'Advanced'}</p>
                </div>
              </div>

              {/* Structure Preview */}
              <div className="p-6">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                  Roadmap Structure
                </h4>
                <div className="space-y-3">
                  {(selectedRoadmap.modules || [
                    { title: 'Module 1: Getting Started', lessons: ['Introduction', 'Core Concepts'] },
                    { title: 'Module 2: Advanced Techniques', lessons: ['Deep Dive', 'Best Practices'] }
                  ]).map((mod, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 group transition-all hover:bg-indigo-100/50">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-black text-indigo-700">{mod.title}</p>
                        <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="space-y-1 pl-2">
                        {mod.lessons.map((lesson, lIdx) => (
                          <div key={lIdx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span className="text-[11px] font-medium text-slate-600">{lesson}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="p-6 pt-0 flex flex-col gap-3">
                <button className="w-full py-4 bg-indigo-600 text-white rounded-[1.25rem] text-sm font-black flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-200 group">
                  <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  View Full Details
                </button>
                <button className="w-full py-4 bg-white text-slate-900 border-2 border-slate-900 rounded-[1.25rem] text-sm font-black flex items-center justify-center gap-3 hover:bg-slate-50 transition-all group">
                  <Play className="w-4 h-4 fill-slate-900 group-hover:scale-110 transition-transform" />
                  Start Review
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-300 h-[600px] flex flex-col items-center justify-center text-center p-8">
               <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                 <Layers className="w-10 h-10 text-slate-300" />
               </div>
               <h3 className="text-lg font-bold text-slate-900">No Roadmap Selected</h3>
               <p className="text-slate-500 text-sm mt-2 max-w-[240px]">Select a roadmap from the table to preview its content and begin the review process.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RoadmapApprovalPage;
