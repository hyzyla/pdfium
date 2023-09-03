# @hyzyla/pdfium

📃 [Documentation](https://pdfium.vercel.app/)

Node.js wrapper for the PDFium library:

- ⬇️ [pdfium](https://pdfium.googlesource.com/pdfium/) - source code of the PDFium library, developed by Google and used in Chrome.
- ⬇️ [pdfium-lib](https://github.com/paulocoutinhox/pdfium-lib) - project to compile PDFium library to multiple platforms, including WebAssembly.
- 📍 [@hyzyla/pdfium](https://github.com/hyzyla/pdfium) - (you are here)
  Node.js wrapper for the WebAssembly build of PDFium library.

# Features

@hyzyla/pdfium is a Node.js wrapper for the [PDFium](https://pdfium.googlesource.com/pdfium/) library:

- ⬇️ [pdfium](https://pdfium.googlesource.com/pdfium/) - an open-source library for PDF manipulation and rendering, developed by Google and used in Google Chrome browser.
- ⬇️ [pdfium-lib](https://github.com/paulocoutinhox/pdfium-lib) - project by [Paulo Coutinho](https://github.com/paulocoutinhox) to compile PDFium library to multiple platforms, including WebAssembly.
- 📍 [@hyzyla/pdfium](https://github.com/hyzyla/pdfium) - (you are here) Node.js wrapper for the WebAssembly build of PDFium library.

## Installation

```sh
# yarn add @hyzyla/pdfium
# pnpm install @hyzyla/pdfium
npm install @hyzyla/pdfium
```

## Usage

```ts
import { PDFiumLibrary } from "@hyzyla/pdfium";
import { promises as fs } from 'fs';

async main() {
  const buff = await fs.readFile('test2.pdf')

  // Initialize the library, you can do this once for the whole application
  // and reuse the library instance.
  const library = await PDFiumLibrary.init();;

  // Load the document from the buffer
  // You can also pass "password" as the second argument if the document is encrypted.
  const document = await library.loadDocument(buff);

  // Iterate over the pages, render them to PNG images and
  // save to the output folder
  for (const page of document.pages()) {
    console.log(`${i + 1} - rendering...`);

    // Render PDF page to PNG image
    const image = await page({
      scale: 3, // 3x scale (91 DPI is the default)
      render: 'sharp', // use "sharp" for converting bitmap to PNG
    });

    // Save the PNG image to the output folder
    await fs.writeFile(`output/${i + 1}.png`, image.data);
  }

  // Do not forget to destroy the document and the library
  // when you are done.
  document.destroy();
  library.destroy();
}

main();
```

## Deploy

1. Bump version in `package.json`
2. Create a new release in GitHub
3. Check status of the [GitHub Actions](https://github.com/hyzyla/pdfium/actions)
