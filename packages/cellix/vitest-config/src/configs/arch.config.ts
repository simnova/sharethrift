import { defineConfig } from "vitest/config";

export const archConfig = defineConfig({
  test: {
    globals: true,
    environment: "node",
    testTimeout: 30000,
    include: ["src/arch-unit-tests/**/*.test.ts"],
  },
});
