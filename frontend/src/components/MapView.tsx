import type { MapPoint } from "../types";
import { useMap } from "../hooks/useMap";
import { EmptyState, Badge } from "./ui";
import { MapPin, ZoomIn, ZoomOut, Navigation } from "./Icons";
export default function MapView({ points = [] }: { points?: MapPoint[] }) {
  const map = useMap(points);
  if (!points.length)
    return (
      <EmptyState title="Chưa có vị trí trên bản đồ">
        Gắn tọa độ trong phần chỉnh sửa chuyến đi để đánh dấu nơi bạn đã đến.
      </EmptyState>
    );
  return (
    <section aria-label="Bản đồ địa điểm" className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold">Những điểm dừng</h2>
          <p className="mt-1 text-[11px] text-slate-500">
            Chọn một marker để xem vị trí.
          </p>
        </div>
        <Badge>Sơ đồ tọa độ · offline</Badge>
      </div>
      <div className="relative h-[340px] overflow-hidden bg-[#f0f4ee] sm:h-[420px]">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <pattern
              id="map-grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="#dfe7dc"
                strokeWidth=".15"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#map-grid)" />
          <path
            d="M-10 45 Q20 15 40 30 T75 15 T115 30"
            stroke="#d4e3cd"
            strokeWidth="12"
            fill="none"
            opacity=".6"
          />
          <path
            d="M-5 80 Q22 95 42 71 T105 63"
            stroke="#d2e8eb"
            strokeWidth="5"
            fill="none"
          />
          <path
            d="M5 0 L42 100 M70 0 L30 100 M0 20 L100 80 M0 60 L100 30"
            stroke="white"
            strokeWidth=".65"
            fill="none"
            opacity=".8"
          />
          {map.projected.length > 1 && (
            <polyline
              points={map.projected
                .map((point) => point.x + "," + point.y)
                .join(" ")}
              fill="none"
              stroke="#0f766e"
              strokeWidth=".45"
              strokeDasharray="1 1"
            />
          )}
        </svg>
        {map.projected.map((point, index) => (
          <button
            key={point.id}
            type="button"
            aria-label={"Vị trí " + point.name}
            aria-pressed={map.selected?.id === point.id}
            onClick={() => map.select(point.id)}
            style={{ left: point.x + "%", top: point.y + "%" }}
            className={`absolute z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white text-xs font-semibold shadow-md transition-all duration-300 hover:scale-110 ${map.selected?.id === point.id ? "bg-teal-700 text-white ring-4 ring-teal-700/15" : "bg-white text-teal-700 ring-1 ring-teal-600/30"}`}
          >
            {index + 1}
          </button>
        ))}
        <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            aria-label="Phóng to bản đồ"
            disabled={map.zoom >= 2}
            onClick={map.zoomIn}
            className="p-2.5 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Thu nhỏ bản đồ"
            disabled={map.zoom <= 0.5}
            onClick={map.zoomOut}
            className="border-t border-slate-100 p-2.5 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Đặt lại bản đồ"
            onClick={map.reset}
            className="border-t border-slate-100 p-2.5 text-slate-600 hover:bg-slate-50"
          >
            <Navigation className="h-4 w-4" />
          </button>
        </div>
        {map.selected && (
          <div className="absolute bottom-4 left-4 right-4 max-w-sm rounded-xl border border-white bg-white/95 p-4 shadow-sm backdrop-blur">
            <p className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-teal-700" />
              {map.selected.name}
            </p>
            <p className="mt-2 text-[11px] text-slate-500">
              {map.selected.coordinates.latitude.toFixed(5)},{" "}
              {map.selected.coordinates.longitude.toFixed(5)}
            </p>
            <a
              target="_blank"
              rel="noreferrer"
              href={
                "https://www.google.com/maps/search/?api=1&query=" +
                encodeURIComponent(
                  map.selected.coordinates.latitude +
                    "," +
                    map.selected.coordinates.longitude,
                )
              }
              className="mt-3 inline-block text-xs font-medium text-teal-700 hover:underline"
            >
              Mở bản đồ đường đi ↗
            </a>
          </div>
        )}
      </div>
      <p className="px-5 py-3 text-[10px] leading-5 text-slate-500">
        Vị trí được chiếu theo tọa độ. Nền minh họa không biểu thị đường đi thực
        tế; điểm trong catalog demo là dữ liệu mẫu.
      </p>
    </section>
  );
}
