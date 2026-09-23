import { useState } from "react";
import type { Place } from "../types";
import Modal from "./Modal";
import MapView from "./MapView";
export default function PlaceCard({
  place,
  onAddToPlan,
  isAdded = false,
}: {
  place: Place;
  onAddToPlan?: (place: Place) => void;
  isAdded?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <article className="space-y-4 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 ">
      {place.coverImage && (
        <img
          src={place.coverImage}
          alt={place.name}
          className="h-40 w-full rounded-xl object-cover transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none"
          loading="lazy"
        />
      )}
      <h3 className="font-semibold text-slate-800 ">
        {place.name}
      </h3>
      <p className="text-sm text-slate-500 ">
        {place.address || "Chưa có địa chỉ"}
      </p>
      <p className="text-sm">
        {place.cost || "Chưa có giá"}
        {place.rating !== undefined && " · " + place.rating + " / 5"}
      </p>
      {place.matchScore !== undefined && (
        <p className="text-xs text-slate-800 ">
          Độ phù hợp: {Math.max(0, Math.min(100, place.matchScore))}%
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl border border-slate-100 px-3 py-2 text-sm transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:opacity-80 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          Xem chi tiết
        </button>
        <button
          type="button"
          disabled={isAdded || !onAddToPlan}
          onClick={() => onAddToPlan?.(place)}
          className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-800 disabled:opacity-50 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:opacity-80 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {isAdded ? "Đã thêm vào lịch trình" : "Thêm vào lịch trình"}
        </button>
      </div>
      {open && (
        <Modal title={place.name} onClose={() => setOpen(false)}>
          <div className="space-y-4">
            <p className="text-sm">{place.address || "Chưa có địa chỉ"}</p>
            <p className="text-sm">{place.cost || "Chưa có giá"}</p>
            <p className="text-sm text-slate-500 ">
              {place.tags?.join(" · ")}
            </p>
            <MapView places={[place]} />
          </div>
        </Modal>
      )}
    </article>
  );
}
