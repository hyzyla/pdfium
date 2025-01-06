import type * as t from "./vendor/pdfium.js";

import { PDFiumPage } from "./page.js";

export class PDFiumDocument {
  private readonly module: t.PDFium;

  // ID to interact with the document in the PDFium library
  private readonly documentIdx: number;

  // Pointer to the document in the WASM memory to free it later
  private readonly documentPtr: number;

  constructor(options: {
    module: t.PDFium;
    documentIdx: number;
    documentPtr: number;
  }) {
    this.module = options.module;
    this.documentPtr = options.documentPtr;
    this.documentIdx = options.documentIdx;
  }

  /**
   * Get a page from the document by its index. The index is zero-based.
   */
  getPage(pageIndex: number): PDFiumPage {
    const page = this.module._FPDF_LoadPage(this.documentIdx, pageIndex);
    return new PDFiumPage({
      module: this.module,
      pageIdx: page,
      documentIdx: this.documentIdx,
      pageIndex: pageIndex,
    });
  }

  /**
   * User-friendly iterator to iterate over all pages in the document.
   */
  *pages(): Generator<PDFiumPage> {
    const pageCount = this.getPageCount();
    for (let i = 0; i < pageCount; i++) {
      yield this.getPage(i);
    }
  }

  /**
   * Get the number of pages in the document.
   */
  getPageCount(): number {
    return this.module._FPDF_GetPageCount(this.documentIdx);
  }

  /**
   * After you're done with the document, you should destroy it to free the memory.
   *
   * Otherwise, you'll be fired from your job for causing a memory leak. 😱
   */
  destroy(): void {
    this.module._FPDF_CloseDocument(this.documentIdx);
    this.module.wasmExports.free(this.documentPtr);
  }
}
