import React from 'react';
import { recentActivities } from '../../mock/dashboardData';

const ActivityTable = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
      case 'Success':
        return 'bg-emerald-50 text-emerald-600';
      case 'Pending':
        return 'bg-amber-50 text-amber-600';
      case 'In Review':
        return 'bg-indigo-50 text-indigo-600';
      default:
        return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Recent Activities</h3>
        <button className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 transition-colors">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {recentActivities.map((activity) => (
              <tr key={activity.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-800">{activity.user}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{activity.action}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-500">{activity.date}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;
