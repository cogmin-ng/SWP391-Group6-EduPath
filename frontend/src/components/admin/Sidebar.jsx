import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  CheckCircle, 
  UserPlus, 
  BarChart3, 
  Settings,
  LogOut,
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { title: 'User Management', icon: Users, path: '/admin/users' },
    { title: 'Category Management', icon: Layers, path: '/admin/categories' },
    { title: 'Roadmap Approval', icon: CheckCircle, path: '/admin/roadmaps' },
    { title: 'Mentor Requests', icon: UserPlus, path: '/admin/mentors' },
    { title: 'Reports', icon: BarChart3, path: '/admin/reports' },
    { title: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-screen bg-slate-900 text-white z-50 transition-all duration-300
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b border-white/10 px-4">
            <div className={`flex items-center gap-3 ${isOpen ? 'w-full' : 'justify-center'}`}>
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-lg">E</span>
              </div>
              {isOpen && <span className="font-bold text-xl tracking-tight">EduPath Admin</span>}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110`} />
                {isOpen && <span className="font-medium whitespace-nowrap">{item.title}</span>}
                {!isOpen && (
                  <span className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {item.title}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button className={`
              flex items-center gap-3 px-3 py-3 rounded-lg w-full text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group
              ${isOpen ? '' : 'justify-center'}
            `}>
              <LogOut className="w-5 h-5" />
              {isOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
