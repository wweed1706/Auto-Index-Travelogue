import type { ItineraryDay } from "../types";
import React, { useState } from "react";
import { Clock, Sparkles, Compass, Calendar } from "./Icons";

// Dữ liệu mẫu lịch trình chi tiết theo từng ngày và mốc giờ

/**
 * PlannerItinerary Component (Thuộc Task 19 - Lịch trình chi tiết)
 * Bố cục: Hiển thị dạng thẻ theo ngày (Day 1, Day 2...)
 * Timeline trong ngày: Cấu trúc dọc hiển thị các mốc giờ (08:00, 10:00...)
 * Mỗi mốc giờ chứa một block nổi bật: Icon (Ăn uống/Di chuyển), Tên địa điểm, Ghi chú nhỏ của AI
 */
const PlannerItinerary = ({ days = [] }: { days?: ItineraryDay[] }) => {
  const [selectedDayTab, setSelectedDayTab] = useState("all");

  const itineraryDays = days;

  // Lọc hiển thị theo ngày được chọn hoặc toàn bộ các ngày
  const displayedDays =
    selectedDayTab === "all"
      ? itineraryDays
      : itineraryDays.filter((d) => d.dayNumber === Number(selectedDayTab));

  return (
    <section
      aria-label="Lịch trình chi tiết theo từng ngày"
      className="space-y-6"
    >
      {/* Header phần lịch trình */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Lịch trình chi tiết theo giờ</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Lịch trình của bạn
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Thêm hoạt động theo giờ để hoàn thiện kế hoạch từng ngày.
          </p>
        </div>

        {/* Thanh chọn nhanh Ngày (Day Filter Tabs) */}
        <div className="bg-slate-100/90 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto ">
          <button
            onClick={() => setSelectedDayTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDayTab === "all"
                ? "bg-teal-50 text-teal-800"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Tất cả ({itineraryDays.length} ngày)
          </button>

          {itineraryDays.map((d) => (
            <button
              key={d.dayNumber}
              onClick={() => setSelectedDayTab(d.dayNumber.toString())}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDayTab === d.dayNumber.toString()
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Ngày {d.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH CÁC THẺ THEO NGÀY (DAY CARDS) */}
      {displayedDays.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-1">
            Chưa có lịch trình cho ngày này
          </h4>
          <p className="text-sm text-slate-500 max-w-md">
            Vui lòng chọn ngày khác hoặc chọn 'Tất cả' để xem toàn bộ lịch
            trình.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {displayedDays.map((day, dIdx) => {
            const activities = Array.isArray(day?.activities)
              ? day.activities
              : [];
            const dayKey = day?.dayNumber ?? dIdx;

            return (
              <div
                key={dayKey}
                className="bg-white rounded-2xl p-3 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate--up"
              >
                {/* Header Thẻ Ngày */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 font-semibold text-base sm:text-lg flex items-center justify-center shadow-sm  shrink-0">
                      N{day?.dayNumber || dIdx + 1}
                    </div>
                    <div>
                      <h4 className="text-base sm:text-xl font-semibold text-slate-800 tracking-tight">
                        {day?.title || `Ngày ${day?.dayNumber || dIdx + 1}`}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>{day?.date}</span>
                        {day?.weather && (
                          <>
                            <span>•</span>
                            <span className="text-teal-600 font-medium">
                              {day.weather}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
                    {activities.length} hoạt động
                  </span>
                </div>

                {/* TIMELINE TRONG NGÀY (CẤU TRÚC DỌC VỚI CÁC MỐC GIỜ) */}
                <div className="relative pl-6 sm:pl-10 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 space-y-6">
                  {activities.length === 0 && (
                    <p className="py-4 text-sm text-slate-500">
                      Chưa có hoạt động. Thêm địa điểm và thời gian ở bên dưới.
                    </p>
                  )}
                  {activities.map((act, index) => {
                    const IconComponent = Compass;
                    const actKey = act?.id || `${dayKey}-${index}`;

                    return (
                      <div key={actKey} className="relative group">
                        {/* Điểm đánh dấu (Dot) trên trục dọc timeline */}
                        <div className="absolute -left-[19px] sm:-left-[23px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-teal-600 shadow-sm flex items-center justify-center text-teal-600">
                          <span className="w-2 h-2 rounded-full bg-teal-600" />
                        </div>

                        {/* Khối nổi bật cho từng mốc giờ (Highlighted Block) */}
                        <div className="bg-slate-50/70 hover:bg-white rounded-2xl p-3 sm:p-5 border border-slate-200/70 hover:border-teal-200 hover:shadow-sm transition-all duration-300 space-y-3">
                          {/* Hàng 1: Mốc giờ & Icon phân loại (Ăn uống / Di chuyển / Ngắm cảnh) */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Mốc giờ */}
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-teal-100/90 text-teal-900 border border-teal-200/60">
                                <Clock className="w-3.5 h-3.5 text-teal-700" />
                                <span>{act?.time || "00:00"}</span>
                              </div>

                              {/* Icon và nhãn phân loại */}
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border bg-teal-50 text-teal-700 border-teal-100">
                                <IconComponent className="w-3.5 h-3.5" />
                                <span>{act?.typeLabel || "Hoạt động"}</span>
                              </div>
                            </div>

                            {/* Thời lượng dự kiến hoặc Chi phí */}
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                              {act?.duration && <span>{act.duration}</span>}
                              {act?.cost && (
                                <>
                                  <span>•</span>
                                  <span className="text-teal-700 font-bold">
                                    {act.cost}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Hàng 2: Tên địa điểm & Ảnh thumbnail */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 min-w-0">
                              <h5 className="font-bold text-slate-800 text-sm sm:text-base tracking-tight break-words group-hover:text-teal-700 transition-colors">
                                {act?.location}
                              </h5>

                              {/* Ghi chú nhỏ của AI (Ghi chú) */}
                              {act?.aiNote && (
                                <div className="mt-2 p-3 rounded-xl bg-teal-50/80 border border-teal-100 flex items-start gap-2.5">
                                  <Sparkles className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words">
                                    <strong>Ghi chú:</strong> {act.aiNote}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Ảnh thumbnail nếu có */}
                            {act?.image && (
                              <div className="w-20 sm:w-28 h-16 sm:h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200/60">
                                <img
                                  src={act.image}
                                  alt={act?.location || "Ảnh hoạt động"}
                                  loading="lazy"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default PlannerItinerary;
