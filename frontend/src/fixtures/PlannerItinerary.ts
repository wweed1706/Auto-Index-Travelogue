import type { ItineraryDay } from "../types";
export const DEFAULT_ITINERARY_DAYS: ItineraryDay[] = [
  {
    dayNumber: 1,
    title: "Đón bình minh & Thung lũng sương mù",
    date: "25/09/2026",
    weather: "18°C • Trời trong, sương nhẹ",
    activities: [
      {
        time: "06:00",
        duration: "2.5 giờ",
        type: "sightseeing",
        typeLabel: "Ngắm cảnh & Săn mây",
        location: "Đồi Chè Cầu Đất - Panorama View",
        aiNote:
          "Khung giờ này nắng sớm xiên qua biển mây tạo vệt sáng tuyệt đẹp để chụp ảnh chân dung và phong cảnh.",
        cost: "80.000 đ",
        image:
          "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
      },
      {
        time: "08:45",
        duration: "45 phút",
        type: "transport",
        typeLabel: "Di chuyển",
        location: "Cung đường QL20 về trung tâm thành phố",
        aiNote:
          "AI tối ưu lộ trình xuôi dốc để ngắm trọn cảnh rừng thông hai bên đèo, tránh giờ cao điểm kẹt xe.",
        cost: "Xăng xe / Taxi: 120.000 đ",
      },
      {
        time: "10:00",
        duration: "1.5 giờ",
        type: "cafe",
        typeLabel: "Cafe view đẹp",
        location: "Tiệm Cà Phê Hoàng Hôn Trên Dốc",
        aiNote:
          "Nên chọn bàn ngoài ban công tầng 2 để có góc nhìn rộng mở xuống thung lũng thông xanh.",
        cost: "65.000 đ",
        image:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
      },
      {
        time: "12:00",
        duration: "1.5 giờ",
        type: "dining",
        typeLabel: "Ăn uống",
        location: "Quán Lẩu Gà Lá É Tao Ngộ",
        aiNote:
          "Quán rất đông vào buổi trưa. AI khuyên bạn đến trước 12:15 để không phải chờ xếp bàn lâu.",
        cost: "150.000 đ / người",
        image:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
      },
      {
        time: "15:30",
        duration: "2 giờ",
        type: "sightseeing",
        typeLabel: "Check-in",
        location: "Vườn Hoa Cẩm Tú Cầu Trại Mát",
        aiNote:
          "Ánh sáng buổi chiều dịu nhẹ rất tôn màu xanh tím của hoa cẩm tú cầu nở rộ.",
        cost: "50.000 đ",
        image:
          "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    dayNumber: 2,
    title: "Hồ Tuyền Lâm & Cảm giác mạnh Datanla",
    date: "26/09/2026",
    weather: "19°C • Nắng ấm ban ngày, se lạnh về đêm",
    activities: [
      {
        time: "08:00",
        duration: "3 giờ",
        type: "activity",
        typeLabel: "Hoạt động trải nghiệm",
        location: "Chèo SUP Bình Minh Hồ Tuyền Lâm",
        aiNote:
          "Mặt nước hồ phẳng lặng nhất trong khoảng 8h-10h sáng, sương tan dần tạo hiệu ứng gương phản chiếu kỳ ảo.",
        cost: "250.000 đ / người",
        image:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
      },
      {
        time: "11:45",
        duration: "1 giờ",
        type: "transport",
        typeLabel: "Di chuyển",
        location: "Đường ven hồ Tuyền Lâm sang Đèo Prenn",
        aiNote:
          "Đoạn đường ngắn chỉ mất 15 phút lái xe, đi qua các cánh rừng thông rợp bóng mát.",
        cost: "Thuê xe máy: 120.000 đ / ngày",
      },
      {
        time: "13:00",
        duration: "2.5 giờ",
        type: "activity",
        typeLabel: "Cảm giác mạnh",
        location: "Máng Trượt Alpine Coaster Thác Datanla",
        aiNote:
          "Trải nghiệm máng trượt xuyên rừng dài nhất Đông Nam Á. Nên mua vé khứ hồi để vừa trượt vừa ngắm cảnh thác cuộn.",
        cost: "180.000 đ / vé",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      },
      {
        time: "18:30",
        duration: "3 giờ",
        type: "dining",
        typeLabel: "Ăn uống & Check-in",
        location: "Chợ Đêm Đà Lạt (Chợ Âm Phủ)",
        aiNote:
          "Thưởng thức bánh tráng nướng và sữa đậu nành nóng hổi trong không khí se lạnh 15°C về đêm.",
        cost: "100.000 đ",
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    dayNumber: 3,
    title: "Thung lũng đèn đêm & Thưởng thức đặc sản",
    date: "27/09/2026",
    weather: "17°C • Sương mù chiều muộn",
    activities: [
      {
        time: "08:30",
        duration: "1.5 giờ",
        type: "dining",
        typeLabel: "Ăn sáng truyền thống",
        location: "Bánh Mì Xíu Mại Hoàng Diệu",
        aiNote:
          "Món ăn sáng quốc dân Đà Lạt, xíu mại viên mềm thơm kết hợp ớt sa tế cay nồng đánh thức vị giác.",
        cost: "30.000 đ / phần",
        image:
          "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80",
      },
      {
        time: "17:30",
        duration: "2.5 giờ",
        type: "sightseeing",
        typeLabel: "Ngắm cảnh đêm",
        location: "Thung Lũng Đèn Làng Hoa Thái Phiên",
        aiNote:
          "Từ 18:00, hàng ngàn nhà lồng thắp đèn rực sáng như dải ngân hà dưới chân thung lũng.",
        cost: "70.000 đ",
        image:
          "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
];
