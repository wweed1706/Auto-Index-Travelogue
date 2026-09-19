import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import JourneyDetail from './pages/JourneyDetail';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * App Component
 * Cấu hình định tuyến (Routing) cho hệ thống Auto-Index Travelogue:
 * - /login: Trang Đăng nhập
 * - /dashboard: Trang Bảng điều khiển (Được bảo vệ bởi <ProtectedRoute>)
 * - /journey/:id: Trang Chi tiết chuyến đi (Được bảo vệ bởi <ProtectedRoute>)
 * - /journey-preview: Trang Chi tiết chuyến đi công khai để kiểm thử
 * - /: Điều hướng mặc định tới /dashboard (Nếu chưa đăng nhập sẽ tự chuyển về /login)
 * - *: Mọi đường dẫn không tồn tại chuyển hướng về /login
 */
function App() {
  return (
    <Routes>
      {/* Route công khai: Đăng nhập */}
      <Route path="/login" element={<Login />} />

      {/* Route được bảo vệ: Bảng điều khiển */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Route cho phép xem dashboard không cần đăng nhập (để hiển thị lên website công khai) */}
      <Route
        path="/dashboard-preview"
        element={<Dashboard />}
      />

      {/* Route được bảo vệ: Chi tiết chuyến đi */}
      <Route
        path="/journey/:id"
        element={
          <ProtectedRoute>
            <JourneyDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journey"
        element={
          <ProtectedRoute>
            <JourneyDetail />
          </ProtectedRoute>
        }
      />
      {/* Route cho phép xem chi tiết chuyến đi không cần đăng nhập */}
      <Route
        path="/journey-preview"
        element={<JourneyDetail />}
      />
      {/* Mặc định chuyển hướng tới /dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Route bắt các URL không hợp lệ */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
