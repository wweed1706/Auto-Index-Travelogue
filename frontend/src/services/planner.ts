import type { Activity, Itinerary, Place, PlannerInput } from "../types";
import { validDate } from "./utils";

export function createDraft(
  criteria: PlannerInput,
  ownerId = "test",
): Itinerary {
  if (!validDate(criteria.startDate) || !validDate(criteria.endDate))
    throw new Error("Vui lòng chọn ngày hợp lệ.");
  const start = Date.parse(criteria.startDate + "T00:00:00Z");
  const count =
    Math.round(
      (Date.parse(criteria.endDate + "T00:00:00Z") - start) / 86400000,
    ) + 1;
  if (count < 1 || count > 60)
    throw new Error("Chọn khoảng thời gian từ 1 đến 60 ngày.");
  if (
    !criteria.destination.trim() ||
    !Number.isInteger(criteria.travelers) ||
    criteria.travelers < 1 ||
    criteria.travelers > 100 ||
    !Number.isFinite(criteria.budget) ||
    criteria.budget <= 0
  )
    throw new Error("Vui lòng kiểm tra điểm đến, số người và ngân sách.");
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    ownerId,
    criteria: { ...criteria, destination: criteria.destination.trim() },
    createdAt: now,
    updatedAt: now,
    days: Array.from({ length: count }, (_, index) => ({
      dayNumber: index + 1,
      date: new Date(start + index * 86400000).toISOString().slice(0, 10),
      title: "Ngày " + (index + 1),
      activities: [],
    })),
  };
}
export function validateActivity(activity: Activity) {
  if (
    !activity.location.trim() ||
    activity.location.trim().length > 200 ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(activity.time)
  )
    throw new Error("Vui lòng nhập hoạt động và thời gian hợp lệ.");
  if (
    !Number.isInteger(activity.durationMinutes) ||
    activity.durationMinutes < 15 ||
    activity.durationMinutes > 720 ||
    !Number.isFinite(activity.costAmount) ||
    activity.costAmount < 0
  )
    throw new Error("Kiểm tra thời lượng (15–720 phút) và chi phí.");
}
export function appendActivity(
  plan: Itinerary,
  dayNumber: number,
  activity: Activity,
): Itinerary {
  validateActivity(activity);
  const day = plan.days.find((item) => item.dayNumber === dayNumber);
  if (!day) throw new Error("Ngày đã chọn không thuộc kế hoạch.");
  if (
    activity.placeId &&
    day.activities.some((item) => item.placeId === activity.placeId)
  )
    throw new Error("Địa điểm này đã có trong ngày đang chọn.");
  return {
    ...plan,
    days: plan.days.map((item) =>
      item.dayNumber === dayNumber
        ? {
            ...item,
            activities: [
              ...item.activities,
              { ...activity, location: activity.location.trim() },
            ].sort((a, b) => a.time.localeCompare(b.time)),
          }
        : item,
    ),
  };
}
export const minutes = (time: string) =>
  Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
export function timeString(value: number) {
  return (
    String(Math.floor(value / 60)).padStart(2, "0") +
    ":" +
    String(value % 60).padStart(2, "0")
  );
}
export function nextTime(plan: Itinerary, dayNumber: number) {
  const activities =
    plan.days.find((day) => day.dayNumber === dayNumber)?.activities || [];
  return timeString(
    Math.min(
      22 * 60,
      activities.reduce(
        (latest, activity) =>
          Math.max(
            latest,
            minutes(activity.time) + activity.durationMinutes + 15,
          ),
        9 * 60,
      ),
    ),
  );
}
export function activityFromPlace(
  place: Place,
  plan: Itinerary,
  dayNumber: number,
): Activity {
  return {
    id: crypto.randomUUID(),
    placeId: place.id,
    location: place.name,
    time: nextTime(plan, dayNumber),
    note: place.description,
    costAmount: place.costAmount,
    durationMinutes: place.durationMinutes,
    category: place.category,
    coordinates: place.coordinates,
  };
}
export function updateActivity(plan: Itinerary, activity: Activity) {
  validateActivity(activity);
  return {
    ...plan,
    days: plan.days.map((day) => ({
      ...day,
      activities: day.activities
        .map((item) =>
          item.id === activity.id
            ? { ...activity, location: activity.location.trim() }
            : item,
        )
        .sort((a, b) => a.time.localeCompare(b.time)),
    })),
  };
}
export function removeActivity(plan: Itinerary, id: string) {
  return {
    ...plan,
    days: plan.days.map((day) => ({
      ...day,
      activities: day.activities.filter((activity) => activity.id !== id),
    })),
  };
}
export function moveActivity(
  plan: Itinerary,
  activityId: string,
  targetDay: number,
  beforeId?: string,
): Itinerary {
  const source = plan.days.find((day) =>
    day.activities.some((activity) => activity.id === activityId),
  );
  const activity = source?.activities.find((item) => item.id === activityId);
  const target = plan.days.find((day) => day.dayNumber === targetDay);
  if (!activity || !target || beforeId === activityId) return plan;
  if (
    source?.dayNumber !== targetDay &&
    activity.placeId &&
    target.activities.some((item) => item.placeId === activity.placeId)
  )
    throw new Error("Địa điểm này đã có trong ngày đích.");
  const items = target.activities.filter((item) => item.id !== activityId);
  const index = beforeId
    ? items.findIndex((item) => item.id === beforeId)
    : items.length;
  items.splice(index < 0 ? items.length : index, 0, activity);
  // Drag order is authoritative. Reflow times with a 15-minute buffer, never silently sort back.
  let time = Math.min(
    minutes(target.activities[0]?.time || "09:00"),
    minutes(items[0]?.time || "09:00"),
  );
  const arranged = items.map((item) => {
    if (time + item.durationMinutes > 24 * 60)
      throw new Error(
        "Ngày này chưa đủ thời gian. Chuyển bớt hoạt động sang ngày khác.",
      );
    const next = { ...item, time: timeString(time) };
    time += item.durationMinutes + 15;
    return next;
  });
  return {
    ...plan,
    days: plan.days.map((day) =>
      day.dayNumber === targetDay
        ? { ...day, activities: arranged }
        : {
            ...day,
            activities: day.activities.filter((item) => item.id !== activityId),
          },
    ),
  };
}
export function scheduleConflicts(activities: Activity[]) {
  return activities
    .filter((activity, index) => {
      const end = minutes(activity.time) + activity.durationMinutes;
      return (
        end > 24 * 60 ||
        activities.some(
          (other, otherIndex) =>
            otherIndex !== index &&
            minutes(activity.time) <
              minutes(other.time) + other.durationMinutes &&
            end > minutes(other.time),
        )
      );
    })
    .map((activity) => activity.id);
}
export function suggestItinerary(
  plan: Itinerary,
  recommendations: Place[],
): Itinerary {
  const candidates = recommendations.filter(
    (place) => place.category !== "hotel",
  );
  let position = 0;
  return {
    ...plan,
    days: plan.days.map((day) => {
      const selected = candidates.slice(position, position + 3);
      position += 3;
      let time = 9 * 60;
      let spent = 0;
      const dailyBudget = plan.criteria.budget / plan.days.length;
      const activities = selected
        .filter((place) => {
          if (spent + place.costAmount > dailyBudget) return false;
          spent += place.costAmount;
          return true;
        })
        .map((place) => {
          const activity = {
            ...activityFromPlace(place, plan, day.dayNumber),
            time: timeString(time),
          };
          time += place.durationMinutes + 30;
          return activity;
        });
      return { ...day, activities };
    }),
  };
}
