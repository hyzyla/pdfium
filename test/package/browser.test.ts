import fs from "node:fs";
import path from "node:path";

import { type Browser, chromium, firefox, webkit } from "playwright-core";
import { build, preview, type PreviewServer } from "vite";
import { afterAll, beforeAll, describe, expect, inject, test } from "vitest";
import webpack from "webpack";

import pkg from "../../package.json" with { type: "json" };

const dir = inject("packageDir");

// Each bundler builds the fixture page into a folder that can be served as is,
// and returns that folder with the page to open in it
const bundlers = {
  async vite() {
    await build({ root: dir, configFile: false, logLevel: "error", build: { outDir: "www-vite" } });
    return { outDir: path.join(dir, "www-vite"), page: "index.html" };
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
    return { outDir, page: "index.html" };
  },
  // No bundler at all, the page loads the published files through an import map
  async unbundled() {
    return { outDir: dir, page: "unbundled.html" };
  },
};

// Chrome is the one installed on the machine. Firefox and WebKit (the engine
// behind Safari) are Playwright's builds: npx playwright-core install firefox webkit
const browserTypes = {
  chrome: () => chromium.launch({ channel: "chrome" }),
  firefox: () => firefox.launch(),
  webkit: () => webkit.launch(),
};

type BrowserName = keyof typeof browserTypes;

// All of them unless TEST_BROWSERS lists a subset, e.g. TEST_BROWSERS=chrome
const browserNames = (process.env.TEST_BROWSERS?.split(",") ?? Object.keys(browserTypes)) as BrowserName[];
const browsers: Partial<Record<BrowserName, Browser>> = {};

beforeAll(async () => {
  for (const name of browserNames) {
    browsers[name] = await browserTypes[name]();
  }
});

afterAll(async () => {
  await Promise.all(Object.values(browsers).map((browser) => browser.close()));
});

// Bundles the fixture page like an app depending on the package would and
// runs it in each browser. The CDN entry's wasm request is answered with the
// packed pdfium.wasm, which also checks the integrity hash baked into it.
describe.for(Object.keys(bundlers) as (keyof typeof bundlers)[])("%s", (bundler) => {
  let server: PreviewServer;
  let url: string;

  beforeAll(async () => {
    const { outDir, page } = await bundlers[bundler]();
    server = await preview({ root: dir, configFile: false, logLevel: "error", build: { outDir } });
    url = new URL(page, server.resolvedUrls!.local[0]).href;
  });

  afterAll(async () => {
    await server?.close();
  });

  describe.for(browserNames)("%s", (browserName) => {
    let results: Record<string, unknown>;
    let failures: Record<string, string>;
    let workerView: unknown;
    const cdnRequests: string[] = [];

    beforeAll(async () => {
      const page = await browsers[browserName]!.newPage();
      await page.route("https://cdn.jsdelivr.net/**", (route) => {
        cdnRequests.push(route.request().url());
        return route.fulfill({
          path: path.join(dir, "node_modules/@hyzyla/pdfium/dist/pdfium.wasm"),
          contentType: "application/wasm",
          headers: { "access-control-allow-origin": "*" },
        });
      });
      await page.goto(url);
      const handle = await page.waitForFunction(() => (window as { results?: Record<string, unknown> }).results);
      results = (await handle.jsonValue())!;
      failures = await page.evaluate(() => (window as unknown as { failures: Record<string, string> }).failures);
      workerView = await page.evaluate(() => (window as unknown as { workerView: unknown }).workerView);
      await page.close();
    });

    test.for(["@hyzyla/pdfium", "@hyzyla/pdfium/browser/cdn", "@hyzyla/pdfium/inline", "@hyzyla/pdfium/worker"])(
      "%s matches the source build",
      (entry) => {
        expect(results[entry]).toEqual(inject("expected"));
      },
    );

    test.for(["@hyzyla/pdfium", "@hyzyla/pdfium/worker"])(
      "%s fails with an error when the wasm is missing",
      (entry) => {
        // An error, not "timed out" or "resolved". The wording differs per browser.
        expect(failures[entry]).toMatch(/^\w*Error\b/);
      },
    );

    test("worker client leaves the rest of a shared buffer alone", () => {
      expect(workerView).toEqual({ pageCount: 4, sharedBufferDetached: false });
    });

    test("CDN entry fetches the wasm of this package version", () => {
      expect(cdnRequests).toEqual([`https://cdn.jsdelivr.net/npm/@hyzyla/pdfium@${pkg.version}/dist/pdfium.wasm`]);
    });
  });
});
