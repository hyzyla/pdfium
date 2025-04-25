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
- `render` - render engine to use, can be either `sharp`, `bitmap` (default is `bitmap`) or custom render function. If you need to render to PNG, it's recommended to use `sharp` render function.
- `renderFormFields` - whether to render interactive form fields (default is `false`). Form fields are interactive elements like text boxes, checkboxes, dropdown menus, and signature fields that users can fill out in PDF documents (like tax forms, applications, or contracts).

```typescript
const image = await page.render({
  scale: 3,
  render: 'sharp',
});
```

To render with form fields visible:

```typescript
const image = await page.render({
  scale: 3,
  render: 'sharp',
  renderFormFields: true,
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
# yarn add sharp
# pnpm install sharp
npm install sharp

```

Example:

```typescript
const image = await page.render({
  scale: 3,
  render: 'sharp',
});

console.log(image.data); // PNG image data as a buffer
```

#### render: `bitmap`

`bitmap` is the default render engine. It renders PDF page to a bitmap image, which is a buffer of RGBA pixels (4 channels). You can use it to render to any image format, but you need to convert the bitmap to the desired format yourself. It's default render engine, because it doesn't require any additional dependencies.

Example:

```typescript
const image = await page.render({
  scale: 3,
  render: 'bitmap',
});

console.log(image.data); // Bitmap image data as a buffer
```

#### render: custom render function

You can also pass a custom render function as the `render` option. It should be a function that accepts a `RenderPageOptions` object and returns a `Promise<Uint8Array>` object. You can use it to render to any image format:

```typescript
import sharp from 'sharp';
import { type PDFiumPageRenderOptions } from '@hyzyla/pdfium';

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
  render: 'sharp',
});
```

## Full example

```typescript
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


async main() {
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
      render: renderFunction, 
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
