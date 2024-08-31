/**
 * Export everything from index.ts, but override the PDFiumLibrary class with a new one that uses a
 * wasm binary from a CDN
 */
export * from "./index";

import { PDFiumLibrary as _PDFiumLibrary } from "./library";
import vendor from "./vendor/pdfium.esm";

// This global variable is defined by Rollup at build time
declare const __PACKAGE_VERSION__: string;
declare const __WASM_SHA265_B64__: string;

const CDN_WASM_LINK = `https://cdn.jsdelivr.net/npm/@hyzyla/pdfium@${__PACKAGE_VERSION__}/dist/pdfium.wasm`;
const WASM_INTEGRITY = `sha256-${__WASM_SHA265_B64__}`;
const CDN_WARNING = `
@hyzyla/pdfium: The PDFium WASM binary is loaded from a CDN. This may be slower than loading the binary from the local server. You can disable this warning by setting the 'disableCDNWarning' option to 'true' when calling PDFiumLibrary.init().
`;

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
    const response = await fetch(CDN_WASM_LINK, { integrity: WASM_INTEGRITY });
    const wasmBinary = await response.arrayBuffer();
    return await _PDFiumLibrary.initBase({
      vendor: vendor,
      wasmBinary: wasmBinary,
    });
  }
}
