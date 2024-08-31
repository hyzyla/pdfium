/**
 * Export everything from index.ts, but override the PDFiumLibrary class with a new one that uses a
 * base64-encoded WASM binary. Having a separate file for this is useful because bundlers do not need
 * to include the base64-encoded WASM binary in the main bundle when the user does not use the
 * base64-encoded WASM binary.
 */
export * from "./index";

import { PDFiumLibrary as _PDFiumLibrary } from "./library";
import vendor from "./vendor/pdfium.esm";

function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

const BASE64_WARNING =
  "@hyzyla/pdfium: Using base64-encoded WASM binary.\n" +
  "\n" +
  `This can lead to larger bundle size or slower load time. Use "@hyzyla/pdfium" with a proper ` +
  "setup for better performance. You can also disable this warning by passing { disableBase64Warning: true } " +
  "to PDFiumLibrary.init() method";

export class PDFiumLibrary extends _PDFiumLibrary {
  static async init(options?: { disableBase64Warning?: boolean }) {
    if (!options?.disableBase64Warning) {
      console.warn(BASE64_WARNING);
    }
    const base64 = await import("./vendor/pdfium.wasm.base64");
    const wasmBinary = base64ToUint8Array(base64.PDFIUM_WASM_BASE64);
    return await _PDFiumLibrary.initBase({
      wasmBinary: wasmBinary.buffer,
      vendor: vendor,
    });
  }
}
