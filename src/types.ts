export type PDFiumRenderOptions = {
  width: number;
  height: number;
  data: Uint8Array;
};

export type PDFiumRenderCallback = (options: PDFiumRenderOptions) => Promise<Uint8Array>;

export type PDFiumRenderFunction = "sharp" | "bitmap" | PDFiumRenderCallback;
