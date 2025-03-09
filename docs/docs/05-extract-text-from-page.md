# Extract text from PDF page

You can extract text from the PDF page objects using the `getText` method of the `PDFiumPage` object


```ts
import { PDFiumLibrary } from "@hyzyla/pdfium";
import { promises as fs } from 'fs';

async function main() {
  const buff = await fs.readFile('document.pdf');

  // Initialize the library
  const library = await PDFiumLibrary.init();

  // Load the document from the buffer
  const document = await library.loadDocument(buff);

  // Extract text from all pages
  for (const page of document.pages()) {
    console.log(`Page ${page.number + 1}:`);
    const text = page.getText();
    console.log(text);
    console.log('-------------------');
  }

  // Save text from a specific page to a file
  const page = document.getPage(0);
  const text = page.getText();
  await fs.writeFile('page1.txt', text);

  // Do not forget to destroy the document and the library
  // when you are done.
  document.destroy();
  library.destroy();
}

main();
```