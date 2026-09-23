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
    <div className="min-h-screen bg-slate-50 text-slate-700 antialiased  [color-scheme:light]">
      <a
        href="#main-content"
        className="sr-only z-50 rounded bg-white p-3 focus:not-sr-only focus:fixed focus:left-20 focus:top-2 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:opacity-80"
      >
        Đến nội dung chính
      </a>
      <Sidebar />
      <div className="ml-16 min-w-0 md:ml-60">
        <Header />
        <main
          ref={content}
          tabIndex={-1}
          id="main-content"
          className="mx-auto w-full max-w-7xl px-4 py-8 outline-none sm:px-8 sm:py-10 lg:px-12 lg:py-12"
        >
          <Outlet />
        </main>
        <footer className="mx-auto flex max-w-7xl items-center border-t border-slate-200/60 px-4 py-7 text-[11px] tracking-wide text-slate-400 sm:px-8 lg:px-12">
          Auto-Index Travelogue · Lưu giữ hành trình theo cách của bạn
        </footer>
      </div>
    </div>
  );
}
