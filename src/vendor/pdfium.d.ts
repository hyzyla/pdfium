export declare type PDFium = {
  _FPDF_InitLibraryWithConfig: (config: object) => void;
  _FPDF_LoadMemDocument: (documentPtr: number, documentSize: number, passwordPtr: number) => number;
  _FPDF_GetLastError: () => number;
  _FPDF_DestroyLibrary: () => void;
  _FPDF_GetPageCount: (documentIdx: number) => number;
  _FPDF_LoadPage: (documentIdx: number, pageIndex: number) => number;
  _FPDF_GetPageWidth: (page: number) => number;
  _FPDF_GetPageHeight: (page: number) => number;
  _FPDFPage_CountObjects: (page: number) => number;
  _FPDFPage_GetObject: (page: number, i: number) => number;
  _FPDFPageObj_GetType: (objectIdx: number) => number;
  _FPDFImageObj_GetBitmap: (objectIdx: number) => number;
  _FPDFImageObj_GetImageDataRaw: (objectIdx: number, buffer: number, lenght: number) => number;
  _FPDF_ClosePage: (page: number) => void;
  _FPDFImageObj_GetImagePixelSize: (objectIdx: number, width: number, height: number) => number;
  _FPDFImageObj_GetImageFilterCount(objectIdx: number): number;
  _FPDFImageObj_GetImageFilter(objectIdx: number, index: number, buffer: number, length: number): number;

  _FPDFText_LoadPage: (page: number) => number;
  _FPDFText_ClosePage: (textPage: number) => void;
  _FPDFText_CountChars: (textPage: number) => number;
  _FPDFText_GetText: (textPage: number, startIndex: number, count: number, buffer: number) => number;

  _FPDFBitmap_CreateEx: (width: number, height: number, format: number, ptr: number, stride: number) => number;
  _FPDFBitmap_FillRect: (
    bitmap: number,
    left: number,
    top: number,
    width: number,
    height: number,
    color: number,
  ) => void;
  _FPDF_RenderPageBitmap: (
    bitmap: number,
    page: number,
    start_x: number,
    start_y: number,
    size_x: number,
    size_y: number,
    rotate: number,
    flags: number,
  ) => void;
  _FPDFBitmap_Destroy: (bitmap: number) => void;
  _FPDFBitmap_GetBuffer: (bitmap: number) => number;
  _FPDFImageObj_GetRenderedBitmap: (document: number, page: number, object: number) => number;
  _FPDFBitmap_GetWidth: (bitmap: number) => number;
  _FPDFBitmap_GetHeight: (bitmap: number) => number;
  _FPDFBitmap_GetStride: (bitmap: number) => number;
  _FPDFBitmap_GetFormat: (bitmap: number) => number;
  _FPDF_CloseDocument(document: number): void;
  wasmExports: {
    malloc: (size: number) => number;
    free: (ptr: number) => void;
  };
  HEAPU8: Uint8Array;
};

export declare type LoadPdfiumOptions = {
  wasmBinary?: ArrayBuffer;
  locateFile?: (path: string) => string;
};

export declare function loadPdfium(options: LoadPdfiumOptions): Promise<PDFium>;

export default loadPdfium;
