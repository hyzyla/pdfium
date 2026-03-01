import type { PDFiumScaleAndRender } from "./page.types.js";

const DEFAULT_PAGE_RENDER_OPTIONS: PDFiumScaleAndRender = {
  scale: 1,
  render: "bitmap",
  colorSpace: "BGRA",
  renderFormFields: false,
};

export { DEFAULT_PAGE_RENDER_OPTIONS };
