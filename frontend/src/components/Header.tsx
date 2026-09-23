import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="flex min-h-20 flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 bg-white/80 px-4 py-3 sm:px-8">
      <p className="text-sm text-slate-500">Không gian hành trình của bạn</p>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 sm:inline">
          Lưu trên thiết bị
        </span>
        {user ? (
          <>
            <span>{user.name}</span>
            <button
              onClick={logout}
              className="rounded-lg p-2 hover:bg-slate-100"
            >
              Thoát hồ sơ
            </button>
          </>
        ) : (
          <Link className="rounded-lg p-2 hover:bg-slate-100" to="/login">
            Hồ sơ cá nhân
          </Link>
        )}
      </div>
    </header>
  );
}
