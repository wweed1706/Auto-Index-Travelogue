// Đường dẫn: src/components/MapView.jsx
import React, { useState } from 'react';
import { 
  MapPin, 
  Map as MapIcon, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Navigation, 
  Sparkles, 
  Clock, 
  Image as ImageIcon 
} from './Icons';

// Dữ liệu mẫu các địa điểm trên bản đồ Đà Lạt với tọa độ tương đối (%)
const DEFAULT_MAP_PLACES = [
  {
    id: 'm1',
    name: 'Đồi Chè Cầu Đất',
    category: 'Săn mây',
    x: 78, // % tọa độ X trên bản đồ
    y: 28, // % tọa độ Y trên bản đồ
    time: '06:15 • 15/08/2026',
    photosCount: 6,
    thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
    tags: ['#san-may', '#binh-minh'],
    description: 'Biển mây sớm mai trôi bồng bềnh qua những luống chè xanh mướt ngút tầm mắt.'
  },
  {
    id: 'm2',
    name: 'Hồ Tuyền Lâm',
    category: 'Thiên nhiên',
    x: 32,
    y: 72,
    time: '10:30 • 15/08/2026',
    photosCount: 5,
    thumbnail: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
    tags: ['#ho-tuyen-lam', '#cheo-sup'],
    description: 'Mặt hồ phẳng lặng như gương soi bóng hàng thông già xanh rì rào.'
  },
  {
    id: 'm3',
    name: 'Tiệm Cà Phê Hoàng Hôn',
    category: 'Quán Cafe',
    x: 62,
    y: 54,
    time: '16:45 • 15/08/2026',
    photosCount: 4,
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    tags: ['#cafe', '#hoang-hon'],
    description: 'Ngắm trọn vẹn hoàng hôn màu tím rực rỡ buông xuống thung lũng thông.'
  },
  {
    id: 'm4',
    name: 'Rừng Thông Đèo Prenn',
    category: 'Cung đường',
    x: 44,
    y: 84,
    time: '07:00 • 16/08/2026',
    photosCount: 3,
    thumbnail: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80',
    tags: ['#rung-thong', '#suong-mu'],
    description: 'Cung đường đèo rợp bóng thông, làn sương mỏng giăng lãng đãng buổi sớm.'
  },
  {
    id: 'm5',
    name: 'Lẩu Gà Lá É Tao Ngộ',
    category: 'Ẩm thực',
    x: 48,
    y: 42,
    time: '12:30 • 16/08/2026',
    photosCount: 2,
    thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    tags: ['#am-thuc', '#dac-san'],
    description: 'Nồi lẩu gà nghi ngút khói thơm nồng hương lá é và cay the vị ớt xiêm.'
  },
  {
    id: 'm6',
    name: 'Chợ Đêm Đà Lạt',
    category: 'Check-in',
    x: 50,
    y: 35,
    time: '19:30 • 17/08/2026',
    photosCount: 4,
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    tags: ['#cho-dem', '#banh-trang-nuong'],
    description: 'Trung tâm nhộn nhịp về đêm với món bánh tráng nướng giòn rụm và sữa nóng.'
  }
];

/**
 * MapView Component
 * Hiển thị bản đồ hành trình tương tác chiếm toàn bộ chiều rộng:
 * - Bản đồ phong cách Travelogue với nền địa hình, hồ nước và tuyến đường nối
 * - Các Marker ghim vị trí kèm hiệu ứng pulse ring
 * - Popup Tooltip khi click Marker: hiển thị thumbnail ảnh, tên địa điểm, thời gian và tag AI
 * - Bộ điều khiển Zoom (+ / -) và danh sách địa điểm nhanh ở đáy
 */
