import { test, expect } from "@playwright/test";

test("sidebar retains its DOM instance across all menu routes and browser history", async ({
  page,
}) => {
  await page.goto("/");
  const sidebar = page.getByTestId("persistent-sidebar");
  await sidebar.evaluate((node) =>
    node.setAttribute("data-instance", "original"),
  );
  const nav = page.getByRole("navigation", { name: "Menu chính" });
  for (const name of [
    "Upload chuyến đi",
    "Lên kế hoạch du lịch",
    "Gallery",
    "Cài đặt",
    "Trang chủ",
  ]) {
    await nav.getByRole("link", { name, exact: true }).click();
    await expect(sidebar).toHaveAttribute("data-instance", "original");
    await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
  }
  await page.goBack();
  await expect(nav.getByRole("link", { name: "Cài đặt" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(sidebar).toHaveAttribute("data-instance", "original");
});

test("media previews survive adding and removing files; journey persists after reload", async ({
  page,
}) => {
  await page.goto("/upload");
  await page.getByLabel("Tên chuyến đi").fill("Ký ức Đà Lạt");
  await page.getByLabel("Địa điểm", { exact: true }).fill("Đà Lạt");
  await page.getByLabel("Ngày chuyến đi").fill("2026-09-20");
  await page.getByLabel("Ghi chú", { exact: true }).fill("Cafe bên rừng thông");
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aG1cAAAAASUVORK5CYII=",
    "base64",
  );
  const input = page.getByLabel("Chọn media", { exact: true });
  await input.setInputFiles({
    name: "first.png",
    mimeType: "image/png",
    buffer: png,
  });
  await input.setInputFiles({
    name: "second.png",
    mimeType: "image/png",
    buffer: png,
  });
  await page.getByRole("button", { name: "Xóa second.png" }).click();
  await expect(page.getByAltText("first.png")).toBeVisible();
  expect(
    await page
      .getByAltText("first.png")
      .evaluate(
        async (node) => (await fetch((node as HTMLImageElement).src)).ok,
      ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Lưu chuyến đi", exact: true })
    .click();
  await expect(page).toHaveURL(/\/journey\//);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Ký ức Đà Lạt" }),
  ).toBeVisible();
  await expect(page.getByAltText("first.png")).toBeVisible();
  await page.getByRole("button", { name: "Xem ảnh first.png" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Xem ảnh first.png" }),
  ).toBeFocused();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Gallery", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Ký ức Đà Lạt" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Tìm kiếm AI", exact: true }).click();
  await page.getByLabel("Từ khóa lịch sử").fill("cafe");
  await page.getByRole("button", { name: "Tìm trong lịch sử" }).click();
  await expect(
    page.getByRole("heading", { name: "Ký ức Đà Lạt" }),
  ).toBeVisible();
  await page.getByLabel("Từ khóa lịch sử").fill("không tồn tại");
  await page.getByRole("button", { name: "Tìm trong lịch sử" }).click();
  await expect(
    page.getByText("Không tìm thấy chuyến đi phù hợp."),
  ).toBeVisible();
});

test("planner honors destination, inclusive dates and preferences, saves activities", async ({
  page,
}) => {
  await page.goto("/planner");
  await page.getByLabel("Điểm đến mong muốn").fill("Hà Giang");
  await page.getByLabel("Số lượng người").fill("3");
  await page.getByLabel("Ngày khởi hành").fill("2026-10-01");
  await page.getByLabel("Ngày kết thúc").fill("2026-10-02");
  await page.getByLabel("Những điều không thích").fill("Đồ ăn cay");
  await page.getByRole("button", { name: "Tạo và lưu bản nháp" }).click();
  await expect(page).toHaveURL(/\/planner\//);
  await expect(page.getByText("Tất cả (2 ngày)")).toBeVisible();
  await expect(page.getByText("Điều cần tránh: Đồ ăn cay")).toBeVisible();
  await expect(page.getByText("Đồi Chè Cầu Đất", { exact: false })).toHaveCount(
    0,
  );
  await page.getByLabel("Giờ", { exact: true }).fill("08:00");
  await page.getByLabel("Địa điểm / Hoạt động").fill("Dạo phố Đồng Văn");
  await page.getByLabel("Ghi chú", { exact: true }).fill("Ăn sáng nhẹ");
  await page.getByRole("button", { name: "Thêm và lưu hoạt động" }).click();
  await expect(
    page.getByRole("heading", { name: "Dạo phố Đồng Văn" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/itinerary-mobile.png",
    fullPage: true,
  });
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Dạo phố Đồng Văn" }),
  ).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Gallery", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Hà Giang", exact: true }),
  ).toBeVisible();
});

test("storage failure stays visible instead of showing a successful save", async ({
  page,
}) => {
  await page.addInitScript(() => {
    IDBFactory.prototype.open = () => {
      throw new DOMException("Blocked", "SecurityError");
    };
  });
  await page.goto("/upload");
  await page.getByLabel("Tên chuyến đi").fill("Không thể lưu");
  await page.getByLabel("Địa điểm", { exact: true }).fill("Hà Nội");
  await page.getByLabel("Ngày chuyến đi").fill("2026-09-20");
  await page.getByLabel("Ghi chú", { exact: true }).fill("Ghi chú thử");
  await page
    .getByRole("button", { name: "Lưu chuyến đi", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "Không thể mở bộ nhớ thiết bị",
  );
  await expect(page).toHaveURL(/\/upload$/);
  await expect(page.getByLabel("Ghi chú", { exact: true })).toHaveValue(
    "Ghi chú thử",
  );
});

test("dropzone receives dropped files and rejects unsupported files", async ({
  page,
}) => {
  await page.goto("/upload");
  const data = await page.evaluateHandle(() => {
    const transfer = new DataTransfer();
    transfer.items.add(
      new File(["audio"], "recording.wav", { type: "audio/wav" }),
    );
    return transfer;
  });
  await page
    .getByRole("button", { name: /Kéo thả hoặc chọn media/ })
    .dispatchEvent("drop", { dataTransfer: data });
  await expect(page.getByText("recording.wav", { exact: true })).toBeVisible();
  await page
    .getByLabel("Chọn media", { exact: true })
    .setInputFiles({
      name: "script.exe",
      mimeType: "application/octet-stream",
      buffer: Buffer.from("invalid"),
    });
  await expect(page.getByRole("alert")).toContainText("Không nhận: script.exe");
  await expect(page.getByText("recording.wav", { exact: true })).toBeVisible();
});

test("empty data and missing IDs never fall back to mock content", async ({
  page,
}) => {
  await page.goto("/gallery");
  await expect(
    page.getByText("Chưa có chuyến đi nào.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText("Chưa có kế hoạch nào.", { exact: false }),
  ).toBeVisible();
  await page.goto("/journey/non-existent");
  await expect(
    page.getByText("Không tìm thấy chuyến đi.", { exact: false }),
  ).toBeVisible();
  await page.goto("/planner/non-existent");
  await expect(
    page.getByText("Không tìm thấy kế hoạch.", { exact: false }),
  ).toBeVisible();
});

test("corrupt profile does not crash the app and AI search is only in Gallery", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("travelogue_profile", "{broken"),
  );
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByLabel("Từ khóa lịch sử")).toHaveCount(0);
  await page.goto("/planner");
  await expect(page.getByLabel("Từ khóa lịch sử")).toHaveCount(0);
  await page.goto("/gallery?tab=search");
  await expect(page.getByLabel("Từ khóa lịch sử")).toBeVisible();
});

test("mobile pages have no horizontal overflow and sidebar stays visible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  for (const route of [
    "/",
    "/upload",
    "/planner",
    "/gallery?tab=search",
    "/settings",
    "/login",
    "/register",
  ]) {
    await page.goto(route);
    await expect(page.getByTestId("persistent-sidebar")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      route,
    ).toBe(true);
  }
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
});

test("desktop visual reference", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  await page.goto("/planner");
  await page.screenshot({
    path: "test-results/planner-desktop.png",
    fullPage: true,
  });
});
