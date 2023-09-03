---
sidebar_position: 1
---

# Render PDF to image

## Load PDFiumLibrary

First of all, you need to create an instance of PDFiumLibrary. You can do this once for the whole application and reuse the library instance during the application lifetime.

```typescript
import { PDFiumLibrary } from '@hyzyla/pdfium';

const library = await PDFiumLibrary.init();

// ... do something with the library

library.destroy();
```

## Load PDF document

```typescript
const document = await library.loadDocument(buff);

// ... do something with the document

document.destroy();
```

## Render PDF page

To render a PDF page to an image, use `renderPage` method of the document instance. First argument is the page number (starting from 0). Second argument is an options object with the following properties:

- `scale` - scale factor for the image (default is 1, which means 91 DPI, 3 almost always is enough for good quality)
- `render` - render engine to use, can be either `sharp`, `bitmap` (default is `bitmap`) or custom render function. If you need to render to PNG, it's recommended to use `sharp` render function.

```typescript
const image = await document.renderPage(0, {
  scale: 3,
  render: 'sharp',
});
```

Result is an object with the following properties:

- `data` - image data as a buffer
- `width` - image width in points (after scaling)
- `height` - image height in points (after scaling)
- `originalWidth` - original page width in points (before scaling)
- `originalHeight` - original page height in points (before scaling)

:::info

DPI is dots per inch, it's a measure of image resolution and commonly used for printing

Points are a typographic unit of measure, 1 point is equal to 1/72 of an inch
:::

#### render: `sharp`

It's recommended to use `sharp` for rendering to PNG. `sharp` is an optional dependency, so you need to install it manually, before using it:

```bash
npm install sharp
# Or if you use yarn or pnpm:
# yarn add sharp
# pnpm install sharp
```

Example:

```typescript
const image = await document.renderPage(0, {
  scale: 3,
  render: 'sharp',
});

console.log(image.data); // PNG image data as a buffer
```

#### render: `bitmap`

`bitmap` is the default render engine. It renders PDF page to a bitmap image, which is a buffer of RGBA pixels (4 channels). You can use it to render to any image format, but you need to convert the bitmap to the desired format yourself. It's default render engine, because it doesn't require any additional dependencies.

Example:

```typescript
const image = await document.renderPage(0, {
  scale: 3,
  render: 'bitmap',
});

console.log(image.data); // Bitmap image data as a buffer
```

#### render: custom render function

You can also pass a custom render function as the `render` option. It should be a function that accepts a `RenderPageOptions` object and returns a `Promise<Buffer>` object. You can use it to render to any image format:

```typescript
import sharp from 'sharp';
import { type PDFiumPageRenderOptions } from '@hyzyla/pdfium';

const image = await document.renderPage(0, {
  scale: 3,
  render: async (options: PDFiumPageRenderOptions): Promise<Buffer> => {
    return await sharp(options.data, {
      raw: {
        width: options.width,
        height: options.height,
        channels: 4,
      },
    })
      .png()
      .toBuffer();
  },
});
```

## Full example

```typescript
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
  const numOfPages = document.getPageCount();
  for (let i = 0; i < numOfPages; i++) {
    console.log(`${i + 1} - rendering...`);

    // Render PDF page to PNG image
    const image = await document.renderPage(i, {
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
