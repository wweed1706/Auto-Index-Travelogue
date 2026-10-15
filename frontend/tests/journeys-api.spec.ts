import {
  test,
  expect,
  type Page,
  type APIRequestContext,
} from "@playwright/test";

const api = "http://127.0.0.1:8002/api";
const password = "JourneyApiTest2026!";
test("upload endpoint requires JWT and validates files", async ({ request }) => {
  const multipart = { file: { name: "test.txt", mimeType: "text/plain", buffer: Buffer.from("test") } };
  expect((await request.post(`${api}/upload`, { multipart })).status()).toBe(401);
  const headers = await account(request);
  expect((await request.post(`${api}/upload`, { headers, multipart })).status()).toBe(415);
  expect((await request.post(`${api}/upload`, { headers, multipart: {
    file: { name: "empty.png", mimeType: "image/png", buffer: Buffer.alloc(0) },
  } })).status()).toBe(400);
});
async function account(request: APIRequestContext) {
  const email = `journey-${crypto.randomUUID()}@example.com`;
  expect(
    (
      await request.post(`${api}/auth/register`, {
        data: { email, password, name: "Traveler" },
      })
    ).status(),
  ).toBe(201);
  const response = await request.post(`${api}/auth/login`, {
    data: { email, password },
  });
  const data = (await response.json()) as { access_token: string };
  return { Authorization: `Bearer ${data.access_token}` };
}
async function session(page: Page, headers: { Authorization: string }) {
  await page.addInitScript((token) => {
    localStorage.setItem("travelogue_access_token", token);
    // Journeys must still work if local IndexedDB is unavailable.
    indexedDB.open = () => {
      throw new Error("IndexedDB disabled by integration test");
    };
  }, headers.Authorization.slice(7));
}
async function fillJourney(page: Page, title: string) {
  await page.getByLabel("Tên chuyến đi", { exact: true }).fill(title);
  await page.getByLabel("Địa điểm", { exact: true }).fill("Đà Lạt");
  await page.getByLabel("Ngày chuyến đi", { exact: true }).fill("2026-10-15");
  await page
    .getByRole("button", { name: "+ Thêm ghi chú & vị trí", exact: true })
    .click();
  await page.getByLabel("Ghi chú", { exact: true }).fill("A real API journey");
}

test("create and delete via UI persist on server without IndexedDB; failed mutations keep state", async ({
  page,
  request,
}) => {
  const headers = await account(request);
  await session(page, headers);
  await page.goto("/upload");
  await fillJourney(page, "Server Journey");
  await page.route(`${api}/journeys`, (route) =>
    route.fulfill({ status: 503, body: "{}" }),
  );
  await page
    .getByRole("button", { name: "Lưu chuyến đi", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("Dịch vụ tạm thời");
  await expect(page.getByLabel("Tên chuyến đi", { exact: true })).toHaveValue(
    "Server Journey",
  );
  expect(
    await (await request.get(`${api}/journeys`, { headers })).json(),
  ).toEqual([]);
  await page.unroute(`${api}/journeys`);
  await page.route(`${api}/journeys`, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    await route.continue();
  });
  await page
    .getByRole("button", { name: "Lưu chuyến đi", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Đang xử lý…", exact: true }),
  ).toBeDisabled();
  await expect(page).toHaveURL(/\/journey\/[a-f0-9]{24}$/);
  const id = page.url().split("/").pop()!;
  const record = await request.get(`${api}/journeys/${id}`, { headers });
  expect(record.status()).toBe(200);
  expect(await record.json()).toMatchObject({
    id,
    title: "Server Journey",
    media: [],
  });
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Server Journey", exact: true }),
  ).toBeVisible();
  await page.goto("/gallery");
  await expect(
    page.getByRole("heading", { name: "Server Journey", exact: true }),
  ).toBeVisible();
  await page.route(`${api}/journeys/${id}`, (route) =>
    route.fulfill({ status: 503, body: "{}" }),
  );
  await page.getByRole("button", { name: /Xóa.*Server Journey/ }).click();
  await expect(page.getByRole("alert")).toContainText("Dịch vụ tạm thời");
  await expect(
    page.getByRole("heading", { name: "Server Journey", exact: true }),
  ).toBeVisible();
  await page.unroute(`${api}/journeys/${id}`);
  await page.getByRole("button", { name: /Xóa.*Server Journey/ }).click();
  await expect(
    page.getByRole("heading", { name: "Server Journey", exact: true }),
  ).toHaveCount(0);
  expect(
    (await request.get(`${api}/journeys/${id}`, { headers })).status(),
  ).toBe(404);
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: "Thư viện đang chờ câu chuyện của bạn.",
    }),
  ).toBeVisible();
});

