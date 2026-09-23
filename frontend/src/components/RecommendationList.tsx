import type { Place } from "../types";
import React, { useState } from "react";
import PlaceCard from "./PlaceCard";
import { Hotel, Utensils, Camera, Compass, Sparkles } from "./Icons";

// Dữ liệu mẫu phong phú về các địa điểm đề xuất theo 4 phân loại

/**
 * RecommendationList Component (Thuộc Task 18 - Đề xuất địa điểm)
 * Giao diện: Phân loại bằng Tabs: [Khách sạn] - [Nhà hàng] - [Check-in] - [Hoạt động]
 * Hiển thị danh sách thẻ địa điểm (PlaceCard) thích ứng và tương tác thêm vào lịch trình
 */
const RecommendationList = ({
  recommendations = [],
  onAddPlace,
  addedPlaceIds = [],
}: {
  recommendations?: Place[];
  onAddPlace?: (place: Place) => void;
  addedPlaceIds?: string[];
}) => {
  const [activeCategory, setActiveCategory] = useState("hotel");
  const addedIds = new Set(addedPlaceIds);

  const categories = [
    { id: "hotel", label: "Khách sạn", icon: Hotel },
    { id: "restaurant", label: "Nhà hàng", icon: Utensils },
    { id: "checkin", label: "Check-in", icon: Camera },
    { id: "activity", label: "Hoạt động", icon: Compass },
  ];

  // Đảm bảo luôn có mảng danh sách hợp lệ, không bao giờ bị crash do null/undefined
  const placesList =
    Array.isArray(recommendations) && recommendations.length > 0
      ? recommendations
      : [];

  // Lọc địa điểm theo category đang chọn với optional chaining
  const filteredPlaces = placesList.filter(
    (place) => place?.category === activeCategory,
  );

  const handleAddPlace = (place: Place) => {
    if (!place?.id) return;
    if (onAddPlace) {
      onAddPlace(place);
    }
  };

  return (
    <section aria-label="Đề xuất địa điểm" className="space-y-6">
      {/* Tiêu đề phần đề xuất */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Địa điểm</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Địa điểm gợi ý cho bạn
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Các địa điểm được cung cấp cho kế hoạch của bạn.
          </p>
        </div>

        {/* Số lượng địa điểm đã thêm */}
        {addedIds.size > 0 && (
          <div className="text-xs font-bold text-teal-700 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200">
            ✓ Đã thêm {addedIds.size} địa điểm vào lịch trình
          </div>
        )}
      </div>

      {/* THANH ĐIỀU HƯỚNG TABS: [Khách sạn] - [Nhà hàng] - [Check-in] - [Hoạt động] */}
      <div className="grid grid-cols-1 gap-2 rounded-2xl bg-slate-100/80 p-1.5 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const count = placesList.filter((p) => p?.category === cat.id).length;

          return (
            <button
              key={cat.id}
              aria-pressed={isActive}
              onClick={() => setActiveCategory(cat.id)}
              className={`min-w-0 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap ${
                isActive
                  ? "bg-white text-teal-900 shadow-sm "
                  : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? "text-teal-600" : "text-slate-400"}`}
              />
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-teal-100 text-teal-800"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* LƯỚI CARD ĐỊA ĐIỂM (PLACE CARDS) */}
      {filteredPlaces.length === 0 ? (
        <div className="p-5 sm:p-8 text-center bg-white rounded-2xl border border-slate-200/80 text-slate-500">
          Chưa có đề xuất trong danh mục này. Dịch vụ AI và Google Places đang
          chờ kết nối.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onAddToPlan={handleAddPlace}
              isAdded={addedIds.has(place.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendationList;
