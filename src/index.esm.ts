/**
 * Export everything from index.ts, but override the PDFiumLibrary class with a new one that uses a
 * base64-encoded WASM binary. Having a separate file for this is useful because bundlers do not need
 * to include the base64-encoded WASM binary in the main bundle when the user does not use the
 * base64-encoded WASM binary.
 */
export * from "./index.js";

import { PDFiumLibrary as _PDFiumLibrary } from "./library.js";
import PDFiumModule from "./vendor/pdfium.esm.js";

export class PDFiumLibrary extends _PDFiumLibrary {
  static async init(options?: {
    wasmBinary?: ArrayBuffer;
    wasmUrl?: string;
    instantiateWasm?: (
      imports: WebAssembly.Imports,
      successCallback: (module: WebAssembly.Module) => void,
    ) => WebAssembly.Exports;
  }) {
    return await _PDFiumLibrary.initBase({
      vendor: PDFiumModule,
      wasmBinary: options?.wasmBinary,
      wasmUrl: options?.wasmUrl,
      instantiateWasm: options?.instantiateWasm,
    });
  }
}

export { PDFiumModule };
