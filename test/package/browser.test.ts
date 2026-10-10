import fs from "node:fs";
import path from "node:path";

import { type Browser, chromium } from "playwright-core";
import { build, preview, type PreviewServer } from "vite";
import { afterAll, beforeAll, describe, expect, inject, test } from "vitest";
import webpack from "webpack";

import pkg from "../../package.json" with { type: "json" };

const dir = inject("packageDir");

// Each bundler builds the fixture page into a folder that can be served as is
const bundlers = {
  async vite() {
    await build({ root: dir, configFile: false, logLevel: "error", build: { outDir: "www-vite" } });
    return path.join(dir, "www-vite");
  },
  async webpack() {
    const outDir = path.join(dir, "www-webpack");
    const stats = await new Promise<webpack.Stats>((resolve, reject) => {
      webpack(
        {
          mode: "production",
          context: dir,
          entry: "./webpack.js",
          output: { path: outDir },
          performance: { hints: false },
        },
        (error, result) => (error ? reject(error) : resolve(result!)),
      );
    });
    // Warnings would show up in every webpack app using the package
    if (stats.hasErrors() || stats.hasWarnings()) {
      throw new Error(stats.toString("errors-warnings"));
    }
    fs.writeFileSync(path.join(outDir, "index.html"), '<!doctype html><script src="main.js"></script>');
    return outDir;
  },
};

let browser: Browser;

beforeAll(async () => {
  browser = await chromium.launch({ channel: "chrome" });
});

afterAll(async () => {
  await browser?.close();
});

// Bundles the fixture page like an app depending on the package would and
// runs it in Chrome. The CDN entry's wasm request is answered with the packed
// pdfium.wasm, which also checks the integrity hash baked into it.
describe.for(Object.keys(bundlers) as (keyof typeof bundlers)[])("%s", (bundler) => {
  let server: PreviewServer;
  let results: Record<string, unknown>;
  let failures: Record<string, string>;
  const cdnRequests: string[] = [];

  beforeAll(async () => {
    const outDir = await bundlers[bundler]();
    server = await preview({ root: dir, configFile: false, logLevel: "error", build: { outDir } });

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
    const handle = await page.waitForFunction(() => (window as { results?: Record<string, unknown> }).results);
    results = (await handle.jsonValue())!;
    failures = await page.evaluate(() => (window as unknown as { failures: Record<string, string> }).failures);
    await page.close();
  });

  afterAll(async () => {
    await server?.close();
  });

  test.for(["@hyzyla/pdfium", "@hyzyla/pdfium/browser/cdn", "@hyzyla/pdfium/browser/base64", "@hyzyla/pdfium/worker"])(
    "%s matches the source build",
    (entry) => {
      expect(results[entry]).toEqual(inject("expected"));
    },
  );

  test.for(["@hyzyla/pdfium", "@hyzyla/pdfium/worker"])("%s fails with an error when the wasm is missing", (entry) => {
    // Not "timed out" or "resolved", but the error from compiling the wasm
    expect(failures[entry]).toMatch(/WebAssembly/);
  });

  test("CDN entry fetches the wasm of this package version", () => {
    expect(cdnRequests).toEqual([`https://cdn.jsdelivr.net/npm/@hyzyla/pdfium@${pkg.version}/dist/pdfium.wasm`]);
  });
});
