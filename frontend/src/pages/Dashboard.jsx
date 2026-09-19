import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CreateJourneyCTA from '../components/CreateJourneyCTA';
import SmartPlannerCTA from '../components/SmartPlannerCTA';
import MiniStats from '../components/MiniStats';
import RecentTripsGrid from '../components/RecentTripsGrid';
import CreateJourneyModal from '../components/CreateJourneyModal';

/**
 * Dashboard Page Component (Refactored & Upgraded)
 * - Sidebar: Đã tinh gọn, loại bỏ avatar trùng lặp
 * - Header: Tích hợp thanh AI Search Bar ở trung tâm và Avatar dropdown ở góc phải
 * - Banners: Module 1 (Auto-Index) + Module 2 (Smart Planner)
 * - Mini Stats: Grid 3 thông số thống kê nổi bật ngay phía trên Recent Trips
 * - Recent Trips: Lưới 3 thẻ placeholder với text "Tạo chuyến đi đầu tiên"
 * - UploadModal: Kích hoạt khi bấm nút hoặc kéo thả file vào banner
 */
const Dashboard = () => {
  // State quản lý đóng/mở Sidebar trên Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State quản lý mở UploadModal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 1. Sidebar Bên Trái (Đã tinh gọn profile) */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={handleCloseSidebar} 
      />

      {/* 2. Khu Vực Nội Dung Chính Bên Phải (Main Content) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
        {/* Header trên cùng tích hợp AI Search Bar và Avatar Dropdown */}
        <Header onToggleSidebar={handleToggleSidebar} />

        {/* Nội dung trang */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* Khu vực Banners & CTA: Module 1 & Module 2 */}
          <section aria-label="Các tính năng chính">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Module 1: Auto-Index Travelogue (Chiếm 2 cột trên màn lớn) */}
              <div className="lg:col-span-2">
                <CreateJourneyCTA onOpenUploadModal={handleOpenUploadModal} />
              </div>

              {/* Module 2: Smart Planner (Chiếm 1 cột với tone màu tím/indigo khác biệt) */}
              <div className="lg:col-span-1 flex">
                <div className="w-full">
                  <SmartPlannerCTA />
                </div>
              </div>
            </div>
          </section>

          {/* Khu vực Thống kê nhanh (Mini Stats) - Đặt ngay phía trên Chuyến đi gần đây */}
          <section aria-label="Thống kê nhanh">
            <MiniStats />
          </section>

          {/* Khu vực Recent: Lưới 3 khối thẻ placeholder đại diện cho chuyến đi */}
          <section aria-label="Chuyến đi gần đây">
            <RecentTripsGrid onAddTrip={handleOpenUploadModal} />
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/70 py-6 px-4 sm:px-8 text-center text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Auto-Index Travelogue. Hệ thống quản lý và lập chỉ mục chuyến đi tự động.</p>
        </footer>
      </div>

      {/* 3. Modal Tạo chuyến đi mới */}
      <CreateJourneyModal 
        isOpen={isUploadModalOpen} 
        onClose={handleCloseUploadModal} 
      />
    </div>
  );
};

export default Dashboard;
