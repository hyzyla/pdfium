import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 10000,
    projects: [
      {
        extends: true,
        test: { name: "unit", include: ["test/*.test.ts"] },
      },
      {
        // Runs against the packed dist/, so build first
        extends: true,
        test: {
          name: "package",
          include: ["test/package/*.test.ts"],
          globalSetup: ["test/package/setup.ts"],
          testTimeout: 30000,
          // Launching Chrome and bundling the fixture page are slow on CI runners
          hookTimeout: 60000,
        },
      },
    ],
  },
  define: {
    __PACKAGE_VERSION__: JSON.stringify("0.0.1"),
    __WASM_SHA265_B64__: "null",
  },
});
