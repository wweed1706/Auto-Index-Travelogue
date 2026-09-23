import type { Activity, Itinerary, PlannerInput } from "../types";

export function createDraft(criteria: PlannerInput): Itinerary {
  const start = Date.parse(`${criteria.startDate}T00:00:00Z`);
  const end = Date.parse(`${criteria.endDate}T00:00:00Z`);
  const count = Math.round((end - start) / 86400000) + 1;
  if (!Number.isFinite(count) || count < 1 || count > 60)
    throw new Error("Chọn khoảng thời gian từ 1 đến 60 ngày.");
  if (
    !criteria.destination.trim() ||
    !Number.isInteger(criteria.travelers) ||
    criteria.travelers < 1 ||
    criteria.budget <= 0
  )
    throw new Error("Vui lòng kiểm tra điểm đến, số người và ngân sách.");
  // Dùng UTC để số ngày không bị lệch do múi giờ; bản nháp không giả lập kết quả AI.
  return {
    id: crypto.randomUUID(),
    criteria,
    createdAt: new Date().toISOString(),
    days: Array.from({ length: count }, (_, index) => ({
      dayNumber: index + 1,
      date: new Date(start + index * 86400000).toISOString().slice(0, 10),
      title: criteria.destination,
      activities: [],
    })),
  };
}

export function appendActivity(
  plan: Itinerary,
  dayNumber: number,
  activity: Activity,
): Itinerary {
  if (!plan.days.some((day) => day.dayNumber === dayNumber))
    throw new Error("Ngày đã chọn không thuộc kế hoạch.");
  if (
    !activity.location.trim() ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(activity.time)
  )
    throw new Error("Vui lòng nhập hoạt động và thời gian hợp lệ.");
  // Không thêm trùng địa điểm; thứ tự hoạt động luôn theo giờ trong ngày đã chọn.
  if (
    activity.placeId &&
    plan.days.some((day) =>
      day.activities.some((item) => item.placeId === activity.placeId),
    )
  )
    return plan;
  return {
    ...plan,
    days: plan.days.map((day) =>
      day.dayNumber === dayNumber
        ? {
            ...day,
            activities: [
              ...day.activities,
              {
                ...activity,
                id: crypto.randomUUID(),
                location: activity.location.trim(),
              },
            ].sort((a, b) => a.time.localeCompare(b.time)),
          }
        : day,
    ),
  };
}
