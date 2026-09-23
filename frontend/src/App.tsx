import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Gallery from "./pages/Gallery";
import JourneyDetail from "./pages/JourneyDetail";
import SmartPlanner from "./pages/SmartPlanner";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import { LibraryProvider } from "./context/LibraryContext";
export default function App() {
  return (
    <LibraryProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="journey/:id" element={<JourneyDetail />} />
          <Route path="planner" element={<SmartPlanner />} />
          <Route path="planner/:id" element={<SmartPlanner />} />
          <Route path="settings" element={<Settings />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Login register />} />
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
              <div className="space-y-4">
                <h1 className="text-2xl font-semibold">Không tìm thấy trang</h1>
                <a href="/" className="text-teal-700 underline">
                  Về Trang chủ
                </a>
              </div>
            }
          />
        </Route>
      </Routes>
    </LibraryProvider>
  );
}
