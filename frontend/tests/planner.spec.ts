import { test, expect } from "@playwright/test";
import {
  appendActivity,
  createDraft,
  moveActivity,
  updateActivity,
  scheduleConflicts,
  suggestItinerary,
} from "../src/services/planner";
import { recommend } from "../src/services/catalog";
import type { Activity } from "../src/types";
const criteria = {
  destination: "Hà Giang",
  startDate: "2026-12-31",
  endDate: "2027-01-01",
  budget: 3000000,
  travelers: 2,
  interests: ["Thiên nhiên"],
  dislikes: "",
};
const activity = (id: string, time = "09:00", placeId?: string): Activity => ({
  id,
  time,
  location: id,
  note: "",
  durationMinutes: 60,
  costAmount: 0,
  placeId,
});
test("inclusive dates across year boundary; invalid calendar, duration, traveler and budget", () => {
  const plan = createDraft(criteria);
  expect(plan.days.map((day) => day.date)).toEqual([
    "2026-12-31",
    "2027-01-01",
  ]);
  for (const input of [
    { ...criteria, endDate: "2026-12-30" },
    { ...criteria, startDate: "2026-02-30" },
    { ...criteria, travelers: 1.5 },
    { ...criteria, endDate: "2028-01-01" },
    { ...criteria, budget: Infinity },
  ])
    expect(() => createDraft(input)).toThrow();
});
test("selected day, chronological addition, duplicate within a day and intentional repeat across days", () => {
  let plan = appendActivity(
    createDraft(criteria),
    2,
    activity("lunch", "12:00", "lunch-place"),
  );
  plan = appendActivity(plan, 2, activity("breakfast", "08:00"));
  expect(plan.days[0].activities).toHaveLength(0);
  expect(plan.days[1].activities.map((item) => item.id)).toEqual([
    "breakfast",
    "lunch",
  ]);
  expect(() =>
    appendActivity(plan, 2, activity("again", "16:00", "lunch-place")),
  ).toThrow(/đã có/);
  expect(
    appendActivity(plan, 1, activity("again", "16:00", "lunch-place")).days[0]
      .activities,
  ).toHaveLength(1);
  expect(() => appendActivity(plan, 3, activity("invalid"))).toThrow();
  expect(() =>
    appendActivity(plan, 1, activity("bad-time", "25:00")),
  ).toThrow();
  expect(() =>
    appendActivity(plan, 1, { ...activity("blank"), location: " " }),
  ).toThrow();
});
test("moving cards preserves drag order, reflows time and can transfer to another day", () => {
  let plan = appendActivity(
    createDraft(criteria),
    1,
    activity("first", "08:00"),
  );
  plan = appendActivity(plan, 1, activity("second", "11:00"));
  plan = moveActivity(plan, "first", 1);
  expect(plan.days[0].activities.map((item) => item.id)).toEqual([
    "second",
    "first",
  ]);
  expect(plan.days[0].activities.map((item) => item.time)).toEqual([
    "08:00",
    "09:15",
  ]);
  plan = moveActivity(plan, "first", 2);
  expect(plan.days[0].activities.map((item) => item.id)).toEqual(["second"]);
  expect(plan.days[1].activities.map((item) => item.id)).toEqual(["first"]);
  const late = appendActivity(
    createDraft(criteria),
    1,
    activity("late", "23:00"),
  );
  expect(() =>
    moveActivity(
      appendActivity(late, 2, activity("extra", "23:00")),
      "extra",
      1,
    ),
  ).toThrow(/thời gian/);
});
test("manual edits retain conflict warnings; recommendations match destination and empty catalog stays empty", () => {
  let plan = appendActivity(
    createDraft(criteria),
    1,
    activity("first", "09:00"),
  );
  plan = appendActivity(plan, 1, activity("second", "11:00"));
  plan = updateActivity(plan, activity("second", "09:30"));
  expect(scheduleConflicts(plan.days[0].activities)).toEqual([
    "first",
    "second",
  ]);
  const places = recommend(criteria);
  expect(places.every((place) => place.destinationId === "hagiang")).toBe(true);
  const suggested = suggestItinerary(createDraft(criteria), places);
  expect(
    suggested.days.flatMap((day) => day.activities).length,
  ).toBeGreaterThan(0);
  expect(recommend({ ...criteria, destination: "Điểm đến chưa có" })).toEqual(
    [],
  );
  expect(
    suggestItinerary(createDraft({ ...criteria, budget: 100000 }), places)
      .days.flatMap((day) => day.activities)
      .reduce((sum, item) => sum + item.costAmount, 0),
  ).toBeLessThanOrEqual(100000);
});
