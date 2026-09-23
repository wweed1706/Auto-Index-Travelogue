import type { TimelineNode } from "../types";
export const DEFAULT_TIMELINE_NODES: TimelineNode[] = [
  {
    id: "t1",
    dayLabel: "Ngày 1",
    date: "15/08/2026",
    time: "06:15",
    location: "Đồi Chè Cầu Đất - Săn Mây",
    aiDescription:
      "AI nhận diện: Đón bình minh giữa biển mây bồng bềnh tại đồi chè tuổi đời gần 100 năm. Ánh sáng vàng rực rỡ chiếu rọi sương sớm, điều kiện lý tưởng cho ảnh phong cảnh.",
    thumbnails: [
      {
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
        caption: "Biển mây buổi sớm",
      },
      {
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
        caption: "Đồi chè xanh ngát",
      },
    ],
    tags: ["#san-may", "#binh-minh", "#thien-nhien"],
  },
  {
    id: "t2",
    dayLabel: "Ngày 1",
    date: "15/08/2026",
    time: "16:45",
    location: "Tiệm Cà Phê Hoàng Hôn Trên Dốc",
    aiDescription:
      "AI nhận diện: Thư giãn ngắm hoàng hôn buông xuống thung lũng. Không gian quán gỗ ấm cúng, view toàn cảnh đồi thông lãng mạn.",
    thumbnails: [
      {
        url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
        caption: "Cà phê ngắm hoàng hôn",
      },
    ],
    tags: ["#cafe", "#hoang-hon", "#chill"],
  },
  {
    id: "t3",
    dayLabel: "Ngày 2",
    date: "16/08/2026",
    time: "07:00",
    location: "Cung Đường Rừng Thông Đèo Prenn",
    aiDescription:
      "AI nhận diện: Lộ trình xe máy xuyên qua rừng thông nguyên sinh. Không khí se lạnh 17°C, sương mỏng giăng mắc trên những tán thông già.",
    thumbnails: [
      {
        url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80",
        caption: "Rừng thông tĩnh lặng",
      },
    ],
    tags: ["#rung-thong", "#suong-mu", "#thien-nhien"],
  },
  {
    id: "t4",
    dayLabel: "Ngày 2",
    date: "16/08/2026",
    time: "12:30",
    location: "Quán Lẩu Gà Lá É Tao Ngộ",
    aiDescription:
      "AI nhận diện: Thưởng thức đặc sản ẩm thực nức tiếng Đà Lạt. Nồi lẩu gà nóng hổi đậm vị ớt hiểm và hương thơm nồng nàn của lá é tươi.",
    thumbnails: [
      {
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
        caption: "Đặc sản lẩu gà lá é",
      },
    ],
    tags: ["#am-thuc", "#dac-san", "#lau-ga"],
  },
  {
    id: "t5",
    dayLabel: "Ngày 3",
    date: "17/08/2026",
    time: "14:00",
    location: "Thác Datanla & Hệ Thống Máng Trượt",
    aiDescription:
      "AI nhận diện: Trải nghiệm cảm giác mạnh với hệ thống máng trượt alpine coaster xuyên rừng dài nhất Đông Nam Á, chiêm ngưỡng tầng thác cuồn cuộn.",
    thumbnails: [
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
        caption: "Thác nước kỳ vĩ",
      },
    ],
    tags: ["#thac-datanla", "#mang-truot", "#trai-nghiem"],
  },
  {
    id: "t6",
    dayLabel: "Ngày 3",
    date: "17/08/2026",
    time: "19:30",
    location: "Chợ Đêm Đà Lạt (Chợ Âm Phủ)",
    aiDescription:
      "AI nhận diện: Hòa mình vào không khí nhộn nhịp của chợ đêm, thưởng thức bánh tráng nướng giòn rụm và sữa đậu nành nóng hổi.",
    thumbnails: [
      {
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
        caption: "Bánh tráng nướng chợ đêm",
      },
    ],
    tags: ["#cho-dem", "#banh-trang-nuong", "#am-thuc"],
  },
];
