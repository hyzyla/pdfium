# Extract images from PDF page

You can extract images from the PDF page objects using the `render` method of the `PDFiumImageObject` class. The `render` method accepts the `render` option, which specifies the rendering engine to use. You can use the `sharp` rendering engine to convert the bitmap image to PNG format or you can use the `bitmap` rendering engine to get the raw bitmap image data as a buffer.

```typescript
const document = await library.loadDocument(buff);

let index = 0;

// Iterate over pages in the document
for (const page of document.pages()) {

  // Iterate over objects in the page
  for (const object of page.objects()) {

    // We are interested only in image objects
    if (object.type === "image") {

      // Render the image using the sharp rendering engine
      const { data: image } = await object.render({
        render: "sharp",
      });

      // Save the PNG image to the output folder
      await fs.writeFile(`output/${index}.png`, image.data);
      
      index++;
    }
  }
}
```


## Reduce image of extracted images

When images are extracted from the PDF page objects, they are rendered without any compression by default. You can use sharp and custom render function to compress the extracted images and reduce their size.

```typescript
import sharp from 'sharp';
import { PDFiumPageRenderOptions } from '@hyzyla/pdfium';

const document = await library.loadDocument(buff);
const page = document.getPage(0);
const object = page.getObject(0);

const image = await object.render({
  render: async (options: PDFiumPageRenderOptions): Promise<Buffer> => {
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

cosnt {
  data,
  width,
  height,
  filters,
} = object.getImageDataRaw();
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

> :warning: Images in PDF documents are not stored in specific image formats like PNG or JPEG. Instead, image bitmaps are stored in compressed formats such as DCTDecode and FlateDecode. You need to decode the image data using the appropriate decoder/filter to obtain the raw uncompressed image data. Alternatively, you can use the render method with a rendering engine like sharp to convert the image into a specific format like PNG or JPEG.