import type * as t from "./vendor/pdfium";

import { BYTES_PER_PIXEL, FPDFRenderFlag, FPDFBitmap } from "./constants";
import { type PDFiumObject, PDFiumObjectBase } from "./objects";
import type { PDFiumRenderFunction, PDFiumRenderOptions } from "./types";
import { convertBitmapToImage } from "./utils";
import type { PDFiumPageRender, PDFiumPageRenderParams } from "./page.types";

export class PDFiumPage {
  private readonly module: t.PDFium;
  private readonly pageIdx: number;
  private readonly documentIdx: number;
  number: number; // 0-based index of the page

  constructor(options: {
    module: t.PDFium;
    pageIdx: number;
    documentIdx: number;
    pageIndex: number;
  }) {
    this.module = options.module;
    this.pageIdx = options.pageIdx;
    this.documentIdx = options.documentIdx;
    this.number = options.pageIndex;
  }

  /**
   * Get the size of the page in points (1/72 inch)
   */
  getSize(precisely = false) {
    const width = this.module._FPDF_GetPageWidth(this.pageIdx);
    const height = this.module._FPDF_GetPageHeight(this.pageIdx);
    if (precisely) {
      return {
        width: width,
        height: height,
      };
    }
    return {
      width: Math.floor(width),
      height: Math.floor(height),
    };
  }

  async render(
    options: PDFiumPageRenderParams = {
      scale: 1,
      render: "bitmap",
    },
  ): Promise<PDFiumPageRender> {
    const { width: originalWidth, height: originalHeight } = this.getSize();

    // You can specify either the scale or the width and height.
    let width: number;
    let height: number;
    if ("scale" in options) {
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

    const bitmap = this.module._FPDFBitmap_CreateEx(
      width,
      height,
      FPDFBitmap.BGRA,
      ptr,
      width * BYTES_PER_PIXEL,
    );
    this.module._FPDFBitmap_FillRect(
      bitmap,
      0, // left
      0, // top
      width, // width
      height, // height
      0xffffffff, // color (white)
    );
    this.module._FPDF_RenderPageBitmap(
      bitmap,
      this.pageIdx,
      0, // start_x
      0, // start_y
      width, // size_x
      height, // size_y
      0, // rotate (0, normal)
      FPDFRenderFlag.REVERSE_BYTE_ORDER |
        FPDFRenderFlag.ANNOT |
        FPDFRenderFlag.LCD_TEXT, // flags
    );
    this.module._FPDFBitmap_Destroy(bitmap);
    this.module._FPDF_ClosePage(this.pageIdx);

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
      render: PDFiumRenderFunction;
    } & PDFiumRenderOptions,
  ): Promise<Buffer> {
    return await convertBitmapToImage(options);
  }

  getObjectCount(): number {
    return this.module._FPDFPage_CountObjects(this.pageIdx);
  }

  getObject(i: number): PDFiumObject {
    const object = this.module._FPDFPage_GetObject(this.pageIdx, i);
    return PDFiumObjectBase.create({
      module: this.module,
      objectIdx: object,
      documentIdx: this.documentIdx,
      pageIdx: this.pageIdx,
    });
  }

  *objects(): Generator<PDFiumObject> {
    const objectsCount = this.getObjectCount();
    for (let i = 0; i < objectsCount; i++) {
      yield this.getObject(i);
    }
  }
}
