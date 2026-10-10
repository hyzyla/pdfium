/**
 * ES module entry point, built once for Node.js and once for browsers. Exports everything from
 * index.ts plus a PDFiumLibrary that reads pdfium.wasm from node_modules in Node.js. Browsers have to
 * pass the wasm or its URL to init().
 */
export * from "./index.js";

import { PDFiumLibrary as _PDFiumLibrary } from "./library.js";
import PDFiumModule, { type InstantiateWasm } from "./vendor/pdfium.esm.js";

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
