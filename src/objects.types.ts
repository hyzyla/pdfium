import type { PDFiumRenderFunction } from "./types.js";

export type PDFiumObjectType = "text" | "path" | "image" | "shading" | "form";

export type PDFiumImageObjectRenderParams = {
  render: PDFiumRenderFunction;
};

export type PDFiumImageObjectRender = {
  width: number;
  height: number;
  data: Uint8Array;
};

export type PDFiumImageObjectRaw = {
  width: number;
  height: number;
  data: Uint8Array;
  filters: string[];
};
