import { readFile } from "node:fs/promises";
import { test, expect, register, createJourney, createPlan } from "./helpers";
test("onboarding preserves requested route, validates credentials and restores session", async ({
  page,
}) => {
  await page.goto("/planner/new");
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole("link", { name: "Tạo tài khoản", exact: true }).click();
  await page.getByLabel("Tên hiển thị", { exact: true }).fill("Người khám phá");
  await page.getByLabel("Email", { exact: true }).fill("new@example.com");
  await page.getByLabel("Mật khẩu", { exact: true }).fill("Travelogue2026!");
  await page
    .getByRole("button", { name: "Tạo tài khoản", exact: true })
    .click();
  await expect(page).toHaveURL(/\/planner\/new$/);
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: "Một ý tưởng. Một hành trình.",
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
  await page.getByLabel("Email", { exact: true }).fill("new@example.com");
  await page.getByLabel("Mật khẩu", { exact: true }).fill("WrongPassword123!");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Email hoặc mật khẩu chưa đúng.",
  );
  await page.getByLabel("Mật khẩu", { exact: true }).fill("Travelogue2026!");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page).toHaveURL(/\/planner\/new$/);
});
test("each local account owns its records and cannot open another account's media or plan", async ({
  signedIn: page,
}) => {
  const journeyUrl = await createJourney(page, "Ký ức riêng", true);
  const planUrl = await createPlan(page);
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
  await register(page, "second@example.com", "Người thứ hai");
  await page.goto("/gallery");
  await expect(
    page.getByText("Chưa có chuyến đi nào.", { exact: false }),
  ).toBeVisible();
  await page.goto(journeyUrl);
  await expect(
    page.getByRole("heading", {
      name: "Không tìm thấy chuyến đi.",
      exact: true,
    }),
  ).toBeVisible();
  await page.goto(planUrl);
  await expect(
    page.getByRole("heading", {
      name: "Không tìm thấy kế hoạch.",
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
  await page.getByLabel("Email", { exact: true }).fill("traveler@example.com");
  await page.getByLabel("Mật khẩu", { exact: true }).fill("Travelogue2026!");
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Hà Giang", exact: true }),
  ).toBeVisible();
  await page.goto(journeyUrl);
  await expect(page.getByAltText("first.png", { exact: true })).toBeVisible();
});
test("profile updates and complete media backups survive export, clear and import", async ({
  signedIn: page,
}) => {
  await createJourney(page, "Ký ức được sao lưu", true);
  await createPlan(page);
  await page.goto("/settings");
  await page.getByLabel("Tên hiển thị", { exact: true }).fill("Một tên mới");
  await page.getByRole("button", { name: "Lưu hồ sơ", exact: true }).click();
  await expect(
    page.getByText("Đã cập nhật hồ sơ", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Tên hiển thị", { exact: true })).toHaveValue(
    "Một tên mới",
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Tải bản sao", exact: true }).click();
  const backup = await download;
  const file = await backup.path();
  if (!file) throw new Error("Backup download must exist.");
  const body = await readFile(file);
  expect(body.toString("utf8")).toContain("data:image/png;base64,");
  await page
    .getByRole("button", { name: "Xóa dữ liệu đã lưu", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Xóa dữ liệu", exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page
    .getByLabel("Chọn bản sao Travelogue", { exact: true })
    .setInputFiles({
      name: "backup.json",
      mimeType: "application/json",
      buffer: body,
    });
  await expect(
    page.getByText("Đã nhập 1 chuyến đi và 1 kế hoạch", { exact: true }),
  ).toBeVisible();
  await page.goto("/gallery");
  await page.getByRole("link", { name: /Ký ức được sao lưu/ }).click();
  await expect(page.getByAltText("first.png", { exact: true })).toBeVisible();
  await page.goto("/planner");
  await expect(
    page.getByRole("heading", { name: "Hà Giang", exact: true }),
  ).toBeVisible();
});
test("corrupt sessions and malformed backups do not crash or replace existing data", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("travelogue_profile", "{broken");
    localStorage.setItem("travelogue_session", "{broken");
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Chào mừng trở lại.", exact: true }),
  ).toBeVisible();
  // Remove the script on a fresh context is unnecessary: subsequent navigation is client-side.
  await page.getByRole("link", { name: "Tạo tài khoản", exact: true }).click();
  await page.getByLabel("Tên hiển thị", { exact: true }).fill("Người đọc");
  await page.getByLabel("Email", { exact: true }).fill("reader@example.com");
  await page.getByLabel("Mật khẩu", { exact: true }).fill("Travelogue2026!");
  await page
    .getByRole("button", { name: "Tạo tài khoản", exact: true })
    .click();
  await page
    .getByTestId("persistent-sidebar")
    .getByRole("link", { name: "Cài đặt", exact: true })
    .click();
  await page
    .getByLabel("Chọn bản sao Travelogue", { exact: true })
    .setInputFiles({
      name: "broken.json",
      mimeType: "application/json",
      buffer: Buffer.from("{broken"),
    });
  await expect(page.getByRole("alert")).toContainText("Bản sao không hợp lệ");
});
test("demo is explicitly seeded, stays usable on reload, and supplies visual references", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/login");
  await page.screenshot({
    path: "test-results/login-desktop.png",
    fullPage: true,
    animations: "disabled",
  });
  await page
    .getByRole("button", { name: "Khám phá bản demo", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Mỗi chuyến đi, một câu chuyện.",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Một sáng trên đường", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/dashboard-desktop.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.goto("/planner");
  await page.getByRole("link", { name: /Đà Lạt/ }).click();
  await expect(
    page.getByRole("region", { name: "Đề xuất địa điểm", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/planner-desktop.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "test-results/planner-390.png",
    fullPage: true,
    animations: "disabled",
  });
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Đà Lạt", exact: true }),
  ).toBeVisible();
});
