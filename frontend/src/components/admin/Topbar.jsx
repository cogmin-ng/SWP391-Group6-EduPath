import React, { useState, useEffect } from "react";
import { Search, Bell, Menu, User, ChevronDown, Check } from "lucide-react";
import { notificationService } from "../../services/notificationService";

const Topbar = ({ toggleSidebar }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notifData, unreadData] = await Promise.all([
        notificationService.getNotifications({ skip: 0, take: 5 }),
        notificationService.getUnreadCount()
      ]);
      setNotifications(notifData?.notifications || []);
      setUnreadCount(unreadData?.unreadCount || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAsRead = async (id, currentIsRead) => {
    if (currentIsRead) return;
    try {
      await notificationService.markAsRead(id);
      fetchData();
    } catch (error) {}
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchData();
    } catch (error) {}
  };
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
        </div>

        {/* Right Side: Icons & Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative group">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden flex flex-col z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <span className="font-bold text-slate-800">Thông báo</span>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllAsRead} className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 transition-colors">
                    <Check className="w-3 h-3" /> Đánh dấu đã đọc
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto w-full">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-center text-slate-500">
                    Không có thông báo nào.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        onClick={() => handleMarkAsRead(notif.id, notif.isRead)}
                        className={`px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50 flex flex-col gap-1 ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>{notif.title}</h4>
                          {!notif.isRead && <span className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1.5" />}
                        </div>
                        <p className={`text-xs ${!notif.isRead ? 'text-slate-700' : 'text-slate-500'}`}>{notif.content}</p>
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
        </div>
      </div>
    </header>
  );
};

export default Topbar;
