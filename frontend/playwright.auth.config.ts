import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig(base, {
  testMatch: ["auth-api.spec.ts", "journeys-api.spec.ts"],
  workers: 1,
  use: { baseURL: "http://127.0.0.1:4183" },
  webServer: {
    command:
      "node ./node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4183 --strictPort",
    url: "http://127.0.0.1:4183",
    reuseExistingServer: false,
    env: { VITE_API_URL: "http://127.0.0.1:8002/api" },
  },
});
