import { test, expect, type Page } from "@playwright/test";

const api = "http://127.0.0.1:8002/api";
const tokenKey = "travelogue_access_token";
const password = "AuthFlowTest2026!";
const email = () => `auth-e2e-${crypto.randomUUID()}@example.com`;

async function fillLogin(page: Page, address: string, value = password) {
  await page.getByLabel("Email", { exact: true }).fill(address);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(value);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
}

test("register, restore with loading, logout and login back to protected URL", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const address = email();
  await page.goto("/register");
  await page.getByLabel("Tên hiển thị", { exact: true }).fill("API Traveler");
  await page.getByLabel("Email", { exact: true }).fill(address);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(password);
  await page.route(`${api}/auth/register`, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    await route.continue();
  });
  await page
    .getByRole("button", { name: "Tạo tài khoản", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Đang xử lý…" }),
  ).toBeDisabled();
  await expect(page).toHaveURL(/\/$/);
  const token = await page.evaluate(
    (key) => localStorage.getItem(key),
    tokenKey,
  );
  expect(token).toBeTruthy();
  const response = await page.request.get(`${api}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({
    email: address,
    name: "API Traveler",
  });
  await page.route(`${api}/auth/me`, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    await route.continue();
  });
  await page.reload();
  await expect(page.getByRole("status")).toContainText("Đang mở không gian");
  await expect(
    page.getByRole("button", { name: "Đăng xuất", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  expect(
    await page.evaluate((key) => localStorage.getItem(key), tokenKey),
  ).toBeNull();
  await page.goto("/gallery?q=memory#saved");
  await expect(page).toHaveURL(/\/login$/);
  await fillLogin(page, address);
  await expect(page).toHaveURL(/\/gallery\?q=memory#saved$/);
  expect(errors).toEqual([]);
});

test("duplicate email and wrong password render inline without redirect loops", async ({
  page,
  request,
}) => {
  const address = email();
  expect(
    (
      await request.post(`${api}/auth/register`, {
        data: { email: address, password },
      })
    ).status(),
  ).toBe(201);
  await page.goto("/register");
  await page.getByLabel("Tên hiển thị", { exact: true }).fill("Duplicate");
  await page.getByLabel("Email", { exact: true }).fill(address);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(password);
  await page
    .getByRole("button", { name: "Tạo tài khoản", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "Email này đã được sử dụng",
  );
  await page.getByRole("link", { name: "Đăng nhập", exact: true }).click();
  await fillLogin(page, address, "wrong-password");
  await expect(page.getByRole("alert")).toContainText(
    "Email hoặc mật khẩu không chính xác",
  );
  await expect(
    page.getByRole("button", { name: "Đăng nhập", exact: true }),
  ).toBeEnabled();
  await expect(page).toHaveURL(/\/login$/);
  expect(
    await page.evaluate((key) => localStorage.getItem(key), tokenKey),
  ).toBeNull();
});

test("invalid stored token is cleared and redirected to login", async ({
  page,
}) => {
  await page.addInitScript(
    (key) => localStorage.setItem(key, "invalid-token"),
    tokenKey,
  );
  await page.goto("/gallery");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("alert")).toContainText(
    "Phiên đăng nhập đã hết hạn",
  );
  expect(
    await page.evaluate((key) => localStorage.getItem(key), tokenKey),
  ).toBeNull();
});

test("server outage keeps stored token and shows retryable error", async ({
  page,
  request,
}) => {
  const address = email();
  await request.post(`${api}/auth/register`, {
    data: { email: address, password },
  });
  const response = await request.post(`${api}/auth/login`, {
    data: { email: address, password },
  });
  const { access_token: token } = (await response.json()) as {
    access_token: string;
  };
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    { key: tokenKey, value: token },
  );
  await page.route(`${api}/auth/me`, (route) =>
    route.fulfill({ status: 503, body: "{}" }),
  );
  await page.goto("/gallery");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("alert")).toContainText(
    "Dịch vụ tạm thời không khả dụng",
  );
  expect(
    await page.evaluate((key) => localStorage.getItem(key), tokenKey),
  ).toBe(token);
  await page.unroute(`${api}/auth/me`);
  await page.reload();
  await expect(page).toHaveURL(/\/gallery$/);
});

test("logout in another tab clears protected UI", async ({
  page,
  context,
  request,
}) => {
  const address = email();
  await request.post(`${api}/auth/register`, {
    data: { email: address, password },
  });
  await page.goto("/login");
  await fillLogin(page, address);
  await expect(page).toHaveURL(/\/$/);
  const second = await context.newPage();
  await second.goto("/gallery");
  await expect(
    second.getByRole("button", { name: "Đăng xuất", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
  await expect(second).toHaveURL(/\/login$/);
});

test("401 during an active session clears the token and redirects", async ({
  page,
  request,
}) => {
  const address = email();
  await request.post(`${api}/auth/register`, {
    data: { email: address, password },
  });
  await page.goto("/login");
  await fillLogin(page, address);
  await expect(page).toHaveURL(/\/$/);
  await page.evaluate(async (key) => {
    localStorage.setItem(key, "invalid-token");
    const modulePath = "/src/services/api.ts";
    const client = (await import(modulePath)) as {
      apiRequest: (path: string) => Promise<unknown>;
    };
    await client.apiRequest("/auth/me").catch(() => undefined);
  }, tokenKey);
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("alert")).toContainText(
    "Phiên đăng nhập đã hết hạn",
  );
  expect(
    await page.evaluate((key) => localStorage.getItem(key), tokenKey),
  ).toBeNull();
});
