/**
 * Export everything from index.ts, but add
 */
export * from "./index.js";

import { PDFiumLibrary as _PDFiumLibrary } from "./library.js";
import PDFiumModule from "./vendor/pdfium.js";

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
