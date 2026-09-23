import { memo } from "react";
import { NavLink } from "react-router-dom";
import { Compass, UploadCloud, Calendar, Image, Settings } from "./Icons";
const items = [
  { to: "/", label: "Trang chủ", icon: Compass },
  { to: "/upload", label: "Upload chuyến đi", icon: UploadCloud },
  { to: "/planner", label: "Lên kế hoạch du lịch", icon: Calendar },
  { to: "/gallery", label: "Gallery", icon: Image },
  { to: "/settings", label: "Cài đặt", icon: Settings },
];
// Sidebar ở route cha nên luôn giữ cùng instance khi Outlet đổi trang.
const Sidebar = memo(function Sidebar() {
  return (
    <aside
      data-testid="persistent-sidebar"
      className="fixed inset-y-0 left-0 z-40 flex w-16 flex-col border-r border-slate-200/70 bg-white md:w-60"
    >
      <NavLink
        to="/"
        aria-label="Auto-Index Travelogue — Trang chủ"
        className="flex h-16 shrink-0 items-center justify-center gap-3 px-3 hover:opacity-75 md:justify-start md:px-6 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 "
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-100 text-slate-700 shadow-sm ">
          <Compass />
        </span>
        <span className="hidden md:block">
          <strong className="block text-sm font-semibold text-slate-800 ">
            Auto-Index
          </strong>
          <span className="text-xs text-slate-500 ">
            Travelogue
          </span>
        </span>
      </NavLink>
      <p className="hidden px-6 pt-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 md:block">
        Không gian cá nhân
      </p>
      <nav
        aria-label="Menu chính"
        className="flex-1 space-y-1.5 overflow-y-auto px-2 py-5 md:px-3"
      >
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            title={label}
            aria-label={label}
            className={({ isActive }) =>
              "flex min-h-12 items-center justify-center gap-3 rounded-xl px-2 text-sm md:justify-start md:px-3 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:opacity-80 " +
              (isActive
                ? "bg-slate-100/80 font-medium text-slate-800 "
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 ")
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="hidden md:inline">{label}</span>
          </NavLink>
        ))}
      </nav>
      <p className="mx-3 mb-4 hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white p-4 text-[11px] leading-6 text-slate-500 md:block">
        Những hành trình nhỏ,
        <br />
        những ký ức đáng giữ.
      </p>
    </aside>
  );
});
export default Sidebar;
