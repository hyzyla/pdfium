/**
 * Entry point with pdfium.wasm embedded as base64, published as `@hyzyla/pdfium/inline`. It runs in
 * browsers and in Node.js, and leaves no wasm file for a bundler to lose. Exports everything from
 * index.ts plus a PDFiumLibrary that needs no options. The base64 string lives in a separate chunk
 * that init() loads with a dynamic import.
 */
export * from "./index.js";

import { PDFiumLibrary as _PDFiumLibrary } from "./library.js";
import PDFiumModule from "./vendor/pdfium.esm.js";

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
    const base64 = await import("./vendor/pdfium.wasm.base64.js");
    const wasmBinary = base64ToUint8Array(base64.PDFIUM_WASM_BASE64);
    return await PDFiumLibrary.initBase({
      wasmBinary: wasmBinary.buffer,
      vendor: PDFiumModule,
    });
  }
}

export { PDFiumModule };
