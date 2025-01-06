/**
 * Export everything from index.ts, but add
 */
export * from "./index.js";

import { PDFiumLibrary as _PDFiumLibrary } from "./library.js";
import vendor from "./vendor/pdfium.js";

export class PDFiumLibrary extends _PDFiumLibrary {
  static async init(options?: {
    wasmBinary?: ArrayBuffer;
    wasmUrl?: string;
  }) {
    return await _PDFiumLibrary.initBase({
      vendor: vendor,
      wasmBinary: options?.wasmBinary,
      wasmUrl: options?.wasmUrl,
    });
  }
}
