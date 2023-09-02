export type PDFiumPageRenderOptions = {
  width: number;
  height: number;
  data: Buffer;
};

export type PDFiumPageRenderCallback = (options: PDFiumPageRenderOptions) => Promise<Buffer>;

export type PDFiumPageRenderFunction = 'sharp' | 'bitmap' | PDFiumPageRenderCallback;

export type PDFiumPageSize = {
  width: number;
  height: number;
};

export type PDFiumPageRender = {
  width: number;
  height: number;
  originalHeight: number;
  originalWidth: number;
  data: Buffer;
};
