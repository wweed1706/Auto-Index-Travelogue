// Đường dẫn: src/components/MediaDropzone.jsx
import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, X, Sparkles } from './Icons';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];

/**
 * MediaDropzone Component
 * - Xử lý vùng kéo thả tập tin hình ảnh/video
 * - Hỗ trợ thumbnail preview với nút xóa từng tệp
 * - Validation kích thước tối đa 5MB và định dạng tệp (JPG, PNG, MP4)
 * - Nút "Bắt đầu tải lên & Phân tích AI" với trạng thái loading spinner
 */
const MediaDropzone = ({ onUploadSuccess, onCloseModal }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  // Ngăn chặn trình duyệt mở file tự động khi kéo thả ra ngoài dropzone
  useEffect(() => {
    const handleWindowDragOver = (e) => e.preventDefault();
    const handleWindowDrop = (e) => e.preventDefault();

    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, []);

  // Thu hồi Object URL khi selectedFiles thay đổi hoặc component unmount để tránh rò rỉ bộ nhớ
  useEffect(() => {
    return () => {
      selectedFiles.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [selectedFiles]);

  const validateAndAddFiles = (files) => {
    setErrorMessage('');
    const newValidFiles = [];
    const invalidFiles = [];

    Array.from(files).forEach((file) => {
      const isValidType = ACCEPTED_TYPES.includes(file.type) || file.name.endsWith('.mp4');
      const isValidSize = file.size <= MAX_FILE_SIZE_BYTES;

      if (!isValidType) {
        invalidFiles.push(`${file.name} (sai định dạng, chỉ nhận JPG, PNG, MP4)`);
        return;
      }

      if (!isValidSize) {
        invalidFiles.push(`${file.name} (dung lượng ${(file.size / (1024 * 1024)).toFixed(1)}MB > 5MB)`);
        return;
      }

      // Tạo preview cho hình ảnh hoặc video
      const previewUrl = file.type.startsWith('image/') || file.type.startsWith('video/')
        ? URL.createObjectURL(file)
        : null;

      newValidFiles.push({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        name: file.name,
        size: (file.size / 1024).toFixed(1),
        type: file.type,
        previewUrl,
        isVideo: file.type.includes('mp4') || file.name.endsWith('.mp4')
      });
    });

    if (invalidFiles.length > 0) {
      setErrorMessage(`Không thể tải: ${invalidFiles.join('; ')}`);
    }

    if (newValidFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...newValidFiles]);
    }
  };

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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
      e.target.value = ''; // Reset input để cho phép chọn lại cùng một file
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (idToRemove) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev.find((item) => item.id === idToRemove);
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((item) => item.id !== idToRemove);
    });
  };

  const handleUploadSubmit = () => {
    if (selectedFiles.length === 0 || isUploading) return;

    setIsUploading(true);
    setErrorMessage('');

    // Giả lập tiến trình upload và phân tích AI (1.5s)
    setTimeout(() => {
      setIsUploading(false);
      if (onUploadSuccess) {
        onUploadSuccess(selectedFiles);
      }
      if (onCloseModal) {
        onCloseModal();
      }
    }, 1500);
  };

  return (
    <div className="space-y-5">
      {/* Input File Ẩn */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4"
        className="hidden"
      />

      {/* Vùng Kéo Thả (Dropzone) */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        className={`
          relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border-2 border-dashed
          cursor-pointer transition-all duration-200 text-center
          ${isDragging 
            ? 'border-teal-500 bg-teal-50/70 scale-[1.01]' 
            : 'border-slate-300 hover:border-teal-500 bg-slate-50/60 hover:bg-teal-50/30'}
        `}
      >
        {/* Upload Icon */}
        <div className={`
          w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-200
          ${isDragging ? 'scale-110 bg-teal-500 text-white shadow-md' : 'bg-white text-teal-600 shadow-sm'}
        `}>
          <UploadCloud className="w-7 h-7" />
        </div>

        {/* Text Hướng dẫn */}
        <div className="space-y-1">
          <p className="text-sm sm:text-base font-semibold text-slate-800">
            Kéo thả hình ảnh, video vào đây
          </p>
          <p className="text-xs text-slate-500">
            hoặc{' '}
            <span className="font-semibold text-teal-600 hover:text-teal-700 underline underline-offset-2">
              bấm để duyệt file
            </span>{' '}
            từ thiết bị
          </p>
        </div>

        {/* Text cảnh báo kích thước & định dạng */}
        <p className="text-[11px] text-slate-400 mt-3">
          Kích thước tối đa: 5MB/file. Hỗ trợ JPG, PNG, MP4.
        </p>
      </div>

      {/* Thông báo lỗi Validation (nếu có) */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-600 animate-in fade-in">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Khu vực Xem Trước (Thumbnail Preview) */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tệp đã chọn ({selectedFiles.length})
            </span>
            <button
              type="button"
              onClick={() => setSelectedFiles([])}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 hover:underline"
            >
              Xóa tất cả
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1">
            {selectedFiles.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs aspect-square flex items-center justify-center"
              >
                {/* Image/Video Preview */}
                {item.previewUrl ? (
                  item.isVideo ? (
                    <video
                      src={item.previewUrl}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="text-center p-2 text-xs text-slate-500">
                    <p className="truncate font-semibold">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.size} KB</p>
                  </div>
                )}

                {/* Badge Video nếu là tệp mp4 */}
                {item.isVideo && (
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-slate-900/80 text-[10px] font-bold text-white uppercase">
                    MP4
                  </span>
                )}

                {/* Tên tệp phủ mờ ở chân thumbnail */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-1.5 pt-3 pointer-events-none">
                  <p className="text-[10px] text-white font-medium truncate">
                    {item.name}
                  </p>
                </div>

                {/* Nút X nhỏ màu đỏ ở góc trên cùng bên phải */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(item.id);
                  }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-transform active:scale-90"
                  aria-label={`Xóa ${item.name}`}
                  title="Xóa tệp này"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nút Hành Động: Bắt đầu tải lên & Phân tích AI */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleUploadSubmit}
          disabled={selectedFiles.length === 0 || isUploading}
          className={`
            w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-200
            flex items-center justify-center gap-2
            ${selectedFiles.length === 0
              ? 'bg-slate-300 shadow-none cursor-not-allowed text-slate-500'
              : isUploading
                ? 'bg-teal-600 opacity-90 cursor-wait shadow-teal-500/20'
                : 'bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-600 hover:to-emerald-600 shadow-teal-500/25 active:scale-[0.99]'}
          `}
        >
          {isUploading ? (
            <>
              {/* Spinner Xoay */}
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang xử lý dữ liệu...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Bắt đầu tải lên & Phân tích AI</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MediaDropzone;
