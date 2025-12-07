import { BYTES_PER_PIXEL, FPDFBitmap, FPDFPageObjectType } from "./constants.js";
import type {
  PDFiumImageObjectRaw,
  PDFiumImageObjectRender,
  PDFiumImageObjectRenderParams,
  PDFiumObjectType,
} from "./objects.types.js";
import { convertBitmapToImage, readUInt16LE } from "./utils.js";
import type * as t from "./vendor/pdfium.js";

export abstract class PDFiumObjectBase {
  public abstract readonly type: PDFiumObjectType;

  protected readonly module: t.PDFium;
  protected readonly documentIdx: number;
  protected readonly pageIdx: number;
  protected readonly objectIdx: number;

  constructor(options: {
    module: t.PDFium;
    objectIdx: number;
    documentIdx: number;
    pageIdx: number;
  }) {
    this.module = options.module;
    this.objectIdx = options.objectIdx;
    this.documentIdx = options.documentIdx;
    this.pageIdx = options.pageIdx;
  }

  static create(options: { module: t.PDFium; objectIdx: number; documentIdx: number; pageIdx: number }): PDFiumObject {
    const type = options.module._FPDFPageObj_GetType(options.objectIdx);
    switch (type) {
      case FPDFPageObjectType.TEXT:
        return new PDFiumTextObject(options);
      case FPDFPageObjectType.PATH:
        return new PDFiumPathObject(options);
      case FPDFPageObjectType.IMAGE:
        return new PDFiumImageObject(options);
      case FPDFPageObjectType.SHADING:
        return new PDFiumShadingObject(options);
      case FPDFPageObjectType.FORM:
        return new PDFiumFormObject(options);
      default:
        throw new Error(`Unknown object type: ${type}`);
    }
  }
}

export class PDFiumTextObject extends PDFiumObjectBase {
  type = "text" as const;
}

export class PDFiumPathObject extends PDFiumObjectBase {
  type = "path" as const;
}

export class PDFiumImageObject extends PDFiumObjectBase {
  type = "image" as const;

  private static formatToBPP(format: number): number {
    switch (format) {
      case FPDFBitmap.Gray:
        return 1;
      case FPDFBitmap.BGR:
        return 3;
      case FPDFBitmap.BGRx:
      case FPDFBitmap.BGRA:
        return 4;
      default:
        throw new Error(`Unsupported bitmap format: ${format as number}`);
    }
  }

  /**
   * Return the raw uncompressed image data.
   */
  async getImageDataRaw(): Promise<PDFiumImageObjectRaw> {
    const bufferSize = this.module._FPDFImageObj_GetImageDataRaw(this.objectIdx, 0, 0);
    if (!bufferSize) {
      throw new Error("Failed to get bitmap from image object.");
    }

    const bufferPtr = this.module.wasmExports.malloc(bufferSize);

    if (!this.module._FPDFImageObj_GetImageDataRaw(this.objectIdx, bufferPtr, bufferSize)) {
      throw new Error("Failed to get bitmap buffer.");
    }

    const oData = this.module.HEAPU8.slice(bufferPtr, bufferPtr + bufferSize);
    this.module.wasmExports.free(bufferPtr);

    // Width and height of the image in pixels will be written to these pointers as 16-bit integers (2 bytes each):
    // [ ... width (2 bytes) ... | ... height (2 bytes) ... ]
    const sizePtr = this.module.wasmExports.malloc(2 + 2);
    const widthPtr = sizePtr;
    const heightPtr = sizePtr + 2;

    if (!this.module._FPDFImageObj_GetImagePixelSize(this.objectIdx, widthPtr, heightPtr)) {
      throw new Error("Failed to get image size.");
    }

    const widthBuffer = this.module.HEAPU8.slice(widthPtr, widthPtr + 2);
    const heightBuffer = this.module.HEAPU8.slice(heightPtr, heightPtr + 2);
    this.module.wasmExports.free(sizePtr);

    const width = readUInt16LE(widthBuffer);
    const height = readUInt16LE(heightBuffer);

    const filtersCount = this.module._FPDFImageObj_GetImageFilterCount(this.objectIdx);
    const filters: string[] = [];
    for (let i = 0; i < filtersCount; i++) {
      const filterSize = this.module._FPDFImageObj_GetImageFilter(this.objectIdx, i, 0, 0);
      const filterPtr = this.module.wasmExports.malloc(filterSize);
      if (!this.module._FPDFImageObj_GetImageFilter(this.objectIdx, i, filterPtr, filterSize)) {
        throw new Error("Failed to get image filter.");
      }
      const filterBuffer = this.module.HEAPU8.slice(filterPtr, filterPtr + filterSize - 1);
      const filter = new TextDecoder().decode(filterBuffer).trim();

      this.module.wasmExports.free(filterPtr);
      filters.push(filter);
    }

    return {
      width: width,
      height: height,
      data: oData,
      filters: filters,
    };
  }

