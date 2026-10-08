import type { Journey, MediaItem } from "../types";
import { Clock, MapPin, Image } from "./Icons";
import { displayDate } from "../services/utils";
export default function TimelineView({
  journey,
  media,
}: {
  journey: Journey;
  media: MediaItem[];
}) {
  return (
    <section
      aria-label="Dòng thời gian chuyến đi"
      className="relative ml-3 border-l border-slate-200 pl-7 sm:pl-10"
    >
      <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-teal-600 ring-4 ring-slate-50" />
      <p className="mb-5 text-xs font-medium text-teal-700">
        {displayDate(journey.date)}
      </p>
      <div className="card mb-6 p-5 sm:p-6">
        <p className="flex items-center gap-2 text-xs text-slate-500">
          <MapPin className="h-4 w-4" />
          {journey.location}
        </p>
        <h2 className="mt-3 text-lg font-semibold tracking-tight">
          {journey.title}
        </h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-500">
          {journey.notes || "Những khoảnh khắc được lưu lại cùng chuyến đi."}
        </p>
      </div>
      <div className="space-y-3">
        {media.map((item, index) => (
          <div
            key={item.id}
            style={{ animationDelay: Math.min(index * 60, 360) + "ms" }}
            className="card flex items-start gap-4 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <Image className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-medium">{item.name}</h3>
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                <Clock className="h-3 w-3" />
                {item.takenAt?.includes("T")
                  ? new Intl.DateTimeFormat("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(item.takenAt))
                  : "Chưa có giờ ghi nhận"}
              </p>
              <p className="mt-2 text-[11px] text-slate-500">
                {item.tags.join(" · ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
