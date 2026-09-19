import React from 'react';
import { useNavigate } from 'react-router-dom';
import TripCardPlaceholder from './TripCardPlaceholder';
import { History, Sparkles } from './Icons';

/**
 * RecentTripsGrid Component
 * Lưới (Grid) hiển thị 3 khối trống (Card placeholder) đại diện cho các chuyến đi gần đây.
 */
const RecentTripsGrid = ({ onAddTrip }) => {
  const navigate = useNavigate();
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

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/journey-preview')}
            className="text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors flex items-center gap-1.5 border border-teal-200 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Xem chuyến đi mẫu (Đà Lạt)</span>
          </button>
        </div>
      </div>

      {/* Grid of 3 Trip Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {placeholders.map((num) => (
          <TripCardPlaceholder 
            key={num} 
            index={num} 
            onClick={num === 1 ? () => navigate('/journey-preview') : onAddTrip} 
          />
        ))}
      </div>
    </section>
  );
};

export default RecentTripsGrid;
