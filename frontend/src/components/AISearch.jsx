// Đường dẫn: src/components/AISearch.jsx
import React, { useState } from 'react';
import { Search, Sparkles, Zap } from './Icons';

/**
 * AISearch Component
 * Thanh tìm kiếm AI thông minh bằng ngôn ngữ tự nhiên:
 * - Input lớn, viền gradient AI nổi bật
 * - Nút Submit với hiệu ứng tia chớp và trạng thái loading
 * - Các gợi ý truy vấn nhanh (Quick prompt chips)
 */
const AISearch = ({ onSearch, isLoading = false, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [errorMessage, setErrorMessage] = useState('');

  const quickPrompts = [
    'Những quán cafe tôi đã đi ở Đà Lạt',
    'Ảnh săn mây bình minh đồi chè',
    'Món ăn ngon và đặc sản',
    'Địa điểm ngắm hoàng hôn'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setErrorMessage('Vui lòng nhập câu hỏi hoặc nội dung bạn muốn tìm kiếm.');
      return;
    }
    setErrorMessage('');
    if (onSearch) {
      onSearch(query.trim());
    }
  };

  const handlePromptClick = (promptText) => {
    setQuery(promptText);
    setErrorMessage('');
    if (onSearch) {
      onSearch(promptText);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Khối Search Input với viền gradient AI */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="p-1 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-600 shadow-lg shadow-teal-500/10 transition-all duration-300 focus-within:shadow-teal-500/20 focus-within:scale-[1.005]">
          <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-[14px] sm:rounded-[22px] px-3 sm:px-4 py-2 sm:py-2.5">
            {/* Icon Search với hiệu ứng tím/teal */}
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-teal-600" />
            </div>

            {/* Input nhập ngôn ngữ tự nhiên */}
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Hỏi AI bất kỳ điều gì (vd: 'Những quán cafe tôi đã đi ở Đà Lạt')..."
              className="flex-1 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
              disabled={isLoading}
            />

            {/* Nút Submit với hiệu ứng tia chớp */}
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all duration-200 shadow-md ${
                isLoading
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-500 via-indigo-600 to-purple-600 hover:opacity-95 active:scale-95 shadow-purple-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <Zap className="w-4 h-4 animate-bounce text-amber-300" />
                  <span className="hidden sm:inline">Đang phân tích...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Hỏi AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Thông báo lỗi validation */}
        {errorMessage && (
          <p className="text-xs text-rose-500 font-medium mt-1.5 ml-2">
            {errorMessage}
          </p>
        )}
      </form>

      {/* Gợi ý truy vấn nhanh (Quick prompt chips) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">Gợi ý:</span>
        {quickPrompts.map((prompt, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handlePromptClick(prompt)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs text-slate-600 bg-white hover:bg-slate-100 border border-slate-200/80 whitespace-nowrap transition-colors hover:border-teal-300 hover:text-teal-700"
          >
            <span>{prompt}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AISearch;
