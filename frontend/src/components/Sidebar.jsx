import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  History,
  Calendar,
  Settings,
  LogOut,
  X,
  Sparkles
} from './Icons';

/**
 * Sidebar Component
 * - Cung cấp thanh điều hướng bên trái với logo, danh sách menu và nút Đăng xuất ở chân sidebar.
 * - Hỗ trợ slide-over drawer trên Mobile khi isOpen = true.
 */
const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('history');

  const menuItems = [
    { id: 'history', label: 'Lịch sử chuyến đi', icon: History, badge: '12' },
    { id: 'planner', label: 'Lên kế hoạch', icon: Calendar, badge: 'Mới' },
    { id: 'settings', label: 'Cài đặt', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = (id) => {
    setActiveTab(id);
    if (window.innerWidth < 768 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 
          flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-lg md:shadow-none
          md:static md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Top Section: Logo & Brand */}
        <div className="p-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">Auto-Index</h1>
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">Travelogue</p>
              </div>
            </div>

            {/* Close Button on Mobile */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 md:hidden transition-colors"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Khám phá
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                    ${isActive
                      ? 'bg-sky-50 text-sky-600 font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isActive
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-slate-100 text-slate-500'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User Card & Logout Button */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          {/* Mini User Profile */}
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500/20 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {user?.name || 'Nhà thám hiểm'}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.email || 'traveler@travelogue.com'}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
