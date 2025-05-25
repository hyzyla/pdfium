/**
 * All the exports from the PDFium module, never use it directly, re-export them in platform-specific index files
 */
export { PDFiumDocument } from "./document.js";
export { PDFiumPage } from "./page.js";
export type {
  PDFiumPageRenderFunction,
  PDFiumPageRenderOptions,
  PDFiumPageSize,
  PDFiumPageRender,
} from "./page.types.js";
export {
  PDFiumObjectType,
  PDFiumImageObjectRenderParams,
  PDFiumImageObjectRender,
  PDFiumPathData,
  PDFiumPathSegment,
  PDFiumPathSegmentType,
} from "./objects.types.js";
export {
  PDFiumTextObject,
  PDFiumPathObject,
  PDFiumImageObject,
  PDFiumShadingObject,
  PDFiumFormObject,
  PDFiumObject,
} from "./objects.js";
export { FPDFPathSegmentType } from "./constants.js";
