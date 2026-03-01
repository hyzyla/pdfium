import type { PDFiumRenderFunction, PDFiumRenderOptions } from "./types.js";

export async function convertBitmapToImage(
  options: {
    render: PDFiumRenderFunction;
  } & PDFiumRenderOptions,
): Promise<Uint8Array> {
  const { data, render } = options;

  if (typeof render === "function") {
    return await render(options);
  }

  return data;
}

export function readUInt16LE(buffer: Uint8Array, offset = 0): number {
  return buffer[offset] | (buffer[offset + 1] << 8);
}
