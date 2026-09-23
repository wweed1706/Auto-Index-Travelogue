import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
export default function MainLayout() {
  const { pathname } = useLocation();
  const content = useRef<HTMLElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    content.current?.focus();
  }, [pathname]);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700">
      <a
        href="#main-content"
        className="sr-only z-50 rounded bg-white p-3 focus:not-sr-only focus:fixed focus:left-20 focus:top-2"
      >
        Đến nội dung chính
      </a>
      <Sidebar />
      <div className="ml-16 min-w-0 md:ml-64">
        <Header />
        <main
          ref={content}
          tabIndex={-1}
          id="main-content"
          className="mx-auto w-full max-w-7xl p-4 outline-none sm:p-8 lg:p-10"
        >
          <Outlet />
        </main>
        <footer className="px-4 py-8 text-xs text-slate-500 sm:px-8">
          Auto-Index Travelogue · Lưu giữ hành trình theo cách của bạn
        </footer>
      </div>
    </div>
  );
}
