import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  root: resolve(__dirname),
  test: {
    globals: true,
    environment: "node",
    threads: false,
    isolate: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "json-summary"],
      include: ["04_packages/**/src/**/*.ts", "03_ee/**/src/**/*.ts", "05_apps/**/*.ts"],
      exclude: ["**/__tests__", "**/*.test.ts", "**/dist"],
    },
    include: [
      "04_packages/**/src/**/__tests__/**/*.test.ts",
      "03_ee/**/src/**/__tests__/**/*.test.ts",
      "05_apps/**/__tests__/**/*.test.ts",
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      // PatternLens dead structures retained per repo policy; covered by patternlens own test run.
      "05_apps/patternlens/__tests__",
      "05_apps/patternlens/tests",
      "05_apps/patternlens/silence-objects-voice-module",
      "05_apps/patternlens/ghost _patterns",
      "05_apps/patternlens/{src",
      // PatternLens src tests require app-specific aliases; run via pnpm --filter patternlens test.
      "05_apps/patternlens/src/**/*.test.ts",
      "05_apps/patternlens/src/**/*.test.tsx",
    ],
  },
  resolve: {
    alias: {
      "@silence": resolve(__dirname, "./04_packages/@silence"),
    },
  },
});
