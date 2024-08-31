/**
 * Export everything from index.ts, but add
 */
export * from "./index";

import { PDFiumLibrary as _PDFiumLibrary } from "./library";
import vendor from "./vendor/pdfium";

export class PDFiumLibrary {
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
