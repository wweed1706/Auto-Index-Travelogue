// Đường dẫn: src/components/PlannerItinerary.jsx
import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  Sparkles, 
  Utensils, 
  Navigation, 
  Camera, 
  Compass, 
  Calendar, 
  CheckCircle 
} from './Icons';

// Dữ liệu mẫu lịch trình chi tiết theo từng ngày và mốc giờ
const DEFAULT_ITINERARY_DAYS = [
  {
    dayNumber: 1,
    title: 'Đón bình minh & Thung lũng sương mù',
    date: '25/09/2026',
    weather: '18°C • Trời trong, sương nhẹ',
    activities: [
      {
        time: '06:00',
        duration: '2.5 giờ',
        type: 'sightseeing',
        typeLabel: 'Ngắm cảnh & Săn mây',
        icon: Camera,
        iconColor: 'bg-purple-100 text-purple-700 border-purple-200',
        location: 'Đồi Chè Cầu Đất - Panorama View',
        aiNote: 'Khung giờ này nắng sớm xiên qua biển mây tạo vệt sáng tuyệt đẹp để chụp ảnh chân dung và phong cảnh.',
        cost: '80.000 đ',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80'
      },
      {
        time: '08:45',
        duration: '45 phút',
        type: 'transport',
        typeLabel: 'Di chuyển',
        icon: Navigation,
        iconColor: 'bg-sky-100 text-sky-700 border-sky-200',
        location: 'Cung đường QL20 về trung tâm thành phố',
        aiNote: 'AI tối ưu lộ trình xuôi dốc để ngắm trọn cảnh rừng thông hai bên đèo, tránh giờ cao điểm kẹt xe.',
        cost: 'Xăng xe / Taxi: 120.000 đ'
      },
      {
        time: '10:00',
        duration: '1.5 giờ',
        type: 'cafe',
        typeLabel: 'Cafe view đẹp',
        icon: Compass,
        iconColor: 'bg-teal-100 text-teal-700 border-teal-200',
        location: 'Tiệm Cà Phê Hoàng Hôn Trên Dốc',
        aiNote: 'Nên chọn bàn ngoài ban công tầng 2 để có góc nhìn rộng mở xuống thung lũng thông xanh.',
        cost: '65.000 đ',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80'
      },
      {
        time: '12:00',
        duration: '1.5 giờ',
        type: 'dining',
        typeLabel: 'Ăn uống',
        icon: Utensils,
        iconColor: 'bg-amber-100 text-amber-700 border-amber-200',
        location: 'Quán Lẩu Gà Lá É Tao Ngộ',
        aiNote: 'Quán rất đông vào buổi trưa. AI khuyên bạn đến trước 12:15 để không phải chờ xếp bàn lâu.',
        cost: '150.000 đ / người',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
      },
      {
        time: '15:30',
        duration: '2 giờ',
        type: 'sightseeing',
        typeLabel: 'Check-in',
        icon: Camera,
        iconColor: 'bg-pink-100 text-pink-700 border-pink-200',
        location: 'Vườn Hoa Cẩm Tú Cầu Trại Mát',
        aiNote: 'Ánh sáng buổi chiều dịu nhẹ rất tôn màu xanh tím của hoa cẩm tú cầu nở rộ.',
        cost: '50.000 đ',
        image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    dayNumber: 2,
    title: 'Hồ Tuyền Lâm & Cảm giác mạnh Datanla',
    date: '26/09/2026',
    weather: '19°C • Nắng ấm ban ngày, se lạnh về đêm',
    activities: [
      {
        time: '08:00',
        duration: '3 giờ',
        type: 'activity',
        typeLabel: 'Hoạt động trải nghiệm',
        icon: Compass,
        iconColor: 'bg-teal-100 text-teal-700 border-teal-200',
        location: 'Chèo SUP Bình Minh Hồ Tuyền Lâm',
        aiNote: 'Mặt nước hồ phẳng lặng nhất trong khoảng 8h-10h sáng, sương tan dần tạo hiệu ứng gương phản chiếu kỳ ảo.',
        cost: '250.000 đ / người',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80'
      },
      {
        time: '11:45',
        duration: '1 giờ',
        type: 'transport',
        typeLabel: 'Di chuyển',
        icon: Navigation,
        iconColor: 'bg-sky-100 text-sky-700 border-sky-200',
        location: 'Đường ven hồ Tuyền Lâm sang Đèo Prenn',
        aiNote: 'Đoạn đường ngắn chỉ mất 15 phút lái xe, đi qua các cánh rừng thông rợp bóng mát.',
        cost: 'Thuê xe máy: 120.000 đ / ngày'
      },
      {
        time: '13:00',
        duration: '2.5 giờ',
        type: 'activity',
        typeLabel: 'Cảm giác mạnh',
        icon: Camera,
        iconColor: 'bg-purple-100 text-purple-700 border-purple-200',
        location: 'Máng Trượt Alpine Coaster Thác Datanla',
        aiNote: 'Trải nghiệm máng trượt xuyên rừng dài nhất Đông Nam Á. Nên mua vé khứ hồi để vừa trượt vừa ngắm cảnh thác cuộn.',
        cost: '180.000 đ / vé',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
      },
      {
        time: '18:30',
        duration: '3 giờ',
        type: 'dining',
        typeLabel: 'Ăn uống & Check-in',
        icon: Utensils,
        iconColor: 'bg-amber-100 text-amber-700 border-amber-200',
        location: 'Chợ Đêm Đà Lạt (Chợ Âm Phủ)',
        aiNote: 'Thưởng thức bánh tráng nướng và sữa đậu nành nóng hổi trong không khí se lạnh 15°C về đêm.',
        cost: '100.000 đ',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
      }
    ]
  },
  {
    dayNumber: 3,
    title: 'Thung lũng đèn đêm & Thưởng thức đặc sản',
    date: '27/09/2026',
    weather: '17°C • Sương mù chiều muộn',
    activities: [
      {
        time: '08:30',
        duration: '1.5 giờ',
        type: 'dining',
        typeLabel: 'Ăn sáng truyền thống',
        icon: Utensils,
        iconColor: 'bg-amber-100 text-amber-700 border-amber-200',
        location: 'Bánh Mì Xíu Mại Hoàng Diệu',
        aiNote: 'Món ăn sáng quốc dân Đà Lạt, xíu mại viên mềm thơm kết hợp ớt sa tế cay nồng đánh thức vị giác.',
        cost: '30.000 đ / phần',
        image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80'
      },
      {
        time: '17:30',
        duration: '2.5 giờ',
        type: 'sightseeing',
        typeLabel: 'Ngắm cảnh đêm',
        icon: Camera,
        iconColor: 'bg-purple-100 text-purple-700 border-purple-200',
        location: 'Thung Lũng Đèn Làng Hoa Thái Phiên',
        aiNote: 'Từ 18:00, hàng ngàn nhà lồng thắp đèn rực sáng như dải ngân hà dưới chân thung lũng.',
        cost: '70.000 đ',
        image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80'
      }
    ]
  }
];

/**
 * PlannerItinerary Component (Thuộc Task 19 - Lịch trình chi tiết)
 * Bố cục: Hiển thị dạng thẻ theo ngày (Day 1, Day 2...)
 * Timeline trong ngày: Cấu trúc dọc hiển thị các mốc giờ (08:00, 10:00...)
 * Mỗi mốc giờ chứa một block nổi bật: Icon (Ăn uống/Di chuyển), Tên địa điểm, Ghi chú nhỏ của AI
 */
const PlannerItinerary = ({ days = DEFAULT_ITINERARY_DAYS }) => {
  const [selectedDayTab, setSelectedDayTab] = useState('all');

  const itineraryDays = days && days.length > 0 ? days : DEFAULT_ITINERARY_DAYS;

  // Lọc hiển thị theo ngày được chọn hoặc toàn bộ các ngày
  const displayedDays = selectedDayTab === 'all' 
    ? itineraryDays 
    : itineraryDays.filter((d) => d.dayNumber === Number(selectedDayTab));

  return (
    <section aria-label="Lịch trình chi tiết theo từng ngày" className="space-y-6">
      
      {/* Header phần lịch trình */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Lịch trình chi tiết theo giờ</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kế hoạch hành trình thông minh
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Từng mốc giờ được phân bổ khoa học, cân đối giữa di chuyển, ăn uống và chụp ảnh
          </p>
        </div>

        {/* Thanh chọn nhanh Ngày (Day Filter Tabs) */}
        <div className="bg-slate-100/90 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedDayTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDayTab === 'all'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({itineraryDays.length} ngày)
          </button>
          
          {itineraryDays.map((d) => (
            <button
              key={d.dayNumber}
              onClick={() => setSelectedDayTab(d.dayNumber.toString())}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDayTab === d.dayNumber.toString()
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ngày {d.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* DANH SÁCH CÁC THẺ THEO NGÀY (DAY CARDS) */}
      {displayedDays.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200/80 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-1">Chưa có lịch trình cho ngày này</h4>
          <p className="text-sm text-slate-500 max-w-md">
            Vui lòng chọn ngày khác hoặc chọn 'Tất cả' để xem toàn bộ lịch trình.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {displayedDays.map((day, dIdx) => {
            const activities = Array.isArray(day?.activities) ? day.activities : [];
            const dayKey = day?.dayNumber ?? dIdx;

            return (
              <div
                key={dayKey}
                className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-fade-in-up"
              >
                {/* Header Thẻ Ngày */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-base sm:text-lg flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
                      N{day?.dayNumber || dIdx + 1}
                    </div>
                    <div>
                      <h4 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
                        {day?.title || `Ngày ${day?.dayNumber || dIdx + 1}`}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-600" />
                        <span>{day?.date}</span>
                        {day?.weather && (
                          <>
                            <span>•</span>
                            <span className="text-teal-600 font-medium">{day.weather}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                    {activities.length} hoạt động
                  </span>
                </div>

                {/* TIMELINE TRONG NGÀY (CẤU TRÚC DỌC VỚI CÁC MỐC GIỜ) */}
                <div className="relative pl-6 sm:pl-10 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 via-indigo-400 before:to-slate-200 space-y-6">
                  {activities.map((act, index) => {
                    const IconComponent = act?.icon || Compass;
                    const actKey = act?.id || `${dayKey}-${index}`;

                    return (
                      <div key={actKey} className="relative group">
                        {/* Điểm đánh dấu (Dot) trên trục dọc timeline */}
                        <div className="absolute -left-[19px] sm:-left-[23px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-purple-600 shadow-sm flex items-center justify-center text-purple-600">
                          <span className="w-2 h-2 rounded-full bg-purple-600" />
                        </div>

                        {/* Khối nổi bật cho từng mốc giờ (Highlighted Block) */}
                        <div className="bg-slate-50/70 hover:bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/70 hover:border-purple-200 hover:shadow-md transition-all duration-300 space-y-3">
                          
                          {/* Hàng 1: Mốc giờ & Icon phân loại (Ăn uống / Di chuyển / Ngắm cảnh) */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {/* Mốc giờ */}
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-purple-100/90 text-purple-900 border border-purple-200/60">
                                <Clock className="w-3.5 h-3.5 text-purple-700" />
                                <span>{act?.time || '00:00'}</span>
                              </div>

                              {/* Icon và nhãn phân loại */}
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${act?.iconColor || 'bg-purple-100 text-purple-700 border-purple-200'}`}>
                                <IconComponent className="w-3.5 h-3.5" />
                                <span>{act?.typeLabel || 'Hoạt động'}</span>
                              </div>
                            </div>

                            {/* Thời lượng dự kiến hoặc Chi phí */}
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                              {act?.duration && <span>{act.duration}</span>}
                              {act?.cost && (
                                <>
                                  <span>•</span>
                                  <span className="text-purple-700 font-bold">{act.cost}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Hàng 2: Tên địa điểm & Ảnh thumbnail */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 min-w-0">
                              <h5 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight line-clamp-1 group-hover:text-purple-700 transition-colors">
                                {act?.location}
                              </h5>

                              {/* Ghi chú nhỏ của AI (AI Note) */}
                              {act?.aiNote && (
                                <div className="mt-2 p-3 rounded-xl bg-purple-50/80 border border-purple-100 flex items-start gap-2.5">
                                  <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                                  <p className="text-xs sm:text-sm text-purple-900/90 leading-relaxed line-clamp-2 sm:line-clamp-3">
                                    <strong>Ghi chú AI:</strong> {act.aiNote}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Ảnh thumbnail nếu có */}
                            {act?.image && (
                              <div className="w-20 sm:w-28 h-16 sm:h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200/60">
                                <img
                                  src={act.image}
                                  alt={act?.location || 'Ảnh hoạt động'}
                                  loading="lazy"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default PlannerItinerary;
