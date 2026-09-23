import { inputClass, buttonClass } from "./ui";
import type { PlannerInput } from "../types";
import React, { useState } from "react";

// Danh sách gợi ý điểm đến phổ biến
const POPULAR_DESTINATIONS = [
  "Đà Lạt, Lâm Đồng",
  "Phú Quốc, Kiên Giang",
  "Hà Giang",
  "Nha Trang, Khánh Hòa",
  "Đà Nẵng - Hội An",
  "Sa Pa, Lào Cai",
];

// Danh sách các sở thích du lịch (Interests tags)
const INTEREST_OPTIONS = [
  { id: "cafe", label: "Cafe view đẹp", icon: "☕" },
  { id: "photo", label: "Chụp ảnh & Sống ảo", icon: "📸" },
  { id: "nature", label: "Thiên nhiên & Trekking", icon: "🌲" },
  { id: "food", label: "Ẩm thực & Đặc sản", icon: "🍜" },
  { id: "culture", label: "Văn hóa & Lịch sử", icon: "🏛️" },
  { id: "relax", label: "Nghỉ dưỡng & Chill", icon: "✨" },
  { id: "cloud", label: "Săn mây & Bình minh", icon: "⛅" },
  { id: "beach", label: "Biển đảo & Lặn ngắm", icon: "🌊" },
];

// Các mốc ngân sách gợi ý
const BUDGET_PRESETS = [
  { label: "Tiết kiệm", value: 3000000, desc: "Dưới 3 triệu" },
  { label: "Tiêu chuẩn", value: 7000000, desc: "3 - 8 triệu" },
  { label: "Nghỉ dưỡng", value: 15000000, desc: "Trên 8 triệu" },
];

/**
 * PlannerForm Component (Thuộc Task 17 - Form nhập liệu AI)
 * Bố cục: Thiết kế dạng Form nhiều cột (Card-based form) gọn gàng, không dàn trải
 * Các trường nhập liệu:
 * 1. Điểm đến (Search input có gợi ý)
 * 2. Thời gian đi (Date Range Picker)
 * 3. Ngân sách (Slider kéo thả kết hợp phân khúc giá)
 * 4. Sở thích (Thẻ Tags chọn nhiều)
 * 5. Nút Submit: Kích thước lớn, màu chủ đạo, text "Đang lưu kế hoạch…" kèm spinner khi loading
 */
