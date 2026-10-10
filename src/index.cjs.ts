/**
 * CommonJS entry point for Node.js. Exports everything from index.ts plus a PDFiumLibrary that reads
 * pdfium.wasm from next to this file, unless the wasm or its URL is passed to init().
 */
export * from "./index.js";

import { PDFiumLibrary as _PDFiumLibrary } from "./library.js";
import PDFiumModule, { type InstantiateWasm } from "./vendor/pdfium.js";

export class PDFiumLibrary extends _PDFiumLibrary {
  static async init(options?: {
    wasmBinary?: ArrayBuffer | Uint8Array;
    wasmUrl?: string;
    instantiateWasm?: InstantiateWasm;
  }) {
    return await PDFiumLibrary.initBase({
      vendor: PDFiumModule,
      wasmBinary: options?.wasmBinary,
      wasmUrl: options?.wasmUrl,
      instantiateWasm: options?.instantiateWasm,
    });
  }
}

export { PDFiumModule };
