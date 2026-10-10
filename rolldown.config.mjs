import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { defineConfig } from "rolldown";
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

function patchEsmPath() {
  // replace string like this "pdfium.esm.wasm" with "pdfium.wasm"
  return {
    name: "patch-esm-path",
    renderChunk(code) {
      return code.replace(/pdfium\.esm\.wasm/g, "pdfium.wasm");
    },
  };
}

// The CDN and base64 entries always hand the wasm bytes to the vendor code, so
// its fallback URL for pdfium.wasm is never used. Bundlers still see the
// `new URL(..., import.meta.url)` pattern and copy pdfium.wasm into apps that
// never load it, so swap it for a plain string.
function dropWasmUrl() {
  const pattern = 'new URL("pdfium.wasm", import.meta.url).href';
  return {
    name: "drop-wasm-url",
    renderChunk(code, chunk) {
      if (!chunk.isEntry) {
        return null;
      }
      if (!code.includes(pattern)) {
        throw new Error(`Expected ${pattern} in ${chunk.fileName}, the vendor code has changed`);
      }
      return code.replace(pattern, '"pdfium.wasm"');
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
      __WASM_SHA265_B64__: JSON.stringify(IS_PROD ? sha256Base64(wasmFile) : null),
    },
    { preventAssignment: true },
  );
}

function setNotNodeEnvironment() {
  return replacePlugin(
    {
      // This is helpefull for properly tree-shaking the node.js code
      ENVIRONMENT_IS_NODE: "false",
    },
    { preventAssignment: true },
  );
}

// Inlines the previously-built worker bundle into the worker client as a string
// constant, so PDFiumWorkerClient.spawn() can construct a Worker from a Blob URL
// with no extra files to ship. Runs on the rendered chunk, after TypeScript
// declarations are gone, and reads the bundle lazily because it's built by the
// previous config.
function injectWorkerBundle() {
  return {
    name: "inject-worker-bundle",
    renderChunk(code) {
      const source = fs.readFileSync(`${DIST_FOLDER}/worker.bundle.js`, "utf-8");
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
    plugins: [injectDebugLog({ message: "PDFium ESM loaded" }), patchEsmPath()],
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
    plugins: [injectDebugLog({ message: "PDFium ESM browser loaded" }), patchEsmPath(), setNotNodeEnvironment()],
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
      patchEsmPath(),
      dropWasmUrl(),
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
      patchEsmPath(),
      dropWasmUrl(),
      setNotNodeEnvironment(),
      replacePlugin(
        { __WASM_BINARY_BASE64__: JSON.stringify(wasmFile.toString("base64")) },
        { preventAssignment: true },
      ),
    ],
  },
  // Worker bundle — runs inside the spawned Web Worker. WASM is fetched from
  // the user-provided `wasmUrl` at init time using
  // `WebAssembly.instantiateStreaming` (with a fetch+compile fallback). Built
  // BEFORE the client below so it can be inlined as a string.
  {
    input: "src/worker/worker-entry.ts",
    platform: "browser",
    transform: { target: TARGET },
    output: {
      file: `${DIST_FOLDER}/worker.bundle.js`,
      format: "es",
      codeSplitting: false,
    },
    plugins: [patchEsmPath(), setNotNodeEnvironment()],
  },
  // Worker client — main-thread entrypoint. Inlines the worker bundle above so
  // users get a single-import `PDFiumWorkerClient.spawn({ wasmUrl })`.
  {
    input: "src/index.esm.worker.ts",
    platform: "browser",
    transform: { target: TARGET },
    output: {
      file: `${DIST_FOLDER}/index.esm.worker.js`,
      format: "es",
      exports: "named",
    },
    plugins: [injectDebugLog({ message: "PDFium worker loaded" }), setNotNodeEnvironment(), injectWorkerBundle()],
  },
]);
