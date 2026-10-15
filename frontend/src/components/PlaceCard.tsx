import { useState } from "react";
import type { Place } from "../types";
import { money } from "../services/utils";
import { categoryLabels } from "../services/catalog";
import { MapPin, Plus, CheckCircle, Clock } from "./Icons";
import { Badge } from "./ui";
import Modal from "./Modal";
import MapView from "./MapView";
export default function PlaceCard({
  place,
  onAddToPlan,
  isAdded = false,
  day = 1,
  disabled = false,
}: {
  place: Place;
  onAddToPlan: (place: Place) => void;
  isAdded?: boolean;
  day?: number;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <article className="interactive-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-2 text-[10px] font-medium text-slate-500">
            {categoryLabels[place.category]}
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-left text-sm font-semibold text-slate-800 transition-colors hover:text-teal-700"
          >
            {place.name}
          </button>
        </div>
        {place.matchScore !== undefined && (
          <Badge demo>{place.matchScore}% phù hợp</Badge>
        )}
      </div>
      <p className="mt-3 line-clamp-2 text-xs leading-6 text-slate-500">
        {place.description}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {place.durationMinutes} phút
        </span>
        <span className="font-medium text-slate-700">
          {place.costAmount ? money(place.costAmount) : "Miễn phí"} / người
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs text-slate-500 hover:text-teal-700"
        >
          Chi tiết & vị trí
        </button>
        <button
          type="button"
          disabled={isAdded || disabled}
          onClick={() => onAddToPlan(place)}
          className={`btn !min-h-9 !px-3 !py-1.5 !text-xs ${isAdded ? "border-slate-200 bg-slate-50 text-slate-400" : "border-teal-100 bg-teal-50 text-teal-800 hover:bg-teal-100"}`}
        >
          {isAdded ? (
            <CheckCircle className="h-3.5 w-3.5" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          {isAdded ? "Đã thêm" : "Thêm vào ngày " + day}
        </button>
      </div>
      {open && (
        <Modal title={place.name} onClose={() => setOpen(false)}>
          <div className="mb-5 space-y-3">
            <p className="text-sm leading-7 text-slate-500">
              {place.description}
            </p>
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="h-4 w-4" />
              {place.address}
            </p>
            <p className="text-xs text-slate-600">
              {money(place.costAmount)} / người · {place.durationMinutes} phút
            </p>
            <p className="text-[11px] text-teal-700">
              Địa điểm và giá minh họa, chưa được xác minh thực tế.
            </p>
          </div>
          <MapView
            points={[
              {
                id: place.id,
                name: place.name,
                coordinates: place.coordinates,
              },
            ]}
          />
        </Modal>
      )}
    </article>
  );
}
