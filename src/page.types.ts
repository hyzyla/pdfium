import type { PDFiumRenderFunction, PDFiumRenderOptions } from "./types";

export type PDFiumPageRenderFunction = PDFiumRenderFunction;
export type PDFiumPageRenderOptions = PDFiumRenderOptions;

export type PDFiumPageRenderCallback = (
  options: PDFiumPageRenderOptions,
) => Promise<Buffer>;
export type PDFiumPageRenderParams = {
  render: PDFiumPageRenderFunction;
} & (
  | {
      scale: number;
    }
  | {
      width: number;
      height: number;
    }
);

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
