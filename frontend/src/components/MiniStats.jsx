import React from 'react';
import { Map, MapPin, Image } from './Icons';

/**
 * MiniStats Component
 * Hàng ngang (Grid 3 cột) hiển thị các thông số thống kê nổi bật:
 * - Thẻ 1: 12 Chuyến đi (icon Map)
 * - Thẻ 2: 45 Địa điểm đã đến (icon MapPin)
 * - Thẻ 3: 1,204 Hình ảnh đã lưu (icon Image)
 */
const MiniStats = () => {
  const stats = [
    {
      id: 'trips',
      value: '12',
      label: 'Chuyến đi',
      icon: Map,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-100'
    },
    {
      id: 'places',
      value: '45',
      label: 'Địa điểm đã đến',
      icon: MapPin,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-100'
    },
    {
      id: 'photos',
      value: '1,204',
      label: 'Hình ảnh đã lưu',
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300/80 hover:shadow-sm transition-all duration-200"
          >
            {/* Icon Container */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bgColor} ${item.color} shrink-0`}>
              <Icon className="w-6 h-6 stroke-[2]" />
            </div>

            {/* Content */}
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {item.value}
                </span>
                <span className="text-xs sm:text-sm font-medium text-slate-500 truncate">
                  {item.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tự động đồng bộ
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MiniStats;
