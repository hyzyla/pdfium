import fs from "node:fs";

import { PDFiumLibrary } from "@hyzyla/pdfium";

async function testPdfiumPackage() {
  const library = await PDFiumLibrary.init();
  console.log("=> library initialized");

  const pdf = fs.readFileSync("sample.pdf");
  const doc = await library.loadDocument(pdf);
  console.log("=> document loaded");
  console.log("===> number of pages:", doc.getPageCount());

  const page = doc.getPage(0); // not async
  console.log("=> page loaded");

  const pageSize = page.getOriginalSize();
  console.log("===> page size:", pageSize.originalWidth, "x", pageSize.originalHeight);

  doc.destroy();
  console.log("=> document destroyed");

  library.destroy();
  console.log("=> library destroyed");
}

testPdfiumPackage();
