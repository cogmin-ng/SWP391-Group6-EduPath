import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LogOut,
  Home,
  Layers,
  ClipboardList,
  BarChart3,
  Bell,
  Search,
  User,
  ChevronDown,
  Plus,
  Award,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const MentorLayout = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { title: 'Trang chủ', icon: Home, path: '/mentor/dashboard' },
    { title: 'Lộ trình của tôi', icon: Layers, path: '/mentor/roadmaps' },
    { title: 'Đánh giá chờ', icon: ClipboardList, path: '/mentor/reviews' },
    { title: 'Thống kê', icon: BarChart3, path: '/mentor/analytics' },
    { title: 'Tạo lộ trình', icon: Plus, path: '/mentor/create-roadmap' },
    { title: 'Hồ sơ cá nhân', icon: User, path: '/mentor/profile' },
    { title: 'Thành tích', icon: Award, path: '/mentor/achievements' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Topbar */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Left Side: Logo & Search */}
          <div className="flex items-center gap-4 flex-1">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 mr-8">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-lg text-white">E</span>
              </div>
              <span className="font-bold text-xl text-slate-900 hidden sm:inline">EduPath</span>
            </Link>

            <div className="hidden md:flex items-center relative max-w-md w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                placeholder="Search roadmaps..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Right Side: Icons & Profile */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 relative group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>

              {/* Notifications Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                <div className="px-4 py-2 border-b border-slate-100 font-semibold text-slate-800">
                  Notifications
                </div>
                <div className="px-4 py-3 text-sm text-slate-500">
                  No new notifications
                </div>
              </div>
            </button>

            <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 p-1.5 hover:bg-slate-100 rounded-xl transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <User className="w-5 h-5" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-slate-800 leading-none">
                    Mentor User
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                  {/* Profile Header */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">Mentor User</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {menuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <item.icon className="w-4 h-4 text-slate-400" />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Logout */}
                  <div className="px-4 py-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-8 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} EduPath Mentor Dashboard. Built with React & Tailwind.
      </footer>
    </div>
  );
};

export default MentorLayout;
