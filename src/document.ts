import { PDFiumPage } from "./page.js";
import type * as t from "./vendor/pdfium.js";

export class PDFiumDocument {
  private readonly module: t.PDFium;

  // ID to interact with the document in the PDFium library
  private readonly documentIdx: number;

  // Pointer to the document in the WASM memory to free it later
  private readonly documentPtr: number;

  // Form handle for rendering and interacting with form fields
  private formIdx: number | null = null;
  private formPtr: number | null = null;

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
   * Initialize form environment for this document
   * This is required for rendering form fields such as signatures.
   * @returns The form handle
   */
  initializeFormFields(): number {
    if (this.formIdx !== null) {
      return this.formIdx;
    }

    // Initialize the form fill environment by allocating a structure with list of
    // callbacks that PDFium will call when it needs to interact with the form.
    // The structure is defined in PDFium as follows (simplified):
    //
    // typedef struct _FPDF_FORMFILLINFO {
    //     int  version;                                   // 1st field (we use 2)
    //     void (*Release)(struct _FPDF_FORMFILLINFO*);    // callback #1
    //     void (*FFI_Invalidate)(struct _FPDF_FORMFILLINFO*, …); // callback #2
    //     …
    // } FPDF_FORMFILLINFO;
    //
    const formSize = 256; // we need at least 140 bytes, but let's allocate 256 for safety
    this.formPtr = this.module.wasmExports.malloc(formSize);
    if (this.formPtr === 0) {
      throw new Error("Failed to allocate memory for form fill environment");
    }

    this.module.HEAPU8.fill(0, this.formPtr, this.formPtr + formSize);

    // Set "version" field to 2. Version 2 supports XFA and other features
    new DataView(this.module.HEAPU8.buffer).setUint32(this.formPtr, 2, true);
    this.formIdx = this.module._FPDFDOC_InitFormFillEnvironment(this.documentIdx, this.formPtr);
    if (this.formIdx === 0) {
      this.module.wasmExports.free(this.formPtr);
      this.formPtr = null;
      throw new Error("Failed to initialize form fill environment");
    }

    return this.formIdx;
  }

  /**
   * Get a page from the document by its index. The index is zero-based.
   */
  getPage(pageIndex: number): PDFiumPage {
    const pageIdx = this.module._FPDF_LoadPage(this.documentIdx, pageIndex);
    return new PDFiumPage({
      module: this.module,
      pageIdx: pageIdx,
      documentIdx: this.documentIdx,
      pageIndex: pageIndex,
      document: this,
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
    if (this.formIdx) {
      this.module._FPDFDOC_ExitFormFillEnvironment(this.formIdx);
      this.formIdx = null;
    }
    if (this.formPtr) {
      this.module.wasmExports.free(this.formPtr);
      this.formPtr = null;
    }
    this.module._FPDF_CloseDocument(this.documentIdx);
    this.module.wasmExports.free(this.documentPtr);
  }
}
