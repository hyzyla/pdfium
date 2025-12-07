/**
 * All the exports from the PDFium module, never use it directly, re-export them in platform-specific index files
 */
export { PDFiumDocument } from "./document.js";
export {
  PDFiumFormObject,
  PDFiumImageObject,
  PDFiumObject,
  PDFiumPathObject,
  PDFiumShadingObject,
  PDFiumTextObject,
} from "./objects.js";
export {
  PDFiumImageObjectRender,
  PDFiumImageObjectRenderParams,
  PDFiumObjectType,
} from "./objects.types.js";
export { PDFiumPage } from "./page.js";
export type {
  PDFiumPageRender,
  PDFiumPageRenderFunction,
  PDFiumPageRenderOptions,
  PDFiumPageSize,
} from "./page.types.js";