const PlannerForm = ({
  onSubmit,
  isLoading = false,
}: {
  onSubmit: (input: PlannerInput) => void;
  isLoading?: boolean;
}) => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState(5000000);
  const [selectedInterests, setSelectedInterests] = useState([
    "cafe",
    "nature",
    "food",
  ]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof PlannerInput, string | null>>
  >({});
  const [travelers, setTravelers] = useState(1);
  const [dislikes, setDislikes] = useState("");

  // Toggle chọn / bỏ chọn sở thích
  const handleToggleInterest = (interestId: string) => {
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

  // Xử lý gửi Form với kiểm tra validation chặt chẽ theo SOP
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof PlannerInput, string>> = {};
    if (!Number.isInteger(travelers) || travelers < 1)
      newErrors.travelers = "Số người phải là số nguyên từ 1 trở lên.";

    if (!destination.trim()) {
      newErrors.destination = "Vui lòng nhập hoặc chọn điểm đến của bạn.";
    }

    if (!startDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu.";
    }

    if (!endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc.";
    } else if (startDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = "Ngày kết thúc không được trước ngày bắt đầu.";
    }

    if (selectedInterests.length === 0) {
      newErrors.interests =
        "Vui lòng chọn ít nhất 1 sở thích để AI tối ưu lịch trình.";
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
        travelers,
        dislikes,
        interests: INTEREST_OPTIONS.filter((option) =>
          selectedInterests.includes(option.id),
        ).map((option) => option.label),
      });
    }
  };

  // Định dạng số tiền VNĐ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm hover:shadow-lg hover:shadow-slate-900/5 sm:p-8 lg:p-10 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none"
    >
      <div className="space-y-2">
        <h2 className="font-semibold text-slate-800 ">
          Bạn muốn đi đâu tiếp theo?
        </h2>
        <p className="text-sm text-slate-500 ">
          Thông tin được lưu cùng bản nháp để bạn tiếp tục hoàn thiện lịch
          trình.
        </p>
      </div>
      <fieldset
        disabled={isLoading}
        className="grid min-w-0 gap-x-8 gap-y-6 lg:grid-cols-2"
      >
        <label className="block text-xs font-medium text-slate-600 ">
          Điểm đến mong muốn
          <input
            list="destinations"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            className={inputClass}
            placeholder="Ví dụ: Đà Lạt"
            required
          />
          <datalist id="destinations">
            {POPULAR_DESTINATIONS.map((place) => (
              <option key={place} value={place} />
            ))}
          </datalist>
          {errors.destination && (
            <span role="alert" className="text-rose-700">
              {errors.destination}
            </span>
          )}
        </label>
        <label className="block text-xs font-medium text-slate-600 ">
          Số lượng người
          <input
            type="number"
            min="1"
            step="1"
            value={travelers}
            onChange={(event) => setTravelers(Number(event.target.value))}
            className={inputClass}
            required
          />
          {errors.travelers && (
            <span role="alert" className="text-rose-700">
              {errors.travelers}
            </span>
          )}
        </label>
        <label className="block text-xs font-medium text-slate-600 ">
          Ngày khởi hành
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className={inputClass}
            required
          />
        </label>
        <label className="block text-xs font-medium text-slate-600 ">
          Ngày kết thúc
          <input
            type="date"
            min={startDate || undefined}
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className={inputClass}
            required
          />
          {errors.endDate && (
            <span role="alert" className="text-rose-700">
              {errors.endDate}
            </span>
          )}
        </label>
        <div className="space-y-5 rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white p-5 lg:col-span-2 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none hover:border-slate-300">
          <label
            className="flex flex-wrap justify-between gap-2 text-sm"
            htmlFor="budget"
          >
            Ngân sách mỗi người{" "}
            <span className="font-medium text-slate-800 ">
              {formatCurrency(budget)}
            </span>
          </label>
          <input
            id="budget"
            type="range"
            min="1000000"
            max="30000000"
            step="500000"
            value={budget}
            onChange={(event) => setBudget(Number(event.target.value))}
            className="w-full accent-slate-700 transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus:outline-none focus-visible:outline-none focus:ring-4 focus:ring-slate-200/60 focus:border-slate-400"
          />
          <div className="flex flex-wrap gap-2">
            {BUDGET_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                aria-pressed={budget === preset.value}
                onClick={() => setBudget(preset.value)}
                className={
                  "rounded-lg border px-3 py-2 text-xs transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:opacity-80 disabled:hover:translate-y-0 disabled:hover:shadow-none " +
                  (budget === preset.value
                    ? "border-slate-200 bg-slate-50 text-slate-800 "
                    : "border-slate-100 bg-white text-slate-600 ")
                }
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3 lg:col-span-2">
          <h3 className="text-sm text-slate-800 ">
            Sở thích & phong cách du lịch
          </h3>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={selectedInterests.includes(item.id)}
                onClick={() => handleToggleInterest(item.id)}
                className={
                  "rounded-xl border px-3 py-2.5 text-xs transition-all duration-300 ease-in-out motion-reduce:transition-none motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-2 active:scale-[0.98] motion-reduce:active:scale-100 hover:opacity-80 disabled:hover:translate-y-0 disabled:hover:shadow-none " +
                  (selectedInterests.includes(item.id)
                    ? "border-slate-200 bg-slate-50 text-slate-800 "
                    : "border-slate-100 text-slate-600 hover:bg-slate-50 ")
                }
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
          {errors.interests && (
            <p role="alert" className="text-sm text-rose-700">
              {errors.interests}
            </p>
          )}
        </div>
        <label className="block text-sm lg:col-span-2">
          Những điều không thích
          <textarea
            value={dislikes}
            onChange={(event) => setDislikes(event.target.value)}
            className={inputClass}
            rows={3}
            placeholder="Ví dụ: quá đông người, đồ ăn cay"
          />
        </label>
      </fieldset>
      <button disabled={isLoading} className={buttonClass}>
        {isLoading ? "Đang lưu…" : "Tạo và lưu bản nháp"}
      </button>
    </form>
  );
};
export default PlannerForm;
