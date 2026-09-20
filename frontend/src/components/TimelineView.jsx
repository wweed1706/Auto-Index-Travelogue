// Đường dẫn: src/components/TimelineView.jsx
import React from 'react';
import { Clock, MapPin, Sparkles } from './Icons';

// Dữ liệu mẫu tĩnh mặc định để đảm bảo giao diện luôn hiển thị đầy đủ khi test
const DEFAULT_TIMELINE_NODES = [
  {
    id: 't1',
    dayLabel: 'Ngày 1',
    date: '15/08/2026',
    time: '06:15',
    location: 'Đồi Chè Cầu Đất - Săn Mây',
    aiDescription: 'AI nhận diện: Đón bình minh giữa biển mây bồng bềnh tại đồi chè tuổi đời gần 100 năm. Ánh sáng vàng rực rỡ chiếu rọi sương sớm, điều kiện lý tưởng cho ảnh phong cảnh.',
    thumbnails: [
      {
        url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
        caption: 'Biển mây buổi sớm'
      },
      {
        url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
        caption: 'Đồi chè xanh ngát'
      }
    ],
    tags: ['#san-may', '#binh-minh', '#thien-nhien']
  },
  {
    id: 't2',
    dayLabel: 'Ngày 1',
    date: '15/08/2026',
    time: '16:45',
    location: 'Tiệm Cà Phê Hoàng Hôn Trên Dốc',
    aiDescription: 'AI nhận diện: Thư giãn ngắm hoàng hôn buông xuống thung lũng. Không gian quán gỗ ấm cúng, view toàn cảnh đồi thông lãng mạn.',
    thumbnails: [
      {
        url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
        caption: 'Cà phê ngắm hoàng hôn'
      }
    ],
    tags: ['#cafe', '#hoang-hon', '#chill']
  },
  {
    id: 't3',
    dayLabel: 'Ngày 2',
    date: '16/08/2026',
    time: '07:00',
    location: 'Cung Đường Rừng Thông Đèo Prenn',
    aiDescription: 'AI nhận diện: Lộ trình xe máy xuyên qua rừng thông nguyên sinh. Không khí se lạnh 17°C, sương mỏng giăng mắc trên những tán thông già.',
    thumbnails: [
      {
        url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80',
        caption: 'Rừng thông tĩnh lặng'
      }
    ],
    tags: ['#rung-thong', '#suong-mu', '#thien-nhien']
  },
  {
    id: 't4',
    dayLabel: 'Ngày 2',
    date: '16/08/2026',
    time: '12:30',
    location: 'Quán Lẩu Gà Lá É Tao Ngộ',
    aiDescription: 'AI nhận diện: Thưởng thức đặc sản ẩm thực nức tiếng Đà Lạt. Nồi lẩu gà nóng hổi đậm vị ớt hiểm và hương thơm nồng nàn của lá é tươi.',
    thumbnails: [
      {
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        caption: 'Đặc sản lẩu gà lá é'
      }
    ],
    tags: ['#am-thuc', '#dac-san', '#lau-ga']
  },
  {
    id: 't5',
    dayLabel: 'Ngày 3',
    date: '17/08/2026',
    time: '14:00',
    location: 'Thác Datanla & Hệ Thống Máng Trượt',
    aiDescription: 'AI nhận diện: Trải nghiệm cảm giác mạnh với hệ thống máng trượt alpine coaster xuyên rừng dài nhất Đông Nam Á, chiêm ngưỡng tầng thác cuồn cuộn.',
    thumbnails: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        caption: 'Thác nước kỳ vĩ'
      }
    ],
    tags: ['#thac-datanla', '#mang-truot', '#trai-nghiem']
  },
  {
    id: 't6',
    dayLabel: 'Ngày 3',
    date: '17/08/2026',
    time: '19:30',
    location: 'Chợ Đêm Đà Lạt (Chợ Âm Phủ)',
    aiDescription: 'AI nhận diện: Hòa mình vào không khí nhộn nhịp của chợ đêm, thưởng thức bánh tráng nướng giòn rụm và sữa đậu nành nóng hổi.',
    thumbnails: [
      {
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        caption: 'Bánh tráng nướng chợ đêm'
      }
    ],
    tags: ['#cho-dem', '#banh-trang-nuong', '#am-thuc']
  }
];

