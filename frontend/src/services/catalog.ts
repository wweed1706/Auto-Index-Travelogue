import type { Destination, Place, PlannerInput } from "../types";
import { normalize } from "./utils";

export const destinations: Destination[] = [
  {
    id: "dalat",
    name: "Đà Lạt",
    subtitle: "Sương sớm & những tán thông",
    coordinates: { latitude: 11.9404, longitude: 108.4583 },
    color: "emerald",
    symbol: "forest",
  },
  {
    id: "hagiang",
    name: "Hà Giang",
    subtitle: "Những cung đường phía Bắc",
    coordinates: { latitude: 22.8233, longitude: 104.9836 },
    color: "sky",
    symbol: "mountain",
  },
  {
    id: "danang",
    name: "Đà Nẵng – Hội An",
    subtitle: "Biển xanh & phố cổ",
    coordinates: { latitude: 16.0544, longitude: 108.2022 },
    color: "amber",
    symbol: "sun",
  },
  {
    id: "phuquoc",
    name: "Phú Quốc",
    subtitle: "Ngày chậm bên biển",
    coordinates: { latitude: 10.2899, longitude: 103.984 },
    color: "cyan",
    symbol: "sea",
  },
  {
    id: "nhatrang",
    name: "Nha Trang",
    subtitle: "Một chút nắng miền biển",
    coordinates: { latitude: 12.2388, longitude: 109.1967 },
    color: "indigo",
    symbol: "sea",
  },
  {
    id: "sapa",
    name: "Sa Pa",
    subtitle: "Chạm vào mây núi",
    coordinates: { latitude: 22.3364, longitude: 103.8438 },
    color: "violet",
    symbol: "mountain",
  },
];
const names: Record<string, string[]> = {
  dalat: [
    "Đồi thông buổi sớm",
    "Góc cà phê bên hồ",
    "Bữa trưa vườn nhỏ",
    "Dạo bước quanh hồ",
    "Nhà nghỉ trên đồi",
    "Vườn hoa cuối chiều",
  ],
  hagiang: [
    "Điểm ngắm núi đá",
    "Cà phê phố Đồng Văn",
    "Bữa trưa miền cao",
    "Dạo phố cổ Đồng Văn",
    "Nhà nghỉ miền đá",
    "Đường mòn ven núi",
  ],
  danang: [
    "Bình minh bên biển",
    "Cà phê phố cổ",
    "Bữa trưa miền Trung",
    "Dạo phố Hội An",
    "Nhà nghỉ gần biển",
    "Chiều bên sông",
  ],
  phuquoc: [
    "Bãi biển sáng sớm",
    "Cà phê nhìn ra biển",
    "Bữa trưa hải sản",
    "Dạo làng ven biển",
    "Nhà nghỉ đảo xanh",
    "Hoàng hôn trên đảo",
  ],
  nhatrang: [
    "Đường biển buổi sớm",
    "Cà phê ven vịnh",
    "Bữa trưa miền biển",
    "Dạo phố ven biển",
    "Nhà nghỉ ven vịnh",
    "Ngắm hoàng hôn",
  ],
  sapa: [
    "Điểm ngắm thung lũng",
    "Cà phê bên sườn núi",
    "Bữa trưa vùng cao",
    "Dạo làng trong mây",
    "Nhà nghỉ bên núi",
    "Đường mòn ruộng bậc thang",
  ],
};
const categories: Place["category"][] = [
  "checkin",
  "restaurant",
  "restaurant",
  "activity",
  "hotel",
  "checkin",
];
const tags = [
  ["Thiên nhiên", "Chụp ảnh"],
  ["Cafe", "Nghỉ dưỡng"],
  ["Ẩm thực", "Không cay"],
  ["Văn hóa", "Chụp ảnh"],
  ["Nghỉ dưỡng", "Yên tĩnh"],
  ["Thiên nhiên", "Chụp ảnh"],
];
export const places: Place[] = destinations.flatMap((destination) =>
  names[destination.id].map((name, index) => ({
    id: `${destination.id}-${index}`,
    destinationId: destination.id,
    name,
    category: categories[index],
    description: [
      "Một điểm dừng nhẹ nhàng để bắt đầu ngày mới.",
      "Không gian để nghỉ chân và thưởng thức một ly cà phê.",
      "Một bữa ăn thư thả với hương vị địa phương.",
      "Đi bộ chậm, khám phá nhịp sống và lưu lại vài tấm ảnh.",
      "Một nơi nghỉ ngơi yên tĩnh sau ngày khám phá.",
      "Kết thúc ngày với những góc nhìn nhiều cảm hứng.",
    ][index],
    address: `Khu vực ${destination.name} · địa điểm minh họa`,
    tags: tags[index],
    costAmount: [0, 65000, 120000, 50000, 650000, 40000][index],
    durationMinutes: [60, 45, 60, 90, 60, 60][index],
    coordinates: {
      latitude:
        destination.coordinates.latitude +
        [0.012, -0.003, -0.007, 0.002, -0.009, 0.008][index],
      longitude:
        destination.coordinates.longitude +
        [-0.009, -0.004, 0.002, 0.01, -0.002, 0.006][index],
    },
  })),
);
export const interests = [
  "Thiên nhiên",
  "Cafe",
  "Ẩm thực",
  "Văn hóa",
  "Chụp ảnh",
  "Nghỉ dưỡng",
];
export const categoryLabels: Record<Place["category"], string> = {
  hotel: "Lưu trú",
  restaurant: "Ăn uống",
  checkin: "Check-in",
  activity: "Trải nghiệm",
};
export function findDestination(value: string) {
  const input = normalize(value);
  return destinations.find(
    (item) =>
      input.includes(normalize(item.name.split(" – ")[0])) ||
      (item.id === "danang" && input.includes("hoi an")),
  );
}
export function recommend(criteria: PlannerInput): Place[] {
  const destination = findDestination(criteria.destination);
  if (!destination) return [];
  const perDay =
    criteria.budget /
    Math.max(
      1,
      Math.round(
        (Date.parse(criteria.endDate) - Date.parse(criteria.startDate)) /
          86400000,
      ) + 1,
    );
  const avoidsSpicy = /cay|spicy/.test(normalize(criteria.dislikes));
  return places
    .filter((place) => place.destinationId === destination.id)
    .filter(
      (place) =>
        !avoidsSpicy || !place.tags.some((tag) => normalize(tag) === "cay"),
    )
    .map((place) => ({
      ...place,
      matchScore: Math.min(
        99,
        72 +
          (place.tags.some((tag) =>
            criteria.interests.some((interest) =>
              normalize(interest).includes(normalize(tag)),
            ),
          )
            ? 18
            : 0) +
          (place.costAmount <= perDay ? 8 : 0),
      ),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}
