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
