export const BYTES_PER_PIXEL = 4;

export const FPDFErrorCode = {
  SUCCESS: 0, // No error.
  UNKNOWN: 1, // Unknown error.
  FILE: 2, // File not found or could not be opened.
  FORMAT: 3, // File not in PDF format or corrupted.
  PASSWORD: 4, // Password required or incorrect password.
  SECURITY: 5, // Unsupported security scheme.
  PAGE: 6, // Page not found or content error.
};

export const FPDFBitmap = {
  Unknown: 0,
  Gray: 1, // Gray scale bitmap, one byte per pixel.
  BGR: 2, // 3 bytes per pixel, byte order: blue, green, red.
  BGRx: 3, // 4 bytes per pixel, byte order: blue, green, red, unused.
  BGRA: 4, // 4 bytes per pixel, byte order: blue, green, red, alpha.
};

// Page rendering flags. They can be combined with bit-wise OR.
export const FPDFRenderFlag = {
  // Set if annotations are to be rendered (high-lights, sticky-notes, ink, etc.)
  ANNOT: 0x01,
  // Set if using text rendering optimized for LCD display. This flag will only
  // take effect if anti-aliasing is enabled for text.
  LCD_TEXT: 0x02,
  // Don't use the native text output available on some platforms
  NO_NATIVETEXT: 0x04,
  // Grayscale output.
  GRAYSCALE: 0x08,
  // Obsolete, has no effect, retained for compatibility.
  DEBUG_INFO: 0x80,
  // Obsolete, has no effect, retained for compatibility.
  NO_CATCH: 0x100,
  // Limit image cache size.
  RENDER_LIMITEDIMAGECACHE: 0x200,
  // Always use halftone for image stretching.
  RENDER_FORCEHALFTONE: 0x400,
  // Render for printing.
  PRINTING: 0x800,
  // Set to disable anti-aliasing on text. This flag will also disable LCD
  // optimization for text rendering.
  RENDER_NO_SMOOTHTEXT: 0x1000,
  // Set to disable anti-aliasing on images.
  RENDER_NO_SMOOTHIMAGE: 0x2000,
  // Set to disable anti-aliasing on paths.
  RENDER_NO_SMOOTHPATH: 0x4000,
  // Set whether to render in a reverse Byte order, this flag is only used when
  // rendering to a bitmap. (what Canvas likes)
  REVERSE_BYTE_ORDER: 0x10,
  // Set whether fill paths need to be stroked. This flag is only used when
  // FPDF_COLORSCHEME is passed in, since with a single fill color for paths the
  // boundaries of adjacent fill paths are less visible.
  CONVERT_FILL_TO_STROKE: 0x20,
};

export const FPDFPageObjectType = {
  TEXT: 1,
  PATH: 2,
  IMAGE: 3,
  SHADING: 4,
  FORM: 5,
};
