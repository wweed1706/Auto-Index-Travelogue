import React from 'react';
import { Sparkles, ArrowRight, Calendar } from './Icons';

/**
 * SmartPlannerCTA Component (Module 2 - Smart Planner)
 * Banner phụ với màu sắc khác biệt (tím/indigo pastel sang trọng).
 * - Tiêu đề: "Chưa biết đi đâu?"
 * - Mô tả: "Để AI lập kế hoạch lịch trình du lịch chi tiết cho bạn."
 * - Nút bấm: "Thử Smart Planner ->"
 */
const SmartPlannerCTA = ({ onTryPlanner }) => {
  const handleClick = () => {
    if (onTryPlanner) {
      onTryPlanner();
    } else {
      alert('Tính năng Module 2: AI Smart Planner đang được kích hoạt!');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-800 text-white p-6 sm:p-8 shadow-xl shadow-indigo-500/10 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl">
      {/* Decorative Pastel Background Glows */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-pink-400/20 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 rounded-full bg-indigo-300/20 blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-3">
        {/* Module Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-purple-100">
          <Calendar className="w-3.5 h-3.5 text-pink-300" />
          <span>Module 2 • Smart Planner</span>
        </div>

        {/* Tiêu đề */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
          Chưa biết đi đâu?
        </h3>

        {/* Mô tả */}
        <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed max-w-md">
          Để AI lập kế hoạch lịch trình du lịch chi tiết cho bạn theo sở thích, thời gian và ngân sách.
        </p>
      </div>

      {/* Nút Bấm: Thử Smart Planner -> */}
      <div className="relative z-10 pt-5">
        <button
          onClick={handleClick}
          className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm bg-white text-purple-900 shadow-md shadow-purple-950/20 hover:bg-purple-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <span>Thử Smart Planner</span>
          <ArrowRight className="w-4 h-4 text-purple-700" />
        </button>
      </div>
    </div>
  );
};

export default SmartPlannerCTA;
