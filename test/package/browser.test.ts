import path from "node:path";

import { type Browser, chromium } from "playwright-core";
import { build, preview, type PreviewServer } from "vite";
import { afterAll, beforeAll, expect, inject, test } from "vitest";

import pkg from "../../package.json" with { type: "json" };

const dir = inject("packageDir");

let browser: Browser;
let server: PreviewServer;
let results: Record<string, unknown>;
const cdnRequests: string[] = [];

// Bundles the fixture page with Vite, like an app depending on the package
// would, and runs it in Chrome. The CDN entry's wasm request is answered with
// the packed pdfium.wasm, which also checks the integrity hash baked into it.
beforeAll(async () => {
  const config = { root: dir, configFile: false as const, logLevel: "error" as const };
  await build({ ...config, build: { outDir: "www" } });
  server = await preview({ ...config, build: { outDir: "www" } });

  browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage();
  await page.route("https://cdn.jsdelivr.net/**", (route) => {
    cdnRequests.push(route.request().url());
    return route.fulfill({
      path: path.join(dir, "node_modules/@hyzyla/pdfium/dist/pdfium.wasm"),
      contentType: "application/wasm",
      headers: { "access-control-allow-origin": "*" },
    });
  });
  await page.goto(server.resolvedUrls!.local[0]);
  results = await page.waitForFunction(() => (window as { results?: unknown }).results).then((r) => r.jsonValue());
}, 60000);

afterAll(async () => {
  await browser?.close();
  await server?.close();
});

test.for(["@hyzyla/pdfium", "@hyzyla/pdfium/browser/cdn", "@hyzyla/pdfium/browser/base64", "@hyzyla/pdfium/worker"])(
  "%s matches the source build",
  (entry) => {
    expect(results[entry]).toEqual(inject("expected"));
  },
);

test("CDN entry fetches the wasm of this package version", () => {
  expect(cdnRequests).toEqual([`https://cdn.jsdelivr.net/npm/@hyzyla/pdfium@${pkg.version}/dist/pdfium.wasm`]);
});
