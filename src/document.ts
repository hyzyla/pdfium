import type * as t from './vendor/pdfium';

import { FPDFBitmap, BYTES_PER_PIXEL, FPDF } from './constants';
import { renderBySharp } from './renderer/sharp';
import { PDFiumPageRenderFunction, PDFiumPageRenderOptions, PDFiumPageSize, PDFiumPageRender } from './types';

export class PDFiumDocument {
  module: t.PDFium;
  documentPointer: number;
  documentHandle: number;
  constructor(module: t.PDFium, documentPointer: number, documentHandle: number) {
    this.module = module;
    this.documentPointer = documentPointer;
    this.documentHandle = documentHandle;
  }

  getPageCount(): number {
    return this.module._FPDF_GetPageCount(this.documentHandle);
  }

  getPageSize(i: number): PDFiumPageSize {
    const page = this.module._FPDF_LoadPage(this.documentHandle, i);
    const width = this.module._FPDF_GetPageWidth(page);
    const height = this.module._FPDF_GetPageHeight(page);
    this.module._FPDF_ClosePage(page);
    return {
      width: width,
      height: height,
    };
  }

  private async convertBitmapToImage(
    options: {
      render: PDFiumPageRenderFunction;
    } & PDFiumPageRenderOptions
  ): Promise<Buffer> {
    switch (options.render) {
      case 'sharp':
        return await renderBySharp(options);
      case 'bitmap':
        return options.data;
      default:
        return await options.render(options);
    }
  }

  async renderPage(
    i: number,
    options: {
      scale: number;
      render: PDFiumPageRenderFunction;
    } = {
      scale: 1,
      render: 'bitmap',
    }
  ): Promise<PDFiumPageRender> {
    const page = this.module._FPDF_LoadPage(this.documentHandle, i);
    const originalWidth = Math.floor(this.module._FPDF_GetPageWidth(page));
    const originalHeight = Math.floor(this.module._FPDF_GetPageHeight(page));

    const width = Math.floor(originalWidth * options.scale);
    const height = Math.floor(originalHeight * options.scale);

    const buffSize = width * height * BYTES_PER_PIXEL;

    // Allocate a block of memory for the bitmap and fill it with zeros.
    const ptr = this.module.asm.malloc(buffSize);
    this.module.HEAPU8.fill(0, ptr, ptr + buffSize);

    const bitmap = this.module._FPDFBitmap_CreateEx(width, height, FPDFBitmap.BGRA, ptr, width * BYTES_PER_PIXEL);
    this.module._FPDFBitmap_FillRect(
      bitmap,
      0, // left
      0, // top
      width, // width
      height, // height
      0xffffffff // color (white)
    );
    this.module._FPDF_RenderPageBitmap(
      bitmap,
      page,
      0, // start_x
      0, // start_y
      width, // size_x
      height, // size_y
      0, // rotate (0, normal)
      FPDF.REVERSE_BYTE_ORDER | FPDF.ANNOT | FPDF.LCD_TEXT // flags
    );
    this.module._FPDFBitmap_Destroy(bitmap);
    this.module._FPDF_ClosePage(page);

    const data = Buffer.from(this.module.HEAPU8.subarray(ptr, ptr + buffSize));
    this.module.asm.free(ptr);

    const image = await this.convertBitmapToImage({
      render: options.render,
      width: width,
      height: height,
      data: data,
    });

    return {
      width: width,
      height: height,
      originalHeight: originalHeight,
      originalWidth: originalWidth,
      data: image,
    };
  }

  destroy(): void {
    this.module._FPDF_CloseDocument(this.documentHandle);
    this.module.asm.free(this.documentPointer);
  }
}
