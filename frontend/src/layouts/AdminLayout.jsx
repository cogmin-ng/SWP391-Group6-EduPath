import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Topbar from '../components/admin/Topbar';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auto-close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className={`
        flex-1 flex flex-col transition-all duration-300
        ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}
      `}>
        <Topbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>

        <footer className="py-6 px-8 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} EduPath - Hệ thống quản trị. Xây dựng bởi React & Tailwind.
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
