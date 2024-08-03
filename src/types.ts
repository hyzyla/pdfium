export type PDFiumRenderOptions = {
  width: number;
  height: number;
  data: Buffer;
};

export type PDFiumRenderCallback = (
  options: PDFiumRenderOptions,
) => Promise<Buffer>;

export type PDFiumRenderFunction = "sharp" | "bitmap" | PDFiumRenderCallback;
