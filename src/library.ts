import type * as t from './vendor/pdfium';
import vendor from './vendor/pdfium';

import { FPDF_ERR } from './constants';
import { PDFiumDocument } from './document';
import { lengthBytesUTF8, stringToUTF8 } from './utils';

/**
 * Converts a JavaScript string to a null-terminated C string and returns
 * a pointer to the allocated memory.
 *
 * Remeber to free the allocated memory using the `free` function after
 * you're done with the string.
 */
function stringToCString(module: t.PDFium, str: string): number {
  // Get the length of the UTF-8 string including the null terminator
  const length = lengthBytesUTF8(str) + 1;

  // Allocate memory for the string
  const ptr = module.wasmExports.malloc(length);

  // Copy the string to the allocated memory
  stringToUTF8(str, module.HEAPU8, ptr, length);

  return ptr;
}

export class PDFiumLibrary {
  private readonly module: t.PDFium;
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
    const ptr = this.module.wasmExports.malloc(size);

    // This line copies the content of buff into the WebAssembly module's memory starting at the address specified by ptr.
    // Here HEAPU8 is a typed array that serves as a view into the WebAssembly memory, allowing JavaScript code to read
    // and write bytes directly. The set method is used to copy the contents of an array (buff in this case) into HEAPU8
    // starting at the index ptr.
    this.module.HEAPU8.set(buff, ptr);

    let passwordPtr: number = 0;
    if (password) {
      passwordPtr = stringToCString(this.module, password);
    }

    const document = this.module._FPDF_LoadMemDocument(ptr, size, passwordPtr);
    const lastError = this.module._FPDF_GetLastError();
    if (lastError != FPDF_ERR.SUCCESS) {
      switch (lastError) {
        case FPDF_ERR.UNKNOWN:
          throw new Error('Unknown error');
        case FPDF_ERR.FILE:
          throw new Error('File not found or could not be opened');
        case FPDF_ERR.FORMAT:
          throw new Error('File not in PDF format or corrupted');
        case FPDF_ERR.PASSWORD:
          throw new Error('Password required or incorrect password');
        case FPDF_ERR.SECURITY:
          throw new Error('Unsupported security scheme');
        case FPDF_ERR.PAGE:
          throw new Error('Page not found or content error');
        default:
          throw new Error(`PDF Loading = ${lastError}`);
      }
    }

    const pdfiumDocument = new PDFiumDocument(this.module, ptr, document);

    if (passwordPtr !== null) {
      this.module.wasmExports.free(passwordPtr);
    }

    return pdfiumDocument;
  }

  destroy() {
    this.module._FPDF_DestroyLibrary();
  }
}
