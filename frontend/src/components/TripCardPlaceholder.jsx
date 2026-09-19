import React from 'react';
import { Plus, MapPin, Sparkles } from './Icons';

/**
 * TripCardPlaceholder Component
 * Khối thẻ trống (Card placeholder) đại diện cho một chuyến đi trong lưới hiển thị Recent.
 */
const TripCardPlaceholder = ({ index, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-slate-200 hover:border-sky-400 bg-white/60 hover:bg-sky-50/40 transition-all duration-300 cursor-pointer min-h-[240px] text-center"
      role="button"
      tabIndex={0}
      aria-label={`Thêm chuyến đi ${index}`}
    >
      {/* Index Tag */}
      <span className="absolute top-4 left-4 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-700 transition-colors">
        Ký sự #{index}
      </span>

      {/* Decorative Icon Circle */}
      <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-sky-500 text-slate-400 group-hover:text-white flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:shadow-md group-hover:shadow-sky-500/20">
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </div>

      {/* Title */}
      <h4 className="font-bold text-slate-800 text-base mb-1.5 group-hover:text-sky-700 transition-colors">
        Chưa có dữ liệu chuyến đi
      </h4>

      {/* Subtitle */}
      <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed mb-4">
        Nhấn để tải lên ảnh hoặc nhập tọa độ hành trình mới
      </p>

      {/* Action Indicator */}
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 group-hover:translate-y-0.5 transition-transform">
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Tạo chuyến đi đầu tiên</span>
      </div>
    </div>
  );
};

export default TripCardPlaceholder;
