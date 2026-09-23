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
    <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
      {place.coverImage && (
        <img
          src={place.coverImage}
          alt={place.name}
          className="h-40 w-full rounded-xl object-cover"
          loading="lazy"
        />
      )}
      <h3 className="font-semibold text-slate-800">{place.name}</h3>
      <p className="text-sm text-slate-500">
        {place.address || "Chưa có địa chỉ"}
      </p>
      <p className="text-sm">
        {place.cost || "Chưa có giá"}
        {place.rating !== undefined && " · " + place.rating + " / 5"}
      </p>
      {place.matchScore !== undefined && (
        <p className="text-xs text-teal-800">
          Độ phù hợp: {Math.max(0, Math.min(100, place.matchScore))}%
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        >
          Xem chi tiết
        </button>
        <button
          type="button"
          disabled={isAdded || !onAddToPlan}
          onClick={() => onAddToPlan?.(place)}
          className="rounded-xl bg-teal-50 px-3 py-2 text-sm text-teal-800 disabled:opacity-50"
        >
          {isAdded ? "Đã thêm vào lịch trình" : "Thêm vào lịch trình"}
        </button>
      </div>
      {open && (
        <Modal title={place.name} onClose={() => setOpen(false)}>
          <div className="space-y-4">
            <p className="text-sm">{place.address || "Chưa có địa chỉ"}</p>
            <p className="text-sm">{place.cost || "Chưa có giá"}</p>
            <p className="text-sm text-slate-500">{place.tags?.join(" · ")}</p>
            <MapView places={[place]} />
          </div>
        </Modal>
      )}
    </article>
  );
}
