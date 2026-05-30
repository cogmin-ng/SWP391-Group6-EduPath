
import { Search, Bell, Menu, User, ChevronDown } from 'lucide-react';

const Topbar = ({ toggleSidebar }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-8">
      <div className="flex items-center justify-between h-full">
        {/* Left Side: Search & Mobile Menu */}
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-100 rounded-lg lg:hidden text-slate-600"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden md:flex items-center relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input 
              type="text" 
              placeholder="Search anything..." 
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
            
            {/* Simple Dropdown placeholder */}
            <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
              <div className="px-4 py-2 border-b border-slate-100 font-semibold text-slate-800">Notifications</div>
              <div className="px-4 py-3 text-sm text-slate-500">No new notifications</div>
            </div>
          </button>

          <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

          {/* User Profile */}
          <button className="flex items-center gap-3 p-1.5 hover:bg-slate-100 rounded-xl transition-all group">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <User className="w-5 h-5" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-800 leading-none">Admin User</p>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">Super Admin</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
