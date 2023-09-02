import { PDFiumPageRenderOptions } from '../types';

export async function renderBySharp(options: PDFiumPageRenderOptions): Promise<Buffer> {
  const { default: sharp } = await import('sharp');
  return await sharp(options.data, {
    raw: {
      width: options.width,
      height: options.height,
      channels: 4,
    },
  })
    .png()
    .toBuffer();
}
