import {
  test,
  expect,
  register,
  createPlan,
  addActivity,
  png,
} from "./helpers";
test("v1 IndexedDB migration preserves Blob media and legacy activities and claims them once", async ({
  page,
}) => {
  await page.addInitScript(
    ({ encoded }) => {
      const ready = () => {
        (window as Window & { legacyReady?: boolean }).legacyReady = true;
      };
      const request = indexedDB.open("travelogue-local", 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore("journeys", { keyPath: "id" });
        request.result.createObjectStore("itineraries", { keyPath: "id" });
      };
      request.onerror = ready;
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(["journeys", "itineraries"], "readwrite");
        const blob = new Blob(
          [Uint8Array.from(atob(encoded), (char) => char.charCodeAt(0))],
          { type: "image/png" },
        );
        tx.objectStore("journeys").put({
          id: "legacy-journey",
          title: "Ký ức từ phiên bản cũ",
          location: "Đà Lạt",
          date: "2026-09-20",
          notes: "Ghi chú còn nguyên.",
          tags: ["Cafe"],
          createdAt: "2026-09-20T08:00:00Z",
          media: [
            { id: "legacy-photo", name: "legacy.png", kind: "image", blob },
          ],
        });
        tx.objectStore("itineraries").put({
          id: "legacy-plan",
          criteria: {
            destination: "Đà Lạt",
            startDate: "2026-09-20",
            endDate: "2026-09-20",
            budget: 3000000,
            travelers: 2,
            interests: ["Cafe"],
            dislikes: "",
          },
          createdAt: "2026-09-20T08:00:00Z",
          days: [
            {
              dayNumber: 1,
              date: "2026-09-20",
              title: "Ngày đầu",
              activities: [
                {
                  time: "08:00",
                  location: "Cà phê ngày cũ",
                  aiNote: "Giữ ghi chú này.",
                  cost: "50.000 đ",
                  duration: "1 giờ",
                },
              ],
            },
          ],
        });
        tx.oncomplete = () => {
          db.close();
          ready();
        };
      };
    },
    { encoded: png.toString("base64") },
  );
  await register(page);
  await page.goto("/journey/legacy-journey");
  await expect(
    page.getByRole("heading", { name: "Ký ức từ phiên bản cũ", exact: true }),
  ).toBeVisible();
  await expect(page.getByAltText("legacy.png", { exact: true })).toBeVisible();
  expect(
    await page
      .getByAltText("legacy.png", { exact: true })
      .evaluate(
        async (node) => (await fetch((node as HTMLImageElement).src)).ok,
      ),
  ).toBe(true);
  await page.goto("/planner/legacy-plan");
  await expect(
    page.getByRole("heading", { name: "Cà phê ngày cũ", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Giữ ghi chú này.", { exact: true }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("region", {
        name: "Lịch trình chi tiết theo từng ngày",
        exact: true,
      })
      .getByText("50.000 ₫ / người", { exact: true }),
  ).toBeVisible();
});
test("concurrent tabs merge durable itinerary mutations without losing an activity", async ({
  signedIn: page,
  context,
  pageErrors,
}) => {
  const url = await createPlan(page);
  const second = await context.newPage();
  second.on("pageerror", (error) => pageErrors.push(error.message));
  try {
    await second.goto(url);
    await expect(
      second.getByRole("heading", { name: "Hà Giang", exact: true }),
    ).toBeVisible();
    await Promise.all([
      addActivity(page, "Điểm dừng A", "08:00"),
      addActivity(second, "Điểm dừng B", "11:00"),
    ]);
    const itinerary = page.getByRole("region", {
      name: "Lịch trình chi tiết theo từng ngày",
      exact: true,
    });
    await expect(itinerary.getByRole("heading", { level: 3 })).toHaveText([
      "Điểm dừng A",
      "Điểm dừng B",
    ]);
    await page.reload();
    await expect(itinerary.getByRole("heading", { level: 3 })).toHaveText([
      "Điểm dừng A",
      "Điểm dừng B",
    ]);
  } finally {
    await second.close();
  }
});
