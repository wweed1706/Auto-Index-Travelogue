import { memo, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Compass,
  Calendar,
  Image,
  Settings,
  X,
  UploadCloud,
  LayoutDashboard,
  ShieldCheck,
  ArrowRight,
} from "./Icons";

const items = [
  { to: "/", label: "Trang chủ", icon: LayoutDashboard },
  { to: "/upload", label: "Upload chuyến đi", icon: UploadCloud },
  { to: "/planner", label: "Lên kế hoạch du lịch", icon: Calendar },
  { to: "/gallery", label: "Gallery & AI Search", icon: Image },
  { to: "/settings", label: "Cài đặt", icon: Settings },
];

const Sidebar = memo(function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    const node = dialog.current;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    if (mobileOpen) node?.showModal();
    else node?.close();
    if (!mobileOpen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      node?.close();
      previous?.focus();
    };
  }, [mobileOpen]);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const close = () => {
      if (query.matches) onClose();
    };
    query.addEventListener("change", close);
    return () => query.removeEventListener("change", close);
  }, [onClose]);
  const content = (mobile = false) => (
    <div className="stitch-home flex h-full min-h-[420px] flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-100 px-5">
        <NavLink
          to="/"
          onClick={mobile ? onClose : undefined}
          aria-label="Travelogue — Trang chủ"
          className="flex min-w-0 items-center gap-2.5 rounded-lg transition-opacity duration-300 hover:opacity-75"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Compass className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <span>
            <strong className="block text-[16px] font-semibold leading-5 tracking-tight text-slate-800">
              Travelogue
            </strong>
            <span className="block text-[10px] tracking-[0.08em] text-slate-500">
              Auto-Index
            </span>
          </span>
        </NavLink>
        {mobile ? (
          <button
            aria-label="Đóng menu"
            onClick={onClose}
            className="btn-ghost !min-h-9 !p-2"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700">
            Beta
          </span>
        )}
      </div>
      <nav
        aria-label={mobile ? "Menu di động" : "Menu chính"}
        className="space-y-1 p-4"
      >
        {items.map(({ to, label, icon: Icon }) => {
          const active =
            to === "/"
              ? pathname === "/"
              : to === "/gallery"
                ? pathname.startsWith("/gallery") ||
                  (pathname.startsWith("/journey") &&
                    !pathname.endsWith("/edit"))
                : to === "/upload"
                  ? pathname === "/upload" ||
                    (pathname.startsWith("/journey") &&
                      pathname.endsWith("/edit"))
                  : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              onClick={mobile ? onClose : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] transition-all duration-300 hover:-translate-y-0.5 motion-reduce:transform-none ${active ? "bg-sky-50 font-medium text-sky-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"}`}
            >
              <Icon
                aria-hidden="true"
                className="h-[18px] w-[18px] shrink-0"
                strokeWidth={1.6}
              />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-4 pb-5 pt-12">
        <div className="rounded-2xl bg-[#f1f4fa] p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-slate-700">
              Không gian cá nhân
            </p>
            <ShieldCheck aria-hidden="true" className="h-4 w-4 text-sky-600" />
          </div>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">
            Ảnh và hành trình được lưu trên thiết bị của bạn.
          </p>
          <Link
            to="/settings"
            onClick={mobile ? onClose : undefined}
            className="mt-3 inline-flex min-h-8 items-center gap-2 rounded-md text-[11px] font-medium text-sky-700 transition-all duration-300 hover:gap-3"
          >
            Quản lý dữ liệu <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <aside
        data-testid="persistent-sidebar"
        className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col overflow-y-auto border-r border-slate-100 bg-white lg:flex"
      >
        {content()}
      </aside>
      <dialog
        ref={dialog}
        aria-label="Điều hướng"
        onCancel={(event) => {
          event.preventDefault();
          onClose();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
        className="fixed inset-y-0 left-0 right-auto m-0 h-dvh max-h-dvh w-[min(290px,85vw)] border-0 bg-white p-0 text-slate-800 shadow-xl backdrop:bg-slate-900/25 lg:hidden"
      >
        {content(true)}
      </dialog>
    </>
  );
});
export default Sidebar;
