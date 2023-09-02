import type * as t from './vendor/pdfium';
import vendor from './vendor/pdfium';

import { FPDF_ERR, FPDFBitmap, BYTES_PER_PIXEL, FPDF } from './constants';
import { renderBySharp } from './renderer/sharp';
import { PDFiumPageRenderFunction, PDFiumPageRenderOptions, PDFiumPageSize, PDFiumPageRender } from './types';

export class PDFiumLibrary {
  module: t.PDFium;
  static async init() {
    const module = await vendor();
    module._FPDF_InitLibraryWithConfig({
      version: 2,
      m_pIsolate: null,
      m_pUserFontPaths: null,
      m_v8EmbedderSlot: 0,
      m_pPlatform: null,
    });

    return new PDFiumLibrary(module);
  }

  constructor(module: t.PDFium) {
    this.module = module;
  }

  async loadDocument(buff: Buffer, password: string = '') {
    const size = buff.length;

    const ptr = this.module.asm.malloc(size);
    this.module.HEAPU8.set(buff, ptr);

    const document = this.module._FPDF_LoadMemDocument(ptr, size, password);
    const lastError = this.module._FPDF_GetLastError();
    if (lastError != FPDF_ERR.SUCCESS) {
      throw new Error(`PDF Loading  = ${lastError}`);
    }

    return new PDFiumDocument(this.module, ptr, document);
  }

  destroy() {
    this.module._FPDF_DestroyLibrary();
  }
}

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
      case 'raw':
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
      render: 'raw',
    }
  ): Promise<PDFiumPageRender> {
    const page = this.module._FPDF_LoadPage(this.documentHandle, i);
    const originalWidth = Math.floor(this.module._FPDF_GetPageWidth(page));
    const originalHeight = Math.floor(this.module._FPDF_GetPageHeight(page));

    const width = Math.floor(originalWidth * options.scale);
    const height = Math.floor(originalHeight * options.scale);

    const buffSize = width * height * BYTES_PER_PIXEL;
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
