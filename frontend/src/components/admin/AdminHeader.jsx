import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getNotificationTargetRoute } from '../../utils/notificationRoutes';
import {
  LayoutDashboard,
  Users,
  Layers,
  CheckCircle,
  UserPlus,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  User,
  Menu,
  X,
  Check,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { notificationService } from '../../services/notificationService';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Monitor scroll for shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const [notifData, unreadData] = await Promise.all([
        notificationService.getNotifications({ skip: 0, take: 5 }),
        notificationService.getUnreadCount(),
      ]);
      setNotifications(notifData?.notifications || []);
      setUnreadCount(unreadData?.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notification) => {
    const route = getNotificationTargetRoute(notification, 'ADMIN');

    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification.id);
        fetchNotifications();
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    navigate(route);
  };

  const handleMarkAsRead = async (id, currentIsRead) => {
    if (currentIsRead) return;
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { title: 'Bảng điều khiển', icon: LayoutDashboard, path: '/admin/dashboard' },
    { title: 'Quản lý người dùng', icon: Users, path: '/admin/users' },
    { title: 'Quản lý danh mục', icon: Layers, path: '/admin/categories' },
    { title: 'Phê duyệt lộ trình', icon: CheckCircle, path: '/admin/roadmaps' },
    { title: 'Yêu cầu Mentor', icon: UserPlus, path: '/admin/mentors' },
  ];

  const displayName = user?.name || 'Quản trị viên';
  const displayAvatar = user?.avatarUrl || user?.avatar || '';

  return (
    <header
      className={`sticky top-0 z-40 border-b border-slate-200 transition-all ${
        scrolled
          ? 'bg-white shadow-sm'
          : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Left Side: Logo & Mobile Toggle */}
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link to="/admin/dashboard" className="flex items-center gap-2 select-none group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md shadow-slate-900/20">
                <Shield className="h-5 w-5 text-indigo-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                EduPath <span className="text-indigo-600 font-medium text-base">Quản trị</span>
              </span>
            </Link>
          </div>

          {/* Navigation accessible via Profile Dropdown & Mobile Menu */}

          {/* Right Side: Account Actions, Notification, User Profile */}
          <div className="flex items-center gap-4 shrink-0">
            
            {/* Notifications Dropdown (Hover Group) */}
            <div className="relative group">
              <button 
                onClick={fetchNotifications}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 relative transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-black rounded-full border-2 border-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden flex flex-col z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <span className="font-bold text-slate-800 text-sm">Thông báo</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllAsRead} 
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3 h-3" /> Đánh dấu đã đọc
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto w-full">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-xs text-center text-slate-400 font-medium">
                      Không có thông báo nào.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => handleNotificationClick(notif)}
                          className={`px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50 flex flex-col gap-1 ${!notif.isRead ? 'bg-indigo-50/20' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-xs ${!notif.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-600'}`}>
                              {notif.title}
                            </h4>
                            {!notif.isRead && <span className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1.5" />}
                          </div>
                          <p className={`text-xs leading-relaxed ${!notif.isRead ? 'text-slate-700' : 'text-slate-500'}`}>
                            {notif.content}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium mt-1">
                            {new Date(notif.createdAt).toLocaleString('vi-VN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 p-1.5 pl-2 shadow-xs transition-all hover:bg-slate-50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-600 font-bold">
                  {displayAvatar ? (
                    <img src={displayAvatar} alt={displayName} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4.5 w-4.5 text-slate-500" />
                  )}
                </div>
                <div className="hidden pr-1 text-left sm:block">
                  <p className="text-xs font-bold leading-none text-slate-800">{displayName}</p>
                  <p className="mt-1 text-[9px] font-black uppercase tracking-wider text-indigo-600">Quản trị</p>
                </div>
                <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block transition-transform duration-250" />
              </button>

              {/* Profile Dropdown Panel */}
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="border-b border-slate-100 px-3 py-2.5 mb-1">
                      <p className="text-xs font-bold text-slate-800 truncate">{displayName}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{user?.email || 'admin@edupath.vn'}</p>
                    </div>
                    <div className="space-y-0.5">
                      {navItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        >
                          <item.icon className="h-4 w-4 text-slate-400" />
                          <span>{item.title}</span>
                        </Link>
                      ))}
                      <div className="border-t border-slate-100 mt-1.5 pt-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false);
                            handleLogout();
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 py-3 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `
                  flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all
                  ${isActive
                    ? 'text-indigo-700 bg-indigo-50 border-l-4 border-indigo-600 pl-2.5'
                    : 'text-slate-600 hover:bg-slate-50'
                  }
                `}
              >
                <item.icon className="h-4.5 w-4.5" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>
        )}
        
      </div>
    </header>
  );
}
