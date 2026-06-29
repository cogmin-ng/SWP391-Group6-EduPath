import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/admin/AdminHeader';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <AdminHeader />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-8 text-center text-slate-500 text-sm border-t border-slate-200 bg-white">
        &copy; {new Date().getFullYear()} EduPath - Hệ thống quản trị. Xây dựng bởi React & Tailwind.
      </footer>
    </div>
  );
};

export default AdminLayout;
