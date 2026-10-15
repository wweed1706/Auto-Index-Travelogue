import { test, expect, createJourney, png } from "./helpers";
test("sidebar retains its DOM instance across lazy routes and browser history", async ({
  signedIn: page,
}) => {
  const sidebar = page.getByTestId("persistent-sidebar");
  await sidebar.evaluate((node) =>
    node.setAttribute("data-instance", "original"),
  );
  const nav = page.getByRole("navigation", { name: "Menu chính" });
  for (const name of [
    "Upload chuyến đi",
    "Gallery & AI Search",
    "Cài đặt",
    "Lên kế hoạch du lịch",
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
  await expect(
    nav.getByRole("link", { name: "Lên kế hoạch du lịch", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(sidebar).toHaveAttribute("data-instance", "original");
});
test("draft media survives navigation; previews, durable save, reload and modal focus work", async ({
  signedIn: page,
}) => {
  await page.goto("/upload");
  await page.getByLabel("Tên chuyến đi", { exact: true }).fill("Ký ức Đà Lạt");
  await page.getByLabel("Địa điểm", { exact: true }).fill("Đà Lạt");
  await page.getByLabel("Ngày chuyến đi", { exact: true }).fill("2026-09-20");
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
  await page
    .getByRole("button", { name: "Xóa second.png", exact: true })
    .click();
  await expect(page.getByAltText("first.png", { exact: true })).toBeVisible();
  expect(
    await page
      .getByAltText("first.png", { exact: true })
      .evaluate(
        async (node) => (await fetch((node as HTMLImageElement).src)).ok,
      ),
  ).toBe(true);
  await page
    .getByRole("navigation", { name: "Menu chính" })
    .getByRole("link", { name: "Gallery & AI Search", exact: true })
    .click();
  await page
    .getByTestId("persistent-sidebar")
    .getByRole("link", { name: "Upload chuyến đi", exact: true })
    .click();
  await expect(
    page.getByText("Đã khôi phục bản nháp của bạn.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByAltText("first.png", { exact: true })).toBeVisible();
  await expect(page.getByText("second.png", { exact: true })).toHaveCount(0);
  await page
    .getByRole("button", { name: "Lưu chuyến đi", exact: true })
    .click();
  await expect(page).toHaveURL(/\/journey\/[^/]+$/);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Ký ức Đà Lạt", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Xem ảnh first.png", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "first.png", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "first.png", exact: true }),
  ).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Xem ảnh first.png", exact: true }),
  ).toBeFocused();
});
test("inline search handles accents, filters and URL state without mixing plans into Gallery", async ({
  signedIn: page,
}) => {
  await createJourney(page);
  await page.goto("/gallery");
  const search = page.getByRole("searchbox", {
    name: "Tìm kiếm ký ức",
    exact: true,
  });
  await search.fill("tim cafe Da Lat");
  await expect(
    page.getByRole("heading", { name: "Ký ức Đà Lạt", exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/q=/);
  await page.reload();
  await expect(search).toHaveValue("tim cafe Da Lat");
  await page.getByLabel("Lọc chủ đề", { exact: true }).selectOption("Cafe");
  await search.fill("không tồn tại");
  await expect(
    page.getByRole("heading", {
      name: "Chưa tìm thấy ký ức phù hợp.",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Xóa bộ lọc", exact: true })
    .first()
    .click();
  await expect(search).toHaveValue("");
  await expect(
    page.getByRole("heading", { name: "Ký ức Đà Lạt", exact: true }),
  ).toBeVisible();
});
test("journey editing, deletion and undo retain media after reload", async ({
  signedIn: page,
}) => {
  await createJourney(page, "Ký ức ban đầu", true);
  await page.getByRole("link", { name: "Chỉnh sửa", exact: true }).click();
  await page
    .getByLabel("Tên chuyến đi", { exact: true })
    .fill("Ký ức đã chỉnh");
  await page
    .getByLabel("Ghi chú", { exact: true })
    .fill("Một câu chuyện được viết lại.");
  await page.getByRole("button", { name: "Lưu thay đổi", exact: true }).click();
  await expect(page).toHaveURL(/\/journey\/[^/]+$/);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Ký ức đã chỉnh", exact: true }),
  ).toBeVisible();
  await expect(page.getByAltText("first.png", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Xóa chuyến đi", exact: true })
    .click();
  await expect(page).toHaveURL(/\/gallery$/);
  await expect(
    page.getByRole("heading", { name: "Ký ức đã chỉnh", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Hoàn tác", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Ký ức đã chỉnh", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Ký ức đã chỉnh/ }).click();
  await expect(page.getByAltText("first.png", { exact: true })).toBeVisible();
});
test("timeline does not invent a time; accessible tabs and map selection survive reload", async ({
  signedIn: page,
}) => {
  await createJourney(page, "Một ngày có ảnh", true);
  await page.getByRole("tab", { name: "Media", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Timeline", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByText("Chưa có giờ ghi nhận", { exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Bản đồ", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Vị trí Đà Lạt", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("tab", { name: "Bản đồ", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("button", { name: "Vị trí Đà Lạt", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("storage failures keep user input and never report a successful save", async ({
  signedIn: page,
}) => {
  await page.goto("/upload");
  await page.getByLabel("Tên chuyến đi", { exact: true }).fill("Không thể lưu");
  await page.getByLabel("Địa điểm", { exact: true }).fill("Hà Nội");
  await page
    .getByRole("button", { name: "+ Thêm ghi chú & vị trí", exact: true })
    .click();
  await page
    .getByLabel("Ghi chú", { exact: true })
    .fill("Giữ lại ghi chú thử.");
  await page.evaluate(() => {
    IDBFactory.prototype.open = () => {
      throw new DOMException("Blocked", "SecurityError");
    };
  });
  await page
    .getByRole("button", { name: "Lưu chuyến đi", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "Không thể mở bộ nhớ thiết bị",
  );
  await expect(page).toHaveURL(/\/upload$/);
  await expect(page.getByLabel("Ghi chú", { exact: true })).toHaveValue(
    "Giữ lại ghi chú thử.",
  );
});
test("dropzone accepts audio and rejects unsupported files without discarding accepted media", async ({
  signedIn: page,
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
  await page.getByLabel("Chọn media", { exact: true }).setInputFiles({
    name: "script.exe",
    mimeType: "application/octet-stream",
    buffer: Buffer.from("invalid"),
  });
  await expect(page.getByRole("alert")).toContainText("Không nhận: script.exe");
  await expect(page.getByText("recording.wav", { exact: true })).toBeVisible();
});
test("empty library, empty planner and unknown IDs never fall back to sample personal records", async ({
  signedIn: page,
}) => {
  await page.goto("/gallery");
  await expect(
    page.getByText("Chưa có chuyến đi nào.", { exact: false }),
  ).toBeVisible();
  await page.goto("/planner");
  await expect(
    page.getByText("Chưa có kế hoạch nào.", { exact: false }),
  ).toBeVisible();
  await page.goto("/journey/non-existent");
  await expect(
    page.getByRole("heading", {
      name: "Không tìm thấy chuyến đi.",
      exact: true,
    }),
  ).toBeVisible();
  await page.goto("/planner/non-existent");
  await expect(
    page.getByRole("heading", {
      name: "Không tìm thấy kế hoạch.",
      exact: true,
    }),
  ).toBeVisible();
});
test("mobile drawer restores focus, closes on navigation and pages never overflow", async ({
  signedIn: page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  for (const route of [
    "/",
    "/upload",
    "/planner",
    "/planner/new",
    "/gallery?q=cafe",
    "/settings",
  ]) {
    await page.goto(route);
    await expect(
      page.getByRole("button", { name: "Mở menu", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      route,
    ).toBe(true);
  }
  const open = page.getByRole("button", { name: "Mở menu", exact: true });
  await open.click();
  const menu = page.getByRole("dialog", { name: "Điều hướng", exact: true });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).not.toBeVisible();
  await expect(open).toBeFocused();
  await open.click();
  await menu
    .getByRole("link", { name: "Gallery & AI Search", exact: true })
    .click();
  await expect(page).toHaveURL(/\/gallery$/);
  await expect(menu).not.toBeVisible();
  await page.screenshot({
    path: "test-results/gallery-mobile.png",
    fullPage: true,
  });
});
