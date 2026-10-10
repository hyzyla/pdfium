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

## Extract raw uncompressed image data

You can also extract the raw uncompressed image data from the PDF page objects using the `getImageDataRaw` method of the `PDFiumImageObject` class. The getImageDataRaw method returns the raw uncompressed image data as a buffer, along with the image's width, height, and the filters/decoders used to decode the image data.

```typescript
const document = await library.loadDocument(buff);

const page = document.getPage(0);
const object = page.getObject(0);

const { data, width, height, filters } = await object.getImageDataRaw();
/*
Example output:
  {
    data: [...], // Raw uncompressed image data
    width: 100, // Image width
    height: 100, // Image height
    filters: ["DCTDecode"], // Filters/decoders used to decode the image data
  }
*/
```

> :warning: Images in PDF documents are not stored in specific image formats like PNG or JPEG. Instead, image bitmaps are stored in compressed formats such as DCTDecode and FlateDecode. You need to decode the image data using the appropriate decoder/filter to obtain the raw uncompressed image data. You can also use the `render` method with a render function, for example one based on sharp, to convert the image to PNG or JPEG.
