import { useState } from "react";
import type { Place, PlaceCategory } from "../types";
import PlaceCard from "./PlaceCard";
import { Badge, EmptyState } from "./ui";
import { categoryLabels } from "../services/catalog";
export default function RecommendationList({
  recommendations,
  onAddPlace,
  addedPlaceIds,
  selectedDay,
  disabled,
}: {
  recommendations: Place[];
  onAddPlace: (place: Place) => void;
  addedPlaceIds: string[];
  selectedDay: number;
  disabled: boolean;
}) {
  const [category, setCategory] = useState<PlaceCategory | "all">("all");
  const filtered =
    category === "all"
      ? recommendations
      : recommendations.filter((place) => place.category === category);
  return (
    <section aria-label="Đề xuất địa điểm" className="min-w-0 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Những điểm dừng gợi ý
          </h2>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Dành cho điểm đến và sở thích của bạn.
          </p>
        </div>
        <Badge demo>Demo</Badge>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(["all", "checkin", "restaurant", "activity", "hotel"] as const).map(
          (value) => (
            <button
              type="button"
              key={value}
              aria-pressed={value === category}
              onClick={() => setCategory(value)}
              className={`rounded-lg border px-3 py-2 text-[11px] font-medium transition-all duration-300 hover:-translate-y-0.5 ${value === category ? "border-teal-200 bg-teal-50 text-teal-800" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
            >
              {value === "all" ? "Tất cả" : categoryLabels[value]}
            </button>
          ),
        )}
      </div>
      {filtered.length ? (
        <div className="space-y-3">
          {filtered.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onAddToPlan={onAddPlace}
              isAdded={addedPlaceIds.includes(place.id)}
              day={selectedDay}
              disabled={disabled}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            recommendations.length
              ? "Chưa có gợi ý trong nhóm này"
              : "Điểm đến mới, câu chuyện mới."
          }
        >
          {recommendations.length
            ? "Chọn nhóm khác để khám phá thêm."
            : "Catalog demo chưa có điểm đến này. Dùng nút Thêm hoạt động để tự tạo lịch trình."}
        </EmptyState>
      )}
      <p className="px-1 text-[10px] leading-5 text-slate-500">
        Độ phù hợp và giá là mô phỏng từ catalog cục bộ. Cùng một địa điểm có
        thể được thêm vào các ngày khác nhau.
      </p>
    </section>
  );
}
