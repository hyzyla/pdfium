import type * as t from "./vendor/pdfium.js";

import { FPDFErrorCode } from "./constants.js";
import { PDFiumDocument } from "./document.js";
import { lengthBytesUTF8, stringToUTF8 } from "./emscripten.js";

const NO_OPTION_WARNING =
  "@hyzyla/pdfium: wasmUrl, wasmBinary is required for browser environment. \n\n" +
  "Please provide the wasm binary or URL to the init method. You can also use '@hyzyla/pdfium/browser/cdn'" +
  "or '@hyzyla/pdfium/browser/base64' for quick setup, but it's not recommended for production use.";

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
  const passwordPtr = module.wasmExports.malloc(length);

  // Copy the string to the allocated memory
  stringToUTF8(str, module.HEAPU8, passwordPtr, length);

  return passwordPtr;
}

type PDFiumLibraryInitOptions = {
  vendor: (options: t.LoadPdfiumOptions) => Promise<t.PDFium>;
  wasmUrl?: string;
  wasmBinary?: ArrayBuffer;
};

export class PDFiumLibrary {
  private readonly module: t.PDFium;

  static async initBase(options: PDFiumLibraryInitOptions) {
    const { wasmUrl, wasmBinary } = options || {};
    const loadOptions: t.LoadPdfiumOptions = {};
    if (wasmUrl) {
      loadOptions.locateFile = (path: string) => wasmUrl;
    } else if (wasmBinary) {
      loadOptions.wasmBinary = wasmBinary;
    } else {
      // Node.js will use wasm binary from node_modules, but for browser environment,
      // user must provide the wasm binary or URL
      if (typeof window !== "undefined") {
        console.error(NO_OPTION_WARNING);
        throw new Error(NO_OPTION_WARNING);
      }
    }

    const module = await options.vendor(loadOptions);
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

  async loadDocument(buff: Uint8Array, password = "") {
    const size = buff.length;

    // This line allocates a block of memory of size bytes and returns a pointer to the first byte of the block.
    //  The malloc function is a standard C library function for memory allocation, and here it's exposed via
    // this.module.asm, which likely represents the compiled WebAssembly module. The returned pointer (ptr) is
    // an integer value representing the memory location within the WebAssembly module's memory space.
    const documentPtr = this.module.wasmExports.malloc(size);

    // This line copies the content of buff into the WebAssembly module's memory starting at the address specified by ptr.
    // Here HEAPU8 is a typed array that serves as a view into the WebAssembly memory, allowing JavaScript code to read
    // and write bytes directly. The set method is used to copy the contents of an array (buff in this case) into HEAPU8
    // starting at the index ptr.
    this.module.HEAPU8.set(buff, documentPtr);

    // This line converts the password string to a null-terminated C string and returns a pointer
    // to the allocated memory. Don't forget to free the allocated memory using the free function after you're
    // done with the string.
    let passwordPtr = 0;
    if (password) {
      passwordPtr = stringToCString(this.module, password);
    }

    // This line reads the PDF document from the memory block starting at documentPtr and of size bytes.
    // If the document is password-protected, the password should be provided as a null-terminated C string.
    // The function returns a document index (handle) that can be used to interact with the document.
    const documentIdx = this.module._FPDF_LoadMemDocument(documentPtr, size, passwordPtr);

    // Handle error if the document could not be loaded
    const lastError = this.module._FPDF_GetLastError();
    if (lastError !== FPDFErrorCode.SUCCESS) {
      switch (lastError) {
        case FPDFErrorCode.UNKNOWN:
          throw new Error("Unknown error");
        case FPDFErrorCode.FILE:
          throw new Error("File not found or could not be opened");
        case FPDFErrorCode.FORMAT:
          throw new Error("File not in PDF format or corrupted");
        case FPDFErrorCode.PASSWORD:
          throw new Error("Password required or incorrect password");
        case FPDFErrorCode.SECURITY:
          throw new Error("Unsupported security scheme");
        case FPDFErrorCode.PAGE:
          throw new Error("Page not found or content error");
        default:
          throw new Error(`PDF Loading = ${lastError}`);
      }
    }

    const document = new PDFiumDocument({
      module: this.module,
      documentPtr: documentPtr,
      documentIdx: documentIdx,
    });

    // Free the allocated memory for the password string
    if (passwordPtr !== null) {
      this.module.wasmExports.free(passwordPtr);
    }

    return document;
  }

  destroy() {
    this.module._FPDF_DestroyLibrary();
  }
}
