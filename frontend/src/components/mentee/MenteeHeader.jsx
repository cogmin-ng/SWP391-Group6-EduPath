import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Award,
  BarChart3,
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
  Sparkles,
  User,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const accountMenuItems = [
  { label: 'Trang chủ', icon: Home, to: '/mentee/homepage' },
  { label: 'Hồ sơ cá nhân', icon: User, to: '/mentee/profile' },
  { label: 'Lộ trình của tôi', icon: Map, to: '/roadmaps' },
  { label: 'Kho lộ trình', icon: Compass, to: '/explore' },
  { label: 'Tiến độ học tập', icon: BarChart3, action: 'placeholder' },
  { label: 'Đăng kí mentor', icon: GraduationCap, to: '/profile/become-mentor' },
  { label: 'Đóng góp', icon: Lightbulb, to: '/mentee/contributions' },
  { label: 'Thành tích', icon: Award, action: 'placeholder' },
  { label: 'Chứng chỉ của tôi', icon: FileText, action: 'placeholder' },
  { label: 'Cài đặt', icon: Settings, action: 'placeholder' },
  { label: 'Đăng xuất', icon: LogOut, action: 'logout' },
];

const headerNavItems = [
  { label: 'Khám phá' },
  { label: 'Lộ trình' },
  { label: 'Mentor' },
  { label: 'Bảng giá' },
  { label: 'Cộng đồng' },
];

export default function MenteeHeader() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
              <button
                key={item.label}
                type="button"
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:text-indigo-600 hover:bg-indigo-50/60"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="relative flex shrink-0 items-center gap-3">
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
                <button
                  key={item.label}
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600"
                >
                  {item.label}
                </button>
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
