import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function AuthLayout({ children, side }) {
  return (
    <div className="min-h-screen flex">
      {/* Left - Purple Gradient Panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 text-white">
            <GraduationCap className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">EduPath</span>
          </Link>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center max-w-md">
            {side}
          </div>

          {/* Footer */}
          <p className="text-white/50 text-sm">
            © 2024 EduPath. Hệ sinh thái Mentorship Cao cấp.
          </p>
        </div>
      </div>

      {/* Right - Form Area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
