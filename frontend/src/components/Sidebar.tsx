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
      className="fixed inset-y-0 left-0 z-40 flex w-16 flex-col border-r border-slate-200/70 bg-white md:w-64"
    >
      <NavLink
        to="/"
        aria-label="Auto-Index Travelogue — Trang chủ"
        className="flex h-20 shrink-0 items-center justify-center gap-3 border-b border-slate-100 px-3 md:justify-start md:px-6"
      >
        <span className="rounded-xl bg-teal-50 p-2.5 text-teal-700">
          <Compass />
        </span>
        <span className="hidden md:block">
          <strong className="block text-sm font-semibold text-slate-800">
            Auto-Index
          </strong>
          <span className="text-xs text-slate-500">Travelogue</span>
        </span>
      </NavLink>
      <nav
        aria-label="Menu chính"
        className="flex-1 space-y-2 overflow-y-auto px-2 py-6 md:px-4"
      >
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            title={label}
            aria-label={label}
            className={({ isActive }) =>
              "flex min-h-12 items-center justify-center gap-3 rounded-xl px-2 text-sm transition-colors md:justify-start md:px-3 " +
              (isActive
                ? "bg-teal-50 font-medium text-teal-800"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800")
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="hidden md:inline">{label}</span>
          </NavLink>
        ))}
      </nav>
      <p className="hidden border-t border-slate-100 p-6 text-xs leading-6 text-slate-500 md:block">
        Những hành trình nhỏ,
        <br />
        những ký ức đáng giữ.
      </p>
    </aside>
  );
});
export default Sidebar;
