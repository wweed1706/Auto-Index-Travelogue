// Đường dẫn: src/pages/SmartPlanner.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlannerForm from '../components/PlannerForm';
import RecommendationList from '../components/RecommendationList';
import PlannerItinerary from '../components/PlannerItinerary';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Compass, 
  Zap, 
  Image as ImageIcon 
} from '../components/Icons';

// Dữ liệu mẫu lịch trình do AI sinh ra để kiểm thử giao diện ngay lập tức
const MOCK_GENERATED_ITINERARY = {
  destination: 'Đà Lạt, Lâm Đồng',
  dateRange: '25/09 - 28/09/2026 (4 ngày 3 đêm)',
  budget: '5.000.000 đ / người',
  style: ['Cafe view đẹp', 'Thiên nhiên & Trekking', 'Ẩm thực & Đặc sản'],
  aiHighlights: 'Lịch trình được tối ưu theo trục đường đèo và thung lũng để giảm thiểu 40% thời gian di chuyển, ưu tiên các khung giờ đón bình minh và hoàng hôn.',
  days: [
    {
      dayNumber: 1,
      title: 'Đón bình minh & Thung lũng sương mù',
      date: '25/09/2026',
      activities: [
        {
          time: '06:00 - 08:30',
          title: 'Săn mây tại Đồi Chè Cầu Đất',
          desc: 'Thưởng thức trà nóng, chụp ảnh bình minh qua biển mây bồng bềnh.',
          cost: '80.000 đ',
          image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80'
        },
        {
          time: '11:30 - 13:00',
          title: 'Thưởng thức Lẩu Gà Lá É Tao Ngộ',
          desc: 'Quán ăn đặc sản nức tiếng với nước dùng cay nồng và lá é tươi.',
          cost: '150.000 đ',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
        },
        {
          time: '16:00 - 18:30',
          title: 'Ngắm hoàng hôn tại Tiệm Cà Phê Hoàng Hôn',
          desc: 'Góc view toàn cảnh đồi thông lúc mặt trời lặn màu cam tím.',
          cost: '70.000 đ',
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80'
        }
      ]
    },
    {
      dayNumber: 2,
      title: 'Hồ Tuyền Lâm & Rừng thông nguyên sinh',
      date: '26/09/2026',
      activities: [
        {
          time: '08:00 - 11:00',
          title: 'Chèo SUP trên mặt Hồ Tuyền Lâm',
          desc: 'Khám phá nhánh sông hẹp và bãi cỏ lau hoang sơ giữa rừng thông.',
          cost: '250.000 đ',
          image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80'
        },
        {
          time: '14:30 - 17:00',
          title: 'Thác Datanla & Hệ thống xe trượt máng',
          desc: 'Trải nghiệm máng trượt alpine coaster uốn lượn qua các tầng thác.',
          cost: '180.000 đ',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
        },
        {
          time: '19:00 - 21:30',
          title: 'Khám phá ẩm thực Chợ Đêm Đà Lạt',
          desc: 'Bánh tráng nướng, sữa đậu nành nóng và kem bơ chuẩn vị.',
          cost: '120.000 đ',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
        }
      ]
    },
    {
      dayNumber: 3,
      title: 'Văn hóa bản địa & Thung lũng đèn đêm',
      date: '27/09/2026',
      activities: [
        {
          time: '08:30 - 11:30',
          title: 'Tham quan Vườn hoa cẩm tú cầu Trại Mát',
          desc: 'Cánh đồng hoa nở rộ giữa sườn đồi bậc thang thoáng đãng.',
          cost: '50.000 đ',
          image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80'
        },
        {
          time: '18:00 - 21:00',
          title: 'Ngắm Thung lũng đèn Làng hoa Thái Phiên',
          desc: 'Hàng ngàn nhà lồng thắp sáng rực rỡ tựa dải ngân hà dưới thung lũng.',
          cost: '65.000 đ',
          image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80'
        }
      ]
    }
  ]
};

/**
 * SmartPlanner Page Component (Module 2 - Smart Travel Planner)
 * - Header với tone tím/indigo sang trọng
 * - PlannerForm: Form nhập liệu AI dạng Card nhiều cột
 * - Khu vực kết quả: Lịch trình gợi ý chi tiết từng ngày sinh ra bởi AI
 */
