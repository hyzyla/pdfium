/**
 * All the exports from the PDFium module, never use it directly, re-export them in platform-specific index files
 */
export { PDFiumDocument } from "./document";
export { PDFiumPage } from "./page";
export type {
  PDFiumPageRenderFunction,
  PDFiumPageRenderOptions,
  PDFiumPageSize,
  PDFiumPageRender,
} from "./page.types";
export {
  PDFiumObjectType,
  PDFiumImageObjectRenderParams,
  PDFiumImageObjectRender,
} from "./objects.types";
export {
  PDFiumTextObject,
  PDFiumPathObject,
  PDFiumImageObject,
  PDFiumShadingObject,
  PDFiumFormObject,
  PDFiumObject,
} from "./objects";
