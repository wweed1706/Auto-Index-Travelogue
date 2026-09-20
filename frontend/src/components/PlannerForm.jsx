// Đường dẫn: src/components/PlannerForm.jsx
import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Sparkles, 
  CheckCircle, 
  Search, 
  ArrowRight 
} from './Icons';

// Danh sách gợi ý điểm đến phổ biến
const POPULAR_DESTINATIONS = [
  'Đà Lạt, Lâm Đồng',
  'Phú Quốc, Kiên Giang',
  'Hà Giang',
  'Nha Trang, Khánh Hòa',
  'Đà Nẵng - Hội An',
  'Sa Pa, Lào Cai'
];

// Danh sách các sở thích du lịch (Interests tags)
const INTEREST_OPTIONS = [
  { id: 'cafe', label: 'Cafe view đẹp', icon: '☕' },
  { id: 'photo', label: 'Chụp ảnh & Sống ảo', icon: '📸' },
  { id: 'nature', label: 'Thiên nhiên & Trekking', icon: '🌲' },
  { id: 'food', label: 'Ẩm thực & Đặc sản', icon: '🍜' },
  { id: 'culture', label: 'Văn hóa & Lịch sử', icon: '🏛️' },
  { id: 'relax', label: 'Nghỉ dưỡng & Chill', icon: '✨' },
  { id: 'cloud', label: 'Săn mây & Bình minh', icon: '⛅' },
  { id: 'beach', label: 'Biển đảo & Lặn ngắm', icon: '🌊' }
];

// Các mốc ngân sách gợi ý
const BUDGET_PRESETS = [
  { label: 'Tiết kiệm', value: 3000000, desc: 'Dưới 3 triệu' },
  { label: 'Tiêu chuẩn', value: 7000000, desc: '3 - 8 triệu' },
  { label: 'Nghỉ dưỡng', value: 15000000, desc: 'Trên 8 triệu' }
];

/**
 * PlannerForm Component (Thuộc Task 17 - Form nhập liệu AI)
 * Bố cục: Thiết kế dạng Form nhiều cột (Card-based form) gọn gàng, không dàn trải
 * Các trường nhập liệu:
 * 1. Điểm đến (Search input có gợi ý)
 * 2. Thời gian đi (Date Range Picker)
 * 3. Ngân sách (Slider kéo thả kết hợp phân khúc giá)
 * 4. Sở thích (Thẻ Tags chọn nhiều)
 * 5. Nút Submit: Kích thước lớn, màu chủ đạo, text "AI Đang lập kế hoạch..." kèm spinner khi loading
 */
