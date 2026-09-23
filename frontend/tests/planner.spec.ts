import { test, expect } from "@playwright/test";
import { appendActivity, createDraft } from "../src/services/planner";
const criteria = {
  destination: "Hà Giang",
  startDate: "2026-12-31",
  endDate: "2027-01-01",
  budget: 3000000,
  travelers: 2,
  interests: ["Thiên nhiên"],
  dislikes: "",
};

test("year boundary, invalid date range and traveler count", () => {
  const plan = createDraft(criteria);
  expect(plan.days.map((day) => day.date)).toEqual([
    "2026-12-31",
    "2027-01-01",
  ]);
  expect(() => createDraft({ ...criteria, endDate: "2026-12-30" })).toThrow();
  expect(() => createDraft({ ...criteria, travelers: 1.5 })).toThrow();
  expect(() => createDraft({ ...criteria, endDate: "2028-01-01" })).toThrow();
});

test("selected day, time ordering, duplicate place and invalid input", () => {
  let plan = createDraft(criteria);
  plan = appendActivity(plan, 2, {
    time: "12:00",
    location: "Ăn trưa",
    placeId: "lunch",
  });
  plan = appendActivity(plan, 2, { time: "08:00", location: "Ăn sáng" });
  expect(plan.days[0].activities).toHaveLength(0);
  expect(plan.days[1].activities.map((item) => item.location)).toEqual([
    "Ăn sáng",
    "Ăn trưa",
  ]);
  expect(
    appendActivity(plan, 1, {
      time: "12:00",
      location: "Ăn trưa",
      placeId: "lunch",
    }),
  ).toBe(plan);
  expect(() =>
    appendActivity(plan, 3, { time: "12:00", location: "Ăn trưa" }),
  ).toThrow();
  expect(() =>
    appendActivity(plan, 1, { time: "25:00", location: "Ăn trưa" }),
  ).toThrow();
  expect(() =>
    appendActivity(plan, 1, { time: "12:00", location: "   " }),
  ).toThrow();
});
