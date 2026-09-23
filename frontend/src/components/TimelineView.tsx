import type { TimelineNode } from "../types";
import React from "react";
import { Clock, MapPin, Sparkles } from "./Icons";

// Dữ liệu mẫu tĩnh mặc định để đảm bảo giao diện luôn hiển thị đầy đủ khi test

/**
 * TimelineView Component
 * Hiển thị dòng thời gian dọc (Vertical Timeline) của hành trình:
 * - Trục dọc gradient thanh lịch (Teal -> Purple -> Slate)
 * - Điểm đánh dấu (Dot) trên trục dọc
 * - Thông tin mốc: Giờ/Ngày, Tên địa điểm, Mô tả ngắn AI sinh ra, 1-2 ảnh thu nhỏ (thumbnails)
 * - Micro-UX: Hiệu ứng trượt nhẹ (/slide-up) so le theo từng mốc thời gian
 */
const TimelineView = ({ timeline = [] }: { timeline?: TimelineNode[] }) => {
  const displayTimeline =
    timeline === null || timeline === undefined ? [] : timeline;

  if (!Array.isArray(displayTimeline) || displayTimeline.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/70 shadow-sm text-center transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 ">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-600/90 flex items-center justify-center mb-4">
          <Clock className="w-8 h-8" />
        </div>
        <h4 className="text-lg font-bold text-slate-800 mb-1">
          Chưa có dòng thời gian
        </h4>
        <p className="text-sm text-slate-500 max-w-md">
          Chuyến đi này chưa có mốc thời gian nào được ghi nhận.
        </p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 sm:pl-8 md:pl-10 before:absolute before:left-3 sm:before:left-4 md:before:left-5 before:top-4 before:bottom-4 before:w-px before:bg-slate-200 ">
      <div className="space-y-8 sm:space-y-10">
        {displayTimeline.map((node, index) => (
          <div
            key={node.id || index}
            style={{ animationDelay: `${index * 120}ms` }}
            className="relative transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none motion-safe:[@starting-style]:opacity-0 motion-safe:[@starting-style]:translate-y-4"
          >
            {/* Điểm đánh dấu (Dot) nằm trên trục dọc */}
            <div className="absolute -left-[19px] sm:-left-[23px] md:-left-[27px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-slate-500 shadow-sm flex items-center justify-center text-slate-600/90 ">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
            </div>

            {/* Nội dung bên cạnh: Card thông tin mốc thời gian */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/70 shadow-sm hover:shadow-sm hover:border-slate-200 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 ">
              {/* Giờ / Ngày tháng */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 ">
                  <Clock className="w-3.5 h-3.5 text-slate-600/90 " />
                  <span>{node.time || "00:00"}</span>
                  {node.date && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span>{node.date}</span>
                    </>
                  )}
                </div>

                {node.dayLabel && (
                  <span className="text-xs font-semibold text-slate-400 ">
                    {node.dayLabel}
                  </span>
                )}
              </div>

              {/* Tên địa điểm */}
              <div className="flex items-start gap-1.5 mt-2">
                <MapPin className="w-4 h-4 text-slate-600/90 mt-0.5 shrink-0" />
                <h4 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight line-clamp-1">
                  {node.location}
                </h4>
              </div>

              {/* Mô tả ngắn do AI sinh ra */}
              {node.aiDescription && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-start gap-2.5 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 ">
                  <Sparkles className="w-4 h-4 text-slate-600/90 mt-0.5 shrink-0" />
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {node.aiDescription}
                  </p>
                </div>
              )}

              {/* 1 - 2 Bức ảnh thu nhỏ (Thumbnails) nổi bật chụp tại địa điểm */}
              {Array.isArray(node.thumbnails) && node.thumbnails.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 max-w-md">
                  {node.thumbnails.slice(0, 2).map((thumb, tIndex) => {
                    const thumbUrl =
                      typeof thumb === "string" ? thumb : thumb.url;
                    const thumbCaption =
                      typeof thumb === "string" ? "" : thumb.caption;
                    return (
                      <div
                        key={tIndex}
                        className="relative aspect-video sm:aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/70 group cursor-pointer transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 "
                      >
                        <img
                          src={thumbUrl}
                          alt={thumbCaption || `Ảnh tại ${node.location}`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none"
                        />
                        {thumbCaption && (
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-2 text-white opacity-0 group-hover:opacity-100">
                            <p className="text-[11px] truncate">
                              {thumbCaption}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tag AI liên quan */}
              {Array.isArray(node.tags) && node.tags.length > 0 && (
                <div className="mt-3.5 flex flex-wrap gap-1.5 items-center">
                  {node.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-100 truncate max-w-[120px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView;
