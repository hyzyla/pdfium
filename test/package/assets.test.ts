import fs from "node:fs";
import path from "node:path";

import { build, type Rolldown } from "vite";
import { expect, inject, test } from "vitest";

const dir = inject("packageDir");

// Only the main entry may load pdfium.wasm from a URL. The others embed the
// wasm, fetch it from a CDN or take a URL from the app, so bundling one of them
// must not copy pdfium.wasm into the app.
test.for(["@hyzyla/pdfium/browser/cdn", "@hyzyla/pdfium/browser/base64", "@hyzyla/pdfium/worker"])(
  "bundling %s doesn't emit pdfium.wasm",
  async (entry) => {
    const input = path.join(dir, `${entry.replaceAll("/", "-")}.js`);
    fs.writeFileSync(input, `import * as pdfium from "${entry}";\nconsole.log(pdfium);\n`);

    const result = (await build({
      root: dir,
      configFile: false,
      logLevel: "error",
      build: { write: false, rolldownOptions: { input } },
    })) as Rolldown.RolldownOutput;

    const files = result.output.map((file) => file.fileName);
    expect(files.filter((file) => file.endsWith(".wasm"))).toEqual([]);
  },
);
