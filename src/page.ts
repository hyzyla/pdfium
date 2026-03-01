import { FPDFBitmap, FPDFRenderFlag } from "./constants.js";
import { DEFAULT_PAGE_RENDER_OPTIONS } from "./default.options.js";
import type { PDFiumDocument } from "./document.js";
import { type PDFiumObject, PDFiumObjectBase } from "./objects.js";
import type { PDFiumPageRender, PDFiumPageRenderOptionsValidated, PDFiumPageRenderParams } from "./page.types.js";
import type { PDFiumRenderFunction, PDFiumRenderOptions } from "./types.js";
import { convertBitmapToImage } from "./utils.js";
import type * as t from "./vendor/pdfium.js";

export class PDFiumPage {
  private readonly module: t.PDFium;
  private readonly pageIdx: number;
  private readonly documentIdx: number;
  private readonly document: PDFiumDocument;
  readonly number: number; // zero based index of the page

  constructor(options: {
    module: t.PDFium;
    pageIdx: number;
    documentIdx: number;
    document: PDFiumDocument;
    pageIndex: number;
  }) {
    this.module = options.module;
    this.pageIdx = options.pageIdx;
    this.documentIdx = options.documentIdx;
    this.document = options.document;
    this.number = options.pageIndex;
  }

  getOriginalSize() {
    const originalWidth = this.module._FPDF_GetPageWidth(this.pageIdx);
    const originalHeight = this.module._FPDF_GetPageHeight(this.pageIdx);

    return {
      originalWidth,
      originalHeight,
    };
  }

  /**
   * Get the size of the page in points (1/72 inch)
   * Floored original values needed in testing. Scale can be a float number.
   */
  private getSize(renderOptions: PDFiumPageRenderOptionsValidated) {
    const { scale, width, height } = renderOptions;

    const { originalHeight, originalWidth } = this.getOriginalSize();

    const computedWidth = Math.floor(width ?? originalWidth);
    const computedHeight = Math.floor(height ?? originalHeight);

    return {
      originalWidth: Math.floor(originalWidth),
      originalHeight: Math.floor(originalHeight),
      width: Math.floor(computedWidth * scale),
      height: Math.floor(computedHeight * scale),
    };
  }

  /**
   * Extract text from the page
   */
  getText(): string {
    const textPage = this.module._FPDFText_LoadPage(this.pageIdx);
    if (!textPage) {
      throw new Error("Failed to load text page");
    }

    try {
      const charCount = this.module._FPDFText_CountChars(textPage);

      if (charCount <= 0) {
        return "";
      }

      const bufferSize = (charCount + 1) * 2;
      const textPtr = this.module.wasmExports.malloc(bufferSize);

      try {
        const length = this.module._FPDFText_GetText(textPage, 0, charCount, textPtr);

        if (length <= 0) {
          return "";
        }

        // Convert the UTF-16LE buffer to a JavaScript string
        // Subtract 1 from length to remove the null terminator
        const buffer = new Uint8Array(this.module.HEAPU8.buffer, textPtr, (length - 1) * 2);
        const text = new TextDecoder("utf-16le").decode(buffer);

        return text;
      } finally {
        this.module.wasmExports.free(textPtr);
      }
    } finally {
      this.module._FPDFText_ClosePage(textPage);
    }
  }

  async render(options: PDFiumPageRenderParams = {}): Promise<PDFiumPageRender> {
    let formIdx: number | null = null;
    const renderOptions: PDFiumPageRenderOptionsValidated = {
      ...DEFAULT_PAGE_RENDER_OPTIONS,
      ...options,
    };

    const { colorSpace, render, renderFormFields } = renderOptions;
    const { width, height, originalWidth, originalHeight } = this.getSize(renderOptions);

    if (renderFormFields) {
      formIdx = this.document.initializeFormFields(); // will be initialized only once
      this.module._FORM_OnAfterLoadPage(this.pageIdx, formIdx);
    }

    const bytesPerPixel = FPDFBitmap[colorSpace];
    const buffSize = width * height * bytesPerPixel;
    const ptr = this.module.wasmExports.malloc(buffSize);
    let bitmap: number | null = null;

    if (ptr === 0) {
      throw new Error("Failed to allocate memory for bitmap");
    }

    try {
      bitmap = this.module._FPDFBitmap_CreateEx(width, height, bytesPerPixel, ptr, width * bytesPerPixel);

      this.module._FPDFBitmap_FillRect(
        bitmap,
        0, // left
        0, // top
        width, // width
        height, // height
        0xffffffff, // color (white)
      );

      let flags = FPDFRenderFlag.ANNOT | FPDFRenderFlag.LCD_TEXT;

      flags = colorSpace === "Gray" ? flags | FPDFRenderFlag.GRAYSCALE : flags | FPDFRenderFlag.REVERSE_BYTE_ORDER;

      this.module._FPDF_RenderPageBitmap(
        bitmap,
        this.pageIdx,
        0, // start_x
        0, // start_y
        width, // size_x
        height, // size_y
        0, // rotate (0, normal)
        flags, // flags
      );

      if (formIdx !== null) {
        // Second draw pass – draw the interactive form widgets on top of previously draw call
        // Remove ANNOT flags to avoid rendering popup annotations (e.g. tooltips).
        const formFlags = flags & ~FPDFRenderFlag.ANNOT;
        this.module._FPDF_FFLDraw(
          formIdx,
          bitmap,
          this.pageIdx,
          0, // start_x
          0, // start_y
          width, // size_x
          height, // size_y
          0, // rotate (0, normal)
          formFlags, // flags
        );

        this.module._FORM_OnBeforeClosePage(this.pageIdx, formIdx);
      }

      const image = await this.convertBitmapToImage({
        render,
        width,
        height,
        // ⚠️ creation of a copy is necessary to avoid memory corruption
        data: this.module.HEAPU8.slice(ptr, ptr + buffSize),
      });

      return {
        width,
        height,
        originalHeight,
        originalWidth,
        data: image,
      };
    } finally {
      // always clean up resources in case of success / error
      if (bitmap !== null) {
        this.module._FPDFBitmap_Destroy(bitmap);
      }

      // TODO: consider to create a separate function for closing the page and free resources only when needed, not after every render
      this.module._FPDF_ClosePage(this.pageIdx);
      this.module.wasmExports.free(ptr);
    }
  }

  async convertBitmapToImage(
    options: {
      render: PDFiumRenderFunction;
    } & PDFiumRenderOptions,
  ): Promise<Uint8Array> {
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
