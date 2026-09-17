import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  ChevronDown,
  Sparkles
} from './Icons';

/**
 * Header Component
 * - Hiển thị lời chào "Chào mừng trở lại!" và tiêu đề ngày tháng
 * - Nút toggle hamburger cho mobile
 * - Chuông thông báo
 * - Avatar người dùng kèm dropdown menu (có chức năng Đăng xuất)
 */
const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const currentDate = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-4 flex items-center justify-between transition-all">
      {/* Left: Mobile Hamburger & Greeting */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Hamburger button on mobile */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          aria-label="Mở bảng điều hướng"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Greetings */}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Chào mừng trở lại{user?.name ? `, ${user.name}` : ''}!
            </h2>
            <span className="hidden sm:inline-block text-lg">👋</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 capitalize">
            {currentDate} • Sẵn sàng cho chuyến phiêu lưu tiếp theo?
          </p>
        </div>
      </div>

      {/* Right: Actions & User Avatar Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Button */}
        <button 
          className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Thông báo"
          title="Thông báo mới"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-white"></span>
        </button>

        {/* User Avatar with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className="flex items-center gap-2.5 p-1 sm:p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            aria-expanded={isDropdownOpen}
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
              alt="Avatar"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-sky-500/30 shadow-sm"
            />
            <ChevronDown className={`w-4 h-4 text-slate-500 hidden sm:block transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs text-slate-400 font-medium">Đăng nhập với</p>
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Nhà thám hiểm'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || 'traveler@travelogue.com'}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    alert('Chức năng Quản lý hồ sơ đang được phát triển!');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>Hồ sơ cá nhân</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