const MapView = ({ places = DEFAULT_MAP_PLACES }) => {
  const [selectedPlace, setSelectedPlace] = useState(places[0] || null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapStyle, setMapStyle] = useState('vector'); // 'vector' | 'satellite'

  const mapPlaces = places && places.length > 0 ? places : DEFAULT_MAP_PLACES;

  const handleMarkerClick = (place) => {
    setSelectedPlace(place);
  };

  const handleCloseTooltip = () => {
    setSelectedPlace(null);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 1.8));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.8));
  };

  const handleResetView = () => {
    setZoomLevel(1);
  };

  return (
    <div className="space-y-4">
      {/* Khung bản đồ chính */}
      <div className="relative w-full h-[540px] sm:h-[620px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-lg select-none">
        
        {/* Lớp nền Bản đồ tương tác giả lập (Canvas) */}
        <div 
          className="absolute inset-0 transition-transform duration-500 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Nền bản đồ phong cách Địa hình vệ tinh / Vector */}
          {mapStyle === 'vector' ? (
            <div className="absolute inset-0 bg-slate-900">
              {/* Lưới tọa độ bản đồ */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #334155 1px, transparent 1px),
                    linear-gradient(to bottom, #334155 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }}
              />

              {/* Mô phỏng hồ Tuyền Lâm & mảng sông ngòi (SVG Vector Water) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <defs>
                  <linearGradient id="lakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#0f766e" />
                  </linearGradient>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="50%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>

                {/* Hồ nước */}
                <path 
                  d="M 200 380 Q 260 340 320 370 T 400 420 Q 360 480 280 470 Z" 
                  fill="url(#lakeGradient)" 
                />
                <path 
                  d="M 520 180 Q 560 140 620 190 T 700 240 Q 640 280 580 260 Z" 
                  fill="url(#lakeGradient)" 
                  opacity="0.6"
                />

                {/* Tuyến đường nối các địa điểm (AI Route Path) */}
                <path
                  d="M 78% 28% Q 62% 40% 62% 54% T 50% 35% T 48% 42% T 32% 72% T 44% 84%"
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  className="animate-pulse"
                />
              </svg>

              {/* Rừng thông & mảng xanh địa hình */}
              <div className="absolute top-[20%] left-[15%] w-36 h-36 rounded-full bg-teal-950/40 blur-2xl pointer-events-none" />
              <div className="absolute bottom-[18%] right-[20%] w-48 h-48 rounded-full bg-emerald-950/30 blur-3xl pointer-events-none" />
              <div className="absolute top-[45%] right-[10%] w-40 h-40 rounded-full bg-purple-950/30 blur-2xl pointer-events-none" />
            </div>
          ) : (
            // Chế độ Vệ tinh mô phỏng
            <div className="absolute inset-0 bg-cover bg-center filter brightness-90"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1920&q=80')`
              }}
            >
              <div className="absolute inset-0 bg-slate-950/60" />
            </div>
          )}

          {/* CÁC MARKER (GHIM VỊ TRÍ) */}
          {mapPlaces.map((place, index) => {
            const isSelected = selectedPlace?.id === place.id;
            return (
              <div
                key={place.id}
                onClick={() => handleMarkerClick(place)}
                style={{
                  left: `${place.x}%`,
                  top: `${place.y}%`,
                  transform: 'translate(-50%, -100%)'
                }}
                className={`absolute z-20 cursor-pointer group transition-all duration-300 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
              >
                {/* Vòng tròn hiệu ứng sóng lan toả (Pulse Ring) */}
                <div className={`absolute -inset-2 rounded-full opacity-75 animate-ping pointer-events-none ${
                  isSelected ? 'bg-teal-400' : 'bg-purple-400/50'
                }`} />

                {/* Khối Marker hình giọt nước / ghim vị trí */}
                <div className={`relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full shadow-lg transition-colors border-2 ${
                  isSelected 
                    ? 'bg-gradient-to-tr from-teal-500 to-teal-400 border-white text-white shadow-teal-500/50' 
                    : 'bg-slate-900/90 border-teal-400 text-teal-300 group-hover:bg-teal-500 group-hover:text-white shadow-black/40'
                }`}>
                  <span className="text-xs font-black tracking-tight">{index + 1}</span>
                </div>

                {/* Nhãn tên địa điểm nhỏ bên dưới Marker */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap backdrop-blur-md border transition-all ${
                  isSelected
                    ? 'bg-teal-500 text-white border-white/40 shadow-md'
                    : 'bg-slate-950/80 text-slate-200 border-white/10 group-hover:bg-slate-900 group-hover:text-white'
                }`}>
                  {place.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* POPUP / TOOLTIP CHI TIẾT KHI CLICK MARKER */}
        {selectedPlace && (
          <div className="absolute top-4 left-4 sm:left-6 z-30 max-w-[280px] sm:max-w-xs w-full animate-fade-in-up">
            <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-2xl border border-slate-200 text-slate-800 space-y-2.5">
              {/* Nút đóng Popup */}
              <button
                onClick={handleCloseTooltip}
                className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                aria-label="Đóng popup"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Thumbnail ảnh của địa điểm */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60">
                <img
                  src={selectedPlace.thumbnail}
                  alt={selectedPlace.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-950/70 text-white backdrop-blur-sm flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-teal-400" />
                  <span>{selectedPlace.photosCount} bức ảnh</span>
                </span>
              </div>

              {/* Tên địa điểm & Thời gian */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                  {selectedPlace.name}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                  <Clock className="w-3 h-3 text-teal-600 shrink-0" />
                  <span className="truncate">{selectedPlace.time}</span>
                </div>
              </div>

              {/* Mô tả tóm tắt do AI sinh ra */}
              {selectedPlace.description && (
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {selectedPlace.description}
                </p>
              )}

              {/* Tag AI */}
              {Array.isArray(selectedPlace.tags) && selectedPlace.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {selectedPlace.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* THANH ĐIỀU KHIỂN BẢN ĐỒ GÓC PHẢI TRÊN (CONTROLS) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 border border-slate-200/80"
            title="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 border border-slate-200/80"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset Center */}
          <button
            onClick={handleResetView}
            className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 border border-slate-200/80"
            title="Đặt lại góc nhìn"
          >
            <Navigation className="w-4 h-4 text-teal-600" />
          </button>

          {/* Đổi Layer Map (Vector / Vệ tinh) */}
          <button
            onClick={() => setMapStyle(mapStyle === 'vector' ? 'satellite' : 'vector')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 border ${
              mapStyle === 'satellite' 
                ? 'bg-teal-600 text-white border-teal-500' 
                : 'bg-white/90 text-slate-800 border-slate-200/80'
            }`}
            title="Đổi kiểu bản đồ"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* THẺ CHỈ DẪN TRẠNG THÁI AI ROUTE Ở GÓC TRÁI DƯỚI */}
        <div className="absolute bottom-4 left-4 z-20 hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-xs text-white">
          <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span>Tuyến đường được AI tự động kết nối theo thứ tự thời gian</span>
        </div>
      </div>

      {/* DANH SÁCH ĐỊA ĐIỂM DƯỚI ĐÁY BẢN ĐỒ (QUICK SELECTOR) */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
          Điểm dừng:
        </span>
        {mapPlaces.map((place, idx) => {
          const isSelected = selectedPlace?.id === place.id;
          return (
            <button
              key={place.id}
              onClick={() => handleMarkerClick(place)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/25 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200/80'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                isSelected ? 'bg-white text-teal-700' : 'bg-slate-200 text-slate-700'
              }`}>
                {idx + 1}
              </span>
              <span className="truncate max-w-[130px]">{place.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MapView;
