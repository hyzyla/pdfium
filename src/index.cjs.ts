/**
 * Export everything from index.ts, but add
 */
export * from "./index.js";

import { PDFiumLibrary as _PDFiumLibrary } from "./library.js";
import PDFiumModule, { type InstantiateWasm } from "./vendor/pdfium.js";

export class PDFiumLibrary extends _PDFiumLibrary {
  static async init(options?: { wasmBinary?: ArrayBuffer; wasmUrl?: string; instantiateWasm?: InstantiateWasm }) {
    return await PDFiumLibrary.initBase({
      vendor: PDFiumModule,
      wasmBinary: options?.wasmBinary,
      wasmUrl: options?.wasmUrl,
      instantiateWasm: options?.instantiateWasm,
    });
  }
}

export { PDFiumModule };
