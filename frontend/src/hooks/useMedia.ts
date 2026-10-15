import { useEffect, useState } from "react";
import type { Journey, MediaMetadata } from "../types";

export function useBlobUrl(blob?: Blob) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!blob) {
      setUrl("");
      return;
    }
    const next = URL.createObjectURL(blob);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [blob]);
  return url;
}

export function useStoredMediaUrl(item?: MediaMetadata) {
  return item?.url || "";
}

export function useJourneyMedia(journey?: Journey) {
  return { media: journey?.media || [], loading: false, error: "" };
}
