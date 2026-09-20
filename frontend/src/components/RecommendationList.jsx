// Đường dẫn: src/components/RecommendationList.jsx
import React, { useState } from 'react';
import PlaceCard from './PlaceCard';
import { 
  Hotel, 
  Utensils, 
  Camera, 
  Compass, 
  Sparkles 
} from './Icons';

// Dữ liệu mẫu phong phú về các địa điểm đề xuất theo 4 phân loại
const MOCK_RECOMMENDATIONS = [
  // 1. KHÁCH SẠN
  {
    id: 'h1',
    category: 'hotel',
    categoryLabel: 'Khách sạn',
    name: 'Hôtel Colline Đà Lạt',
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 342,
    cost: '1.450.000 đ / đêm',
    matchScore: 98,
    address: '10 Phan Bội Châu, Phường 1, Đà Lạt',
    tags: ['#trung-tam', '#sang-trong', '#buffet-sang']
  },
  {
    id: 'h2',
    category: 'hotel',
    categoryLabel: 'Resort & Spa',
    name: 'Ana Mandara Villas Dalat Resort',
    coverImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 215,
    cost: '2.200.000 đ / đêm',
    matchScore: 95,
    address: 'Đường Lê Lai, Phường 5, Đà Lạt',
    tags: ['#biet-thu-phap', '#rung-thong', '#nghi-duong']
  },
  {
    id: 'h3',
    category: 'hotel',
    categoryLabel: 'Homestay',
    name: 'Zen Valley Dalat Homestay',
    coverImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 180,
    cost: '850.000 đ / đêm',
    matchScore: 92,
    address: '38 Khe Sanh, Phường 10, Đà Lạt',
    tags: ['#view-thung-lung', '#yen-tinh', '#san-vuon']
  },

  // 2. NHÀ HÀNG & ẨM THỰC
  {
    id: 'r1',
    category: 'restaurant',
    categoryLabel: 'Lẩu đặc sản',
    name: 'Quán Lẩu Gà Lá É Tao Ngộ',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 520,
    cost: '150.000 đ / người',
    matchScore: 97,
    address: 'Số 5 Đường 3 Tháng 4, Đà Lạt',
    tags: ['#dac-san', '#lau-ga', '#cay-nong']
  },
  {
    id: 'r2',
    category: 'restaurant',
    categoryLabel: 'Ăn sáng truyền thống',
    name: 'Bánh Mì Xíu Mại Hoàng Diệu',
    coverImage: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 410,
    cost: '30.000 đ / phần',
    matchScore: 94,
    address: '26 Hoàng Diệu, Phường 5, Đà Lạt',
    tags: ['#an-sang', '#xiu-mai-chen', '#truyen-thong']
  },
  {
    id: 'r3',
    category: 'restaurant',
    categoryLabel: 'Nướng ngói',
    name: 'Quán Nướng Ngói Cu Đức',
    coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewCount: 290,
    cost: '180.000 đ / người',
    matchScore: 91,
    address: '6A Nguyễn Lương Bằng, Phường 2, Đà Lạt',
    tags: ['#nuong-ngoi', '#am-cung', '#troi-lanh']
  },

  // 3. ĐIỂM CHECK-IN
  {
    id: 'c1',
    category: 'checkin',
    categoryLabel: 'Săn mây',
    name: 'Đồi Chè Cầu Đất - Panorama View',
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 650,
    cost: '80.000 đ / vé',
    matchScore: 99,
    address: 'Thôn Cầu Đất, Xã Xuân Trường, Đà Lạt',
    tags: ['#san-may', '#binh-minh', '#doi-che']
  },
  {
    id: 'c2',
    category: 'checkin',
    categoryLabel: 'Cánh đồng hoa',
    name: 'Vườn Hoa Cẩm Tú Cầu Trại Mát',
    coverImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 380,
    cost: '50.000 đ / vé',
    matchScore: 93,
    address: 'Tổ 1, Thôn Lộc Quý, Trại Mát, Đà Lạt',
    tags: ['#song-ao', '#hoa-cam-tu-cau', '#checkin']
  },
  {
    id: 'c3',
    category: 'checkin',
    categoryLabel: 'Biểu tượng',
    name: 'Cây Thông Cô Đơn Hồ Suối Vàng',
    coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 420,
    cost: 'Miễn phí tham quan',
    matchScore: 96,
    address: 'Lát, Lạc Dương, Lâm Đồng',
    tags: ['#thong-co-don', '#ho-suoi-vang', '#cam-trai']
  },

  // 4. HOẠT ĐỘNG TRẢI NGHIỆM
  {
    id: 'a1',
    category: 'activity',
    categoryLabel: 'Thể thao nước',
    name: 'Chèo SUP Bình Minh Hồ Tuyền Lâm',
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 230,
    cost: '250.000 đ / người',
    matchScore: 98,
    address: 'Khu du lịch Hồ Tuyền Lâm, Đà Lạt',
    tags: ['#cheo-sup', '#ho-tuyen-lam', '#trai-nghiem']
  },
  {
    id: 'a2',
    category: 'activity',
    categoryLabel: 'Cảm giác mạnh',
    name: 'Máng Trượt Alpine Coaster Datanla',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 510,
    cost: '180.000 đ / vé',
    matchScore: 95,
    address: 'Đèo Prenn, Phường 3, Đà Lạt',
    tags: ['#mang-truot', '#thac-datanla', '#xuyen-rung']
  },
  {
    id: 'a3',
    category: 'activity',
    categoryLabel: 'Trekking',
    name: 'Trekking Rừng Thông & Cắm Trại',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 160,
    cost: '450.000 đ / tour',
    matchScore: 90,
    address: 'Vườn quốc gia Bidoup Núi Bà',
    tags: ['#trekking', '#cam-trai', '#thien-nhien']
  }
];

