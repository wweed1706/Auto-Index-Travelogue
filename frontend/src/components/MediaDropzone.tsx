import { useRef, useState } from "react";
import type { useMediaUpload } from "../hooks/useMediaUpload";
import { UploadCloud, X, Plus, Image, CheckCircle } from "./Icons";
import { ErrorNotice } from "./ui";
export default function MediaDropzone({
  media,
  disabled = false,
}: {
  media: ReturnType<typeof useMediaUpload>;
  disabled?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const depth = useRef(0);
  return (
    <div className="space-y-4">
      <input
        ref={input}
        type="file"
        aria-label="Chọn media"
        className="sr-only"
        multiple
        disabled={disabled}
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/aac"
        onChange={(event) => {
          if (event.target.files) media.add(event.target.files);
          event.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => input.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) {
            depth.current++;
            setDragging(true);
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = disabled ? "none" : "copy";
        }}
        onDragLeave={() => {
          depth.current = Math.max(0, depth.current - 1);
          if (!depth.current) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          depth.current = 0;
          setDragging(false);
          if (!disabled) media.add(event.dataTransfer.files);
        }}
        className={`flex min-h-56 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-5 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md disabled:opacity-50 motion-reduce:transform-none ${dragging ? "border-teal-600 bg-teal-50 ring-4 ring-teal-50" : "border-slate-300 bg-slate-50/60 hover:border-teal-500 hover:bg-teal-50/30"}`}
      >
        <span className="mb-1 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-teal-700 shadow-sm">
          <UploadCloud className="h-6 w-6" />
        </span>
        <span className="text-sm font-medium text-slate-800">
          {dragging ? "Thả để thêm vào chuyến đi" : "Kéo thả hoặc chọn media"}
        </span>
        <span className="max-w-sm text-xs leading-6 text-slate-500">
          Ảnh, video, âm thanh · Tối đa 50 MB/tệp
          <br />
          40 tệp, tổng dung lượng tối đa 200 MB
        </span>
        <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-teal-700">
          <Plus className="h-3 w-3" />
          Chọn từ thiết bị
        </span>
      </button>
      <ErrorNotice message={media.error} />
      {media.files.length > 0 && (
        <>
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <CheckCircle className="h-4 w-4 text-teal-600" />
              {media.files.length} tệp đã sẵn sàng
            </p>
            <button
              type="button"
              disabled={disabled}
              onClick={media.clear}
              className="text-xs text-slate-500 transition-colors hover:text-rose-700"
            >
              Xóa tất cả
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {media.files.map((item) => (
              <div
                key={item.id}
                className="group relative min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {item.type.startsWith("image/") ? (
                  <img
                    src={item.previewUrl || ""}
                    alt={item.name}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : item.isVideo ? (
                  <video
                    aria-label={item.name}
                    src={item.previewUrl || ""}
                    controls
                    className="aspect-[4/3] w-full bg-slate-100"
                  />
                ) : (
                  <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-slate-50 px-2">
                    <Image className="h-5 w-5 text-teal-600" />
                    <audio
                      aria-label={item.name}
                      src={item.previewUrl || ""}
                      controls
                      className="h-8 w-full min-w-0"
                    />
                  </div>
                )}
                <button
                  type="button"
                  disabled={disabled}
                  aria-label={"Xóa " + item.name}
                  onClick={() => media.remove(item.id)}
                  className="absolute right-2 top-2 rounded-lg border border-slate-200 bg-white/95 p-1.5 text-slate-500 transition-all duration-300 hover:bg-rose-50 hover:text-rose-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="p-2.5">
                  <p className="truncate text-[11px] font-medium text-slate-700">
                    {item.name}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">{item.size}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
