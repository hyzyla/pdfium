# Extract text from PDF page

You can extract text from the PDF page objects using the `getText` method of the `PDFiumPage` object

```ts
import { promises as fs } from "fs";

import { PDFiumLibrary } from "@hyzyla/pdfium";

async function main() {
  const buff = await fs.readFile("document.pdf");

  // Initialize the library
  const library = await PDFiumLibrary.init();

  // Load the document from the buffer
  const document = await library.loadDocument(buff);

  // Extract text from all pages
  for (const page of document.pages()) {
    console.log(`Page ${page.number + 1}:`);
    const text = page.getText();
    console.log(text);
    console.log("-------------------");
  }

  // Save text from a specific page to a file
  const page = document.getPage(0);
  const text = page.getText();
  await fs.writeFile("page1.txt", text);

  // Do not forget to destroy the document and the library
  // when you are done.
  document.destroy();
  library.destroy();
}

main();
```

## Text of individual objects

`page.objects()` returns the page's content as objects, and text objects have their own `getText` method. A text object usually holds a word or a line, not a whole paragraph.

```ts
for (const object of page.objects()) {
  if (object.type === "text") {
    console.log(object.getText());
  }
}
```

The first `getText` call on a text object loads the page's text data. It stays in memory until you close the page with `page.close()` or destroy the document.