/**
 * RecommendationList Component (Thuộc Task 18 - Đề xuất địa điểm)
 * Giao diện: Phân loại bằng Tabs: [Khách sạn] - [Nhà hàng] - [Check-in] - [Hoạt động]
 * Hiển thị danh sách thẻ địa điểm (PlaceCard) thích ứng và tương tác thêm vào lịch trình
 */
const RecommendationList = ({ 
  recommendations = MOCK_RECOMMENDATIONS,
  onAddPlace
}) => {
  const [activeCategory, setActiveCategory] = useState('hotel');
  const [addedIds, setAddedIds] = useState(new Set());

  const categories = [
    { id: 'hotel', label: 'Khách sạn', icon: Hotel },
    { id: 'restaurant', label: 'Nhà hàng', icon: Utensils },
    { id: 'checkin', label: 'Check-in', icon: Camera },
    { id: 'activity', label: 'Hoạt động', icon: Compass }
  ];

  // Đảm bảo luôn có mảng danh sách hợp lệ, không bao giờ bị crash do null/undefined
  const placesList = Array.isArray(recommendations) && recommendations.length > 0 
    ? recommendations 
    : MOCK_RECOMMENDATIONS;

  // Lọc địa điểm theo category đang chọn với optional chaining
  const filteredPlaces = placesList.filter(
    (place) => place?.category === activeCategory
  );

  const handleAddPlace = (place) => {
    if (!place?.id) return;
    setAddedIds((prev) => {
      const next = new Set(prev);
      next.add(place.id);
      return next;
    });
    if (onAddPlace) {
      onAddPlace(place);
    }
  };

  return (
    <section aria-label="Đề xuất địa điểm từ AI" className="space-y-6">
      {/* Tiêu đề phần đề xuất */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Curation</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Địa điểm gợi ý cho bạn
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Dựa trên sở thích và mức ngân sách bạn đã chọn, AI chọn lọc những địa điểm đáng trải nghiệm nhất
          </p>
        </div>

        {/* Số lượng địa điểm đã thêm */}
        {addedIds.size > 0 && (
          <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            ✓ Đã thêm {addedIds.size} địa điểm vào lịch trình
          </div>
        )}
      </div>

      {/* THANH ĐIỀU HƯỚNG TABS: [Khách sạn] - [Nhà hàng] - [Check-in] - [Hoạt động] */}
      <div className="bg-slate-100/80 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const count = placesList.filter((p) => p?.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-1 min-w-[120px] sm:min-w-0 py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-white text-purple-900 shadow-sm shadow-purple-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* LƯỚI CARD ĐỊA ĐIỂM (PLACE CARDS) */}
      {filteredPlaces.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 text-slate-500">
          Chưa có địa điểm nào thuộc danh mục này.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onAddToPlan={handleAddPlace}
              isAdded={addedIds.has(place.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendationList;
