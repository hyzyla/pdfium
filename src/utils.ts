import { renderBySharp } from "./renderer/sharp";
import type { PDFiumRenderFunction, PDFiumRenderOptions } from "./types";

export async function convertBitmapToImage(
  options: {
    render: PDFiumRenderFunction;
  } & PDFiumRenderOptions,
): Promise<Buffer> {
  switch (options.render) {
    case "sharp":
      return await renderBySharp(options);
    case "bitmap":
      return options.data;
    default:
      return await options.render(options);
  }
}
