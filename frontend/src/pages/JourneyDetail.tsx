import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useJourney } from "../hooks/useJourney";
import GalleryView from "../components/GalleryView";
import TimelineView from "../components/TimelineView";
import MediaPreview from "../components/MediaPreview";
import { PageHeading, EmptyState, ErrorNotice } from "../components/ui";
import type { Photo } from "../types";
export default function JourneyDetail() {
  const { id } = useParams();
  const { journey, loading, error } = useJourney(id);
  const [tab, setTab] = useState("gallery");
  const [photos, setPhotos] = useState<Photo[]>([]);
  useEffect(() => {
    if (!journey) return;
    const next = journey.media
      .filter((m) => m.kind === "image")
      .map((m) => ({
        id: m.id,
        url: URL.createObjectURL(m.blob),
        title: m.name,
        location: journey.location,
        takenAt: journey.date,
        tags: journey.tags,
      }));
    setPhotos(next);
    return () => next.forEach((p) => URL.revokeObjectURL(p.url));
  }, [journey]);
  if (loading) return <p role="status">Đang đọc chuyến đi…</p>;
  if (error) return <ErrorNotice message={error} />;
  if (!journey)
    return (
      <EmptyState>
        Không tìm thấy chuyến đi.{" "}
        <Link
          to="/gallery"
          className="text-slate-700 underline transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:opacity-80"
        >
          Về Gallery
        </Link>
      </EmptyState>
    );
  return (
    <div className="space-y-6">
      <Link
        to="/gallery"
        className="text-sm text-slate-700 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:opacity-80"
      >
        ← Gallery / Lịch sử
      </Link>
      <PageHeading
        title={journey.title}
        description={journey.location + " · " + journey.date}
      />
      <p className="rounded-xl bg-slate-50/60 p-4 text-sm text-slate-800 ">
        Đã lưu trên thiết bị. Nội dung chưa được AI phân tích.
      </p>
      {journey.notes && (
        <p className="whitespace-pre-wrap rounded-2xl border border-slate-100 bg-white p-5 text-sm leading-7 shadow-sm">
          {journey.notes}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {["gallery", "timeline", "map"].map((value) => (
          <button
            key={value}
            aria-pressed={tab === value}
            onClick={() => setTab(value)}
            className={
              "rounded-xl px-4 py-2.5 text-sm transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:opacity-80 disabled:hover:translate-y-0 disabled:hover:shadow-none " +
              (tab === value
                ? "bg-slate-50 text-slate-800 "
                : "bg-white text-slate-500 ")
            }
          >
            {value === "gallery"
              ? "Gallery"
              : value === "timeline"
                ? "Timeline"
                : "Map"}
          </button>
        ))}
      </div>
      {tab === "gallery" && (
        <>
          <GalleryView key={journey.id} photos={photos} />
          <div className="grid gap-4 lg:grid-cols-2">
            {journey.media
              .filter((m) => m.kind !== "image")
              .map((item) => (
                <MediaPreview key={item.id} item={item} />
              ))}
          </div>
        </>
      )}
      {tab === "timeline" && (
        <TimelineView
          timeline={[
            {
              id: journey.id,
              dayLabel: "Ngày chuyến đi",
              date: journey.date,
              time: "",
              location: journey.location,
              aiDescription: journey.notes,
              thumbnails: photos.map((p) => ({ url: p.url, caption: p.title })),
              tags: journey.tags,
            },
          ]}
        />
      )}
      {tab === "map" && (
        <EmptyState>
          Chuyến đi chưa có tọa độ địa lý.{" "}
          <a
            href={
              "https://www.google.com/maps/search/?api=1&query=" +
              encodeURIComponent(journey.location)
            }
            target="_blank"
            rel="noreferrer"
            className="text-slate-700 underline transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:opacity-80"
          >
            Tìm địa điểm trên Google Maps
          </a>
        </EmptyState>
      )}
    </div>
  );
}
