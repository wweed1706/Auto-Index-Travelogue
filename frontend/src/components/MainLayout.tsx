import { Outlet, useLocation } from "react-router-dom";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Skeleton } from "./ui";

export default function MainLayout() {
  const { pathname } = useLocation();
  const content = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  useEffect(() => {
    window.scrollTo(0, 0);
    content.current?.focus({ preventScroll: true });
    setMenuOpen(false);
  }, [pathname]);
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-800 antialiased">
      <a href="#main-content" className="skip-link">
        Đến nội dung chính
      </a>
      <Sidebar mobileOpen={menuOpen} onClose={closeMenu} />
      <div className="min-w-0 lg:pl-64">
        <Header onOpenMenu={openMenu} />
        <main
          ref={content}
          tabIndex={-1}
          id="main-content"
          className="mx-auto w-full max-w-[1440px] px-4 py-7 outline-none sm:px-8 sm:py-8"
        >
          <div
            key={pathname}
            className="animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none"
          >
            <Suspense fallback={<Skeleton />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
        <footer className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 px-4 py-7 text-[11px] text-slate-500 sm:px-8">
          <span>Travelogue · Những hành trình đáng nhớ.</span>
          <span>Demo · Dữ liệu lưu trên thiết bị</span>
        </footer>
      </div>
    </div>
  );
}
