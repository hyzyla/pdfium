import { promises as fs } from "node:fs";

import { afterEach, expect, test, vi } from "vitest";

const CDN_URL = "https://cdn.jsdelivr.net/npm/@hyzyla/pdfium@0.0.1/dist/pdfium.wasm";

// A fresh copy of the entry, so each test starts without a downloaded wasm
async function importCdnEntry() {
  vi.resetModules();
  const { PDFiumLibrary } = await import("../src/index.esm.cdn");
  return PDFiumLibrary;
}

async function wasmResponse() {
  return new Response(await fs.readFile("src/vendor/pdfium.wasm"));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

test("downloads the wasm once and reuses it", async () => {
  const fetchMock = vi.fn(wasmResponse);
  vi.stubGlobal("fetch", fetchMock);
  const PDFiumLibrary = await importCdnEntry();

  const libraries = await Promise.all([
    PDFiumLibrary.init({ disableCDNWarning: true }),
    PDFiumLibrary.init({ disableCDNWarning: true }),
  ]);
  libraries.push(await PDFiumLibrary.init({ disableCDNWarning: true }));
  for (const library of libraries) {
    library.destroy();
  }

  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith(CDN_URL, {});
});

test("reports a failed download and tries again on the next call", async () => {
  const fetchMock = vi.fn(async () => new Response("Not found", { status: 404 }));
  vi.stubGlobal("fetch", fetchMock);
  const PDFiumLibrary = await importCdnEntry();

  await expect(PDFiumLibrary.init({ disableCDNWarning: true })).rejects.toThrow(
    `Failed to fetch ${CDN_URL} (HTTP 404)`,
  );

  fetchMock.mockImplementation(wasmResponse);
  const library = await PDFiumLibrary.init({ disableCDNWarning: true });
  library.destroy();
  expect(fetchMock).toHaveBeenCalledTimes(2);
});
