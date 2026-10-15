import { Link } from "react-router-dom";
import type { Journey } from "../types";
import { useStoredMediaUrl } from "../hooks/useMedia";
import { displayDate } from "../services/utils";
import { findDestination } from "../services/catalog";
import { MapPin, ArrowRight, X } from "./Icons";
import DestinationArt from "./DestinationArt";
export default function JourneyCard({
  journey,
  onDelete,
  deleting = false,
  accent = "teal",
}: {
  journey: Journey;
  onDelete?: (id: string) => void;
  deleting?: boolean;
  accent?: "teal" | "sky";
}) {
  const cover = journey.media.find((item) => item.kind === "image");
  const url = useStoredMediaUrl(cover);
  return (
    <article className="interactive-card group relative overflow-hidden">
      <Link to={"/journey/" + journey.id} className="block">
        <div className="relative h-44 overflow-hidden bg-slate-100">
          {url ? (
            <img
              src={url}
              alt={"Ảnh bìa " + journey.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
            />
          ) : (
            <DestinationArt
              variant={findDestination(journey.location.name)?.symbol}
              className="h-full w-full"
            />
          )}
          <span className="absolute bottom-3 left-3 rounded-full border border-white/70 bg-white/95 px-2.5 py-1 text-[10px] text-slate-600">
            {journey.media.length} media
          </span>
        </div>
        <div className="p-5">
          <p className="text-[11px] text-slate-500">
            {displayDate(journey.date)}
          </p>
          <h3 className="mt-2 truncate text-base font-semibold tracking-tight text-slate-800">
            {journey.title}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{journey.location.name}</span>
          </p>
          <p className="mt-4 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">
            {journey.notes || "Những khoảnh khắc nhỏ, một câu chuyện riêng."}
          </p>
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="max-w-[80%] truncate text-[10px] text-slate-500">
              {journey.tags.slice(0, 2).join(" · ") || "Ký ức của bạn"}
            </span>
            <ArrowRight
              className={
                "h-4 w-4 " +
                (accent === "sky" ? "text-sky-700" : "text-teal-700")
              }
            />
          </div>
        </div>
      </Link>
      {onDelete && (
        <button
          type="button"
          disabled={deleting}
          aria-label={"Xóa chuyến đi " + journey.title}
          onClick={() => onDelete(journey.id)}
          className="absolute right-3 top-3 rounded-lg border border-white/70 bg-white/95 p-2 text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </article>
  );
}
