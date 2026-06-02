import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X, LogOut, User } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

const navLinks = [
  { label: 'Khám phá', to: '/explore' },
  { label: 'Lộ trình', to: '/roadmaps' },
  { label: 'Mentors', href: '#' },
  { label: 'Bảng giá', href: '#' },
  { label: 'Cộng đồng', href: '#' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isExplorePage = location.pathname === '/explore';

  const isLinkActive = (to) => {
    if (!to) return false;
    if (to === '/roadmaps') return location.pathname.startsWith('/roadmaps');
    return location.pathname === to;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-100'
          : isExplorePage
            ? 'bg-white/95 border-b border-slate-100'
            : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <GraduationCap className="w-7 h-7 text-indigo-600 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              EduPath
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isLinkActive(link.to)
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50/50 transition-all duration-200"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-indigo-50/60 border border-indigo-100/50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                    {user?.avatarUrl || user?.avatar ? (
                      <img
                        src={user.avatarUrl || user.avatar}
                        alt={user?.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : user?.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800 leading-tight">
                      {user?.name || "User"}
                    </span>
                    <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                      {user?.roles?.[0] || "LEARNER"}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="gap-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-lg transition-all duration-300 ${
          mobileOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className={`block px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  isLinkActive(link.to)
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            )
          ))}
          <div className="pt-3 space-y-2 border-t border-slate-100 mt-2">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base overflow-hidden">
                    {user?.avatarUrl || user?.avatar ? (
                      <img
                        src={user.avatarUrl || user.avatar}
                        alt={user?.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : user?.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-tight">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">
                      {user?.roles?.[0] || "LEARNER"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full gap-2 text-slate-700 hover:text-red-600 hover:bg-red-50 border-slate-200"
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block"
                  onClick={() => setMobileOpen(false)}
                >
                  <Button variant="secondary" size="md" className="w-full">
                    Đăng nhập
                  </Button>
                </Link>
                <Link
                  to="/register"
                  className="block"
                  onClick={() => setMobileOpen(false)}
                >
                  <Button variant="primary" size="md" className="w-full">
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