const SmartPlanner = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  // Khởi tạo sẵn dữ liệu mẫu tĩnh để giao diện luôn hiển thị đầy đủ ngay khi mở trang
  const [itinerary, setItinerary] = useState(MOCK_GENERATED_ITINERARY);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGeneratePlan = (formData) => {
    setIsGenerating(true);
    setItinerary(null);

    // Mô phỏng AI xử lý tính toán trong 1.5 giây
    setTimeout(() => {
      setItinerary({
        ...MOCK_GENERATED_ITINERARY,
        destination: formData.destination,
        budget: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(formData.budget) + ' / người',
        dateRange: `${formData.startDate} - ${formData.endDate}`
      });
      setIsGenerating(false);
    }, 1500);
  };

  const handleResetPlan = () => {
    setItinerary(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. HEADER TRANG SMART PLANNER */}
      <header className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-950 text-white">
        {/* Họa tiết ánh sáng nền (Glow effects) */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16 space-y-6">
          {/* Top Bar: Nút quay lại & Badge Module */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleBackToDashboard}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium backdrop-blur-md border border-white/15 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Bảng điều khiển</span>
            </button>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-pulse" />
              <span>Module 2 • Smart Travel Planner</span>
            </div>
          </div>

          {/* Tiêu đề trang */}
          <div className="max-w-3xl space-y-3">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Lập kế hoạch du lịch thông minh cùng AI
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-purple-100/90 leading-relaxed">
              Chưa biết đi đâu hay phân bổ thời gian thế nào? Điền mong muốn của bạn, AI sẽ tối ưu lịch trình chi tiết theo từng ngày, vị trí địa lý và ngân sách của bạn.
            </p>
          </div>
        </div>
      </header>

      {/* 2. KHU VỰC NỘI DUNG CHÍNH (MAIN CONTENT) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 pb-12 space-y-10">
        
        {/* Khối Form nhập liệu AI (Task 17) */}
        <section aria-label="Form lập kế hoạch AI">
          <PlannerForm 
            onSubmit={handleGeneratePlan} 
            isLoading={isGenerating} 
          />
        </section>

        {/* ======================================================== */}
        {/* KHU VỰC KẾT QUẢ LỊCH TRÌNH DO AI SINH RA                   */}
        {/* ======================================================== */}
        {itinerary && (
          <section aria-label="Kết quả lịch trình gợi ý" className="space-y-6 animate-fade-in-up">
            {/* Header kết quả */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-500/10">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-pink-300" />
                  <span>Kế hoạch AI đề xuất cho bạn</span>
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                  {itinerary.destination}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-purple-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-pink-300" />
                    {itinerary.dateRange}
                  </span>
                  <span>•</span>
                  <span>Ngân sách: <strong>{itinerary.budget}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetPlan}
                  className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/20 transition-colors"
                >
                  Tạo kế hoạch khác
                </button>
              </div>
            </div>

            {/* AI Note Insight */}
            <div className="p-4 sm:p-5 rounded-2xl bg-purple-50 border border-purple-200/80 flex items-start gap-3 text-purple-900 text-xs sm:text-sm leading-relaxed">
              <Zap className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
              <p>
                <strong>AI Insight:</strong> {itinerary.aiHighlights}
              </p>
            </div>

            {/* Lịch trình chi tiết theo từng ngày (Task 19) */}
            <PlannerItinerary days={itinerary.days} />
          </section>
        )}

        {/* TRẠNG THÁI CHƯA TẠO (FEATURE PREVIEW HIGHLIGHTS) */}
        {!itinerary && !isGenerating && (
          <section aria-label="Tính năng nổi bật Smart Planner" className="pt-4 space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight text-center">
              Tại sao nên lập kế hoạch với AI Travelogue?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto text-xl">
                  🧭
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Tối ưu cung đường</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tự động sắp xếp các điểm đến gần nhau trong cùng một buổi để tránh mất thời gian di chuyển.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl">
                  💰
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Dự toán ngân sách</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Phân bổ chi phí ăn uống, tham quan và trải nghiệm bám sát theo hạn mức bạn đã chọn.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto text-xl">
                  📸
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Đề xuất chuẩn gu</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Gợi ý đúng các quán cafe view đẹp, điểm săn mây hoặc ẩm thực địa phương theo sở thích của bạn.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* KHU VỰC ĐỀ XUẤT ĐỊA ĐIỂM (TASK 18 - RECOMMENDATION LIST) */}
        <div className="pt-6 border-t border-slate-200/80">
          <RecommendationList />
        </div>
      </main>
    </div>
  );
};

export default SmartPlanner;
