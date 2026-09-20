// Đường dẫn: src/components/PlaceCard.jsx
import React from 'react';
import { Star, MapPin, CheckCircle, Plus, Sparkles } from './Icons';

/**
 * PlaceCard Component
 * Khối thẻ hiển thị thông tin địa điểm đề xuất:
 * - Bố cục: Dọc (Vertical) trên Mobile, linh hoạt ngang/dọc trên Desktop (sm:flex-row)
 * - Ảnh cover đẹp với loading="lazy" và hiệu ứng zoom khi hover
 * - Tên địa điểm (chống vỡ layout với truncate / line-clamp)
 * - Đánh giá sao (Rating) kèm số lượt đánh giá
 * - Ước tính chi phí
 * - Thanh Progress bar nhỏ: "Độ phù hợp: 95%"
 * - Nút: "+ Thêm vào lịch trình" với phản hồi tức thì
 */
const PlaceCard = ({ place = {}, onAddToPlan, isAdded = false }) => {
  const safePlace = place || {};
  const {
    id,
    name = 'Địa điểm gợi ý',
    coverImage,
    rating = 4.8,
    reviewCount = 120,
    cost = '100.000 đ',
    matchScore = 95,
    address,
    tags = [],
    categoryLabel
  } = safePlace;

  const handleAddClick = () => {
    if (onAddToPlan && safePlace.id) {
      onAddToPlan(safePlace);
    }
  };

  return (
    <div className="group bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300 flex flex-col sm:flex-row gap-4">
      
      {/* 1. KHUNG ẢNH COVER */}
      <div className="relative w-full sm:w-48 lg:w-52 h-44 sm:h-auto rounded-2xl overflow-hidden bg-slate-100 shrink-0">
        <img
          src={coverImage}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badge phân loại hoặc danh mục */}
        {categoryLabel && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-950/75 text-white backdrop-blur-md">
            {categoryLabel}
          </span>
        )}

        {/* Badge Độ phù hợp AI nhỏ trên ảnh */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-200 text-[10px] font-bold backdrop-blur-md flex items-center gap-1 border border-purple-400/30">
          <Sparkles className="w-2.5 h-2.5 text-pink-300" />
          <span>{matchScore}% phù hợp</span>
        </div>
      </div>

      {/* 2. NỘI DUNG THÔNG TIN ĐỊA ĐIỂM */}
      <div className="flex-1 flex flex-col justify-between space-y-3 min-w-0">
        <div className="space-y-1.5">
          
          {/* Hàng 1: Đánh giá sao & Chi phí */}
          <div className="flex items-center justify-between gap-2 text-xs">
            {/* Rating sao */}
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({reviewCount})</span>
            </div>

            {/* Chi phí ước tính */}
            <div className="text-slate-600 font-semibold text-[11px] sm:text-xs bg-slate-100 px-2.5 py-0.5 rounded-md truncate max-w-[150px]">
              {cost}
            </div>
          </div>

          {/* Hàng 2: Tên địa điểm (Layout Protection với line-clamp-1) */}
          <h4 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight line-clamp-1 group-hover:text-purple-700 transition-colors">
            {name}
          </h4>

          {/* Hàng 3: Địa chỉ ngắn */}
          {address && (
            <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span className="truncate">{address}</span>
            </p>
          )}

          {/* Hàng 4: Tag AI liên quan */}
          {Array.isArray(tags) && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-full truncate max-w-[100px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 3. THANH PROGRESS BAR ĐỘ PHÙ HỢP & NÚT THÊM VÀO LỊCH TRÌNH */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          {/* Thanh Progress Bar "Độ phù hợp: 95%" */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>Độ phù hợp AI:</span>
              </span>
              <span className="font-bold text-purple-700">{matchScore}%</span>
            </div>
            
            {/* Thanh thanh tiến trình nhỏ */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${matchScore}%` }}
              />
            </div>
          </div>

          {/* Nút "+ Thêm vào lịch trình" */}
          <button
            type="button"
            onClick={handleAddClick}
            className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
              isAdded
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white border border-purple-200/80 active:scale-98 shadow-xs'
            }`}
          >
            {isAdded ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Đã thêm vào lịch trình</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>+ Thêm vào lịch trình</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
