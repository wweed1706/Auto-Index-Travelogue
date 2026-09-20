// Đường dẫn: src/pages/JourneyDetail.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GalleryView from '../components/GalleryView';
import TimelineView from '../components/TimelineView';
import MapView from '../components/MapView';
import AISearch from '../components/AISearch';
import AISummary from '../components/AISummary';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Image as ImageIcon, 
  History, 
  Map as MapIcon, 
  Sparkles, 
  Compass 
} from '../components/Icons';

// Dữ liệu mẫu (Mock Data) chuẩn bị sẵn ảnh Unsplash chất lượng cao để kiểm thử giao diện ngay lập tức
const MOCK_JOURNEY = {
  id: 'dalat-trip-2026',
  title: 'Khám phá Đà Lạt',
  dateRange: '15/08 - 18/08/2026',
  location: 'Đà Lạt, Lâm Đồng',
  totalDays: 4,
  coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80',
  photos: [
    {
      id: 'p1',
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
      title: 'Đồi chè Cầu Đất sớm mai',
      location: 'Cầu Đất, Đà Lạt',
      takenAt: '15/08/2026 06:15',
      tags: ['#san-may', '#thien-nhien', '#binh-minh']
    },
    {
      id: 'p2',
      url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
      title: 'Hồ Tuyền Lâm êm đềm',
      location: 'Hồ Tuyền Lâm, Đà Lạt',
      takenAt: '15/08/2026 10:30',
      tags: ['#thien-nhien', '#ho-tuyen-lam', '#cheo-sup']
    },
    {
      id: 'p3',
      url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      title: 'Cà phê ngắm thung lũng',
      location: 'Tiệm Cà Phê Hoàng Hôn',
      takenAt: '15/08/2026 16:45',
      tags: ['#cafe', '#hoang-hon', '#chill']
    },
    {
      id: 'p4',
      url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
      title: 'Rừng thông trong sương sớm',
      location: 'Đèo Prenn',
      takenAt: '16/08/2026 07:00',
      tags: ['#thien-nhien', '#rung-thong', '#suong-mu']
    },
    {
      id: 'p5',
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      title: 'Lẩu gà lá é nức tiếng',
      location: 'Đường 3 Tháng 4',
      takenAt: '16/08/2026 12:30',
      tags: ['#am-thuc', '#dac-san', '#lau-ga']
    },
    {
      id: 'p6',
      url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
      title: 'Vườn hoa cẩm tú cầu',
      location: 'Trại Mát',
      takenAt: '16/08/2026 15:20',
      tags: ['#hoa', '#checkin', '#thien-nhien']
    },
    {
      id: 'p7',
      url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80',
      title: 'Thung lũng đèn về đêm',
      location: 'Làng hoa Thái Phiên',
      takenAt: '16/08/2026 18:10',
      tags: ['#hoang-hon', '#thung-lung-den', '#nightview']
    },
    {
      id: 'p8',
      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
      title: 'Cung đường đèo uốn lượn',
      location: 'Đèo Tà Nung',
      takenAt: '17/08/2026 09:15',
      tags: ['#phuot', '#cung-duong', '#thien-nhien']
    },
    {
      id: 'p9',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      title: 'Thác Datanla kỳ vĩ',
      location: 'Khu du lịch Datanla',
      takenAt: '17/08/2026 14:00',
      tags: ['#thac-nuoc', '#trai-nghiem', '#thien-nhien']
    },
    {
      id: 'p10',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      title: 'Chợ đêm Đà Lạt nhộn nhịp',
      location: 'Chợ Đêm Đà Lạt',
      takenAt: '17/08/2026 19:30',
      tags: ['#am-thuc', '#cho-dem', '#banh-trang-nuong']
    },
    {
      id: 'p11',
      url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      title: 'Homestay nhà gỗ mộc mạc',
      location: 'Dốc Nhà Bò',
      takenAt: '18/08/2026 08:30',
      tags: ['#homestay', '#vintage', '#checkin']
    },
    {
      id: 'p12',
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      title: 'Quảng trường Lâm Viên',
      location: 'Quảng trường Lâm Viên',
      takenAt: '18/08/2026 11:45',
      tags: ['#quang-truong', '#checkin', '#dalat']
    }
  ],
  timeline: [
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
  ]
};