test("upload retries preserve files and save returned media; editing remains unsupported", async ({ page, request }) => {
  const headers = await account(request);
  await session(page, headers);
  await page.goto("/upload");
  await fillJourney(page, "Uploaded journey");
  await page.getByLabel("Chọn media", { exact: true }).setInputFiles({
    name: "photo.png", mimeType: "image/png", buffer: Buffer.from("test image"),
  });
  let uploads = 0;
  await page.route(`${api}/upload`, async route => {
    uploads++;
    expect(route.request().headers()["authorization"]).toBe(headers.Authorization);
    expect(route.request().headers()["content-type"]).toContain("multipart/form-data; boundary=");
    await route.fulfill({ status: uploads === 1 ? 502 : 200, json: {
      url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      public_id: "travelogue/test-image", resource_type: "image",
    }});
  });
  const save = page.getByRole("button", { name: "Lưu chuyến đi", exact: true });
  await save.click();
  await expect(page.getByRole("alert")).toContainText("Không thể tải media");
  expect(await (await request.get(`${api}/journeys`, { headers })).json()).toEqual([]);
  await save.click();
  await expect(page).toHaveURL(/\/journey\/[a-f0-9]{24}$/);
  const saved = await (await request.get(`${api}/journeys`, { headers })).json();
  expect(saved[0].media[0]).toMatchObject({ id: "travelogue/test-image", kind: "image", name: "photo.png" });
  expect(uploads).toBe(2);
  let mutations = 0;
  page.on("request", req => {
    if (req.url().startsWith(`${api}/journeys`) && ["POST", "PUT", "PATCH"].includes(req.method())) mutations++;
  });
  const response = await request.post(`${api}/journeys`, {
    headers,
    data: {
      title: "Existing",
      location: "Vietnam",
      date: "2026-10-15",
      notes: "Original",
    },
  });
  const { id } = (await response.json()) as { id: string };
  await page.goto(`/journey/${id}/edit`);
  await expect(page.getByRole("alert")).toContainText(
    "API chưa hỗ trợ chỉnh sửa",
  );
  await page.getByLabel("Tên chuyến đi", { exact: true }).fill("Changed");
  await page.getByRole("button", { name: "Lưu thay đổi", exact: true }).click();
  expect(mutations).toBe(0);
  expect(
    await (await request.get(`${api}/journeys/${id}`, { headers })).json(),
  ).toMatchObject({ title: "Existing" });
});

test("server list loading and retry; another user cannot view journey", async ({
  page,
  request,
}) => {
  const owner = await account(request);
  const other = await account(request);
  const response = await request.post(`${api}/journeys`, {
    headers: owner,
    data: { title: "Private journey", location: "Vietnam", date: "2026-10-15" },
  });
  const { id } = (await response.json()) as { id: string };
  await session(page, other);
  await page.goto(`/journey/${id}`);
  await expect(
    page.getByRole("heading", { name: "Không tìm thấy chuyến đi." }),
  ).toBeVisible();
  await page.route(`${api}/journeys?*`, (route) =>
    route.fulfill({ status: 503, body: "{}" }),
  );
  await page.goto("/gallery");
  await expect(page.getByRole("alert")).toContainText("Dịch vụ tạm thời");
  await page.unroute(`${api}/journeys?*`);
  await page.route(`${api}/journeys?*`, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    await route.continue();
  });
  await page.getByRole("button", { name: "Thử lại" }).click();
  await expect(page.getByRole("status")).toContainText("Đang tải dữ liệu");
  await expect(
    page.getByRole("heading", {
      name: "Thư viện đang chờ câu chuyện của bạn.",
    }),
  ).toBeVisible();
});

test("list fetches every API page, including journeys older than the first 100", async ({
  page,
  request,
}) => {
  const headers = await account(request);
  for (let batch = 0; batch < 11; batch++) {
    await Promise.all(
      Array.from(
        { length: Math.min(10, 101 - batch * 10) },
        async (_, offset) => {
          const response = await request.post(`${api}/journeys`, {
            headers,
            data: {
              title: `Paginated ${batch * 10 + offset}`,
              location: "Vietnam",
              date: "2026-10-15",
              notes: "Pagination test",
            },
          });
          expect(response.status()).toBe(201);
        },
      ),
    );
  }
  await session(page, headers);
  const secondPage = page.waitForResponse((response) =>
    response.url().includes("/journeys?skip=100&limit=100"),
  );
  await page.goto("/gallery");
  expect((await secondPage).status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: /^Paginated \d+$/ }),
  ).toHaveCount(101);
});
