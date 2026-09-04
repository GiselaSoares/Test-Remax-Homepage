import { defineConfig } from "@playwright/test";
import { URL_INICIAL } from "./src/config.js";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  timeout: 60_000,
  use: {
    baseURL: URL_INICIAL,
    locale: "en-US",
    viewport: { width: 1280, height: 800 },
    screenshot: "only-on-failure",
    navigationTimeout: 45_000,
  },
});
