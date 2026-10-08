import { useCallback, useEffect, useRef, useState } from "react";
import type { SelectedFile, MediaItem } from "../types";
export function useMediaUpload() {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [error, setError] = useState("");
  const current = useRef<SelectedFile[]>([]);
  const urls = useRef(new Set<string>());
  useEffect(() => {
    const active = urls.current;
    return () => {
      active.forEach((url) => URL.revokeObjectURL(url));
      active.clear();
    };
  }, []);
  const clear = useCallback(() => {
    urls.current.forEach((url) => URL.revokeObjectURL(url));
    urls.current.clear();
    current.current = [];
    setFiles([]);
    setError("");
  }, []);
  const add = useCallback((incoming: FileList | File[]) => {
    const next = [...current.current];
    const rejected: string[] = [];
    for (const file of Array.from(incoming)) {
      if (
        !/^(image\/(jpeg|png|webp|gif)|video\/(mp4|webm)|audio\/(mpeg|mp3|wav|x-wav|ogg|webm|mp4|aac))$/.test(
          file.type,
        ) ||
        file.size > 50 * 1024 * 1024 ||
        file.size === 0
      ) {
        rejected.push(file.name + " (định dạng hoặc dung lượng)");
        continue;
      }
      if (
        next.some(
          (item) =>
            item.name === file.name &&
            item.file.size === file.size &&
            item.file.lastModified === file.lastModified,
        )
      ) {
        rejected.push(file.name + " (đã có)");
        continue;
      }
      if (
        next.length >= 40 ||
        next.reduce((total, item) => total + item.file.size, 0) + file.size >
          200 * 1024 * 1024
      ) {
        rejected.push(file.name + " (tối đa 40 tệp / 200 MB)");
        continue;
      }
      const url = URL.createObjectURL(file);
      urls.current.add(url);
      next.push({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size:
          file.size < 1024 * 1024
            ? (file.size / 1024).toFixed(0) + " KB"
            : (file.size / 1024 / 1024).toFixed(1) + " MB",
        type: file.type,
        previewUrl: url,
        isVideo: file.type.startsWith("video/"),
      });
    }
    current.current = next;
    setFiles(next);
    setError(
      rejected.length
        ? "Không nhận: " +
            rejected.join(", ") +
            ". Chỉ nhận media được hỗ trợ, tối đa 50 MB/tệp."
        : "",
    );
  }, []);
  const remove = useCallback((id: string) => {
    const item = current.current.find((file) => file.id === id);
    if (item?.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
      urls.current.delete(item.previewUrl);
    }
    current.current = current.current.filter((file) => file.id !== id);
    setFiles(current.current);
  }, []);
  const restore = useCallback(
    (items: MediaItem[]) => {
      clear();
      const next = items.map((item) => {
        const file = new File([item.blob], item.name, {
          type: item.mimeType || item.blob.type,
          lastModified: item.takenAt ? Date.parse(item.takenAt) : 0,
        });
        const url = URL.createObjectURL(file);
        urls.current.add(url);
        return {
          id: item.id,
          file,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(1) + " MB",
          type: file.type,
          previewUrl: url,
          isVideo: item.kind === "video",
        };
      });
      current.current = next;
      setFiles(next);
    },
    [clear],
  );
  return { files, error, add, remove, clear, restore };
}
