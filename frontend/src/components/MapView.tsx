import type { Place } from "../types";
import { EmptyState } from "./ui";
export default function MapView({ places = [] }: { places?: Place[] }) {
  if (!places.length)
    return <EmptyState>Chưa có địa điểm để hiển thị trên bản đồ.</EmptyState>;
  return (
    <section aria-label="Bản đồ địa điểm" className="space-y-3">
      {places.map((place) => (
        <a
          key={place.id}
          href={
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(
              place.latitude !== undefined && place.longitude !== undefined
                ? place.latitude + "," + place.longitude
                : place.name + " " + (place.address || ""),
            )
          }
          target="_blank"
          rel="noreferrer"
          className="block rounded-xl border border-slate-200 bg-white p-4 text-sm text-teal-700"
        >
          {place.name} · Mở trên Google Maps ↗
        </a>
      ))}
    </section>
  );
}
