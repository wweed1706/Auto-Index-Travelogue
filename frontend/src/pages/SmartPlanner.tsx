import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PlannerForm from "../components/PlannerForm";
import PlannerItinerary from "../components/PlannerItinerary";
import { usePlanner } from "../hooks/usePlanner";
import {
  PageHeading,
  buttonClass,
  inputClass,
  ErrorNotice,
  EmptyState,
} from "../components/ui";
import RecommendationList from "../components/RecommendationList";
import type { PlannerInput, Place } from "../types";
export default function SmartPlanner() {
  const { id } = useParams();
  const {
    itineraries,
    create,
    addActivity: saveActivity,
    loading,
    error: loadError,
  } = usePlanner();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const plan = itineraries.find((p) => p.id === id);
  async function generate(input: PlannerInput) {
    setSaving(true);
    setError("");
    try {
      const next = await create(input);
      navigate("/planner/" + next.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo kế hoạch.");
    } finally {
      setSaving(false);
    }
  }
  async function addActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!plan || saving) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const day = Number(data.get("day"));
    if (!String(data.get("location") || "").trim()) {
      setError("Vui lòng nhập địa điểm hoặc hoạt động.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await saveActivity(plan, day, {
        time: String(data.get("time")),
        location: String(data.get("location")).trim(),
        aiNote: String(data.get("notes") || ""),
        typeLabel: "Tự thêm",
      });
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể thêm hoạt động.",
      );
    } finally {
      setSaving(false);
    }
  }
  async function addPlace(place: Place) {
    if (!plan || saving) return;
    setSaving(true);
    setError("");
    try {
      await saveActivity(plan, 1, {
        placeId: place.id,
        time: "09:00",
        location: place.name,
        cost: place.cost,
        image: place.coverImage,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể thêm địa điểm.");
    } finally {
      setSaving(false);
    }
  }
  if (id && loading) return <p role="status">Đang đọc kế hoạch…</p>;
  if (id && !plan)
    return (
      <>
        <ErrorNotice message={loadError} />
        <EmptyState>
          Không tìm thấy kế hoạch.{" "}
          <Link to="/gallery" className="text-teal-700 underline">
            Về Gallery
          </Link>
        </EmptyState>
      </>
    );
  return (
    <div className="space-y-6">
      <PageHeading
        title="Lên kế hoạch du lịch"
        description="Bắt đầu từ mong muốn của bạn, sắp xếp từng ngày theo nhịp đi riêng."
      />
      <ErrorNotice message={error || loadError} />
      {!plan ? (
        <>
          <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-500">
            Bạn có thể tạo và lưu bản nháp, thêm hoạt động theo giờ. Đề xuất địa
            điểm và tạo lịch trình bằng AI đang chờ kết nối.
          </p>
          <PlannerForm onSubmit={generate} isLoading={saving} />
        </>
      ) : (
        <>
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">
                {plan.criteria.destination}
              </h2>
              <Link className="text-sm text-teal-700 underline" to="/planner">
                Tạo kế hoạch khác
              </Link>
            </div>
            <p className="text-sm text-slate-500">
              {plan.criteria.startDate} · {plan.criteria.endDate} ·{" "}
              {plan.criteria.travelers} người ·{" "}
              {plan.criteria.budget.toLocaleString("vi-VN")} đ/người
            </p>
            <p className="text-sm">
              Sở thích: {plan.criteria.interests.join(", ")}
            </p>
            {plan.criteria.dislikes && (
              <p className="text-sm">
                Điều cần tránh: {plan.criteria.dislikes}
              </p>
            )}
            <p role="status" className="text-xs text-teal-700">
              Đã lưu bản nháp trên thiết bị
            </p>
            <Link
              to="/gallery"
              className="inline-block text-sm text-teal-700 underline"
            >
              Xem trong Gallery
            </Link>
          </section>
          <PlannerItinerary key={plan.id} days={plan.days} />
          <form
            onSubmit={addActivity}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
          >
            <h2 className="font-semibold">Thêm hoạt động vào lịch trình</h2>
            <fieldset disabled={saving} className="grid gap-4 lg:grid-cols-2">
              <label className="text-sm">
                Ngày
                <select name="day" className={inputClass}>
                  {plan.days.map((d) => (
                    <option key={d.dayNumber} value={d.dayNumber}>
                      Ngày {d.dayNumber} · {d.date}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                Giờ
                <input
                  name="time"
                  required
                  type="time"
                  className={inputClass}
                />
              </label>
              <label className="text-sm">
                Địa điểm / Hoạt động
                <input
                  name="location"
                  required
                  maxLength={200}
                  className={inputClass}
                />
              </label>
              <label className="text-sm">
                Ghi chú
                <input name="notes" className={inputClass} />
              </label>
              <button disabled={saving} className={buttonClass}>
                {saving ? "Đang lưu…" : "Thêm và lưu hoạt động"}
              </button>
            </fieldset>
          </form>
          <RecommendationList
            recommendations={[]}
            onAddPlace={(place) => void addPlace(place)}
            addedPlaceIds={plan.days.flatMap((day) =>
              day.activities.flatMap((activity) =>
                activity.placeId ? [activity.placeId] : [],
              ),
            )}
          />
        </>
      )}
    </div>
  );
}
