import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 10000,


  },
  define: {
    __PACKAGE_VERSION__: JSON.stringify("0.0.1"),
  }
});
