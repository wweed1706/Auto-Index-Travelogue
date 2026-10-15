import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useUploadForm } from "../hooks/useUploadForm";
import MediaDropzone from "../components/MediaDropzone";
import LocationAutocomplete from "../components/LocationAutocomplete";
import {
  PageHeading,
  ErrorNotice,
  Field,
  Badge,
  Spinner,
  Skeleton,
  EmptyState,
} from "../components/ui";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from "../components/Icons";
const stages = [
  { id: "checking", label: "Chuẩn bị media" },
  { id: "analyzing", label: "Sắp xếp ký ức" },
  { id: "saving", label: "Lưu chuyến đi" },
];
export default function Upload() {
  const { id } = useParams();
  const form = useUploadForm(id);
  const [more, setMore] = useState(Boolean(id));
  if (!form.ready) return <Skeleton count={2} label="Đang mở bản nháp…" />;
  if (id && !form.existing)
    return (
      <EmptyState
        title="Không tìm thấy chuyến đi"
        action={
          <Link to="/gallery" className="btn-secondary">
            Về thư viện
          </Link>
        }
      />
    );
  const currentStage = stages.findIndex((stage) => stage.id === form.stage);
  return (
    <>
      <Link
        to={id ? "/journey/" + id : "/gallery"}
        className="mb-6 inline-flex items-center gap-2 text-xs text-slate-500 transition-colors hover:text-teal-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {id ? "Về chuyến đi" : "Thư viện ký ức"}
      </Link>
      <PageHeading
        eyebrow="CAPTURE A MOMENT"
        title={id ? "Chỉnh sửa chuyến đi" : "Giữ lại một chuyến đi."}
        description="Bắt đầu bằng những khoảnh khắc. Thêm vài dòng để câu chuyện trở nên trọn vẹn."
        action={<Badge demo>AI mô phỏng</Badge>}
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.submit();
          }}
          className="card space-y-6 p-5 sm:p-7"
        >
          <fieldset disabled={form.busy} className="min-w-0 space-y-7">
            {form.restored && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-teal-50 px-4 py-3 text-xs text-teal-800">
                <span>Đã khôi phục bản nháp của bạn.</span>
                <button
                  type="button"
                  onClick={() => void form.discard()}
                  className="font-medium underline"
                >
                  Bắt đầu lại
                </button>
              </div>
            )}
            <MediaDropzone media={form.media} disabled={form.busy} />
            <div className="border-t border-slate-200 pt-6">
              <p className="mb-4 text-sm font-medium text-slate-800">
                Một chút về chuyến đi
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Tên chuyến đi">
                  <input
                    required
                    maxLength={150}
                    value={form.input.title}
                    onChange={(event) =>
                      form.setField("title", event.target.value)
                    }
                    placeholder="Một ngày không vội"
                    className="input"
                  />
                </Field>
                <LocationAutocomplete
                  value={form.input.location}
                  onChange={(location) => form.setField("location", location)}
                  disabled={form.busy}
                />
                <Field label="Ngày chuyến đi">
                  <input
                    required
                    type="date"
                    value={form.input.date}
                    onChange={(event) =>
                      form.setField("date", event.target.value)
                    }
                    className="input"
                  />
                </Field>
                <Field label="Chủ đề" hint="Phân cách bằng dấu phẩy.">
                  <input
                    value={form.input.tags.join(",")}
                    onChange={(event) =>
                      form.setField("tags", event.target.value.split(","))
                    }
                    placeholder="Cafe, thiên nhiên"
                    className="input"
                  />
                </Field>
              </div>
            </div>
            <button
              type="button"
              aria-expanded={more}
              onClick={() => setMore(!more)}
              className="text-xs font-medium text-teal-700 hover:underline"
            >
              {more ? "− Thu gọn ghi chú & vị trí" : "+ Thêm ghi chú & vị trí"}
            </button>
            {more && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4">
                <Field label="Ghi chú">
                  <textarea
                    value={form.input.notes}
                    onChange={(event) =>
                      form.setField("notes", event.target.value)
                    }
                    rows={4}
                    placeholder="Điều gì khiến bạn nhớ nhất?"
                    className="input"
                  />
                </Field>
                <details className="rounded-xl bg-slate-50 p-4">
                  <summary className="cursor-pointer text-xs text-slate-600">
                    Điều chỉnh tọa độ đã chọn (tùy chọn)
                  </summary>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="Vĩ độ">
                      <input
                        type="number"
                        step="any"
                        min={-90}
                        max={90}
                        disabled={!form.input.location}
                        value={form.input.location?.lat ?? ""}
                        onChange={(event) =>
                          form.input.location &&
                          event.target.value &&
                          form.setField("location", {
                            ...form.input.location,
                            lat: Number(event.target.value),
                          })
                        }
                        className="input"
                      />
                    </Field>
                    <Field label="Kinh độ">
                      <input
                        type="number"
                        step="any"
                        min={-180}
                        max={180}
                        disabled={!form.input.location}
                        value={form.input.location?.lng ?? ""}
                        onChange={(event) =>
                          form.input.location &&
                          event.target.value &&
                          form.setField("location", {
                            ...form.input.location,
                            lng: Number(event.target.value),
                          })
                        }
                        className="input"
                      />
                    </Field>
                  </div>
                </details>
              </div>
            )}
            <ErrorNotice message={form.error} />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
              <p role="status" className="text-[11px] text-slate-500">
                {form.draftStatus || "Hỗ trợ cả nhật ký chỉ có ghi chú"}
              </p>
              <button disabled={form.busy} className="btn-primary">
                {form.busy ? <Spinner /> : <Sparkles className="h-4 w-4" />}
                {form.busy
                  ? "Đang xử lý…"
                  : id
                    ? "Lưu thay đổi"
                    : "Lưu chuyến đi"}
              </button>
            </div>
          </fieldset>
        </form>
        <aside className="space-y-5 xl:sticky xl:top-24">
          <div className="card p-6">
            <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="text-sm font-semibold">
              Từ khoảnh khắc đến câu chuyện
            </h2>
            <p className="mt-3 text-xs leading-6 text-slate-500">
              Ảnh, video và âm thanh được sắp xếp cùng ghi chú của bạn trong một
              chuyến đi.
            </p>
            <div className="mt-6 space-y-4">
              {[
                "Thư viện media gọn gàng",
                "Timeline theo ngày",
                "Vị trí trên bản đồ",
              ].map((label) => (
                <p
                  key={label}
                  className="flex items-center gap-2 text-xs text-slate-600"
                >
                  <CheckCircle className="h-4 w-4 text-teal-600" />
                  {label}
                </p>
              ))}
            </div>
            <p className="mt-6 border-t border-slate-200 pt-4 text-[11px] leading-5 text-slate-500">
              AI demo dùng thông tin bạn cung cấp, chưa nhận diện nội dung ảnh.
            </p>
          </div>
          {form.busy && (
            <div
              role="status"
              aria-live="polite"
              className="card space-y-4 p-6 animate-in fade-in"
            >
              <p className="text-sm font-medium">Đang chuẩn bị câu chuyện…</p>
              {stages.map((stage, index) => (
                <div
                  key={stage.id}
                  className={`flex items-center gap-3 text-xs ${index <= currentStage ? "text-teal-700" : "text-slate-400"}`}
                >
                  {index < currentStage ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : index === currentStage ? (
                    <Spinner />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-slate-200" />
                  )}
                  {stage.label}
                </div>
              ))}
              {form.stage !== "saving" && (
                <button
                  type="button"
                  onClick={form.cancel}
                  className="text-xs text-slate-500 underline"
                >
                  Hủy xử lý
                </button>
              )}
            </div>
          )}
          {!form.busy && (
            <Link
              to="/planner/new"
              className="flex items-center justify-between px-1 text-xs text-slate-500 hover:text-teal-700 transition-colors"
            >
              Chuẩn bị chuyến đi tiếp theo
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </aside>
      </div>
    </>
  );
}
