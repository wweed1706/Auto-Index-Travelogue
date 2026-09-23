import { useEffect, useState } from "react";
import type { MediaItem } from "../types";
export default function MediaPreview({ item }: { item: MediaItem }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const next = URL.createObjectURL(item.blob);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [item.blob]);
  if (!url) return null;
  return (
    <figure className="min-w-0 overflow-hidden rounded-xl border border-slate-200/70 bg-white p-2 shadow-sm transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 ">
      {item.kind === "image" ? (
        <img
          src={url}
          alt={item.name}
          className="h-48 w-full rounded-lg object-cover transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none"
          loading="lazy"
        />
      ) : item.kind === "video" ? (
        <video
          aria-label={item.name}
          src={url}
          controls
          className="h-48 w-full rounded-lg"
        />
      ) : (
        <audio
          aria-label={item.name}
          src={url}
          controls
          className="max-w-full"
        />
      )}
      <figcaption className="truncate p-2 text-xs text-slate-500 ">
        {item.name}
      </figcaption>
    </figure>
  );
}
