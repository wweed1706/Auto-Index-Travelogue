import { useEffect, useState } from "react";
import type { MediaItem } from "../types";
import { useBlobUrl } from "../hooks/useMedia";
import { Image, ArrowLeft, ArrowRight, MapPin } from "./Icons";
import { EmptyState } from "./ui";
import Modal from "./Modal";
import { displayDate } from "../services/utils";
function MediaTile({ item, onOpen }: { item: MediaItem; onOpen: () => void }) {
  const url = useBlobUrl(item.blob);
  return (
    <button
      type="button"
      aria-label={
        "Xem " + (item.kind === "image" ? "ảnh " : "media ") + item.name
      }
      onClick={onOpen}
      className="interactive-card group min-w-0 overflow-hidden text-left"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {item.kind === "image" ? (
          <img
            src={url}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
          />
        ) : item.kind === "video" ? (
          <video
            src={url}
            muted
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-teal-700">
            <Image className="h-9 w-9" />
          </span>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] text-slate-700">
          {item.kind === "image"
            ? "Ảnh"
            : item.kind === "video"
              ? "Video · mở để xem"
              : "Âm thanh · mở để nghe"}
        </span>
      </div>
      <div className="p-3.5">
        <p className="truncate text-xs font-medium text-slate-700">
          {item.name}
        </p>
        <p className="mt-1 text-[10px] text-slate-500">
          {item.takenAt ? displayDate(item.takenAt) : "Chưa có ngày ghi nhận"}
        </p>
      </div>
    </button>
  );
}
export default function GalleryView({ media = [] }: { media?: MediaItem[] }) {
  const [selectedId, setSelectedId] = useState<string>();
  const active = media.find((item) => item.id === selectedId);
  const activeIndex = media.findIndex((item) => item.id === selectedId);
  const url = useBlobUrl(active?.blob);
  useEffect(() => {
    if (!active) return;
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && activeIndex < media.length - 1)
        setSelectedId(media[activeIndex + 1].id);
      if (event.key === "ArrowLeft" && activeIndex > 0)
        setSelectedId(media[activeIndex - 1].id);
    };
    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  }, [active, activeIndex, media]);
  if (!media.length)
    return (
      <EmptyState title="Một trang nhật ký không cần ảnh">
        Ghi chú của chuyến đi vẫn được lưu trọn vẹn. Bạn có thể thêm media khi
        chỉnh sửa.
      </EmptyState>
    );
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {media.map((item) => (
          <MediaTile
            key={item.id}
            item={item}
            onOpen={() => setSelectedId(item.id)}
          />
        ))}
      </div>
      {active && (
        <Modal title={active.name} onClose={() => setSelectedId(undefined)}>
          <div className="overflow-hidden rounded-xl bg-slate-50">
            {active.kind === "image" ? (
              <img
                src={url}
                alt={active.name}
                className="max-h-[60dvh] w-full object-contain"
              />
            ) : active.kind === "video" ? (
              <video src={url} controls className="max-h-[60dvh] w-full" />
            ) : (
              <div className="p-6">
                <audio src={url} controls className="w-full" />
              </div>
            )}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="h-4 w-4" />
              {active.location || "Chưa có vị trí"}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Media trước"
                disabled={activeIndex <= 0}
                onClick={() => setSelectedId(media[activeIndex - 1].id)}
                className="btn-secondary !min-h-9 !p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="text-xs text-slate-500">
                {activeIndex + 1} / {media.length}
              </span>
              <button
                type="button"
                aria-label="Media tiếp theo"
                disabled={activeIndex >= media.length - 1}
                onClick={() => setSelectedId(media[activeIndex + 1].id)}
                className="btn-secondary !min-h-9 !p-2"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
