// Đường dẫn: src/components/GalleryView.jsx
import React, { useState, useMemo } from 'react';
import { Image as ImageIcon, Sparkles, X, MapPin, Calendar } from './Icons';

/**
 * GalleryView Component
 * Hiển thị danh sách hình ảnh theo dạng CSS Grid thích ứng (Responsive Grid):
 * - Mobile: grid-cols-2
 * - Tablet: md:grid-cols-3
 * - Desktop: lg:grid-cols-4
 * - Tối ưu hiệu năng: Thẻ <img> sử dụng thuộc tính loading="lazy"
 * - Lớp phủ Hover gradient nhẹ ở đáy với các thẻ AI Tags phân loại
 * - Modal xem ảnh chi tiết chất lượng cao khi người dùng nhấn vào thẻ ảnh
 */
const GalleryView = ({ photos = [] }) => {
  const [selectedTag, setSelectedTag] = useState('all');
  const [activePhotoModal, setActivePhotoModal] = useState(null);

  // Trích xuất danh sách tất cả các tag duy nhất từ mảng ảnh
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    photos.forEach((photo) => {
      if (Array.isArray(photo.tags)) {
        photo.tags.forEach((tag) => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet);
  }, [photos]);

  // Lọc danh sách ảnh theo tag người dùng đang chọn
  const filteredPhotos = useMemo(() => {
    if (selectedTag === 'all') return photos;
    return photos.filter((photo) => Array.isArray(photo.tags) && photo.tags.includes(selectedTag));
  }, [photos, selectedTag]);

  const handleSelectTag = (tag) => {
    setSelectedTag(tag);
  };

  const handleOpenPhoto = (photo) => {
    setActivePhotoModal(photo);
  };

  const handleCloseModal = () => {
    setActivePhotoModal(null);
  };

  // Trạng thái dữ liệu rỗng (Empty State) theo SOP
  if (!photos || photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200/80 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
          <ImageIcon className="w-8 h-8" />
        </div>
        <h4 className="text-lg font-bold text-slate-800 mb-1">Chưa có hình ảnh nào</h4>
        <p className="text-sm text-slate-500 max-w-md">
          Chuyến đi này chưa có ảnh được tải lên. Hãy tải lên ảnh để AI tự động phân tích và gắn thẻ.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Thanh bộ lọc Tag AI */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleSelectTag('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedTag === 'all'
                ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            Tất cả ({photos.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleSelectTag(tag)}
              className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedTag === tag
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span>{tag}</span>
            </button>
          ))}
        </div>
      )}

      {/* Lưới hình ảnh Grid (CSS Grid: 2 cột mobile, 3 cột tablet, 4 cột desktop) */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80">
          <p className="text-sm text-slate-500">Không tìm thấy bức ảnh nào với thẻ "{selectedTag}"</p>
          <button
            onClick={() => setSelectedTag('all')}
            className="mt-3 text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline"
          >
            Xem tất cả ảnh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => handleOpenPhoto(photo)}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              {/* Thẻ <img> với thuộc tính loading="lazy" bắt buộc */}
              <img
                src={photo.url}
                alt={photo.title || 'Ảnh hành trình'}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Lớp phủ gradient nhẹ dưới đáy kèm các Tag AI khi hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4 text-white">
                {photo.title && (
                  <h4 className="text-xs sm:text-sm font-semibold truncate mb-1 drop-shadow-sm">
                    {photo.title}
                  </h4>
                )}

                {photo.location && (
                  <p className="text-[11px] text-slate-200 flex items-center gap-1 truncate mb-2 drop-shadow-sm">
                    <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
                    <span className="truncate">{photo.location}</span>
                  </p>
                )}

                {/* Danh sách Tag AI phân loại */}
                {Array.isArray(photo.tags) && photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 items-center">
                    {photo.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/20 backdrop-blur-md text-white border border-white/20 truncate max-w-[100px]"
                      >
                        {tag}
                      </span>
                    ))}
                    {photo.tags.length > 3 && (
                      <span className="text-[10px] font-medium text-slate-200">
                        +{photo.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal phóng to ảnh chi tiết */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in-up"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng Modal */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors backdrop-blur-md"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Ảnh chi tiết */}
            <div className="relative max-h-[70vh] flex items-center justify-center bg-black/40 overflow-hidden">
              <img
                src={activePhotoModal.url}
                alt={activePhotoModal.title || 'Ảnh chi tiết'}
                className="w-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Thông tin mốc ảnh */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold truncate">
                    {activePhotoModal.title || 'Ảnh hành trình'}
                  </h3>
                  {activePhotoModal.location && (
                    <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span className="truncate">{activePhotoModal.location}</span>
                    </p>
                  )}
                </div>

                {activePhotoModal.takenAt && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activePhotoModal.takenAt}</span>
                  </div>
                )}
              </div>

              {/* Tag AI */}
              {Array.isArray(activePhotoModal.tags) && activePhotoModal.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activePhotoModal.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-500/20 text-teal-300 border border-teal-500/30"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryView;
