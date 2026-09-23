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
          className="block rounded-xl border border-slate-100 bg-white p-4 text-sm text-slate-700 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:opacity-80"
        >
          {place.name} · Mở trên Google Maps ↗
        </a>
      ))}
    </section>
  );
}
