import React from 'react';
import TripCardPlaceholder from './TripCardPlaceholder';
import { History, Sparkles } from './Icons';

/**
 * RecentTripsGrid Component
 * Lưới (Grid) hiển thị 3 khối trống (Card placeholder) đại diện cho các chuyến đi gần đây.
 */
const RecentTripsGrid = ({ onAddTrip }) => {
  const placeholders = [1, 2, 3];

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Chuyến đi gần đây
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-700">
              3 thẻ mẫu
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Các hành trình bạn đã ghi nhận hoặc được tự động lập chỉ mục
          </p>
        </div>

        <button 
          onClick={onAddTrip}
          className="text-xs sm:text-sm font-semibold text-sky-600 hover:text-sky-700 hover:underline transition-colors flex items-center gap-1"
        >
          <span>Xem tất cả</span>
          <span>→</span>
        </button>
      </div>

      {/* Grid of 3 Trip Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {placeholders.map((num) => (
          <TripCardPlaceholder 
            key={num} 
            index={num} 
            onClick={onAddTrip} 
          />
        ))}
      </div>
    </section>
  );
};

export default RecentTripsGrid;
