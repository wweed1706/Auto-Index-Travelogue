import React, { useState, useRef } from 'react';
import { Plus, Sparkles, UploadCloud } from './Icons';

/**
 * CreateJourneyCTA Component (Module 1 - Auto-Index)
 * - Nút primary lớn "+ Tạo chuyến đi mới (Create Journey)"
 * - Hỗ trợ kéo thả file trực tiếp vào khối banner để kích hoạt UploadModal
 * - Sử dụng dragCounter và pointer-events-none để khắc phục triệt để lỗi nhấp nháy (flicker)
 */
const CreateJourneyCTA = ({ onOpenUploadModal }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    if (onOpenUploadModal) {
      onOpenUploadModal();
    }
  };

  return (
    <div 
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative overflow-hidden rounded-3xl text-white p-6 sm:p-9 transition-all duration-300
        bg-gradient-to-br from-sky-500 via-teal-500 to-emerald-600 shadow-xl shadow-teal-500/10
        ${isDragging ? 'ring-4 ring-white/70 scale-[1.01] shadow-2xl' : ''}
      `}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

      {/* Drag Overlay Hint khi kéo file qua - Bắt buộc dùng pointer-events-none để chống chớp nháy */}
      {isDragging && (
        <div className="absolute inset-0 z-20 pointer-events-none bg-teal-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white border-2 border-dashed border-white m-3 rounded-2xl animate-in fade-in">
          <UploadCloud className="w-12 h-12 mb-2 animate-bounce" />
          <p className="font-bold text-lg">Thả tệp vào đây để mở tải lên!</p>
        </div>
      )}

      <div className="relative z-10 max-w-2xl">
        {/* Module Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide uppercase mb-3 text-sky-100">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Module 1 • Auto-Index Travelogue</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2.5 leading-tight">
          Bắt đầu Hành trình Mới của bạn
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed mb-6 max-w-xl">
          Tải lên ảnh chụp hoặc tệp tọa độ. Hệ thống sẽ tự động lập chỉ mục thời gian, địa danh và kỷ niệm cho chuyến đi của bạn.
        </p>

        {/* Nút Primary Lớn: + Tạo chuyến đi mới (Create Journey) */}
        <div>
          <button
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base bg-white text-slate-900 shadow-lg shadow-black/10 hover:bg-sky-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/30"
          >
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-500 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span>+ Tạo chuyến đi mới (Create Journey)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateJourneyCTA;
