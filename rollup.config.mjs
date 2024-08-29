import fs from "node:fs";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import rollupReplace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import copyPlugin from "rollup-plugin-copy";
import deletePlugin from "rollup-plugin-delete";
import crypto from "node:crypto";

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

const DIST_FOLDER = "dist";
const EXTERNAL_NODE_PACKAGES = ["fs", "path", "crypto"];
const WASMB64_IMPORT = './pdfiumB64.js';
const IS_PROD = process.env.NODE_ENV === "production";

const ESM_SHIM = `
// -- Start Node ESM Shim --
import NODE_path from 'path';
import NODE_url from 'url';

var __NODE_FILENAME = undefined;
var __NODE_DIRNAME = undefined;

if (NODE_url && NODE_url.fileURLToPath && import.meta && import.meta.url) {
  __NODE_FILENAME = NODE_url.fileURLToPath(import.meta.url);
  __NODE_DIRNAME = NODE_path.dirname(__NODE_FILENAME);
}
// -- End Node ESM Shim --
`;

function nodeEsmShim() {
  return [
    {
      name: "esm-shim",
      renderChunk(code) {
        return ESM_SHIM + code;
      },
    },
    rollupReplace({
      preventAssignment: true,
      values: {
        __dirname: "__NODE_DIRNAME",
        __filename: "__NODE_FILENAME",
      },
    }),
  ];
}

function injectPackageVersion() {
  return rollupReplace({
    preventAssignment: true,
    values: {
      __PACKAGE_VERSION__: JSON.stringify(pkg.version),
    },
  });
}

function injectDebugLog({ message }) {
  return {
    name: "inject-console-log",
    renderChunk(code) {
      return `${code}\nconsole.log("${message}");`;
    },
  };
}

const wasmFile = fs.readFileSync("src/vendor/pdfium.wasm");
const wasmSHA256B64 = crypto.createHash("sha256").update(wasmFile).digest("base64");

function injectWasm() {
  return rollupReplace({
    preventAssignment: true,
    values: {
      __WASM_SHA265_B64__: JSON.stringify(wasmSHA256B64),
      __WASM_BINARY_B64__: JSON.stringify(wasmFile.toString("base64")),
    },
  });
}

export default [
  // CommonJS build
  {
    input: "src/index.ts",
    output: {
      name: "@hyzyla/pdfium",
      file: `${DIST_FOLDER}/index.cjs`,
      format: "cjs",
      exports: "named",
    },
    plugins: [
      deletePlugin({ targets: `${DIST_FOLDER}/*` }),
      !IS_PROD && injectDebugLog({ message: "PDFium CJS loaded" }),
      injectPackageVersion(),
      injectWasm(),
      resolve(),
      typescript(),
      commonjs({
        strictRequires: true,
        ignore: EXTERNAL_NODE_PACKAGES,
      }),
      copyPlugin({
        targets: [{ src: "src/vendor/pdfium.wasm", dest: DIST_FOLDER }],
      }),
    ],
    external: EXTERNAL_NODE_PACKAGES.concat(WASMB64_IMPORT),
  },
  // // ES module build
  {
    input: "src/index.ts",
    output: {
      name: "@hyzyla/pdfium",
      file: `${DIST_FOLDER}/index.esm.js`,
      format: "es",
      exports: "named",
    },
    plugins: [
      !IS_PROD && injectDebugLog({ message: "PDFium ESM loaded" }),
      ...nodeEsmShim(),
      injectPackageVersion(),
      injectWasm(),
      resolve(),
      typescript(),
      commonjs({
        strictRequires: false,
      }),
    ],
    external: [WASMB64_IMPORT],
  },
  // PDFium wasm base64
  {
    input: "src/pdfiumB64.ts",
    output: {
      name: "@hyzyla/pdfium",
      file: `${DIST_FOLDER}/pdfiumB64.js`,
      format: "es",
      exports: "named",
    },
    plugins: [
      !IS_PROD && injectDebugLog({ message: "PDFium B64 loaded" }),
      injectWasm(),
      typescript(),
    ],
  },
];
