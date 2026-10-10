import { expect, inject, test } from "vitest";

// Everything npm publishes. Run with -u after adding or removing files on purpose.
test("published files", () => {
  const files = inject("packedFiles")
    .map((file) => file.replace(/\.base64-[\w-]+\.js$/, ".base64-[hash].js"))
    .sort();
  expect(files).toMatchInlineSnapshot(`
    [
      "LICENSE.md",
      "README.md",
      "dist/document.d.cts",
      "dist/document.d.ts",
      "dist/index.cjs",
      "dist/index.cjs.d.cts",
      "dist/index.d.cts",
      "dist/index.d.ts",
      "dist/index.esm.base64.d.ts",
      "dist/index.esm.base64.js",
      "dist/index.esm.browser.js",
      "dist/index.esm.cdn.d.ts",
      "dist/index.esm.cdn.js",
      "dist/index.esm.d.ts",
      "dist/index.esm.js",
      "dist/index.esm.worker.d.ts",
      "dist/index.esm.worker.js",
      "dist/library.d.cts",
      "dist/library.d.ts",
      "dist/objects.d.cts",
      "dist/objects.d.ts",
      "dist/objects.types.d.cts",
      "dist/objects.types.d.ts",
      "dist/page.d.cts",
      "dist/page.d.ts",
      "dist/page.types.d.cts",
      "dist/page.types.d.ts",
      "dist/pdfium.wasm",
      "dist/pdfium.wasm.base64-[hash].js",
      "dist/types.d.cts",
      "dist/types.d.ts",
      "dist/vendor/pdfium.d.cts",
      "dist/vendor/pdfium.d.ts",
      "dist/vendor/pdfium.esm.d.ts",
      "dist/worker/client-base.d.ts",
      "dist/worker/protocol.d.ts",
      "package.json",
    ]
  `);
});
