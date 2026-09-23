import { useRef, useState } from "react";
import type { useMediaUpload } from "../hooks/useMediaUpload";
import { UploadCloud } from "./Icons";
import { ErrorNotice } from "./ui";
export default function MediaDropzone({
  media,
}: {
  media: ReturnType<typeof useMediaUpload>;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  return (
    <div className="space-y-4">
      <input
        ref={input}
        type="file"
        aria-label="Chọn media"
        className="sr-only"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/aac"
        onChange={(event) => {
          if (event.target.files) media.add(event.target.files);
          event.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          media.add(event.dataTransfer.files);
        }}
        className={
          "flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center sm:p-10 " +
          (dragging
            ? "border-teal-500 bg-teal-50"
            : "border-slate-200 bg-slate-50/50 hover:bg-slate-50")
        }
      >
        <UploadCloud className="h-8 w-8 text-teal-700" />
        <span className="text-sm font-medium">Kéo thả hoặc chọn media</span>
        <span className="text-xs leading-6 text-slate-500">
          Ảnh JPG, PNG, WebP, GIF · Video MP4, WebM · Audio MP3, WAV, OGG, M4A,
          AAC
          <br />
          Tối đa 50 MB mỗi tệp
        </span>
      </button>
      <ErrorNotice message={media.error} />
      {media.files.length > 0 && (
        <>
          <div className="flex justify-between text-sm">
            <span>{media.files.length} tệp đã chọn</span>
            <button
              type="button"
              onClick={media.clear}
              className="text-slate-500 underline"
            >
              Xóa tất cả
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {media.files.map((item) => (
              <div
                key={item.id}
                className="min-w-0 rounded-xl border border-slate-200 p-2"
              >
                {item.previewUrl &&
                  (item.type.startsWith("image/") ? (
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="h-28 w-full rounded-lg object-cover"
                    />
                  ) : item.isVideo ? (
                    <video
                      src={item.previewUrl}
                      controls
                      className="h-28 w-full"
                    />
                  ) : (
                    <audio
                      aria-label={item.name}
                      src={item.previewUrl}
                      controls
                      className="w-full"
                    />
                  ))}
                <p className="truncate py-2 text-xs">{item.name}</p>
                <button
                  type="button"
                  aria-label={"Xóa " + item.name}
                  onClick={() => media.remove(item.id)}
                  className="rounded-lg px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
                >
                  Xóa tệp
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