/**
 * JourneyDetail Page Component
 * Quản lý giao diện chi tiết chuyến đi:
 * - Header: Tên chuyến đi, thời gian, và ảnh cover mờ làm background phía trên cùng
 * - Thanh điều hướng (View Toggle): Chuyển đổi giữa [Lưới ảnh (Gallery)], [Dòng thời gian (Timeline)], [Bản đồ (Map)]
 * - Tích hợp Task 7: MapView (Bản đồ tương tác với Markers & Tooltips)
 * - Tích hợp Task 8: AISearch & AISummary (Tìm kiếm ngôn ngữ tự nhiên và tóm tắt AI)
 */
const JourneyDetail = ({ journeyData = MOCK_JOURNEY }) => {
  const navigate = useNavigate();
  // State quản lý tab hiển thị: 'gallery' | 'timeline' | 'map'
  const [activeTab, setActiveTab] = useState('gallery');

  // State quản lý tìm kiếm AI (Task 8)
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchResult, setAiSearchResult] = useState(null);

  const journey = journeyData || MOCK_JOURNEY;

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  // Logic mô phỏng phản hồi AI thông minh dựa trên câu hỏi
  const handleAISearch = (queryText) => {
    setIsAiSearching(true);
    setAiSearchResult(null);

    setTimeout(() => {
      const lowerQuery = queryText.toLowerCase();
      let summaryText = '';
      let matchingPhotos = [];
      let stats = {
        places: '3 địa điểm',
        photosCount: '4 bức ảnh',
        timeRange: '15/08 - 18/08/2026'
      };

      if (lowerQuery.includes('cafe') || lowerQuery.includes('cà phê')) {
        summaryText = 'Bạn đã ghé thăm 3 quán cafe và không gian ngắm cảnh tại Đà Lạt. Nổi bật nhất là Tiệm Cà Phê Hoàng Hôn Trên Dốc với view thung lũng thông tuyệt đẹp lúc 16:45, và quán cafe mộc mạc ấm cúng tại Dốc Nhà Bò.';
        matchingPhotos = journey.photos.filter((p) => p.tags.includes('#cafe') || p.tags.includes('#hoang-hon') || p.tags.includes('#chill'));
        stats = { places: '2 quán cafe', photosCount: `${matchingPhotos.length} bức ảnh`, timeRange: 'Chiều 15 & 18/08' };
      } else if (lowerQuery.includes('săn mây') || lowerQuery.includes('mây') || lowerQuery.includes('bình minh')) {
        summaryText = 'AI nhận diện bạn đã săn mây thành công tại Đồi Chè Cầu Đất vào sáng sớm ngày 15/08 (06:15). Ánh bình minh vàng rực rỡ chiếu rọi qua biển mây bồng bềnh phủ kín thung lũng chè.';
        matchingPhotos = journey.photos.filter((p) => p.tags.includes('#san-may') || p.tags.includes('#binh-minh'));
        stats = { places: 'Đồi Chè Cầu Đất', photosCount: `${matchingPhotos.length} bức ảnh`, timeRange: '06:15 • 15/08' };
      } else if (lowerQuery.includes('ăn') || lowerQuery.includes('lẩu') || lowerQuery.includes('ẩm thực') || lowerQuery.includes('đặc sản')) {
        summaryText = 'Bạn đã trải nghiệm 2 nét ẩm thực trứ danh Đà Lạt: Nồi lẩu gà lá é Tao Ngộ đậm đà the cay ớt xiêm lúc trưa 16/08, và món bánh tráng nướng giòn rụm nóng hổi tại Chợ Đêm Đà Lạt.';
        matchingPhotos = journey.photos.filter((p) => p.tags.includes('#am-thuc') || p.tags.includes('#dac-san') || p.tags.includes('#cho-dem'));
        stats = { places: '2 điểm ẩm thực', photosCount: `${matchingPhotos.length} bức ảnh`, timeRange: '16/08 & 17/08' };
      } else {
        summaryText = `AI Travelogue đã phân tích chuyến đi và tìm thấy các khoảnh khắc khớp với "${queryText}". Hành trình gồm các điểm nhấn thiên nhiên, cung đường đèo và không gian sương mù đặc trưng Đà Lạt.`;
        matchingPhotos = journey.photos.slice(0, 4);
        stats = { places: 'Đà Lạt, Lâm Đồng', photosCount: `${matchingPhotos.length} bức ảnh`, timeRange: journey.dateRange };
      }

      setAiSearchResult({
        query: queryText,
        summaryText,
        stats,
        matchingPhotos
      });
      setIsAiSearching(false);
    }, 800);
  };

  const handleClearAISearch = () => {
    setAiSearchResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* 1. HEADER CỦA CHUYẾN ĐI */}
      <header className="relative w-full overflow-hidden bg-slate-950 text-white">
        {/* Ảnh Cover mờ làm background phía trên cùng */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={journey.coverImage}
            alt={journey.title}
            className="w-full h-full object-cover scale-105 blur-sm opacity-40 transition-transform duration-700"
          />
          {/* Lớp phủ Gradient tạo chiều sâu và độ tương phản cao cho chữ */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-950/40 via-transparent to-purple-950/40" />
        </div>

        {/* Nội dung Header */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 sm:pb-12 flex flex-col justify-between min-h-[260px] sm:min-h-[320px]">
          {/* Top Bar: Nút quay lại & Badge trạng thái AI */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleBackToDashboard}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium backdrop-blur-md border border-white/15 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Bảng điều khiển</span>
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
              <span>Đã lập chỉ mục AI</span>
            </div>
          </div>

          {/* Tiêu đề và thông tin meta chuyến đi */}
          <div className="mt-8 sm:mt-12 space-y-3">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md truncate">
              {journey.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6 text-xs sm:text-sm text-slate-200">
              {/* Thời gian */}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{journey.dateRange}</span>
              </div>

              {/* Địa điểm */}
              {journey?.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{journey.location}</span>
                </div>
              )}

              {/* Tổng số ảnh */}
              {Array.isArray(journey?.photos) && (
                <div className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{journey.photos.length} hình ảnh</span>
                </div>
              )}

              {/* Tổng số mốc */}
              {Array.isArray(journey?.timeline) && (
                <div className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{journey.timeline.length} điểm dừng</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. THANH ĐIỀU HƯỚNG GÓC NHÌN (VIEW TOGGLE TAB BAR) */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 sm:space-x-4 py-2.5 overflow-x-auto scrollbar-none" aria-label="Tabs góc nhìn chuyến đi">
            {/* Tab 1: Lưới ảnh (Gallery) */}
            <button
              onClick={() => setActiveTab('gallery')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'gallery'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Lưới ảnh (Gallery)</span>
              {Array.isArray(journey?.photos) && (
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  activeTab === 'gallery' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {journey.photos.length}
                </span>
              )}
            </button>

            {/* Tab 2: Dòng thời gian (Timeline) */}
            <button
              onClick={() => setActiveTab('timeline')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'timeline'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Dòng thời gian (Timeline)</span>
              {Array.isArray(journey?.timeline) && (
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  activeTab === 'timeline' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {journey.timeline.length}
                </span>
              )}
            </button>

            {/* Tab 3: Bản đồ (Map) - Đã hoàn thiện Task 7 */}
            <button
              onClick={() => setActiveTab('map')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                activeTab === 'map'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>Bản đồ (Map)</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                {Array.isArray(journey?.mapPlaces) ? `${journey.mapPlaces.length} điểm ghim` : '6 điểm ghim'}
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* 3. KHU VỰC NỘI DUNG CHÍNH (CONDITIONAL RENDERING) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* KHU VỰC TÌM KIẾM AI (TASK 8: AI SEARCH & AI SUMMARY) */}
        <section aria-label="Tìm kiếm AI trong chuyến đi" className="space-y-4">
          <AISearch 
            onSearch={handleAISearch} 
            isLoading={isAiSearching} 
          />

          {/* Khối tóm tắt AI khi có kết quả hoặc đang tải */}
          {(isAiSearching || aiSearchResult) && (
            <AISummary
              result={aiSearchResult}
              isLoading={isAiSearching}
              onClear={handleClearAISearch}
            />
          )}
        </section>

        {/* Góc nhìn 1: Lưới ảnh */}
        {activeTab === 'gallery' && (
          <section aria-label="Lưới ảnh chuyến đi">
            <GalleryView photos={journey?.photos} />
          </section>
        )}

        {/* Góc nhìn 2: Dòng thời gian */}
        {activeTab === 'timeline' && (
          <section aria-label="Dòng thời gian chuyến đi">
            <TimelineView timeline={journey?.timeline} />
          </section>
        )}

        {/* Góc nhìn 3: Bản đồ (Đã hoàn thiện Task 7 với MapView tương tác) */}
        {activeTab === 'map' && (
          <section aria-label="Bản đồ chuyến đi">
            <MapView places={journey?.mapPlaces} />
          </section>
        )}
      </main>
    </div>
  );
};

export default JourneyDetail;
