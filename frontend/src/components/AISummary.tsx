import Modal from "./Modal";
import type { Photo, SearchResult } from "../types";
import React, { useState } from "react";
import { Sparkles, X, MapPin, Calendar, Image as ImageIcon } from "./Icons";

/**
 * AISummary Component
 * Hiển thị khối kết quả phân tích và tóm tắt thông minh từ AI:
 * - Khối văn bản với viền gradient nhấn mạnh yếu tố AI
 * - Đoạn trả lời tự nhiên, điểm qua các địa điểm và mốc thời gian nổi bật
 * - Mini-gallery: Lưới ảnh 1 hàng ngang (Single-row scrollable) chứa ảnh khớp với truy vấn
 * - Modal xem ảnh chi tiết khi click vào ảnh trong mini-gallery
 */
const AISummary = ({
  result,
  isLoading = false,
  onClear,
}: {
  result: SearchResult | null;
  isLoading?: boolean;
  onClear: () => void;
}) => {
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);

  // Trạng thái Loading giả lập bằng Skeleton Shimmer
  if (isLoading) {
    return (
      <div className="rounded-2xl p-[1.5px] border border-slate-200/70 bg-white animate-pulse shadow-sm transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 ">
        <div className="bg-white rounded-[22px] p-6 sm:p-7 space-y-4 border border-slate-200/70 shadow-sm transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 ">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-200 motion-safe:animate-pulse" />
            <div className="h-4 w-44 rounded-md bg-slate-200 motion-safe:animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-3.5 w-full rounded bg-slate-200 motion-safe:animate-pulse" />
            <div className="h-3.5 w-5/6 rounded bg-slate-200 motion-safe:animate-pulse" />
            <div className="h-3.5 w-3/4 rounded bg-slate-200 motion-safe:animate-pulse" />
          </div>
          <div className="flex gap-3 pt-2">
            <div className="w-40 h-28 rounded-2xl bg-slate-200 motion-safe:animate-pulse shrink-0" />
            <div className="w-40 h-28 rounded-2xl bg-slate-200 motion-safe:animate-pulse shrink-0" />
            <div className="w-40 h-28 rounded-2xl bg-slate-200 motion-safe:animate-pulse shrink-0" />
          </div>
        </div>
      </div>
    );
  }

  // Nếu không có dữ liệu kết quả thì không render
  if (!result) return null;

  const {
    query = "",
    summaryText = "",
    stats = null,
    matchingPhotos = [],
  } = result || {};
  const validPhotos = Array.isArray(matchingPhotos) ? matchingPhotos : [];

  return (
    <div className="relative rounded-2xl p-[1.5px] border border-slate-200/70 bg-white shadow-sm transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 ">
      <div className="bg-white backdrop-blur-md rounded-[22px] p-5 sm:p-7 space-y-5 border border-slate-200/70 shadow-sm transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 ">
        {/* Header Kết quả AI */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200/60 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-slate-600/90 animate-pulse" />
              <span>Kết quả tìm kiếm</span>
            </div>
            {query && (
              <p className="text-xs text-slate-500 font-medium">
                Kết quả cho:{" "}
                <span className="text-slate-800 font-semibold italic">
                  "{query}"
                </span>
              </p>
            )}
          </div>

          {/* Nút đóng / xóa kết quả */}
          {onClear && (
            <button
              onClick={onClear}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 disabled:hover:translate-y-0 disabled:hover:shadow-none hover:shadow-sm"
              title="Đóng kết quả"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Khối văn bản câu trả lời từ AI */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50/60 via-slate-50 to-slate-50/50 border border-slate-100/80 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 ">
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
            {summaryText}
          </p>

          {/* Thống kê nhanh nổi bật từ AI nếu có */}
          {stats && (
            <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-100/60 text-xs font-semibold text-slate-900 ">
              {stats.places && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-600/90 " />
                  {stats.places}
                </span>
              )}
              {stats.photosCount && (
                <span className="inline-flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-600/90 " />
                  {stats.photosCount}
                </span>
              )}
              {stats.timeRange && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-600/90 " />
                  {stats.timeRange}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Mini-Gallery (Lưới ảnh 1 hàng ngang) */}
        {validPhotos.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-slate-600/90 " />
                <span>Hình ảnh liên quan ({validPhotos.length})</span>
              </h4>
              <span className="text-[11px] text-slate-400 ">
                Cuộn ngang để xem thêm →
              </span>
            </div>

            {/* Lưới ảnh 1 hàng ngang cuộn ngang */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 ">
              {validPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setActivePhoto(photo)}
                  className="w-44 sm:w-52 shrink-0 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative group cursor-pointer border border-slate-200/70 shadow-sm hover:shadow-sm transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 "
                >
                  <img
                    src={photo.url}
                    alt={photo.title || "Ảnh liên quan"}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none"
                  />

                  {/* Lớp phủ thông tin khi hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 flex flex-col justify-end p-2.5 text-white">
                    {photo.title && (
                      <p className="text-xs font-semibold truncate drop-shadow-sm">
                        {photo.title}
                      </p>
                    )}
                    {photo.location && (
                      <p className="text-[10px] text-slate-200 truncate flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-slate-400" />
                        <span>{photo.location}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal phóng to ảnh khi click vào mini-gallery */}
      {activePhoto && (
        <Modal title={activePhoto.title} onClose={() => setActivePhoto(null)}>
          <div
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/70 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300/80 "
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center backdrop-blur-md transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative max-h-[65vh] flex items-center justify-center bg-slate-100 overflow-hidden">
              <img
                src={activePhoto.url}
                alt={activePhoto.title || "Ảnh chi tiết"}
                className="w-full max-h-[65vh] object-contain transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none"
              />
            </div>

            <div className="p-4 sm:p-5 bg-white text-slate-700">
              <h3 className="text-base font-bold truncate text-slate-800 ">
                {activePhoto.title || "Ảnh hành trình"}
              </h3>
              {activePhoto.location && (
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activePhoto.location}</span>
                </p>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AISummary;
