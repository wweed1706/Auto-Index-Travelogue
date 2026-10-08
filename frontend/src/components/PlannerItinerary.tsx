import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Activity, ItineraryDay } from "../types";
import { Plus, Clock, X } from "./Icons";
import { money, displayDate } from "../services/utils";
import { EmptyState } from "./ui";
function DayTab({
  day,
  selected,
  onSelect,
}: {
  day: ItineraryDay;
  selected: boolean;
  onSelect: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "day:" + day.dayNumber });
  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`min-w-0 shrink-0 rounded-xl border px-4 py-3 text-left transition-all duration-300 hover:-translate-y-0.5 ${isOver ? "border-teal-600 bg-teal-100 ring-2 ring-teal-100" : selected ? "border-teal-200 bg-teal-50 text-teal-800" : "border-slate-200 bg-white text-slate-500"}`}
    >
      <span className="block text-xs font-semibold">Ngày {day.dayNumber}</span>
      <span className="mt-1 block text-[10px] font-normal">
        {day.date.slice(8, 10)}/{day.date.slice(5, 7)} · {day.activities.length}{" "}
        điểm
      </span>
    </button>
  );
}
function ActivityCard({
  activity,
  index,
  count,
  day,
  days,
  conflict,
  onEdit,
  onRemove,
  onMove,
  disabled,
}: {
  activity: Activity;
  index: number;
  count: number;
  day: ItineraryDay;
  days: ItineraryDay[];
  conflict: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onMove: (id: string, day: number, beforeId?: string) => void;
  disabled: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id, disabled });
  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`card relative p-4 ${isDragging ? "z-20 opacity-75 shadow-lg ring-2 ring-teal-200" : ""} ${conflict ? "border-amber-300" : ""}`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={"Kéo hoạt động " + activity.location}
          className="mt-0.5 flex h-8 w-6 shrink-0 touch-none cursor-grab items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 active:cursor-grabbing"
        >
          <svg viewBox="0 0 12 18" aria-hidden="true" className="h-4 w-3">
            <path
              d="M3 3h.01M9 3h.01M3 9h.01M9 9h.01M3 15h.01M9 15h.01"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-teal-50 px-2 py-1 text-[11px] font-semibold text-teal-800">
              {activity.time}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-500">
              <Clock className="h-3 w-3" />
              {activity.durationMinutes} phút
            </span>
          </div>
          <h3 className="mt-3 break-words text-sm font-semibold text-slate-800">
            {activity.location}
          </h3>
          {activity.note && (
            <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-500">
              {activity.note}
            </p>
          )}
          <p className="mt-3 text-[11px] text-slate-600">
            {activity.costAmount
              ? money(activity.costAmount) + " / người"
              : "Không có chi phí"}
          </p>
          {conflict && (
            <p className="mt-2 text-[11px] text-amber-700">
              Giờ đang chồng với hoạt động khác hoặc vượt cuối ngày.
            </p>
          )}
        </div>
        <button
          type="button"
          disabled={disabled}
          aria-label={"Xóa hoạt động " + activity.location}
          onClick={onRemove}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-700"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="ml-9 mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          disabled={disabled}
          onClick={onEdit}
          className="mr-auto text-[11px] font-medium text-teal-700 hover:underline"
        >
          Chỉnh sửa
        </button>
        <button
          type="button"
          disabled={index === 0 || disabled}
          aria-label={"Đưa lên " + activity.location}
          onClick={() =>
            onMove(activity.id, day.dayNumber, day.activities[index - 1].id)
          }
          className="h-8 w-8 rounded-lg border border-slate-200 text-xs text-slate-500 hover:bg-slate-50 disabled:opacity-30"
        >
          ↑
        </button>
        <button
          type="button"
          disabled={index === count - 1 || disabled}
          aria-label={"Đưa xuống " + activity.location}
          onClick={() =>
            onMove(activity.id, day.dayNumber, day.activities[index + 2]?.id)
          }
          className="h-8 w-8 rounded-lg border border-slate-200 text-xs text-slate-500 hover:bg-slate-50 disabled:opacity-30"
        >
          ↓
        </button>
        {days.length > 1 && (
          <select
            aria-label={"Chuyển ngày cho " + activity.location}
            disabled={disabled}
            value={day.dayNumber}
            onChange={(event) =>
              onMove(activity.id, Number(event.target.value))
            }
            className="h-8 max-w-full rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-500"
          >
            {days.map((item) => (
              <option key={item.dayNumber} value={item.dayNumber}>
                Ngày {item.dayNumber}
              </option>
            ))}
          </select>
        )}
      </div>
    </article>
  );
}
export default function PlannerItinerary({
  days,
  selectedDay,
  onSelect,
  onMove,
  onEdit,
  onRemove,
  onAdd,
  conflicts,
  disabled,
}: {
  days: ItineraryDay[];
  selectedDay: number;
  onSelect: (day: number) => void;
  onMove: (id: string, day: number, beforeId?: string) => void;
  onEdit: (activity: Activity) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  conflicts: string[];
  disabled: boolean;
}) {
  const day = days.find((item) => item.dayNumber === selectedDay);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const drop = (event: DragEndEvent) => {
    if (!event.over || event.active.id === event.over.id) return;
    const id = String(event.active.id);
    const over = String(event.over.id);
    const targetDay = over.startsWith("day:")
      ? Number(over.slice(4))
      : days.find((item) =>
          item.activities.some((activity) => activity.id === over),
        )?.dayNumber;
    if (targetDay) {
      const target = days.find((item) => item.dayNumber === targetDay);
      const sourceIndex =
        target?.activities.findIndex((item) => item.id === id) ?? -1;
      const targetIndex =
        target?.activities.findIndex((item) => item.id === over) ?? -1;
      const before = over.startsWith("day:")
        ? undefined
        : sourceIndex >= 0 && sourceIndex < targetIndex
          ? target?.activities[targetIndex + 1]?.id
          : over;
      onMove(id, targetDay, before);
    }
  };
  return (
    <section
      aria-label="Lịch trình chi tiết theo từng ngày"
      className="min-w-0 space-y-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Lịch trình của bạn
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            {days.length} ngày · Kéo thẻ để sắp xếp
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className="btn-secondary !min-h-9 !px-3 !text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Thêm hoạt động
        </button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={drop}
        accessibility={{
          screenReaderInstructions: {
            draggable:
              "Nhấn Space để chọn hoạt động, dùng phím mũi tên để di chuyển, Space để thả hoặc Escape để hủy.",
          },
        }}
      >
        <div
          className="flex max-w-full gap-2 overflow-x-auto pb-2"
          aria-label="Chọn ngày"
        >
          {days.map((item) => (
            <DayTab
              key={item.dayNumber}
              day={item}
              selected={item.dayNumber === selectedDay}
              onSelect={() => onSelect(item.dayNumber)}
            />
          ))}
        </div>
        {day && (
          <div className="mt-5">
            <p className="mb-4 text-xs text-slate-500">
              {displayDate(day.date)}
            </p>
            <SortableContext
              items={day.activities.map((activity) => activity.id)}
              strategy={verticalListSortingStrategy}
            >
              {day.activities.length ? (
                <div className="space-y-3">
                  {day.activities.map((activity, index) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      index={index}
                      count={day.activities.length}
                      day={day}
                      days={days}
                      conflict={conflicts.includes(activity.id)}
                      onEdit={() => onEdit(activity)}
                      onRemove={() => onRemove(activity.id)}
                      onMove={onMove}
                      disabled={disabled}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Dành chỗ cho trải nghiệm mới."
                  action={
                    <button
                      type="button"
                      onClick={onAdd}
                      className="btn-secondary"
                    >
                      <Plus className="h-4 w-4" />
                      Tự thêm hoạt động
                    </button>
                  }
                >
                  Chọn một đề xuất bên cạnh hoặc thêm điểm dừng của riêng bạn
                  vào ngày {day.dayNumber}.
                </EmptyState>
              )}
            </SortableContext>
          </div>
        )}
      </DndContext>
      <p className="px-1 text-[10px] leading-5 text-slate-500">
        Kéo thả tự điều chỉnh giờ với khoảng nghỉ 15 phút. Dùng ↑ ↓ hoặc menu
        ngày khi thao tác bằng bàn phím và điện thoại.
      </p>
    </section>
  );
}
