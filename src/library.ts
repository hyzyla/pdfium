import type * as t from './vendor/pdfium';
import vendor from './vendor/pdfium';

import { FPDF_ERR } from './constants';
import { PDFiumDocument } from './document';

export class PDFiumLibrary {
  module: t.PDFium;
  static async init() {
    const module = await vendor();
    module._FPDF_InitLibraryWithConfig({
      version: 2,
      m_pIsolate: null,
      m_pUserFontPaths: null,
      m_v8EmbedderSlot: 0,
      m_pPlatform: null,
    });

    return new PDFiumLibrary(module);
  }

  constructor(module: t.PDFium) {
    this.module = module;
  }

  async loadDocument(buff: Buffer, password: string = '') {
    const size = buff.length;

    // This line allocates a block of memory of size bytes and returns a pointer to the first byte of the block.
    //  The malloc function is a standard C library function for memory allocation, and here it's exposed via
    // this.module.asm, which likely represents the compiled WebAssembly module. The returned pointer (ptr) is
    // an integer value representing the memory location within the WebAssembly module's memory space.
    const ptr = this.module.asm.malloc(size);

    // This line copies the content of buff into the WebAssembly module's memory starting at the address specified by ptr.
    // Here HEAPU8 is a typed array that serves as a view into the WebAssembly memory, allowing JavaScript code to read
    // and write bytes directly. The set method is used to copy the contents of an array (buff in this case) into HEAPU8
    // starting at the index ptr.
    this.module.HEAPU8.set(buff, ptr);

    const document = this.module._FPDF_LoadMemDocument(ptr, size, password);
    const lastError = this.module._FPDF_GetLastError();
    if (lastError != FPDF_ERR.SUCCESS) {
      throw new Error(`PDF Loading = ${lastError}`);
    }

    return new PDFiumDocument(this.module, ptr, document);
  }

  destroy() {
    this.module._FPDF_DestroyLibrary();
  }
}
