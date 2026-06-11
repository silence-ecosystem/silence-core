import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    threads: false,
    isolate: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json"],
      include: ["04_packages/**/src/**/*.ts", "03_ee/**/src/**/*.ts"],
      exclude: ["**/__tests__", "**/*.test.ts", "**/dist"],
    },
    include: ["04_packages/**/src/**/__tests__/**/*.test.ts", "03_ee/**/src/**/__tests__/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@silence": resolve(__dirname, "./04_packages/@silence"),
    },
  },
});
