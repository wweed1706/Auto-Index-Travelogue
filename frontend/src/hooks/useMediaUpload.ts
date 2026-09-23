import { useState, useEffect, useRef } from "react";
import type { SelectedFile } from "../types";
export function useMediaUpload() {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [error, setError] = useState("");
  const urls = useRef(new Set<string>());
  useEffect(() => {
    const active = urls.current;
    return () => {
      active.forEach((url) => URL.revokeObjectURL(url));
      active.clear();
    };
  }, []);
  const add = (incoming: FileList | File[]) => {
    const accepted: SelectedFile[] = [];
    const invalid: string[] = [];
    Array.from(incoming).forEach((file) => {
      if (
        !/^(image\/(jpeg|png|webp|gif)|video\/(mp4|webm)|audio\/(mpeg|mp3|wav|x-wav|ogg|webm|mp4|aac))$/.test(
          file.type,
        ) ||
        file.size > 50 * 1024 * 1024
      ) {
        invalid.push(file.name);
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      urls.current.add(previewUrl);
      accepted.push({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: (file.size / 1024).toFixed(1),
        type: file.type,
        previewUrl,
        isVideo: file.type.startsWith("video/"),
      });
    });
    setFiles((prev) => [...prev, ...accepted]);
    setError(
      invalid.length
        ? `Không nhận: ${invalid.join(", ")}. Chỉ nhận media được hỗ trợ, tối đa 50 MB/tệp.`
        : "",
    );
  };
  // Chỉ thu hồi URL của tệp bị xóa, không ảnh hưởng preview của các tệp còn lại.
  const remove = (id: string) => {
    const item = files.find((file) => file.id === id);
    if (item?.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
      urls.current.delete(item.previewUrl);
    }
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };
  const clear = () => {
    urls.current.forEach((url) => URL.revokeObjectURL(url));
    urls.current.clear();
    setFiles([]);
  };
  return { files, error, add, remove, clear };
}
