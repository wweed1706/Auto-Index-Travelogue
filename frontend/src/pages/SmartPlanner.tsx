import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { usePlanner } from "../hooks/usePlanner";
import PlannerForm from "../components/PlannerForm";
import PlannerItinerary from "../components/PlannerItinerary";
import RecommendationList from "../components/RecommendationList";
import ActivityEditor from "../components/ActivityEditor";
import Modal from "../components/Modal";
import MapView from "../components/MapView";
import DestinationArt from "../components/DestinationArt";
import {
  PageHeading,
  EmptyState,
  ErrorNotice,
  Skeleton,
  Badge,
  Spinner,
} from "../components/ui";
import {
  Plus,
  ArrowLeft,
  ArrowRight,
  Calendar,
  X,
  Map,
  CheckCircle,
} from "../components/Icons";
import { displayDate, money } from "../services/utils";
import { findDestination } from "../services/catalog";
import type { Activity } from "../types";
export default function SmartPlanner({
  newPlan = false,
}: {
  newPlan?: boolean;
}) {
  const { id } = useParams();
  const [params] = useSearchParams();
  const data = usePlanner(id);
  const [editor, setEditor] = useState<Activity | "new" | null>(null);
  const [editingCriteria, setEditingCriteria] = useState(false);
  const [mobileView, setMobileView] = useState("itinerary");
  const [mapVisible, setMapVisible] = useState(false);
  const move = (activityId: string, day: number, beforeId?: string) => {
    void data.move(activityId, day, beforeId).then((success) => {
      if (success) data.selectDay(day);
    });
  };
  if (newPlan)
    return (
      <>
        <Link
          to="/planner"
          className="mb-6 inline-flex items-center gap-2 text-xs text-slate-500 hover:text-teal-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Tất cả kế hoạch
        </Link>
        <PageHeading
          eyebrow="THE NEXT CHAPTER"
          title="Một ý tưởng. Một hành trình."
          description="Chọn điểm đến và nhịp đi của bạn. Chúng ta sẽ bắt đầu từ đó."
          action={<Badge demo>Đề xuất mô phỏng</Badge>}
        />
        <ErrorNotice message={data.error || data.mutationError} />
        <div className="mt-5 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <PlannerForm
            onSubmit={data.create}
            destination={params.get("destination") || ""}
          />
          <aside className="card space-y-5 p-6 xl:sticky xl:top-24">
            <Calendar className="h-6 w-6 text-teal-700" />
            <h2 className="text-sm font-semibold">
              Lịch trình theo nhịp của bạn
            </h2>
            <p className="text-xs leading-6 text-slate-500">
              Bắt đầu với gợi ý hoặc một trang trống. Thêm điểm dừng, chuyển
              ngày và điều chỉnh giờ bất cứ lúc nào.
            </p>
            <div className="border-t border-slate-200 pt-4 text-[11px] leading-6 text-slate-500">
              Catalog hiện có 6 điểm đến mẫu. Địa điểm khác vẫn có thể lên kế
              hoạch thủ công.
            </div>
          </aside>
        </div>
      </>
    );
  if (data.loading) return <Skeleton />;
  if (data.error)
    return (
      <ErrorNotice message={data.error} onRetry={() => void data.reload()} />
    );
  if (!id)
    return (
      <>
        <PageHeading
          eyebrow="YOUR NEXT ADVENTURES"
          title="Những chuyến đi phía trước."
          description="Một nơi cho mọi ý tưởng du lịch. Mở lại kế hoạch và tiếp tục từ nơi bạn dừng."
          action={
            <Link to="/planner/new" className="btn-primary">
              <Plus className="h-4 w-4" />
              Tạo kế hoạch mới
            </Link>
          }
        />
        <ErrorNotice message={data.mutationError} />
        {data.itineraries.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {data.itineraries.map((plan) => (
              <article
                key={plan.id}
                className="interactive-card group relative overflow-hidden"
              >
                <Link to={"/planner/" + plan.id} className="block">
                  <DestinationArt
                    variant={findDestination(plan.criteria.destination)?.symbol}
                    className="h-32 w-full"
                  />
                  <div className="p-5">
                    <p className="text-[10px] text-slate-500">
                      {displayDate(plan.criteria.startDate)}
                    </p>
                    <h2 className="mt-2 text-base font-semibold tracking-tight">
                      {plan.criteria.destination}
                    </h2>
                    <p className="mt-3 text-xs text-slate-500">
                      {plan.days.length} ngày · {plan.criteria.travelers} người
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {money(plan.criteria.budget)} / người
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-[11px] text-slate-500">
                        {plan.days.reduce(
                          (count, day) => count + day.activities.length,
                          0,
                        )}{" "}
                        hoạt động đã lưu
                      </span>
                      <ArrowRight className="h-4 w-4 text-teal-700" />
                    </div>
                  </div>
                </Link>
                <button
                  type="button"
                  disabled={data.saving}
                  aria-label={"Xóa kế hoạch " + plan.criteria.destination}
                  onClick={() => void data.deletePlan(plan.id)}
                  className="absolute right-3 top-3 rounded-lg border border-white/70 bg-white/95 p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700 transition-all duration-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Chuyến đi tiếp theo bắt đầu từ đây."
            action={
              <Link to="/planner/new" className="btn-primary">
                <Plus className="h-4 w-4" />
                Tạo kế hoạch đầu tiên
              </Link>
            }
          >
            Chưa có kế hoạch nào. Chọn điểm đến, chúng ta sẽ dành chỗ cho những
            trải nghiệm mới.
          </EmptyState>
        )}
      </>
    );
  const plan = data.plan;
  if (!plan)
    return (
      <EmptyState
        title="Không tìm thấy kế hoạch."
        action={
          <Link to="/planner" className="btn-secondary">
            Về kế hoạch
          </Link>
        }
      >
        Kế hoạch đã được xóa hoặc không thuộc không gian này.
      </EmptyState>
    );
  return (
    <>
      <Link
        to="/planner"
        className="mb-6 inline-flex items-center gap-2 text-xs text-slate-500 hover:text-teal-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Tất cả kế hoạch
      </Link>
      <PageHeading
        eyebrow="LET'S MAKE IT YOURS"
        title={plan.criteria.destination}
        description={
          displayDate(plan.criteria.startDate) +
          " — " +
          displayDate(plan.criteria.endDate) +
          " · " +
          plan.days.length +
          " ngày · " +
          plan.criteria.travelers +
          " người"
        }
        action={
          <>
            <button
              type="button"
              disabled={data.saving}
              onClick={() => setEditingCriteria(true)}
              className="btn-secondary"
            >
              Chỉnh tiêu chí
            </button>
            <button
              type="button"
              onClick={() => setMapVisible(!mapVisible)}
              aria-pressed={mapVisible}
              className="btn-secondary"
            >
              <Map className="h-4 w-4" />
              Bản đồ
            </button>
          </>
        }
      />
      <div className="card mb-7 flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        <div className="flex flex-wrap gap-x-7 gap-y-3">
          <div>
            <p className="text-[10px] text-slate-500">
              Dự tính mỗi người · demo
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {money(data.totalCost)}
              <span className="ml-2 text-[11px] font-normal text-slate-500">
                / {money(plan.criteria.budget)}
              </span>
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500">Tổng nhóm</p>
            <p className="mt-1 text-sm font-medium">
              {money(data.totalCost * plan.criteria.travelers)}
            </p>
          </div>
        </div>
        <p
          role="status"
          className="flex items-center gap-2 text-[11px] text-slate-500"
        >
          {data.saving ? (
            <Spinner />
          ) : (
            <CheckCircle className="h-4 w-4 text-teal-600" />
          )}
          {data.saving ? "Đang lưu thay đổi…" : "Đã lưu trên thiết bị"}
        </p>
      </div>
      {data.totalCost > plan.criteria.budget && (
        <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          Chi phí hoạt động đang vượt ngân sách mỗi người. Bạn có thể điều chỉnh
          hoạt động hoặc tiêu chí.
        </p>
      )}
      {plan.criteria.dislikes && (
        <p className="mb-5 text-xs text-slate-500">
          Điều cần tránh: {plan.criteria.dislikes}
        </p>
      )}
      <ErrorNotice message={data.mutationError} />
      {mapVisible && (
        <div className="mb-7">
          <MapView
            points={plan.days.flatMap((day) =>
              day.activities.flatMap((activity) =>
                activity.coordinates
                  ? [
                      {
                        id: activity.id,
                        name: activity.location,
                        coordinates: activity.coordinates,
                      },
                    ]
                  : [],
              ),
            )}
          />
        </div>
      )}
      <div className="mb-6 mt-5 flex gap-1 rounded-xl border border-slate-200 bg-white p-1 xl:hidden">
        {[
          { id: "itinerary", label: "Lịch trình" },
          { id: "recommendations", label: "Đề xuất" },
        ].map((tab) => (
          <button
            type="button"
            key={tab.id}
            aria-pressed={mobileView === tab.id}
            onClick={() => setMobileView(tab.id)}
            className={`min-h-10 flex-1 rounded-lg px-3 text-xs font-medium transition-all duration-300 ${mobileView === tab.id ? "bg-teal-50 text-teal-800" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6 grid items-start gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div
          className={`min-w-0 ${mobileView === "recommendations" ? "" : "hidden xl:block"}`}
        >
          <RecommendationList
            recommendations={data.recommendations}
            onAddPlace={(place) => void data.addPlace(place)}
            addedPlaceIds={data.addedPlaceIds}
            selectedDay={data.selectedDay}
            disabled={data.saving}
          />
        </div>
        <div
          className={`min-w-0 ${mobileView === "itinerary" ? "" : "hidden xl:block"}`}
        >
          <PlannerItinerary
            days={plan.days}
            selectedDay={data.selectedDay}
            onSelect={data.selectDay}
            onMove={move}
            onEdit={setEditor}
            onRemove={(activityId) => void data.remove(activityId)}
            onAdd={() => setEditor("new")}
            conflicts={data.conflicts}
            disabled={data.saving}
          />
        </div>
      </div>
      {editor && (
        <Modal
          title={
            editor === "new"
              ? "Thêm hoạt động · Ngày " + data.selectedDay
              : "Chỉnh sửa hoạt động"
          }
          onClose={() => setEditor(null)}
        >
          <ErrorNotice message={data.mutationError} />
          <ActivityEditor
            activity={editor === "new" ? undefined : editor}
            time={data.suggestedTime}
            onSave={async (activity) => {
              const success = await data.saveActivity(activity);
              if (success) setEditor(null);
              return success;
            }}
          />
        </Modal>
      )}
      {editingCriteria && (
        <Modal
          title="Chỉnh tiêu chí chuyến đi"
          onClose={() => setEditingCriteria(false)}
        >
          <ErrorNotice message={data.mutationError} />
          <PlannerForm
            initial={plan.criteria}
            onSubmit={async (input) => {
              const success = await data.changeCriteria(input);
              if (success) setEditingCriteria(false);
              return success;
            }}
          />
        </Modal>
      )}
    </>
  );
}
