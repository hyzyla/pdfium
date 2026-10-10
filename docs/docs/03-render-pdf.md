# Render PDF to image

## Load PDF document

```typescript
const document = await library.loadDocument(buff);

// ... do something with the document

document.destroy();
```

## Render PDF page

Before rendering a PDF page, you need to get it from the document. You can do this by calling `getPage` method of the document instance. First argument is the page number (starting from 0).

```typescript
const page = document.getPage(0);
```

or you can iterate over the pages using `pages` method of the document instance:

```typescript
for (const page of document.pages()) {
  // ... do something with the page
}
```

Then you can render the page to an image by calling `render` method of the page instance. It accepts an optional `PDFiumPageRenderParams` object with the following properties:

- `scale` - scale factor for the image (default is 1, which means 72 DPI, 3 almost always is enough for good quality)
- `render` - what to return: `'bitmap'` (default) returns the raw pixels. To convert them, for example to PNG, pass your own function (see below).
- `colorSpace` - color space to render to: `'RGBA'` (default, full color, 4 bytes per pixel) or `'Gray'` (grayscale, useful for OCR). `'BGRA'` still works as a deprecated alias of `'RGBA'` and returns the same bytes.
- `renderFormFields` - whether to render interactive form fields (default is `false`). Form fields are interactive elements like text boxes, checkboxes, dropdown menus, and signature fields that users can fill out in PDF documents (like tax forms, applications, or contracts).
- `transparent` - render onto a transparent background instead of the default opaque white (default is `false`). Useful when you want to composite the rendered page over other content. Only applies to `colorSpace: 'RGBA'` (the default); ignored for `'Gray'` since grayscale bitmaps have no alpha channel.

```typescript
const image = await page.render({
  scale: 3,
});
```

To render with form fields visible:

```typescript
const image = await page.render({
  scale: 3,
  renderFormFields: true,
});
```

To render onto a transparent background (e.g. for compositing as a layer):

```typescript
const image = await page.render({
  scale: 3,
  transparent: true,
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

#### render: `bitmap`

`bitmap` is the default. It returns the raw pixels: 4 bytes per pixel in RGBA order, or 1 byte per pixel with `colorSpace: 'Gray'`. Convert them to the image format you need yourself, or pass a render function as shown below.

Example:

```typescript
const image = await page.render({
  scale: 3,
  render: "bitmap",
});

console.log(image.data); // Bitmap image data as a buffer
```

#### render: custom render function

To get an image file such as PNG, pass a function as the `render` option. It receives the raw pixels with their width and height and returns the encoded image as a `Promise<Uint8Array>`. The package doesn't include an image encoder, so this example uses [sharp](https://sharp.pixelplumbing.com/), which you install separately:

```bash
npm install sharp
```

```typescript
import { type PDFiumPageRenderOptions } from "@hyzyla/pdfium";
import sharp from "sharp";

const image = await page.render({
  scale: 3,
  render: async (options: PDFiumPageRenderOptions): Promise<Uint8Array> => {
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

#### render: `width` and `height`, instead of `scale`

You can use the `width` and `height` options instead of scale to specify the exact image size in points that you want to render. In this case, the aspect ratio will not be preserved, and the image will be stretched to the specified size. If you want to preserve the aspect ratio, you can manually calculate the width and height based on the original image size and the desired scale.

```typescript
const image = await page.render({
  width: 800,
  height: 600,
});
```

## Close the page

A page stays loaded until you call `page.close()` or destroy the document. Until then you can render it, extract its text and read its objects as often as you need. When you process a large document page by page, close each page when you're done with it so memory doesn't keep growing:

```typescript
for (const page of document.pages()) {
  const image = await page.render({ scale: 3 });
  // ... save the image
  page.close();
}
```

After `close()`, you can't use the page or any objects you got from it.

## Full example

```typescript
import { promises as fs } from "fs";

import { PDFiumLibrary, type PDFiumPageRenderOptions } from "@hyzyla/pdfium";
import sharp from "sharp";

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
  const buff = await fs.readFile("test2.pdf");

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
      render: renderFunction,
    });

    // Save the PNG image to the output folder
    await fs.writeFile(`output/${page.number}.png`, Buffer.from(image.data));

    // Free the page before moving on to the next one
    page.close();
  }

  // Do not forget to destroy the document and the library
  // when you are done.
  document.destroy();
  library.destroy();
}

main();
```
