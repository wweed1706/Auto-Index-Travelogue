// Đường dẫn: src/components/CreateJourneyModal.jsx
import React, { useEffect } from 'react';
import { X, Compass } from './Icons';
import MediaDropzone from './MediaDropzone';

/**
 * CreateJourneyModal Component (Wrapper Modal)
 * - Modal popup hiển thị đè lên giao diện Dashboard khi tạo chuyến đi mới
 * - Lớp phủ Backdrop mờ mờ đục kết hợp backdrop-blur
 * - Hộp thoại bo tròn rounded-2xl căn giữa màn hình
 * - Header chứa tiêu đề "Tạo chuyến đi mới" và nút 'X' để đóng
 * - Props: isOpen (boolean), onClose (function)
 */
const CreateJourneyModal = ({ isOpen, onClose }) => {
  // Lắng nghe sự kiện bàn phím Escape để đóng modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Khóa cuộn trang nền khi modal đang mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Khối Modal Nằm Giữa Màn Hình */}
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h3 id="modal-title" className="text-lg font-bold text-slate-900 tracking-tight">
              Tạo chuyến đi mới
            </h3>
          </div>

          {/* Nút 'X' ở góc phải để đóng Modal */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
            aria-label="Đóng Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal: Chứa MediaDropzone */}
        <div className="p-6 overflow-y-auto">
          <MediaDropzone 
            onCloseModal={onClose}
            onUploadSuccess={() => {
              // Phản hồi thành công
              alert('Tải lên hoàn tất! AI đang bắt đầu phân tích ký sự chuyến đi.');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateJourneyModal;
