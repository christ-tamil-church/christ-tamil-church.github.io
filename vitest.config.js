import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.js";

// Unit tests run against the same Vite pipeline as the app (React plugin,
// CSS and image imports), in jsdom unless a file opts into another environment.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      include: ["tests/unit/**/*.test.{ts,tsx}"],
      setupFiles: ["tests/unit/setup.ts"]
    }
  })
);
