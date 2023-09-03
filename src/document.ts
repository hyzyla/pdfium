import type * as t from './vendor/pdfium';

import { PDFiumPage } from './page';

export class PDFiumDocument {
  private readonly module: t.PDFium;
  private readonly documentPointer: number;
  private readonly documentHandle: number;
  constructor(module: t.PDFium, documentPointer: number, documentHandle: number) {
    this.module = module;
    this.documentPointer = documentPointer;
    this.documentHandle = documentHandle;
  }

  getPage(i: number): PDFiumPage {
    const page = this.module._FPDF_LoadPage(this.documentHandle, i);
    return new PDFiumPage(this.module, page, i);
  }

  *pages(): Generator<PDFiumPage> {
    const pageCount = this.getPageCount();
    let i = 0;
    for (; i < pageCount; i++) {
      yield this.getPage(i);
    }
  }

  getPageCount(): number {
    return this.module._FPDF_GetPageCount(this.documentHandle);
  }

  destroy(): void {
    this.module._FPDF_CloseDocument(this.documentHandle);
    this.module.asm.free(this.documentPointer);
  }
}
