import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import MediaDropzone from "../components/MediaDropzone";
import { useMediaUpload } from "../hooks/useMediaUpload";
import { useJourney } from "../hooks/useJourney";
import {
  PageHeading,
  inputClass,
  buttonClass,
  ErrorNotice,
} from "../components/ui";
export default function Upload() {
  const media = useMediaUpload();
  const { saveJourney } = useJourney();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const values = new FormData(event.currentTarget);
    const notes = String(values.get("notes") || "").trim();
    if (
      !String(values.get("title") || "").trim() ||
      !String(values.get("location") || "").trim()
    ) {
      setError("Vui lòng nhập tên chuyến đi và địa điểm.");
      return;
    }
    if (!media.files.length && !notes) {
      setError("Thêm ít nhất một tệp media hoặc ghi chú cho chuyến đi.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const id = crypto.randomUUID();
      await saveJourney({
        id,
        title: String(values.get("title")).trim(),
        location: String(values.get("location")).trim(),
        date: String(values.get("date")),
        notes,
        tags: String(values.get("tags") || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        createdAt: new Date().toISOString(),
        media: media.files.map((item) => ({
          id: item.id,
          name: item.name,
          blob: item.file,
          kind: item.type.startsWith("image/")
            ? "image"
            : item.type.startsWith("video/")
              ? "video"
              : "audio",
        })),
      });
      navigate(`/journey/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lưu chuyến đi.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <>
      <PageHeading
        title="Upload chuyến đi"
        description="Giữ lại ảnh, video, âm thanh và những ghi chú trên đường. Media được lưu trên thiết bị; tính năng tự động lập chỉ mục AI sẽ được bổ sung sau."
      />
      <form
        onSubmit={submit}
        className="space-y-6 rounded-2xl border border-slate-200/70 bg-white p-4 sm:p-7"
      >
        <fieldset disabled={saving} className="space-y-6">
          <div className="grid gap-5 lg:grid-cols-2">
            <label className="text-sm">
              Tên chuyến đi
              <input
                name="title"
                required
                maxLength={150}
                className={inputClass}
                placeholder="Một ngày ở Đà Lạt"
              />
            </label>
            <label className="text-sm">
              Địa điểm
              <input
                name="location"
                required
                className={inputClass}
                placeholder="Đà Lạt, Lâm Đồng"
              />
            </label>
            <label className="text-sm">
              Ngày chuyến đi
              <input name="date" required type="date" className={inputClass} />
            </label>
            <label className="text-sm">
              Tags, phân cách bằng dấu phẩy
              <input
                name="tags"
                className={inputClass}
                placeholder="cafe, thiên nhiên"
              />
            </label>
          </div>
          <MediaDropzone media={media} />
          <label className="block text-sm">
            Ghi chú
            <textarea
              name="notes"
              rows={4}
              className={inputClass}
              placeholder="Điều gì khiến bạn nhớ nhất về chuyến đi này?"
            />
          </label>
          <ErrorNotice message={error} />
          <button disabled={saving} className={buttonClass}>
            {saving ? "Đang lưu…" : "Lưu chuyến đi"}
          </button>
        </fieldset>
      </form>
    </>
  );
}
