import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  ChevronDown,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  Home,
  Layers,
  LogOut,
  Menu,
  Plus,
  User,
  Users,
} from 'lucide-react';
import { getNotificationTargetRoute } from '../utils/notificationRoutes';
import { useAuth } from '../hooks/useAuth';
import { notificationService } from '../services/notificationService';

const menuItems = [
  { title: 'Trang chủ', icon: Home, path: '/mentor/dashboard' },
  { title: 'Lộ trình của tôi', icon: Layers, path: '/mentor/roadmaps' },
  { title: 'Quản lý học viên', icon: Users, path: '/mentor/learners' },
  { title: 'Quản lý đóng góp', icon: ClipboardList, path: '/mentor/reviews' },
  { title: 'Tạo lộ trình', icon: Plus, path: '/mentor/create-roadmap' },
  {
    title: 'Ngân hàng câu hỏi',
    icon: HelpCircle,
    path: '/mentor/question-bank',
  },
  {
    title: 'Đăng ký trở thành mentor',
    icon: GraduationCap,
    path: '/profile/become-mentor',
  },
  { title: 'Hồ sơ cá nhân', icon: User, path: '/mentor/profile' },
];

const headerNavItems = [
  { label: 'Trang chủ', to: '/mentor/dashboard' },
  { label: 'Lộ trình', to: '/mentor/roadmaps' },
  { label: 'Học viên', to: '/mentor/learners' },
  { label: 'Đóng góp', to: '/mentor/reviews' },
  { label: 'Câu hỏi', to: '/mentor/question-bank' },
];

export default function MentorLayout() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const userId = user?.id;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!userId) return undefined;

    let active = true;
    const fetchNotifications = async () => {
      try {
        const [notificationData, unreadData] = await Promise.all([
          notificationService.getNotifications({ skip: 0, take: 5 }),
          notificationService.getUnreadCount(),
        ]);

        if (!active) return;
        setNotifications(notificationData?.notifications || []);
        setUnreadCount(unreadData?.unreadCount || 0);
      } catch (error) {
        console.error('Failed to fetch mentor notifications:', error);
      }
    };

    fetchNotifications();
    const interval = window.setInterval(fetchNotifications, 60000);
    window.addEventListener('edupath:notifications-changed', fetchNotifications);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener(
        'edupath:notifications-changed',
        fetchNotifications
      );
    };
  }, [userId]);

  const displayName = user?.name || 'Mentor';
  const displayAvatar = user?.avatarUrl || user?.avatar || '';

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
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
        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id ? { ...item, isRead: true } : item
          )
        );
        setUnreadCount((current) => Math.max(current - 1, 0));
      } catch (error) {
        console.error('Failed to mark mentor notification as read:', error);
      }
    }

    setNotificationsOpen(false);
    navigate(route);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all mentor notifications as read:', error);
    }
  };

  const closeMenus = () => {
    setMobileOpen(false);
    setProfileOpen(false);
    setNotificationsOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F6F8FC]">
      <header
        className={`sticky top-0 z-40 border-b border-slate-200/70 transition-all ${
          scrolled
            ? 'bg-white/90 shadow-sm backdrop-blur-xl'
            : 'bg-white/80 backdrop-blur-xl'
        }`}
      >
        <div className="px-4 md:px-8">
          <div className="mx-auto flex h-16 max-w-400 items-center justify-between gap-4 lg:h-18">
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                aria-label="Mở menu mentor"
                onClick={() => setMobileOpen((current) => !current)}
                className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link
                to="/mentor/dashboard"
                onClick={closeMenus}
                className="group flex select-none items-center gap-2"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  EduPath
                </span>
              </Link>
            </div>

            <nav className="hidden items-center gap-1 lg:flex">
              {headerNavItems.map((item) => (
                <NavLink
                  key={item.to}
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
                  aria-label="Mở thông báo"
                  onClick={() => {
                    setNotificationsOpen((current) => !current);
                    setProfileOpen(false);
                    if (unreadCount > 0) handleMarkAllAsRead();
                  }}
                  className="relative rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 ? (
                    <span className="absolute right-1 top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-0.5 text-[9px] font-black text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  ) : null}
                </button>

                {notificationsOpen ? (
                  <div className="absolute right-0 top-12 z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3">
                      <span className="text-sm font-semibold text-slate-800">
                        Thông báo
                      </span>
                      {unreadCount > 0 ? (
                        <button
                          type="button"
                          onClick={handleMarkAllAsRead}
                          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Đánh dấu đã đọc
                        </button>
                      ) : null}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length ? (
                        <div className="divide-y divide-slate-100">
                          {notifications.map((notification) => (
                            <button
                              key={notification.id}
                              type="button"
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className={`flex w-full flex-col gap-1 px-4 py-3 text-left transition hover:bg-slate-50 ${
                                notification.isRead ? '' : 'bg-indigo-50/20'
                              }`}
                            >
                              <span className="flex items-start justify-between gap-2">
                                <span
                                  className={`text-xs ${
                                    notification.isRead
                                      ? 'font-semibold text-slate-600'
                                      : 'font-bold text-slate-900'
                                  }`}
                                >
                                  {notification.title}
                                </span>
                                {!notification.isRead ? (
                                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                                ) : null}
                              </span>
                              <span className="text-xs leading-relaxed text-slate-500">
                                {notification.content}
                              </span>
                              <time className="mt-1 text-[10px] font-medium text-slate-400">
                                {new Date(
                                  notification.createdAt
                                ).toLocaleString('vi-VN')}
                              </time>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-center text-xs font-medium text-slate-400">
                          Không có thông báo nào.
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen((current) => !current);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 p-1.5 pl-2 shadow-sm transition hover:bg-slate-50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-600 font-bold text-white">
                  {displayAvatar ? (
                    <img
                      src={displayAvatar}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-4.5 w-4.5" />
                  )}
                </span>
                <span className="hidden pr-1 text-left sm:block">
                  <span className="block text-sm font-semibold leading-none text-slate-800">
                    {displayName}
                  </span>
                  <span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    Mentor
                  </span>
                </span>
                <ChevronDown
                  className={`hidden h-4 w-4 text-slate-400 transition sm:block ${
                    profileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileOpen ? (
                <div className="absolute right-0 top-14 z-50 max-h-[calc(100vh-6rem)] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="mb-1 border-b border-slate-100 px-3 py-2">
                    <p className="text-sm font-semibold text-slate-800">
                      {displayName}
                    </p>
                    <p className="text-xs text-slate-500">Tài khoản mentor</p>
                  </div>
                  <div className="space-y-1">
                    {menuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeMenus}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        <item.icon className="h-4.5 w-4.5 text-slate-400" />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <LogOut className="h-4.5 w-4.5 text-slate-400" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {mobileOpen ? (
            <div className="space-y-2 border-t border-slate-100 pb-4 pt-3 lg:hidden">
              <div className="grid grid-cols-2 gap-2">
                {headerNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={closeMenus}
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
            </div>
          ) : null}
        </div>
      </header>

      <main className="flex-1 bg-[#F6F8FC] p-4 md:p-8">
        <div className="mx-auto max-w-400">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
