import type * as t from './vendor/pdfium';

import { BYTES_PER_PIXEL, FPDF, FPDFBitmap } from './constants';
import { renderBySharp } from './renderer/sharp';
import { PDFiumPageRender, PDFiumPageRenderFunction, PDFiumPageRenderOptions, PDFiumPageRenderParams } from './types';

export class PDFiumPage {
  private readonly module: t.PDFium;
  private readonly pageHandle: number;
  number: number;

  constructor(module: t.PDFium, pageHandle: number, number: number) {
    this.module = module;
    this.pageHandle = pageHandle;
    this.number = number;
  }

  getSize(precisely: boolean = false) {
    const width = this.module._FPDF_GetPageWidth(this.pageHandle);
    const height = this.module._FPDF_GetPageHeight(this.pageHandle);
    if (precisely) {
      return {
        width: width,
        height: height,
      };
    } else {
      return {
        width: Math.floor(width),
        height: Math.floor(height),
      };
    }
  }

  async render(
    options: PDFiumPageRenderParams = {
      scale: 1,
      render: 'bitmap',
    }
  ): Promise<PDFiumPageRender> {
    const { width: originalWidth, height: originalHeight } = this.getSize();

    // You can specify either the scale or the width and height.
    let width: number;
    let height: number;
    if ('scale' in options) {
      width = Math.floor(originalWidth * options.scale);
      height = Math.floor(originalHeight * options.scale);
    } else {
      width = options.width;
      height = options.height;
    }

    const buffSize = width * height * BYTES_PER_PIXEL;

    // Allocate a block of memory for the bitmap and fill it with zeros.
    const ptr = this.module.wasmExports.malloc(buffSize);
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
      this.pageHandle,
      0, // start_x
      0, // start_y
      width, // size_x
      height, // size_y
      0, // rotate (0, normal)
      FPDF.REVERSE_BYTE_ORDER | FPDF.ANNOT | FPDF.LCD_TEXT // flags
    );
    this.module._FPDFBitmap_Destroy(bitmap);
    this.module._FPDF_ClosePage(this.pageHandle);

    const data = Buffer.from(this.module.HEAPU8.subarray(ptr, ptr + buffSize));
    this.module.wasmExports.free(ptr);

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

  async convertBitmapToImage(
    options: {
      render: PDFiumPageRenderFunction;
    } & PDFiumPageRenderOptions
  ) {
    switch (options.render) {
      case 'sharp':
        return await renderBySharp(options);
      case 'bitmap':
        return options.data;
      default:
        return await options.render(options);
    }
  }
}