  /**
   * Render the image object to a buffer with the specified render function.
   */
  async render(
    options: PDFiumImageObjectRenderParams = {
      render: "bitmap",
    },
  ): Promise<PDFiumImageObjectRender> {
    const bitmapIdx = this.module._FPDFImageObj_GetBitmap(this.objectIdx);
    if (!bitmapIdx) {
      throw new Error("Failed to get bitmap from image object.");
    }

    const bufferPtr = this.module._FPDFBitmap_GetBuffer(bitmapIdx);
    if (!bufferPtr) {
      throw new Error("Failed to get bitmap buffer.");
    }

    // Stride is the number of bytes per row, it might be larger than width * bytesPerPixel
    // and is used for alignment in the bitmap buffer (e.g. 4-byte alignment)
    const stride = this.module._FPDFBitmap_GetStride(bitmapIdx);

    // Width and height of the image in pixels
    const width = this.module._FPDFBitmap_GetWidth(bitmapIdx);
    const height = this.module._FPDFBitmap_GetHeight(bitmapIdx);

    // Format of the image: 1 - Gray, 2 - BGR, 3 - BGRx, 4 - BGRA
    const format = this.module._FPDFBitmap_GetFormat(bitmapIdx);

    // Here is BBP (bytes per pixel) for the original image
    const oBPP = PDFiumImageObject.formatToBPP(format);

    // Calculate the buffer size of the original image, stored in the WASM heap
    const bufferSize = height * stride;

    // Get the buffer from the WASM heap to a JS Uint8Array
    const oData = this.module.HEAPU8.slice(bufferPtr, bufferPtr + bufferSize);
    this.module.wasmExports.free(bufferPtr);

    // Currently we only support converting to RGBA (4 bytes per pixel)
    const tBPP = BYTES_PER_PIXEL;

    // Create a new buffer for the target image and fill it with white color
    const tData = new Uint8Array(width * height * tBPP);
    // Fill the buffer with transparent white color
    tData.fill(255);

    // Iterate over the rows of the original and target images
    for (let rowIndex = 0; rowIndex < height; rowIndex++) {
      const tRowStart = rowIndex * tBPP * width;
      const oRowStart = rowIndex * stride;

      // Iterate over the columns of the original and target images
      for (let columnIndex = 0; columnIndex < width; columnIndex++) {
        const tPixelStart = tRowStart + columnIndex * tBPP;
        const oPixelStart = oRowStart + columnIndex * oBPP;

        // conver from original format to RGBA
        // =================
        switch (format) {
          case FPDFBitmap.Gray: {
            // Grayscale: Copy the gray value to R, G, B, and set A to 255
            const gray = oData[oPixelStart];
            tData[tPixelStart + 0] = gray; // R
            tData[tPixelStart + 1] = gray; // G
            tData[tPixelStart + 2] = gray; // B
            // A is already set to 255 by Buffer.alloc
            break;
          }
          case FPDFBitmap.BGR: {
            // BGR: Copy the values to RGB and set A to 255
            tData[tPixelStart + 0] = oData[oPixelStart + 2]; // R
            tData[tPixelStart + 1] = oData[oPixelStart + 1]; // G
            tData[tPixelStart + 2] = oData[oPixelStart + 0]; // B
            // A is already set to 255 by Buffer.alloc
            break;
          }
          case FPDFBitmap.BGRx: {
            // BGRx: Copy the values to RGB and set A to 255
            tData[tPixelStart + 0] = oData[oPixelStart + 2]; // R
            tData[tPixelStart + 1] = oData[oPixelStart + 1]; // G
            tData[tPixelStart + 2] = oData[oPixelStart + 0]; // B
            // A is already set to 255 by Buffer.alloc
            break;
          }
          case FPDFBitmap.BGRA: {
            // BGRA: Copy directly
            tData[tPixelStart + 0] = oData[oPixelStart + 2]; // R
            tData[tPixelStart + 1] = oData[oPixelStart + 1]; // G
            tData[tPixelStart + 2] = oData[oPixelStart + 0]; // B
            tData[tPixelStart + 3] = oData[oPixelStart + 3]; // A
            break;
          }
          default:
            throw new Error(`Unsupported bitmap format: ${format as number}`);
        }
        // switch case end
        // =================
      }
    }

    const image = await convertBitmapToImage({
      render: options.render,
      width: width,
      height: height,
      data: tData,
    });

    return {
      width: width,
      height: height,
      data: image,
    };
  }
}

export class PDFiumShadingObject extends PDFiumObjectBase {
  type = "shading" as const;
}

export class PDFiumFormObject extends PDFiumObjectBase {
  type = "form" as const;
}

export type PDFiumObject =
  | PDFiumTextObject
  | PDFiumPathObject
  | PDFiumImageObject
  | PDFiumShadingObject
  | PDFiumFormObject;
