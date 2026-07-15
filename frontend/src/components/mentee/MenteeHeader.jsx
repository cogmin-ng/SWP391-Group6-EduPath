import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Award,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  Compass,
  FileText,
  GraduationCap,
  Home,
  Lightbulb,
  LogOut,
  Map,
  Menu,
  Settings,
  User,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { notificationService } from '../../services/notificationService';
import { getNotificationTargetRoute } from '../../utils/notificationRoutes';

const accountMenuItems = [
  { label: 'Trang chủ', icon: Home, to: '/mentee/homepage' },
  { label: 'Hồ sơ cá nhân', icon: User, to: '/mentee/profile' },
  { label: 'Lộ trình của tôi', icon: Map, to: '/roadmaps' },
  { label: 'Kho lộ trình', icon: Compass, to: '/explore' },
  { label: 'Tiến độ học tập', icon: BarChart3, action: 'placeholder' },
  { label: 'Đăng kí mentor', icon: GraduationCap, to: '/profile/become-mentor' },
  { label: 'Đóng góp', icon: Lightbulb, to: '/mentee/contributions' },
  { label: 'Huy hiệu', icon: Award, to: '/mentee/badges' },
  { label: 'Chứng chỉ của tôi', icon: FileText, to: '/my-certificates' },
  { label: 'Cài đặt', icon: Settings, action: 'placeholder' },
  { label: 'Đăng xuất', icon: LogOut, action: 'logout' },
];

const headerNavItems = [
  { label: 'Trang chủ', to: '/mentee/homepage' },
  { label: 'Khám phá', to: '/explore' },
  { label: 'Lộ trình của tôi', to: '/roadmaps' },
  { label: 'Đóng góp', to: '/mentee/contributions' },
  { label: 'Chứng chỉ', to: '/my-certificates' },
];

export default function MenteeHeader() {
  const { user: authUser, logout } = useAuth();
  const userId = authUser?.id;
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!userId) return;
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

    fetchNotifications();
    const interval = window.setInterval(fetchNotifications, 60000);
    window.addEventListener('edupath:notifications-changed', fetchNotifications);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('edupath:notifications-changed', fetchNotifications);
    };
  }, [userId]);

  const displayName = authUser?.name || 'Học viên';
  const displayAvatar = authUser?.avatarUrl || authUser?.avatar || '';

  const handleMenuAction = async (item) => {
    setMenuOpen(false);
    setMobileOpen(false);

    if (item.to) {
      navigate(item.to);
      return;
    }

    if (item.action === 'logout') {
      await logout();
      return;
    }
  };

  const handleNotificationClick = async (notification) => {
    const route = getNotificationTargetRoute(notification, 'MENTEE');

    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item))
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    setNotificationsOpen(false);
    navigate(route);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b border-slate-200/70 transition-all ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-sm'
          : 'bg-white/80 backdrop-blur-xl'
      }`}
    >
      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-18">
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/mentee/homepage" className="flex items-center gap-2 select-none group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                EduPath
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {headerNavItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-indigo-50/60 hover:text-indigo-600'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="relative flex shrink-0 items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[9px] font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-800">Thông báo</span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllAsRead}
                        className="flex items-center gap-1 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-xs font-medium text-slate-400">
                        Không có thông báo nào.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {notifications.map((notif) => (
                          <button
                            key={notif.id}
                            type="button"
                            onClick={() => handleNotificationClick(notif)}
                            className={`flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${!notif.isRead ? 'bg-indigo-50/20' : ''}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-xs ${!notif.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-600'}`}>
                                {notif.title}
                              </h4>
                              {!notif.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />}
                            </div>
                            <p className={`text-xs leading-relaxed ${!notif.isRead ? 'text-slate-700' : 'text-slate-500'}`}>
                              {notif.content}
                            </p>
                            <span className="mt-1 text-[10px] font-medium text-slate-400">
                              {new Date(notif.createdAt).toLocaleString('vi-VN')}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 p-1.5 pl-2 shadow-sm transition-shadow hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-600 font-bold text-white">
                {displayAvatar ? (
                  <img src={displayAvatar} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-4.5 w-4.5" />
                )}
              </div>
              <div className="hidden pr-1 text-left sm:block">
                <p className="text-sm font-semibold leading-none text-slate-800">{displayName}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">Mentee</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-14 z-50 w-[min(20rem,calc(100vw-2rem))] max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="mb-1 border-b border-slate-100 px-3 py-2">
                  <p className="text-sm font-semibold text-slate-800">{displayName}</p>
                  <p className="text-xs text-slate-500">Tài khoản học viên</p>
                </div>
                <div className="space-y-1">
                  {accountMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleMenuAction(item)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                      >
                        <Icon className="h-4.5 w-4.5 text-slate-400" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {mobileOpen && (
          <div className="space-y-2 border-t border-slate-100 pb-4 pt-3 lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {headerNavItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl border px-3 py-2 text-center text-sm font-medium ${
                      isActive
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-2">
              {accountMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleMenuAction(item)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Icon className="h-4.5 w-4.5 text-slate-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
