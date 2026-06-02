import React, { useState } from 'react';
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
  const [selectedRequest, setSelectedRequest] = useState({
    id: 1,
    name: "Nguyen Van A",
    subtitle: "University Student • Beginner",
    goal: "Frontend Development in 6 months",
    techStack: ["React", "JavaScript", "HTML/CSS", "Tailwind"],
    statement: "I have been self-learning for 3 months but feel overwhelmed by advanced concepts. I am seeking structured guidance and code reviews to accelerate my journey toward a professional career.",
    schedule: {
      days: "Tuesdays & Thursdays",
      time: "7:00 PM – 9:00 PM (GMT+7)"
    },
    requestedAt: "2 hours ago",
    status: "Pending"
  });

  const stats = [
    { label: "Pending Requests", value: "24", growth: "+12%", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Accepted", value: "86", growth: "+5%", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Rejected", value: "12", growth: "-2%", icon: XCircle, color: "text-rose-500", bg: "bg-rose-50" },
    { label: "Active Mentees", value: "43", growth: "+8", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  const requests = [
    { id: 1, name: "Nguyen Van A", goal: "Frontend", date: "2 hours ago", status: "Pending" },
    { id: 2, name: "Tran Minh Khang", goal: "Full Stack", date: "5 hours ago", status: "Pending" },
    { id: 3, name: "Le Thi Mai", goal: "Data Science", date: "Yesterday", status: "Accepted" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Accepted': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
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
            placeholder="Search by learner name..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
            <Mail className="w-5 h-5" />
          </button>
          <button className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <span className="text-lg leading-none">+</span> Open Sessions
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
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Filters:</span>
        <div className="flex flex-wrap gap-2">
          {['Learning Goal', 'Category', 'Status'].map((filter) => (
            <button key={filter} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 flex items-center gap-2 hover:border-indigo-500 hover:text-indigo-600 transition-colors">
              {filter}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          ))}
          <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 flex items-center gap-2 hover:bg-slate-100 transition-colors ml-auto lg:ml-0">
            <Calendar className="w-4 h-4" />
            Last 30 Days
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
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Learner Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Goal</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Requested Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
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
                    <td className="px-6 py-4 text-slate-600">{req.goal}</td>
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
                  <p className="text-sm text-slate-500 font-medium">{selectedRequest.subtitle}</p>
                </div>
              </div>

              {/* Detail Items */}
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Learning Goal</label>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-sm text-slate-700 font-medium flex items-start gap-2">
                      <Monitor className="w-4 h-4 text-indigo-500 mt-0.5" />
                      {selectedRequest.goal}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Tech Stack</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.techStack.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                        <Code className="w-3 h-3 text-indigo-400" />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Personal Statement</label>
                  <p className="text-sm text-slate-600 italic leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    "{selectedRequest.statement}"
                  </p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Preferred Schedule</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      {selectedRequest.schedule.days}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      {selectedRequest.schedule.time}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <button className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-[0.98]">
                  Accept Request
                </button>
                <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 transition-all active:scale-[0.98]">
                  Schedule Interview
                </button>
                <button className="w-full py-2.5 text-rose-600 font-bold text-sm hover:bg-rose-50 rounded-lg transition-all">
                  Reject Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorRequestPage;
