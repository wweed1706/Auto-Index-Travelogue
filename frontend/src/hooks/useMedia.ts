import { useEffect, useState } from "react";
import { useLibrary } from "../context/LibraryContext";
import { storage } from "../services/storage";
import { messageOf } from "../services/utils";
import type { MediaItem, MediaMetadata } from "../types";
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
  const { ownerId } = useLibrary();
  const [url, setUrl] = useState("");
  const id = item?.id;
  useEffect(() => {
    let active = true;
    let objectUrl = "";
    setUrl("");
    if (id)
      storage
        .mediaItem(id, ownerId)
        .then((media) => {
          if (!active || !media) return;
          objectUrl = URL.createObjectURL(media.blob);
          setUrl(objectUrl);
        })
        .catch(() => {
          /* The card keeps its accessible cover fallback. */
        });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, ownerId]);
  return url;
}
export function useJourneyMedia(id?: string) {
  const { ownerId, journeys } = useLibrary();
  const journey = journeys.find((item) => item.id === id);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setMedia([]);
    setError("");
    if (!journey) {
      setLoading(false);
      return;
    }
    setLoading(true);
    storage
      .media(journey.id, ownerId)
      .then((items) => {
        if (active) setMedia(items);
      })
      .catch((err: unknown) => {
        if (active) setError(messageOf(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [journey, ownerId]);
  return { media, loading, error };
}