/**
 * TimelineView Component
 * Hiển thị dòng thời gian dọc (Vertical Timeline) của hành trình:
 * - Trục dọc gradient thanh lịch (Teal -> Purple -> Slate)
 * - Điểm đánh dấu (Dot) trên trục dọc
 * - Thông tin mốc: Giờ/Ngày, Tên địa điểm, Mô tả ngắn AI sinh ra, 1-2 ảnh thu nhỏ (thumbnails)
 * - Micro-UX: Hiệu ứng trượt nhẹ (fade-in/slide-up) so le theo từng mốc thời gian
 */
const TimelineView = ({ timeline = DEFAULT_TIMELINE_NODES }) => {
  const displayTimeline = timeline === null || timeline === undefined 
    ? DEFAULT_TIMELINE_NODES 
    : timeline;

  if (!Array.isArray(displayTimeline) || displayTimeline.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200/80 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
          <Clock className="w-8 h-8" />
        </div>
        <h4 className="text-lg font-bold text-slate-800 mb-1">Chưa có dòng thời gian</h4>
        <p className="text-sm text-slate-500 max-w-md">
          Chuyến đi này chưa có mốc thời gian nào được ghi nhận.
        </p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 sm:pl-8 md:pl-10 before:absolute before:left-3 sm:before:left-4 md:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-teal-500 before:via-purple-500 before:to-slate-300">
      <div className="space-y-8 sm:space-y-10">
        {displayTimeline.map((node, index) => (
          <div
            key={node.id || index}
            style={{ animationDelay: `${index * 120}ms` }}
            className="relative animate-fade-in-up"
          >
            {/* Điểm đánh dấu (Dot) nằm trên trục dọc */}
            <div className="absolute -left-[19px] sm:-left-[23px] md:-left-[27px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-teal-500 shadow-sm flex items-center justify-center text-teal-600">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
            </div>

            {/* Nội dung bên cạnh: Card thông tin mốc thời gian */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-teal-200 transition-all duration-300">
              {/* Giờ / Ngày tháng */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>{node.time || '00:00'}</span>
                  {node.date && (
                    <>
                      <span className="text-teal-300">•</span>
                      <span>{node.date}</span>
                    </>
                  )}
                </div>

                {node.dayLabel && (
                  <span className="text-xs font-semibold text-slate-400">
                    {node.dayLabel}
                  </span>
                )}
              </div>

              {/* Tên địa điểm */}
              <div className="flex items-start gap-1.5 mt-2">
                <MapPin className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight line-clamp-1">
                  {node.location}
                </h4>
              </div>

              {/* Mô tả ngắn do AI sinh ra */}
              {node.aiDescription && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {node.aiDescription}
                  </p>
                </div>
              )}

              {/* 1 - 2 Bức ảnh thu nhỏ (Thumbnails) nổi bật chụp tại địa điểm */}
              {Array.isArray(node.thumbnails) && node.thumbnails.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 max-w-md">
                  {node.thumbnails.slice(0, 2).map((thumb, tIndex) => {
                    const thumbUrl = typeof thumb === 'string' ? thumb : thumb.url;
                    const thumbCaption = typeof thumb === 'string' ? '' : thumb.caption;
                    return (
                      <div
                        key={tIndex}
                        className="relative aspect-video sm:aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 group cursor-pointer"
                      >
                        <img
                          src={thumbUrl}
                          alt={thumbCaption || `Ảnh tại ${node.location}`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        {thumbCaption && (
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <p className="text-[11px] truncate">{thumbCaption}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tag AI liên quan */}
              {Array.isArray(node.tags) && node.tags.length > 0 && (
                <div className="mt-3.5 flex flex-wrap gap-1.5 items-center">
                  {node.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/50 truncate max-w-[120px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView;
