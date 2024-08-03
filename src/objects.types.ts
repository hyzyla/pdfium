import type { PDFiumRenderFunction } from "./types";

export type PDFiumObjectType = "text" | "path" | "image" | "shading" | "form";

export type PDFiumImageObjectRenderParams = {
  render: PDFiumRenderFunction;
};

export type PDFiumImageObjectRender = {
  width: number;
  height: number;
  data: Buffer;
};
