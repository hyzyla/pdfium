import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { build, defineConfig } from "rolldown";
import { replacePlugin } from "rolldown/plugins";

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

const DIST_FOLDER = "dist";
const IS_PROD = process.env.NODE_ENV === "production";

// Matches the syntax already required by the emscripten-generated vendor code
const TARGET = "es2020";

const wasmFile = fs.readFileSync("src/vendor/pdfium.wasm");

// Start from a clean dist folder with the files that bundles don't produce
fs.rmSync(DIST_FOLDER, { recursive: true, force: true });
fs.mkdirSync(`${DIST_FOLDER}/vendor`, { recursive: true });
fs.copyFileSync("src/vendor/pdfium.wasm", `${DIST_FOLDER}/pdfium.wasm`);
for (const file of fs.globSync("src/vendor/*.d.ts")) {
  fs.copyFileSync(file, `${DIST_FOLDER}/vendor/${path.basename(file)}`);
}

function sha256Base64(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("base64");
}

// Edits the emscripten-generated vendor code before it's bundled, so the
// patterns match src/vendor/pdfium.esm.js as `npm run update:pdfium` writes it.
// Each edit throws when its pattern is gone, so a vendor update can't quietly
// undo it.
function patchVendor({ dropWasmUrl = false, allowShell = false } = {}) {
  // The package ships the wasm as pdfium.wasm
  const edits = [[/pdfium\.esm\.wasm/g, "pdfium.wasm"]];
  if (dropWasmUrl) {
    // The CDN and base64 entries always hand the wasm bytes to the vendor code,
    // so its fallback URL for pdfium.wasm is never used. Bundlers still see the
    // `new URL(..., import.meta.url)` pattern and copy pdfium.wasm into apps
    // that never load it, so swap it for a plain string.
    edits.push([/new URL\("pdfium\.wasm", import\.meta\.url\)\.href/, '"pdfium.wasm"']);
  }
  if (allowShell) {
    // The browser builds see any runtime without `window` or a worker scope as
    // an emscripten "shell" and refuse to start there. Given the wasm bytes,
    // they run fine in Node.js, Bun, Deno and Cloudflare Workers, so drop that
    // check.
    edits.push([/assert\(\s*!ENVIRONMENT_IS_SHELL,\s*"shell environment detected[^"]*",?\s*\);/, ""]);
  }
  return {
    name: "patch-vendor",
    transform: {
      filter: { id: /[\\/]vendor[\\/]pdfium\.esm\.js$/ },
      handler(code, id) {
        for (const [pattern, replacement] of edits) {
          if (code.search(pattern) === -1) {
            throw new Error(`Expected ${pattern} in ${id}, the vendor code has changed`);
          }
          code = code.replace(pattern, replacement);
        }
        return code;
      },
    },
  };
}

function injectDebugLog({ message }) {
  if (IS_PROD) {
    return null;
  }
  return {
    name: "inject-console-log",
    renderChunk(code) {
      return `${code}\nconsole.log("${message}");`;
    },
  };
}

function injectCdnVars() {
  return replacePlugin(
    {
      // For properly fetching the wasm file from CDN
      __PACKAGE_VERSION__: JSON.stringify(pkg.version),
      // For dev environment we don't care about integrity
      __WASM_SHA256_B64__: JSON.stringify(IS_PROD ? sha256Base64(wasmFile) : null),
    },
    { preventAssignment: true },
  );
}

function setNotNodeEnvironment() {
  return replacePlugin(
    {
      // Lets the bundler drop the Node.js code paths
      ENVIRONMENT_IS_NODE: "false",
    },
    { preventAssignment: true },
  );
}

// Builds the worker and inlines it into the worker client as a string constant,
// so PDFiumWorkerClient.spawn() can construct a Worker from a Blob URL with no
// extra files to ship. Building it here instead of in a separate config lets
// watch mode rebuild the client whenever a worker source changes.
function inlineWorker(input) {
  let source;
  return {
    name: "inline-worker",
    async buildStart() {
      const { output } = await build({
        input,
        platform: "browser",
        transform: { target: TARGET },
        write: false,
        output: { format: "es", codeSplitting: false },
        plugins: [patchVendor(), setNotNodeEnvironment()],
      });
      source = output[0].code;
      for (const id of output[0].moduleIds) {
        if (path.isAbsolute(id)) {
          this.addWatchFile(id);
        }
      }
    },
    renderChunk(code, chunk) {
      if (!code.includes("__WORKER_BUNDLE_SOURCE__")) {
        throw new Error(`Expected __WORKER_BUNDLE_SOURCE__ in ${chunk.fileName}`);
      }
      return code.replaceAll("__WORKER_BUNDLE_SOURCE__", () => JSON.stringify(source));
    },
  };
}

export default defineConfig([
  // CommonJS build
  {
    input: "src/index.cjs.ts",
    platform: "node",
    transform: { target: TARGET },
    output: {
      file: `${DIST_FOLDER}/index.cjs`,
      format: "cjs",
      exports: "named",
    },
    plugins: [injectDebugLog({ message: "PDFium CJS loaded" })],
  },
  // ES module build
  {
    input: "src/index.esm.ts",
    platform: "neutral",
    external: [/^node:/],
    transform: { target: TARGET },
    output: {
      file: `${DIST_FOLDER}/index.esm.js`,
      format: "es",
      exports: "named",
    },
    plugins: [injectDebugLog({ message: "PDFium ESM loaded" }), patchVendor()],
  },
  // ES (browser) build
  {
    input: "src/index.esm.ts",
    platform: "browser",
    transform: { target: TARGET },
    output: {
      file: `${DIST_FOLDER}/index.esm.browser.js`,
      format: "es",
      exports: "named",
    },
    plugins: [
      injectDebugLog({ message: "PDFium ESM browser loaded" }),
      patchVendor({ allowShell: true }),
      setNotNodeEnvironment(),
    ],
  },
  // ES (browser) + CDN build
  {
    input: "src/index.esm.cdn.ts",
    platform: "browser",
    transform: { target: TARGET },
    output: {
      file: `${DIST_FOLDER}/index.esm.cdn.js`,
      format: "es",
    },
    plugins: [
      injectDebugLog({ message: "PDFium with CDN loaded" }),
      patchVendor({ dropWasmUrl: true, allowShell: true }),
      setNotNodeEnvironment(),
      injectCdnVars(),
    ],
  },
  // ES (browser) + Base64 build
  {
    input: "src/index.esm.base64.ts",
    platform: "browser",
    transform: { target: TARGET },
    output: {
      dir: DIST_FOLDER,
      format: "es",
    },
    plugins: [
      injectDebugLog({ message: "PDFium with Base64 loaded" }),
      patchVendor({ dropWasmUrl: true, allowShell: true }),
      setNotNodeEnvironment(),
      replacePlugin(
        { __WASM_BINARY_BASE64__: JSON.stringify(wasmFile.toString("base64")) },
        { preventAssignment: true },
      ),
    ],
  },
  // Worker client, the main-thread entrypoint. The worker itself runs
  // src/worker/worker-entry.ts, which instantiates the wasm passed as
  // `wasmBinary`, or fetches it from `wasmUrl` using
  // `WebAssembly.instantiateStreaming` (with a fetch+compile fallback).
  {
    input: "src/index.esm.worker.ts",
    platform: "browser",
    transform: { target: TARGET },
    output: {
      file: `${DIST_FOLDER}/index.esm.worker.js`,
      format: "es",
      exports: "named",
    },
    plugins: [
      injectDebugLog({ message: "PDFium worker loaded" }),
      setNotNodeEnvironment(),
      inlineWorker("src/worker/worker-entry.ts"),
    ],
  },
]);
