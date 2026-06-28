import StatsCard from '../../components/admin/StatsCard';
import DashboardCharts from '../../components/admin/DashboardCharts';
import ActivityTable from '../../components/admin/ActivityTable';
import { statsData } from '../../mock/dashboardData';

const DashboardPage = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Tổng quan Bảng điều khiển</h1>
        <p className="text-slate-500">Chào mừng trở lại, Admin. Đây là những gì đang diễn ra hôm nay.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <StatsCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <DashboardCharts />

      {/* Recent Activities Section */}
      <div className="mb-8">
        <ActivityTable />
      </div>
    </div>
  );
};

export default DashboardPage;
