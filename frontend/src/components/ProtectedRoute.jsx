import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Ngăn chặn người dùng chưa đăng nhập truy cập trái phép vào các route nội bộ (như /dashboard).
 * Tự động chuyển hướng về /login nếu isAuthenticated là false.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Lưu lại vị trí trang họ muốn vào để sau khi đăng nhập có thể redirect lại nếu muốn
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