const PlannerForm = ({ onSubmit, isLoading = false }) => {
  const [destination, setDestination] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [startDate, setStartDate] = useState('2026-09-25');
  const [endDate, setEndDate] = useState('2026-09-28');
  const [budget, setBudget] = useState(5000000);
  const [selectedInterests, setSelectedInterests] = useState(['cafe', 'nature', 'food']);
  const [errors, setErrors] = useState({});

  // Toggle chọn / bỏ chọn sở thích
  const handleToggleInterest = (interestId) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interestId)) {
        return prev.filter((id) => id !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
    if (errors.interests) {
      setErrors((prev) => ({ ...prev, interests: null }));
    }
  };

  // Chọn nhanh gợi ý điểm đến
  const handleSelectDestination = (dest) => {
    setDestination(dest);
    setShowSuggestions(false);
    if (errors.destination) {
      setErrors((prev) => ({ ...prev, destination: null }));
    }
  };

  // Xử lý gửi Form với kiểm tra validation chặt chẽ theo SOP
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!destination.trim()) {
      newErrors.destination = 'Vui lòng nhập hoặc chọn điểm đến của bạn.';
    }

    if (!startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu.';
    }

    if (!endDate) {
      newErrors.endDate = 'Vui lòng chọn ngày kết thúc.';
    } else if (startDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'Ngày kết thúc không được trước ngày bắt đầu.';
    }

    if (selectedInterests.length === 0) {
      newErrors.interests = 'Vui lòng chọn ít nhất 1 sở thích để AI tối ưu lịch trình.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (onSubmit) {
      onSubmit({
        destination: destination.trim(),
        startDate,
        endDate,
        budget,
        interests: selectedInterests
      });
    }
  };

  // Định dạng số tiền VNĐ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xl shadow-indigo-500/5 space-y-8"
    >
      {/* Header nhỏ của Form */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Thiết lập yêu cầu chuyến đi</h3>
          <p className="text-xs text-slate-500">Cung cấp thông tin để AI tính toán cung đường và lịch trình phù hợp</p>
        </div>
      </div>

      {/* Grid 2 cột cho các trường nhập liệu chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        
        {/* ======================================================== */}
        {/* TRƯỜNG 1: ĐIỂM ĐẾN (Search input có gợi ý)               */}
        {/* ======================================================== */}
        <div className="space-y-2 relative">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            1. Điểm đến mong muốn <span className="text-rose-500">*</span>
          </label>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4 text-purple-500" />
            </div>
            
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowSuggestions(true);
                if (errors.destination) setErrors((prev) => ({ ...prev, destination: null }));
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Nhập thành phố hoặc địa danh (vd: Đà Lạt)..."
              className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm bg-slate-50 border transition-all focus:outline-none focus:bg-white ${
                errors.destination 
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' 
                  : 'border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
              }`}
            />
          </div>

          {/* Danh sách gợi ý điểm đến (Autocomplete Dropdown) */}
          {showSuggestions && (
            <div className="absolute z-30 left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 space-y-1 animate-fade-in-up max-h-56 overflow-y-auto">
              <p className="text-[11px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                Gợi ý phổ biến
              </p>
              {POPULAR_DESTINATIONS.filter((d) => 
                d.toLowerCase().includes(destination.toLowerCase())
              ).map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => handleSelectDestination(dest)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-purple-500" />
                    <span>{dest}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Chọn</span>
                </button>
              ))}
            </div>
          )}

          {errors.destination && (
            <p className="text-xs text-rose-500 font-medium">{errors.destination}</p>
          )}
        </div>

        {/* ======================================================== */}
        {/* TRƯỜNG 2: THỜI GIAN ĐI (Date Range Picker)                */}
        {/* ======================================================== */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            2. Thời gian chuyến đi <span className="text-rose-500">*</span>
          </label>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Ngày khởi hành */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Khởi hành</label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: null }));
                  }}
                  className="w-full px-3 py-2.5 rounded-2xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all text-slate-700"
                />
              </div>
            </div>

            {/* Ngày kết thúc */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500">Kết thúc</label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: null }));
                  }}
                  className="w-full px-3 py-2.5 rounded-2xl text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all text-slate-700"
                />
              </div>
            </div>
          </div>

          {(errors.startDate || errors.endDate) && (
            <p className="text-xs text-rose-500 font-medium">
              {errors.startDate || errors.endDate}
            </p>
          )}
        </div>

        {/* ======================================================== */}
        {/* TRƯỜNG 3: NGÂN SÁCH (Slider kéo thả + Phân khúc)          */}
        {/* ======================================================== */}
        <div className="space-y-3 md:col-span-2 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Dự toán ngân sách (Mỗi người)
            </label>
            <span className="text-base font-extrabold text-purple-700 bg-purple-100/80 px-3 py-1 rounded-xl border border-purple-200/60">
              {formatCurrency(budget)}
            </span>
          </div>

          {/* Slider kéo thả */}
          <input
            type="range"
            min="1000000"
            max="30000000"
            step="500000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none"
          />

          {/* Phân khúc gợi ý nhanh */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto scrollbar-none">
            <span className="text-[11px] text-slate-400 shrink-0">Mức chi:</span>
            {BUDGET_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setBudget(preset.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  budget === preset.value
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200/70'
                }`}
              >
                {preset.label} ({preset.desc})
              </button>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* TRƯỜNG 4: SỞ THÍCH DU LỊCH (Thẻ Tags chọn nhiều)         */}
        {/* ======================================================== */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              4. Sở thích & Phong cách du lịch <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-400">
              Đã chọn: <strong className="text-purple-700">{selectedInterests.length}</strong>
            </span>
          </div>

          {/* Lưới các thẻ tag chọn nhiều */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {INTEREST_OPTIONS.map((item) => {
              const isSelected = selectedInterests.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggleInterest(item.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all duration-200 border text-left ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300 text-purple-800 shadow-xs ring-1 ring-purple-300'
                      : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="text-base shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  {isSelected && (
                    <CheckCircle className="w-4 h-4 text-purple-600 shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </div>

          {errors.interests && (
            <p className="text-xs text-rose-500 font-medium">{errors.interests}</p>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. NÚT SUBMIT LỚN (Có hiệu ứng loading & spinner)         */}
      {/* ======================================================== */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base text-white transition-all duration-300 shadow-xl flex items-center justify-center gap-3 ${
            isLoading
              ? 'bg-slate-400 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] shadow-indigo-500/25'
          }`}
        >
          {isLoading ? (
            <>
              {/* Spinner xoay tròn */}
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>AI Đang lập kế hoạch...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-pink-300" />
              <span>Tạo Lịch Trình Thông Minh Bằng AI</span>
              <ArrowRight className="w-5 h-5 text-white/80" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PlannerForm;
