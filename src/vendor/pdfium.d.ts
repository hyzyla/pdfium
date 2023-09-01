declare type PDFium = {
  _FPDF_InitLibraryWithConfig: (config: any) => void;
  _FPDF_LoadMemDocument: (ptr: number, size: number, password: string) => any;
  _FPDF_GetLastError: () => number;
  _FPDF_DestroyLibrary: () => void;
  _FPDF_GetPageCount: (handle: any) => number;
  _FPDF_LoadPage: (handle: any, i: number) => any;
  _FPDF_GetPageWidth: (page: any) => number;
  _FPDF_GetPageHeight: (page: any) => number;
  _FPDF_ClosePage: (page: any) => void;
  _FPDFBitmap_CreateEx: (width: number, height: number, format: number, ptr: number, stride: number) => any;
  _FPDFBitmap_FillRect: (bitmap: any, left: number, top: number, width: number, height: number, color: number) => void;
  _FPDF_RenderPageBitmap: (
    bitmap: any,
    page: any,
    start_x: number,
    start_y: number,
    size_x: number,
    size_y: number,
    rotate: number,
    flags: number
  ) => void;
  _FPDFBitmap_Destroy: (bitmap: any) => void;
  asm: {
    malloc: (size: number) => number;
    free: (ptr: number) => void;
  };
  HEAPU8: Uint8Array;
};

declare function loadPdfium(): Promise<PDFium>;

export default loadPdfium;
