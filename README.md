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

With npm

```sh
npm install @hyzyla/pdfium
```

or with yarn

```sh
yarn add @hyzyla/pdfium
```

## Usage

```ts
import { PDFiumLibrary } from "@hyzyla/pdfium";
import { promises as fs } from 'fs';

async main() {
  const library = await PDFiumLibrary.init();
  const buff = await fs.readFile('test2.pdf');

  const document = await library.loadDocument(buff);

  for (const page of document.pages()) {
    console.log(`${i + 1} - rendering...`);
    const image = await page.render();
    await fs.writeFile(`output/${i + 1}.png`, image.data);
  }
  document.destroy();
  library.destroy();
}
main();
```

## Deploy

1. Bump version in `package.json`
2. Create a new release in GitHub
3. Check status of the [GitHub Actions](https://github.com/hyzyla/pdfium/actions)
