/**
 * Export everything from index.ts, but override the PDFiumLibrary class with a new one that uses a
 * wasm binary from a CDN
 */
export * from "./index.js";

import { PDFiumLibrary as _PDFiumLibrary } from "./library.js";
import vendor from "./vendor/pdfium.esm.js";

// This global variable is defined by Rollup at build time
declare const __PACKAGE_VERSION__: string;
declare const __WASM_SHA265_B64__: string | null;

const CDN_WASM_LINK = `https://cdn.jsdelivr.net/npm/@hyzyla/pdfium@${__PACKAGE_VERSION__}/dist/pdfium.wasm`;
const WASM_INTEGRITY = __WASM_SHA265_B64__ ? `sha256-${__WASM_SHA265_B64__}` : null;

const CDN_WARNING =
  "@hyzyla/pdfium: Fetching wasm binary from a CDN.\n" +
  "\n" +
  `This can lead to slower load time or potential network issues. Use "@hyzyla/pdfium" with a local wasm binary ` +
  "for better performance and reliability. You can also disable this warning by passing { disableCDNWarning: true } " +
  "to PDFiumLibrary.init() method";

export class PDFiumLibrary extends _PDFiumLibrary {
  static _cache: ArrayBuffer | null = null;

  static async init(options?: { disableCDNWarning?: boolean }) {
    if (!options?.disableCDNWarning) {
      console.warn(CDN_WARNING);
    }
    if (PDFiumLibrary._cache) {
      return await _PDFiumLibrary.initBase({
        vendor: vendor,
        wasmBinary: PDFiumLibrary._cache,
      });
    }
    const fetchOptions = WASM_INTEGRITY ? { integrity: WASM_INTEGRITY } : {};
    const response = await fetch(CDN_WASM_LINK, fetchOptions);
    const wasmBinary = await response.arrayBuffer();
    return await _PDFiumLibrary.initBase({
      vendor: vendor,
      wasmBinary: wasmBinary,
    });
  }
}
