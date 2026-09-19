// Đường dẫn: src/components/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  ChevronDown,
  Sparkles,
  Zap
} from './Icons';

/**
 * Header Component (Căn chỉnh bố cục chuẩn xác)
 * - Chiều cao chuẩn h-[72px] với đường kẻ border-b ngang bằng tuyệt đối với Sidebar
 * - Chữ "Chào mừng trở lại!" căn lề sát về bên trái
 * - Ô "Hỏi AI" căn lề chính giữa trung tâm trang web
 * - Avatar và nút chuông thông báo căn lề sát về bên phải
 */
const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`AI đang phân tích câu hỏi: "${searchQuery}"...`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-[72px] bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center transition-all shadow-xs">
      <div className="w-full flex items-center justify-between gap-2 sm:gap-4">
        
        {/* ======================================================== */}
        {/* CỘT TRÁI: LỜI CHÀO CĂN LỀ SÁT VỀ BÊN TRÁI                */}
        {/* ======================================================== */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 justify-start min-w-0">
          {/* Nút Hamburger cho Mobile */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/20 shrink-0"
            aria-label="Mở bảng điều hướng"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Tiêu đề Chào mừng trở lại */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight truncate">
                Chào mừng trở lại!
              </h2>
              <span className="text-base sm:text-lg shrink-0">👋</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-none mt-1 truncate hidden sm:block">
              {user?.name ? `${user.name} • ` : ''}Ký sự hành trình thông minh
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CỘT GIỮA: Ô HỎI AI CĂN LỀ CHÍNH GIỮA TRANG WEB            */}
        {/* ======================================================== */}
        <div className="w-full max-w-xs sm:max-w-md lg:max-w-xl shrink-0 mx-auto">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative flex items-center w-full group">
              {/* Icon Tia chớp vàng AI */}
              <div className="absolute left-3.5 flex items-center pointer-events-none text-amber-500 group-focus-within:text-amber-600 transition-colors">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 stroke-amber-500" />
              </div>

              {/* Input Search */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hỏi AI: Tôi đã đi đâu ở Đà Lạt?"
                className="w-full pl-10 sm:pl-11 pr-20 sm:pr-24 py-2 sm:py-2.5 rounded-2xl bg-slate-100/90 hover:bg-slate-100/70 focus:bg-white border border-transparent focus:border-sky-400 text-slate-800 text-xs sm:text-sm shadow-xs transition-all placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
              />

              {/* Nút Hỏi AI */}
              <div className="absolute right-1.5 sm:right-2 flex items-center">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 text-white text-[11px] font-semibold hover:from-sky-600 hover:to-teal-600 transition-all shadow-xs"
                >
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  <span className="hidden sm:inline">Hỏi AI</span>
                  <span className="sm:hidden">Tìm</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ======================================================== */}
        {/* CỘT PHẢI: AVATAR & NÚT CHUÔNG CĂN LỀ SÁT VỀ BÊN PHẢI     */}
        {/* ======================================================== */}
        <div className="flex items-center justify-end gap-2 sm:gap-3.5 flex-1 min-w-0 shrink-0">
          {/* Nút Chuông Thông Báo */}
          <button 
            className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors focus:outline-none"
            aria-label="Thông báo"
            title="Thông báo mới"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-white"></span>
          </button>

          {/* Avatar Người Dùng có Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(prev => !prev)}
              className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              aria-expanded={isDropdownOpen}
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt="Avatar"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-sky-500/30 shadow-xs"
              />
              <ChevronDown className={`w-4 h-4 text-slate-500 hidden sm:block transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Xổ Xuống */}
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

      </div>
    </header>
  );
};

export default Header;
