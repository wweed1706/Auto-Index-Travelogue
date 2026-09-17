import React, { useState, useRef } from 'react';
import { Plus, UploadCloud, Sparkles, CheckCircle } from './Icons';

/**
 * CreateJourneyCTA Component
 * Khu vực lớn nổi bật ở giữa màn hình khuyến khích người dùng tạo chuyến đi mới và tải lên ảnh/ký sự.
 */
const CreateJourneyCTA = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleCreateJourneyClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      // Giả lập tiến trình upload
      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 4000);
      }, 1500);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-teal-500 to-emerald-600 text-white shadow-xl shadow-teal-500/10 p-6 sm:p-10 transition-all duration-300">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

      {/* Hidden file input for upload feature */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        multiple 
        accept="image/*,.gpx,.kml" 
        className="hidden" 
      />

      <div className="relative z-10 max-w-2xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide uppercase mb-4 text-sky-100">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Hệ thống Tự động Lập chỉ mục Thông minh</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
          Bắt đầu Hành trình Mới của bạn
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed mb-8">
          Tải lên ảnh chụp, dữ liệu GPS hoặc nhật ký hành trình. Auto-Index Travelogue sẽ tự động sắp xếp theo thời gian và địa điểm với độ chính xác cao.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleCreateJourneyClick}
            disabled={isUploading}
            className={`
              inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base
              bg-white text-slate-900 shadow-lg shadow-black/10 hover:bg-sky-50 hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/30
              ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý ảnh & tọa độ...</span>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-500 text-white flex items-center justify-center shadow-sm">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span>Tạo chuyến đi mới (Create Journey)</span>
              </>
            )}
          </button>

          <button
            onClick={handleCreateJourneyClick}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
          >
            <UploadCloud className="w-5 h-5" />
            <span>Kéo thả tệp tin vào đây</span>
          </button>
        </div>

        {/* Upload Success Toast Notice */}
        {uploadSuccess && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white text-sm font-medium border border-white/30 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle className="w-4 h-4 text-emerald-300" />
            <span>Đã nhận tệp thành công! Đang tự động đánh chỉ mục ký sự...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateJourneyCTA;
