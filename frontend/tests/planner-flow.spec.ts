import { test, expect, createPlan, addActivity } from "./helpers";
test("recommendations honor destination and add to the selected day; repeats across days are intentional", async ({
  signedIn: page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await createPlan(page);
  await page
    .getByRole("button", { name: /Ngày 2/, exact: false })
    .filter({ hasText: "01/01" })
    .click();
  const recommendations = page.getByRole("region", {
    name: "Đề xuất địa điểm",
    exact: true,
  });
  await expect(
    recommendations.getByText("Cà phê phố Đồng Văn", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Góc cà phê bên hồ", { exact: true }),
  ).toHaveCount(0);
  await recommendations
    .getByRole("button", { name: "Thêm vào ngày 2", exact: true })
    .first()
    .click();
  const itinerary = page.getByRole("region", {
    name: "Lịch trình chi tiết theo từng ngày",
    exact: true,
  });
  await expect(itinerary.getByRole("heading", { level: 3 })).toHaveCount(1);
  const added = await itinerary
    .getByRole("heading", { level: 3 })
    .first()
    .innerText();
  await page
    .getByRole("button", { name: /Ngày 1/, exact: false })
    .filter({ hasText: "31/12" })
    .click();
  await expect(itinerary.getByRole("heading", { level: 3 })).toHaveCount(0);
  const samePlace = recommendations
    .getByRole("article")
    .filter({ has: page.getByRole("button", { name: added, exact: true }) });
  await samePlace
    .getByRole("button", { name: "Thêm vào ngày 1", exact: true })
    .click();
  await expect(
    itinerary.getByRole("heading", { name: added, exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    itinerary.getByRole("heading", { name: added, exact: true }),
  ).toBeVisible();
});
test("pointer drag changes order and time; mobile controls transfer, edit, delete and undo", async ({
  signedIn: page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await createPlan(page);
  await addActivity(page, "Ăn sáng", "08:00");
  await addActivity(page, "Dạo phố", "11:00");
  const itinerary = page.getByRole("region", {
    name: "Lịch trình chi tiết theo từng ngày",
    exact: true,
  });
  const handle = itinerary.getByRole("button", {
    name: "Kéo hoạt động Ăn sáng",
    exact: true,
  });
  const target = itinerary
    .getByRole("article")
    .filter({
      has: page.getByRole("heading", { name: "Dạo phố", exact: true }),
    });
  const start = await handle.boundingBox();
  const end = await target.boundingBox();
  if (!start || !end) throw new Error("Drag targets must be visible.");
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    start.x + start.width / 2,
    start.y + start.height / 2 + 12,
    { steps: 3 },
  );
  await page.mouse.move(end.x + end.width / 2, end.y + end.height / 2, {
    steps: 15,
  });
  await page.mouse.up();
  await expect(itinerary.getByRole("heading", { level: 3 })).toHaveText([
    "Dạo phố",
    "Ăn sáng",
  ]);
  await expect(itinerary.getByText("09:15", { exact: true })).toBeVisible();
  await page.setViewportSize({ width: 320, height: 740 });
  await page
    .getByLabel("Chuyển ngày cho Ăn sáng", { exact: true })
    .selectOption("2");
  await expect(
    itinerary.getByRole("heading", { name: "Ăn sáng", exact: true }),
  ).toBeVisible();
  await expect(
    itinerary.getByRole("heading", { name: "Dạo phố", exact: true }),
  ).toHaveCount(0);
  await itinerary
    .getByRole("button", { name: "Chỉnh sửa", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Địa điểm / Hoạt động", { exact: true })
    .fill("Ăn sáng trong phố");
  await dialog
    .getByLabel("Ghi chú", { exact: true })
    .fill("Một điểm dừng nhẹ nhàng.");
  await dialog
    .getByRole("button", { name: "Lưu hoạt động", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await page.reload();
  await expect(
    itinerary.getByRole("heading", { name: "Ăn sáng trong phố", exact: true }),
  ).toBeVisible();
  await itinerary
    .getByRole("button", {
      name: "Xóa hoạt động Ăn sáng trong phố",
      exact: true,
    })
    .click();
  await expect(
    itinerary.getByRole("heading", { name: "Ăn sáng trong phố", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Hoàn tác", exact: true }).click();
  await expect(
    itinerary.getByRole("heading", { name: "Ăn sáng trong phố", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/planner-mobile.png",
    fullPage: true,
  });
});
test("criteria editing preserves activities and refuses to silently discard removed dates", async ({
  signedIn: page,
}) => {
  await createPlan(page, "Đà Lạt", true);
  await page
    .getByRole("button", { name: "Chỉnh tiêu chí", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Ngày kết thúc", { exact: true }).fill("2026-12-31");
  await dialog
    .getByRole("button", { name: "Lưu tiêu chí", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toContainText("bỏ hoạt động");
  await dialog.getByLabel("Ngày kết thúc", { exact: true }).fill("2027-01-01");
  await dialog.getByLabel("Số lượng người", { exact: true }).fill("4");
  await dialog
    .getByRole("button", { name: "Lưu tiêu chí", exact: true })
    .click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByText("4 người", { exact: false })).toBeVisible();
  await page.goto("/planner");
  await page
    .getByRole("button", { name: "Xóa kế hoạch Đà Lạt", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Đà Lạt", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Hoàn tác", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Đà Lạt", exact: true }),
  ).toBeVisible();
});
test("unknown destinations remain usable with custom activities and clear empty recommendations", async ({
  signedIn: page,
}) => {
  await createPlan(page, "Một điểm đến riêng", true);
  await addActivity(page, "Dạo quanh nơi lưu trú", "09:00");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Đề xuất", exact: true }).click();
  await expect(
    page.getByText("Catalog demo chưa có điểm đến này.", { exact: false }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Dạo quanh nơi lưu trú", exact: true }),
  ).toBeVisible();
});
