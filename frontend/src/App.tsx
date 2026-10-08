import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import { lazy, Suspense } from "react";
import { LibraryProvider } from "./context/LibraryContext";
import { ToastProvider } from "./context/ToastContext";
import { useAuth } from "./context/AuthContext";
import { EmptyState, Spinner } from "./components/ui";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Upload = lazy(() => import("./pages/Upload"));
const Gallery = lazy(() => import("./pages/Gallery"));
const JourneyDetail = lazy(() => import("./pages/JourneyDetail"));
const SmartPlanner = lazy(() => import("./pages/SmartPlanner"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));
function ProtectedLayout() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user)
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  return (
    <LibraryProvider key={user.id} ownerId={user.id}>
      <ToastProvider>
        <MainLayout />
      </ToastProvider>
    </LibraryProvider>
  );
}
export default function App() {
  const { loading } = useAuth();
  if (loading)
    return (
      <div
        role="status"
        className="flex min-h-dvh items-center justify-center gap-3 text-sm text-teal-700"
      >
        <Spinner />
        Đang mở không gian của bạn…
      </div>
    );
  return (
    <Suspense
      fallback={
        <div
          role="status"
          className="flex min-h-dvh items-center justify-center gap-3 text-sm text-teal-700"
        >
          <Spinner />
          Đang tải màn hình…
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={<Login key="login" />} />
        <Route path="/register" element={<Login key="register" register />} />
        <Route element={<ProtectedLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="journey/:id" element={<JourneyDetail />} />
          <Route path="journey/:id/edit" element={<Upload />} />
          <Route path="planner" element={<SmartPlanner />} />
          <Route path="planner/new" element={<SmartPlanner newPlan />} />
          <Route path="planner/:id" element={<SmartPlanner />} />
          <Route path="settings" element={<Settings />} />
          <Route path="dashboard" element={<Navigate to="/" replace />} />
          <Route
            path="dashboard-preview"
            element={<Navigate to="/" replace />}
          />
          <Route path="journey" element={<Navigate to="/gallery" replace />} />
          <Route
            path="journey-preview"
            element={<Navigate to="/gallery" replace />}
          />
          <Route
            path="planner-preview"
            element={<Navigate to="/planner" replace />}
          />
          <Route
            path="smart-planner"
            element={<Navigate to="/planner" replace />}
          />
          <Route
            path="*"
            element={
              <EmptyState
                title="Không tìm thấy trang"
                action={
                  <Link to="/" className="btn-primary">
                    Về tổng quan
                  </Link>
                }
              >
                Đường dẫn này không còn tồn tại. Bạn có thể tiếp tục từ không
                gian cá nhân.
              </EmptyState>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}
