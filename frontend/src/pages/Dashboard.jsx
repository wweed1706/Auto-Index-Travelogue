import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CreateJourneyCTA from '../components/CreateJourneyCTA';
import RecentTripsGrid from '../components/RecentTripsGrid';

/**
 * Dashboard Page Component
 * - Cấu trúc: Sidebar (trái) + Main Content (phải)
 * - Quản lý state isSidebarOpen để đóng/mở thanh điều hướng trên các màn hình di động
 * - Điều phối Header, Banner CTA tạo chuyến đi và Grid hiển thị 3 placeholder chuyến đi
 */
const Dashboard = () => {
  // State quản lý đóng/mở Sidebar trên Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleOpenUploadAction = () => {
    // Có thể kích hoạt upload hoặc mở modal
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 1. Sidebar Bên Trái (Cố định trên Desktop, Drawer trên Mobile) */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={handleCloseSidebar} 
      />

      {/* 2. Khu Vực Nội Dung Chính Bên Phải (Main Content) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
        {/* Header trên cùng */}
        <Header onToggleSidebar={handleToggleSidebar} />

        {/* Nội dung trang */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Khu vực Call-to-Action (CTA): Nổi bật ở giữa màn hình */}
          <section aria-label="Tạo chuyến đi mới">
            <CreateJourneyCTA />
          </section>

          {/* Khu vực Recent: Lưới 3 khối thẻ placeholder đại diện cho chuyến đi */}
          <section aria-label="Chuyến đi gần đây">
            <RecentTripsGrid onAddTrip={handleOpenUploadAction} />
          </section>
        </main>

        {/* Footer ghi nhận thông tin bản quyền */}
        <footer className="border-t border-slate-200/70 py-6 px-4 sm:px-8 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Auto-Index Travelogue. Hệ thống quản lý và lập chỉ mục chuyến đi tự động.</p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
