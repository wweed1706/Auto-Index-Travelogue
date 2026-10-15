import type { MediaItem } from "../types";
import { useBlobUrl } from "../hooks/useMedia";
export default function MediaPreview({ item }: { item: MediaItem }) {
  const url = useBlobUrl(item.blob);
  return (
    <figure className="card min-w-0 overflow-hidden p-3">
      {item.kind === "image" ? (
        <img
          src={url}
          alt={item.name}
          loading="lazy"
          className="h-48 w-full rounded-xl object-cover"
        />
      ) : item.kind === "video" ? (
        <video
          aria-label={item.name}
          src={url}
          controls
          className="w-full rounded-xl"
        />
      ) : (
        <audio aria-label={item.name} src={url} controls className="w-full" />
      )}
      <figcaption className="mt-3 truncate text-xs text-slate-500">
        {item.name}
      </figcaption>
    </figure>
  );
}
