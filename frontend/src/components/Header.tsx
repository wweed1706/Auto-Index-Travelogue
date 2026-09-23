import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-end sm:justify-between gap-3 border-b border-slate-200/60 bg-white/70 px-4 py-3 backdrop-blur-md sm:px-8 lg:px-12">
      <p className="hidden text-xs font-medium tracking-wide sm:block text-slate-500 ">
        Không gian hành trình của bạn
      </p>
      <div className="flex items-center gap-3 text-xs text-slate-500 ">
        <span className="hidden rounded-xl border border-slate-200/70 bg-white/60 px-3 py-1.5 text-[11px] text-slate-500 sm:inline">
          Lưu trên thiết bị
        </span>
        {user ? (
          <>
            <span className="max-w-24 truncate">{user.name}</span>
            <button
              onClick={logout}
              className="rounded-xl border border-transparent px-3 py-2 text-xs font-medium text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-800 hover:shadow-sm transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 "
            >
              Thoát hồ sơ
            </button>
          </>
        ) : (
          <Link
            className="rounded-xl border border-transparent px-3 py-2 text-xs font-medium text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-800 hover:shadow-sm transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 "
            to="/login"
          >
            Hồ sơ cá nhân
          </Link>
        )}
      </div>
    </header>
  );
}
