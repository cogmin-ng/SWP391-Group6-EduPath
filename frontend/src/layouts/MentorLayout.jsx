import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { getNotificationTargetRoute } from '../utils/notificationRoutes';
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
import { notificationService } from '../services/notificationService';

const MentorLayout = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const [notifData, unreadData] = await Promise.all([
          notificationService.getNotifications({ skip: 0, take: 5 }),
          notificationService.getUnreadCount(),
        ]);

        if (!isMounted) return;
        setNotifications(notifData?.notifications || []);
        setUnreadCount(unreadData?.unreadCount || 0);
      } catch (error) {
        console.error('Failed to fetch mentor notifications:', error);
      }
    };

    fetchNotifications();
    const interval = window.setInterval(fetchNotifications, 60000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    const route = getNotificationTargetRoute(notification, 'MENTOR');

    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item))
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      } catch (error) {
        console.error('Failed to mark mentor notification as read:', error);
      }
    }

    setIsNotificationOpen(false);
    navigate(route);
  };

  const handleMarkAsRead = async (notificationId, alreadyRead) => {
    if (alreadyRead) return;

    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((item) => (item.id === notificationId ? { ...item, isRead: true } : item))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error('Failed to mark mentor notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all mentor notifications as read:', error);
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
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationOpen((prev) => !prev)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Thông báo</span>
                    {notifications.length > 0 && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleMarkAllAsRead();
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-700"
                      >
                        Đọc tất cả
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-slate-500">Không có thông báo mới.</div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <button
                          key={notif.id}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleNotificationClick(notif);
                          }}
                          className={`w-full text-left px-4 py-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 ${!notif.isRead ? 'bg-indigo-50/70' : 'bg-white'}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">{notif.title}</p>
                              <p className="text-sm text-slate-600 mt-1 line-clamp-2">{notif.content}</p>
                            </div>
                            {!notif.isRead && <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>}
                          </div>
                          <p className="text-xs text-slate-400 mt-2">
                            {new Date(notif.createdAt).toLocaleString('vi-VN')}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

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
                    {user?.name || 'Mentor User'}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                  {/* Profile Header */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{user?.name || 'Mentor User'}</p>
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
