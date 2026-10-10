/**
 * Browser entry point that downloads pdfium.wasm for this package version from jsDelivr. Exports
 * everything from index.ts plus a PDFiumLibrary that needs no options.
 */
export * from "./index.js";

import { PDFiumLibrary as _PDFiumLibrary } from "./library.js";
import PDFiumModule from "./vendor/pdfium.esm.js";

// Replaced at build time, see rolldown.config.mjs
declare const __PACKAGE_VERSION__: string;
declare const __WASM_SHA256_B64__: string | null;

const CDN_WASM_LINK = `https://cdn.jsdelivr.net/npm/@hyzyla/pdfium@${__PACKAGE_VERSION__}/dist/pdfium.wasm`;
const WASM_INTEGRITY = __WASM_SHA256_B64__ ? `sha256-${__WASM_SHA256_B64__}` : null;

const CDN_WARNING =
  "@hyzyla/pdfium: Fetching wasm binary from a CDN.\n" +
  "\n" +
  `This can lead to slower load time or potential network issues. Use "@hyzyla/pdfium" with a local wasm binary ` +
  "for better performance and reliability. You can also disable this warning by passing { disableCDNWarning: true } " +
  "to PDFiumLibrary.init() method";

async function fetchWasmBinary(): Promise<ArrayBuffer> {
  const response = await fetch(CDN_WASM_LINK, WASM_INTEGRITY ? { integrity: WASM_INTEGRITY } : {});
  if (!response.ok) {
    throw new Error(`@hyzyla/pdfium: Failed to fetch ${CDN_WASM_LINK} (HTTP ${response.status})`);
  }
  return await response.arrayBuffer();
}

// One download shared by every init() call. After a failure the next call tries again.
let wasmDownload: Promise<ArrayBuffer> | null = null;

export class PDFiumLibrary extends _PDFiumLibrary {
  static async init(options?: { disableCDNWarning?: boolean }) {
    if (!options?.disableCDNWarning) {
      console.warn(CDN_WARNING);
    }
    wasmDownload ??= fetchWasmBinary().catch((error: unknown) => {
      wasmDownload = null;
      throw error;
    });
    return await PDFiumLibrary.initBase({
      vendor: PDFiumModule,
      wasmBinary: await wasmDownload,
    });
  }
}

export { PDFiumModule };
