import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, LogOut, Folder, Plus } from "./Icons";
export default function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const section = pathname.startsWith("/planner")
    ? "Lên kế hoạch"
    : pathname.startsWith("/gallery") || pathname.startsWith("/journey")
      ? "Gallery"
      : pathname === "/upload"
        ? "Upload chuyến đi"
        : pathname === "/settings"
          ? "Cài đặt"
          : "Trang chủ";
  return (
    <header className="stitch-home sticky top-0 z-30 flex h-16 items-center justify-between gap-2 border-b border-slate-100 bg-white/85 px-4 backdrop-blur-md sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Mở menu"
          onClick={onOpenMenu}
          className="btn-ghost !min-h-9 !p-2 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Folder
          aria-hidden="true"
          className="hidden h-4 w-4 shrink-0 text-slate-400 sm:block"
        />
        <p className="truncate text-xs text-slate-500">
          <span className="hidden sm:inline">
            Auto-Index<span className="mx-2.5 text-slate-300">/</span>
          </span>
          <span className="text-slate-700">{section}</span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link
          to="/upload"
          className="home-action hidden !min-h-9 !rounded-lg !px-3 !py-1.5 !text-xs sm:inline-flex"
        >
          <Plus className="h-3.5 w-3.5" /> Tạo chuyến đi mới
        </Link>
        <div className="flex items-center gap-2 sm:border-l sm:border-slate-100 sm:pl-3">
          <Link
            to="/settings"
            aria-label="Hồ sơ cá nhân"
            className="flex items-center gap-2 rounded-lg p-1.5 transition-all duration-300 hover:bg-slate-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-100 bg-sky-50 text-xs font-semibold text-sky-800">
              {(user?.name || user?.email || "").slice(0, 1).toUpperCase()}
            </span>
            <span className="hidden max-w-32 truncate text-xs text-slate-700 md:block">
              {user?.name}
            </span>
          </Link>
          <button
            type="button"
            aria-label="Đăng xuất"
            onClick={logout}
            className="btn-ghost !min-h-9 !p-2"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
