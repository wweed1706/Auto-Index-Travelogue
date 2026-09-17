import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * App Component
 * Cấu hình định tuyến (Routing) cho hệ thống Auto-Index Travelogue:
 * - /login: Trang Đăng nhập
 * - /dashboard: Trang Bảng điều khiển (Được bảo vệ bởi <ProtectedRoute>)
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
      {/* Mặc định chuyển hướng tới /dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Route bắt các URL không hợp lệ */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
