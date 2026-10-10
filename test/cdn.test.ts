import { promises as fs } from "node:fs";

import { afterEach, expect, test, vi } from "vitest";

import { PDFiumLibrary } from "../src/index.esm.cdn";

const CDN_URL = "https://cdn.jsdelivr.net/npm/@hyzyla/pdfium@0.0.1/dist/pdfium.wasm";

afterEach(() => {
  vi.unstubAllGlobals();
  PDFiumLibrary._cache = null;
});

test("downloads the wasm once and reuses it", async () => {
  const wasm = await fs.readFile("src/vendor/pdfium.wasm");
  const fetchMock = vi.fn(async () => new Response(wasm));
  vi.stubGlobal("fetch", fetchMock);

  for (let i = 0; i < 2; i++) {
    const library = await PDFiumLibrary.init({ disableCDNWarning: true });
    library.destroy();
  }

  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith(CDN_URL, {});
});

test("reports a failed download", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response("Not found", { status: 404 })),
  );

  await expect(PDFiumLibrary.init({ disableCDNWarning: true })).rejects.toThrow(
    `Failed to fetch ${CDN_URL} (HTTP 404)`,
  );
});
