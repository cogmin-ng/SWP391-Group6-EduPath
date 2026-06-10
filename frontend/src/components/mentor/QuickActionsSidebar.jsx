import { Plus, FileText, User, Bell } from 'lucide-react';

const QuickActionsSidebar = ({ onCreateNew, onManage, onProfile, onNotifications }) => {
  const actions = [
    {
      icon: Plus,
      label: 'Tạo Lộ Trình Mới',
      description: 'Bắt đầu tạo lộ trình mới',
      onClick: onCreateNew,
      highlight: true,
    },
    {
      icon: FileText,
      label: 'Quản Lý Lộ Trình',
      description: 'Xem và chỉnh sửa lộ trình',
      onClick: onManage,
    },
    {
      icon: User,
      label: 'Xem Hồ Sơ',
      description: 'Chỉnh sửa hồ sơ của bạn',
      onClick: onProfile,
    },
    {
      icon: Bell,
      label: 'Thông Báo',
      description: 'Kiểm tra thông báo của bạn',
      onClick: onNotifications,
      badge: 3,
    },
  ];

  return (
    <div className="hidden lg:flex flex-col gap-4 w-80">
      {/* Sticky container */}
      <div className="sticky top-24 space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const bgClass = action.highlight
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-white border border-slate-100 text-slate-900 hover:shadow-md';
          const textColorClass = action.highlight ? 'text-indigo-100' : 'text-slate-500';

          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`w-full p-4 rounded-xl transition-all duration-200 text-left ${bgClass}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${action.highlight ? 'bg-indigo-500' : 'bg-slate-100'}`}>
                  <Icon className={`w-5 h-5 ${action.highlight ? 'text-white' : 'text-indigo-600'}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm leading-tight">{action.label}</p>
                  <p className={`text-xs mt-1 ${textColorClass}`}>{action.description}</p>
                </div>
                {action.badge && (
                  <div className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex-shrink-0">
                    {action.badge}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="sticky top-96 bg-slate-50 rounded-xl p-4 border border-slate-100">
        <h4 className="font-semibold text-slate-900 mb-2 text-sm">Cần Giúp Đỡ?</h4>
        <p className="text-xs text-slate-500 mb-3">
          Kiểm tra tài liệu và hướng dẫn của chúng tôi để tận dụng tối đa EduPath.
        </p>
        <button className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
          Tài Liệu
        </button>
      </div>
    </div>
  );
};

export default QuickActionsSidebar;
