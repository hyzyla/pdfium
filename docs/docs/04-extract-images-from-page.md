# Extract images from PDF page

You can extract images from the PDF page objects with the `render` method of `PDFiumImageObject`. By default it returns raw RGBA pixels. To save the image as PNG or JPEG, pass a render function, such as the sharp-based `renderFunction` from [Render PDF to image](./03-render-pdf.md).

```typescript
const document = await library.loadDocument(buff);

let index = 0;

// Iterate over pages in the document
for (const page of document.pages()) {
  // Iterate over objects in the page
  for (const object of page.objects()) {
    // We are interested only in image objects
    if (object.type === "image") {
      // Render the image to PNG with the sharp-based render function
      const { data } = await object.render({
        render: renderFunction,
      });

      // Save the PNG image to the output folder
      await fs.writeFile(`output/${index}.png`, data);

      index++;
    }
  }
}
```

## Reduce image size of extracted images

When images are extracted from the PDF page objects, they are rendered without any compression by default. You can use sharp and custom render function to compress the extracted images and reduce their size.

```typescript
import { type PDFiumPageRenderOptions } from "@hyzyla/pdfium";
import sharp from "sharp";

const document = await library.loadDocument(buff);
const page = document.getPage(0);
const object = page.getObject(0);

const image = await object.render({
  render: async (options: PDFiumPageRenderOptions): Promise<Uint8Array> => {
    return await sharp(options.data, {
      raw: {
        width: options.width,
        height: options.height,
        channels: 4,
      },
    })
      .jpeg({ quality: 80 }) // Use JPEG format with 80% quality
      .toBuffer();
  },
});
```

## Extract raw image data

The `getImageDataRaw` method of `PDFiumImageObject` returns the image data as it's stored in the PDF, along with the image's width and height and the filters the data is encoded with.

```typescript
const document = await library.loadDocument(buff);

const page = document.getPage(0);
const object = page.getObject(0);

const { data, width, height, filters } = await object.getImageDataRaw();
/*
Example output:
  {
    data: [...], // Image data as stored in the PDF, still encoded
    width: 100, // Image width
    height: 100, // Image height
    filters: ["DCTDecode"], // Filters the data is encoded with
  }
*/
```

PDF doesn't store images as PNG files. Most images are pixels compressed with a filter such as `FlateDecode`, and you have to decode them yourself or use `render`. JPEG images are the exception: when `filters` is `["DCTDecode"]`, the data is a complete JPEG file. You can save it as is, which keeps the original quality and is usually much smaller than a PNG from `render`:

```typescript
let index = 0;

for (const page of document.pages()) {
  for (const object of page.objects()) {
    if (object.type !== "image") {
      continue;
    }
    const { data, filters } = await object.getImageDataRaw();
    if (filters.length === 1 && filters[0] === "DCTDecode") {
      // A JPEG image, saved without re-encoding
      await fs.writeFile(`output/${index}.jpg`, data);
    } else {
      const { data: png } = await object.render({ render: renderFunction });
      await fs.writeFile(`output/${index}.png`, png);
    }
    index++;
  }
}
```

The JPEG is the image exactly as stored, so anything the PDF applies on top of it, such as a transparency mask, isn't included.
