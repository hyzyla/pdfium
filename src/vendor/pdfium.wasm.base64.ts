/**
 * Here, is the place where the base64-encoded PDFium WebAssembly binary will be injected by rolldown as a constant string.
 *
 * Later, PDFiumLibrary.init() in index.esm.base64.ts dynamically imports this constant to initialize the PDFium library.
 * With this approach, the user doesn't need to provide the path to the WASM file. Everything is handled automatically
 * by the package, and any bundler that supports dynamic imports will treat this file as a separate chunk.
 */

declare const __WASM_BINARY_BASE64__: string;

export const PDFIUM_WASM_BASE64 = __WASM_BINARY_BASE64__;
