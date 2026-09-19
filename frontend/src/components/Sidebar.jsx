// Đường dẫn: src/components/Sidebar.jsx
import React, { useState } from 'react';
import {
  Compass,
  History,
  Calendar,
  Settings,
  X,
  Sparkles
} from './Icons';

/**
 * Sidebar Component
 * - Cung cấp thanh điều hướng bên trái với logo và danh sách menu
 * - Chiều cao Top bar và Bottom bar chuẩn h-[72px] đồng bộ tuyệt đối với Header và Footer
 * - Hỗ trợ slide-over drawer trên Mobile khi isOpen = true.
 */
const Sidebar = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('history');

  const menuItems = [
    { id: 'history', label: 'Lịch sử chuyến đi', icon: History, badge: '12' },
    { id: 'planner', label: 'Lên kế hoạch', icon: Calendar, badge: 'Mới' },
    { id: 'settings', label: 'Cài đặt', icon: Settings }
  ];

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
        {/* Top Section: Logo & Brand (Chiều cao h-[72px] có border-b ngang hàng tuyệt đối với Header) */}
        <div className="h-[72px] px-6 border-b border-slate-200/80 flex items-center justify-between shrink-0">
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
        <div className="flex-1 p-6 space-y-1.5 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Khám phá
          </div>

          <nav className="space-y-1.5">
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
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive 
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

        {/* Bottom Section: Hệ thống & Trạng thái AI (Chiều cao h-[72px] có border-t ngang hàng tuyệt đối với Footer) */}
        <div className="h-[72px] px-4 border-t border-slate-200/80 flex items-center shrink-0 bg-white">
          <div className="w-full p-2.5 rounded-xl bg-sky-50/60 border border-sky-100/80 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 leading-none truncate">Auto-Index AI</p>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">Sẵn sàng nhận dữ liệu</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
