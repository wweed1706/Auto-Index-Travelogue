import { test, expect, createJourney, createPlan } from "./helpers";

test("home actions preserve the sidebar and search saved journeys in Gallery", async ({
  signedIn: page,
}) => {
  await createJourney(page, "Sáng cafe Đà Lạt", true);
  const planUrl = await createPlan(page);
  await page.goto("/");
  const stats = page.getByRole("region", { name: "Thống kê hành trình" });
  for (const label of ["Chuyến đi đã lưu", "Kế hoạch du lịch", "Khoảnh khắc"]) {
    await expect(
      stats
        .getByText(label, { exact: true })
        .locator("..")
        .getByText("01", { exact: true }),
    ).toBeVisible();
  }
  const sidebar = page.getByTestId("persistent-sidebar");
  await sidebar.evaluate((node) =>
    node.setAttribute("data-home-instance", "retained"),
  );
  await page
    .getByRole("link", { name: "Lên kế hoạch ngay", exact: true })
    .click();
  await expect(page).toHaveURL(/\/planner\/new$/);
  await expect(sidebar).toHaveAttribute("data-home-instance", "retained");
  await expect(
    sidebar.getByRole("link", { name: "Lên kế hoạch du lịch", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await sidebar
    .getByRole("navigation", { name: "Menu chính" })
    .getByRole("link", { name: "Trang chủ", exact: true })
    .click();
  await page.getByRole("link", { name: "Lưu chuyến đi", exact: true }).click();
  await expect(page).toHaveURL(/\/upload$/);
  await expect(
    sidebar.getByRole("link", { name: "Upload chuyến đi", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.goBack();
  const search = page.getByRole("search", { name: "Tìm kiếm trong Gallery" });
  await expect(
    search.getByRole("button", { name: "Tìm kiếm", exact: false }),
  ).toBeDisabled();
  await search
    .getByRole("searchbox", { name: "Tìm kiếm ký ức", exact: true })
    .fill("cafe Da Lat");
  await search.getByRole("button", { name: "Tìm kiếm", exact: false }).click();
  await expect(page).toHaveURL(/\/gallery\?q=cafe%20Da%20Lat$/);
  await expect(
    page.getByRole("heading", { name: "Sáng cafe Đà Lạt", exact: true }),
  ).toBeVisible();
  await expect(sidebar).toHaveAttribute("data-home-instance", "retained");
  await page.goto(planUrl);
  await expect(
    page.getByRole("heading", { name: "Hà Giang", exact: true }),
  ).toBeVisible();
  await expect(sidebar).toBeVisible();
});

test("home adapts to mobile and tablet without hiding its entry points", async ({
  signedIn: page,
}) => {
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        name: "Mỗi chuyến đi, một câu chuyện.",
        exact: true,
      }),
    ).toBeVisible();
    for (const name of [
      "Lên kế hoạch ngay",
      "Lưu chuyến đi",
      "Khám phá Gallery",
    ]) {
      await expect(
        page.getByRole("link", { name, exact: false }),
      ).toBeVisible();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      "home at " + width,
    ).toBe(true);
    await page.screenshot({
      path: "test-results/dashboard-" + width + ".png",
      fullPage: true,
      animations: "disabled",
    });
  }
});
