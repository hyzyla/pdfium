import {PDFiumLibrary} from '@hyzyla/pdfium';
import fs from 'fs';

async function testPdfiumPackage() {
  const library = await PDFiumLibrary.init();
  console.log("=> library initialized");

  const pdf = fs.readFileSync('sample.pdf');
  const doc = await library.loadDocument(pdf);
  console.log("=> document loaded");
  console.log("===> number of pages:", doc.getPageCount());


  const page = await doc.getPage(0);
  console.log("=> page loaded");

  const pageSize = page.getSize();
  console.log("===> page size:", pageSize.width, 'x', pageSize.height);

  doc.destroy();
  console.log("=> document destroyed");

  library.destroy();
  console.log("=> library destroyed");
}

testPdfiumPackage();