import { test as base, expect, type Page } from "@playwright/test";
export async function register(
  page: Page,
  email = "traveler@example.com",
  name = "Người đi xa",
) {
  await page.goto("/register");
  await page.getByLabel("Tên hiển thị", { exact: true }).fill(name);
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Mật khẩu", { exact: true }).fill("Travelogue2026!");
  await page
    .getByRole("button", { name: "Tạo tài khoản", exact: true })
    .click();
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", { name: "Mỗi chuyến đi, một câu chuyện." }),
  ).toBeVisible();
}
export const test = base.extend<{ signedIn: Page; pageErrors: string[] }>({
  pageErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await use(errors);
      expect(errors).toEqual([]);
    },
    { auto: true },
  ],
  signedIn: async ({ page }, use) => {
    await register(page);
    await use(page);
  },
});
export { expect };
export const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aG1cAAAAASUVORK5CYII=",
  "base64",
);
export async function createJourney(
  page: Page,
  title = "Ký ức Đà Lạt",
  withImage = false,
) {
  await page.goto("/upload");
  await page.getByLabel("Tên chuyến đi", { exact: true }).fill(title);
  await page.getByLabel("Địa điểm", { exact: true }).fill("Đà Lạt");
  await page.getByLabel("Ngày chuyến đi", { exact: true }).fill("2026-09-20");
  await page.getByLabel("Chủ đề", { exact: true }).fill("Cafe, Thiên nhiên");
  await page
    .getByRole("button", { name: "+ Thêm ghi chú & vị trí", exact: true })
    .click();
  await page
    .getByLabel("Ghi chú", { exact: true })
    .fill("Cafe bên rừng thông và một buổi sáng chậm.");
  if (withImage)
    await page
      .getByLabel("Chọn media", { exact: true })
      .setInputFiles({ name: "first.png", mimeType: "image/png", buffer: png });
  await page
    .getByRole("button", { name: "Lưu chuyến đi", exact: true })
    .click();
  await expect(page).toHaveURL(/\/journey\/[^/]+$/);
  await expect(
    page.getByRole("heading", { name: title, exact: true }),
  ).toBeVisible();
  return page.url();
}
export async function createPlan(
  page: Page,
  destination = "Hà Giang",
  suggest = false,
) {
  await page.goto("/planner/new");
  await page
    .getByLabel("Điểm đến mong muốn", { exact: true })
    .fill(destination);
  await page.getByLabel("Ngày khởi hành", { exact: true }).fill("2026-12-31");
  await page.getByLabel("Ngày kết thúc", { exact: true }).fill("2027-01-01");
  await page.getByLabel("Số lượng người", { exact: true }).fill("3");
  await page
    .getByLabel("Bắt đầu với lịch trình gợi ý", { exact: false })
    .setChecked(suggest);
  await page.getByRole("button", { name: "Tạo kế hoạch", exact: true }).click();
  await expect(page).toHaveURL(/\/planner\/[^/?]+$/);
  await expect(
    page.getByRole("heading", { name: destination, exact: true }),
  ).toBeVisible();
  return page.url();
}
export async function addActivity(page: Page, location: string, time: string) {
  await page
    .getByRole("button", { name: "Thêm hoạt động", exact: true })
    .click();
  const modal = page.getByRole("dialog");
  await modal
    .getByLabel("Địa điểm / Hoạt động", { exact: true })
    .fill(location);
  await modal.getByLabel("Giờ", { exact: true }).fill(time);
  await modal
    .getByRole("button", { name: "Thêm hoạt động", exact: true })
    .click();
  await expect(modal).not.toBeVisible();
  await expect(
    page.getByRole("heading", { name: location, exact: true }),
  ).toBeVisible();
}
