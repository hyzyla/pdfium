import { PDFiumLibrary, type PDFiumPageRender } from "@hyzyla/pdfium";

export async function render(): Promise<PDFiumPageRender> {
  const library = await PDFiumLibrary.init();
  const document = await library.loadDocument(new Uint8Array());
  return document.getPage(0).render({ scale: 2, render: "bitmap" });
}
