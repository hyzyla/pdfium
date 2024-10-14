# @hyzyla/pdfium

📃 [Documentation](https://pdfium.js.org/docs/intro)

TypeScript/JavaScript wrapper for the PDFium library:

- ⬇️ [pdfium](https://pdfium.googlesource.com/pdfium/) - source code of the PDFium library, developed by Google and used in Chrome.
- ⬇️ [pdfium-lib](https://github.com/paulocoutinhox/pdfium-lib) - project to compile PDFium library to multiple platforms, including WebAssembly.
- 📍 [@hyzyla/pdfium](https://github.com/hyzyla/pdfium) - (you are here)
 TypeScript/JavaScript wrapper for the WebAssembly build of PDFium library.

# Features
-  📦 Zero dependencies - PDFium library is compiled to WebAssembly and bundled with the package.
- 🚀 Fast - PDFium can be faster than PDF.js, because it's originally written in C++ and compiled to WebAssembly, while PDF.js is entirely written in JavaScript.
- 🔒 Type-safe - TypeScript definitions are included.
- 🗼 Works in browser and Node.js

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
import sharp from 'sharp';


/**
 * For this and the following examples, we will use "sharp" library to convert
 * the raw bitmap data to PNG images. You can use any other library or write
 * your own function to convert the raw bitmap data to PNG images.
 */
async function renderFunction(options: PDFiumPageRenderOptions) {
  return await sharp(options.data, {
    raw: {
      width: options.width,
      height: options.height,
      channels: 4,
    },
  })
    .png()
    .toBuffer();
}


async function main() {
  const buff = await fs.readFile('test2.pdf');

  // Initialize the library, you can do this once for the whole application
  // and reuse the library instance.
  const library = await PDFiumLibrary.init();

  // Load the document from the buffer
  // You can also pass "password" as the second argument if the document is encrypted.
  const document = await library.loadDocument(buff);

  // Iterate over the pages, render them to PNG images and
  // save to the output folder
  for (const page of document.pages()) {
    console.log(`${page.number} - rendering...`);

    // Render PDF page to PNG image
    const image = await page.render({
      scale: 3, // 3x scale (72 DPI is the default)
      render: renderFunction,  // sharp function to convert raw bitmap data to PNG
    });

    // Save the PNG image to the output folder
    await fs.writeFile(`output/${page.number}.png`, Buffer.from(image.data));
  }

  // Do not forget to destroy the document and the library
  // when you are done.
  document.destroy();
  library.destroy();
}

main();
```

## Release

1. Bump version in `package.json`: `npm version patch`
2. Create a new release in GitHub
3. Check status of the [GitHub Actions](https://github.com/hyzyla/pdfium/actions)
