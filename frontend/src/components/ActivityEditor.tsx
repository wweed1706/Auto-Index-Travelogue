import type { Activity } from "../types";
import { useActivityForm } from "../hooks/useActivityForm";
import { ErrorNotice, Field, Spinner } from "./ui";
export default function ActivityEditor({
  activity,
  time,
  onSave,
}: {
  activity?: Activity;
  time?: string;
  onSave: (activity: Activity) => Promise<boolean>;
}) {
  const form = useActivityForm(onSave, activity, time);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.submit();
      }}
      className="space-y-5"
    >
      <ErrorNotice message={form.error} />
      <fieldset disabled={form.busy} className="space-y-5">
        <Field label="Địa điểm / Hoạt động">
          <input
            required
            maxLength={200}
            value={form.activity.location}
            onChange={(event) => form.setField("location", event.target.value)}
            placeholder="Một điểm dừng mới"
            className="input"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Giờ">
            <input
              required
              type="time"
              value={form.activity.time}
              onChange={(event) => form.setField("time", event.target.value)}
              className="input"
            />
          </Field>
          <Field label="Thời lượng (phút)">
            <input
              required
              type="number"
              min={15}
              max={720}
              step={15}
              value={form.activity.durationMinutes}
              onChange={(event) =>
                form.setField("durationMinutes", Number(event.target.value))
              }
              className="input"
            />
          </Field>
        </div>
        <Field label="Chi phí mỗi người (VNĐ)">
          <input
            required
            type="number"
            min={0}
            step={1000}
            value={form.activity.costAmount}
            onChange={(event) =>
              form.setField("costAmount", Number(event.target.value))
            }
            className="input"
          />
        </Field>
        <Field label="Ghi chú">
          <textarea
            rows={3}
            value={form.activity.note}
            onChange={(event) => form.setField("note", event.target.value)}
            className="input"
          />
        </Field>
        <button className="btn-primary w-full" disabled={form.busy}>
          {form.busy && <Spinner />}
          {activity ? "Lưu hoạt động" : "Thêm hoạt động"}
        </button>
      </fieldset>
    </form>
  );
}
