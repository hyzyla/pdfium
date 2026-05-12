import crypto from "node:crypto";
import fs from "node:fs";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import rollupReplace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import copyPlugin from "rollup-plugin-copy";
import deletePlugin from "rollup-plugin-delete";

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

const DIST_FOLDER = "dist";
const EXTERNAL_NODE_PACKAGES = ["fs", "path", "crypto"];
const IS_PROD = process.env.NODE_ENV === "production";

const wasmFile = fs.readFileSync("src/vendor/pdfium.wasm");

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

async function injectCdnVars() {
  if (IS_PROD) {
    const wasmSHA256B64 = sha256Base64(wasmFile);
    return rollupReplace({
      preventAssignment: true,
      values: {
        // For properly fetching the wasm file from CDN
        __PACKAGE_VERSION__: JSON.stringify(pkg.version),
        __WASM_SHA265_B64__: JSON.stringify(wasmSHA256B64),
      },
    });
  }

  // For dev environent we don't care about integrity
  return rollupReplace({
    preventAssignment: true,
    values: {
      __PACKAGE_VERSION__: JSON.stringify(pkg.version),
      __WASM_SHA265_B64__: JSON.stringify(null),
    },
  });
}

function setNotNodeEnvironment() {
  return rollupReplace({
    preventAssignment: true,
    values: {
      // This is helpefull for properly tree-shaking the node.js code
      ENVIRONMENT_IS_NODE: "false",
    },
  });
}

// Inlines the previously-built worker bundle into the worker client as a string
// constant, so PDFiumWorkerClient.spawn() can construct a Worker from a Blob URL
// with no extra files to ship.
function injectWorkerBundle() {
  return rollupReplace({
    preventAssignment: true,
    delimiters: ["", ""],
    values: {
      __WORKER_BUNDLE_SOURCE__: () => {
        const source = fs.readFileSync(`${DIST_FOLDER}/worker.bundle.js`, "utf-8");
        return JSON.stringify(source);
      },
    },
  });
}

export default [
  // CommonJS build
  {
    input: "src/index.cjs.ts",
    output: {
      name: "@hyzyla/pdfium",
      file: `${DIST_FOLDER}/index.cjs`,
      format: "cjs",
      exports: "named",
    },
    plugins: [
      deletePlugin({ targets: `${DIST_FOLDER}/*` }),
      copyPlugin({
        targets: [
          { src: "src/vendor/pdfium.wasm", dest: DIST_FOLDER },
          { src: "src/vendor/*.d.ts", dest: `${DIST_FOLDER}/vendor` },
        ],
      }),
      injectDebugLog({ message: "PDFium CJS loaded" }),
      resolve(),
      typescript(),
      commonjs({
        strictRequires: true,
        ignore: EXTERNAL_NODE_PACKAGES,
      }),
    ],
    external: EXTERNAL_NODE_PACKAGES,
  },
  // ES module build
  {
    input: "src/index.esm.ts",
    output: {
      name: "@hyzyla/pdfium",
      file: `${DIST_FOLDER}/index.esm.js`,
      format: "es",
      exports: "named",
    },
    plugins: [injectDebugLog({ message: "PDFium ESM loaded" }), patchEsmPath(), resolve(), typescript()],
  },
  // ES (browser) build
  {
    input: "src/index.esm.ts",
    output: {
      name: "@hyzyla/pdfium",
      file: `${DIST_FOLDER}/index.esm.browser.js`,
      format: "es",
      exports: "named",
    },
    plugins: [
      injectDebugLog({ message: "PDFium ESM browser loaded" }),
      patchEsmPath(),
      setNotNodeEnvironment(),
      resolve(),
      typescript(),
    ],
  },
  // ES (browser) + CDN build
  {
    input: "src/index.esm.cdn.ts",
    output: {
      name: "PDFium",
      file: `${DIST_FOLDER}/index.esm.cdn.js`,
      format: "es",
    },
    plugins: [
      injectDebugLog({ message: "PDFium with CDN loaded" }),
      patchEsmPath(),
      setNotNodeEnvironment(),
      await injectCdnVars(),
      resolve(),
      typescript(),
    ],
  },
  // ES (browser) + Base64 build
  {
    input: "src/index.esm.base64.ts",
    output: {
      name: "PDFium",
      dir: DIST_FOLDER,
      format: "es",
    },
    plugins: [
      injectDebugLog({ message: "PDFium with Base64 loaded" }),
      patchEsmPath(),
      setNotNodeEnvironment(),
      rollupReplace({
        preventAssignment: true,
        values: {
          __WASM_BINARY_BASE64__: JSON.stringify(wasmFile.toString("base64")),
        },
      }),
      resolve(),
      typescript(),
    ],
  },
  // Worker bundle — runs inside the spawned Web Worker. WASM is fetched from
  // the user-provided `wasmUrl` at init time using
  // `WebAssembly.instantiateStreaming` (with a fetch+compile fallback). Built
  // BEFORE the client below so it can be inlined as a string.
  {
    input: "src/worker/worker-entry.ts",
    output: {
      file: `${DIST_FOLDER}/worker.bundle.js`,
      format: "es",
      inlineDynamicImports: true,
    },
    plugins: [patchEsmPath(), setNotNodeEnvironment(), resolve(), typescript()],
  },
  // Worker client — main-thread entrypoint. Inlines the worker bundle above so
  // users get a single-import `PDFiumWorkerClient.spawn({ wasmUrl })`.
  {
    input: "src/index.esm.worker.ts",
    output: {
      name: "PDFium",
      file: `${DIST_FOLDER}/index.esm.worker.js`,
      format: "es",
      exports: "named",
    },
    plugins: [
      injectDebugLog({ message: "PDFium worker loaded" }),
      setNotNodeEnvironment(),
      injectWorkerBundle(),
      resolve(),
      typescript(),
    ],
  },
];
