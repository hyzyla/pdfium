import { promises as fs, promises } from "node:fs";

import { toMatchImageSnapshot } from "jest-image-snapshot";
import sharp from "sharp";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { type PDFiumDocument, PDFiumLibrary, PDFiumPage, type PDFiumPageRenderOptions } from "../src/index.esm";
import { PDFiumLibrary as PDFiumLibraryBase } from "../src/library";
import type { PDFiumImageObject } from "../src/objects";

expect.extend({ toMatchImageSnapshot });

const A4_SIZE = {
  width: 595, // px = 210 mm ~ 8.27 inches => 72 DPI
  height: 841, // px = 297 mm ~ 11.69 inches => 72 DPI
};

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

describe("PDFium", () => {
  let library: PDFiumLibrary;
  beforeAll(async () => {
    library = await PDFiumLibrary.init({
      wasmBinary: await fs.readFile("./src/vendor/pdfium.wasm"),
    });
  });

  afterAll(() => {
    library?.destroy();
  });

  async function loadDocument(filename: string, callback: (document: PDFiumDocument) => Promise<void>) {
    const buff = await fs.readFile(`test/data/${filename}`);
    const document = await library.loadDocument(buff);
    await callback(document);
    document.destroy();
  }

  test("init should return an instance of the imported class", () => {
    expect(library).toBeInstanceOf(PDFiumLibrary);
  });

  describe("PDFiumDocument", () => {
    test("should load a document from a buffer and return the number of pages", async () => {
      await loadDocument("test_1.pdf", async (document) => {
        const numOfPages = document.getPageCount();
        expect(numOfPages).toBe(4);
      });
    });

    test("shoul iterate over pages", async () => {
      await loadDocument("test_1.pdf", async (document) => {
        let i = 0;
        for (const page of document.pages()) {
          expect(page).toBeInstanceOf(PDFiumPage);
          expect(page.number).toBe(i);
          i++;
        }
      });
    });

    test("should load document successfully even after a previous unrelated error", async () => {
      let doc1: PDFiumDocument | undefined;
      let doc2: PDFiumDocument | undefined;
      try {
        // Load the first document - it's not a PDF file, so it will throw an error
        const buff1 = await fs.readFile("test/data/test_5.txt");
        try {
          doc1 = await library.loadDocument(buff1);
        } catch {
          // do nothing
        }

        // Now, try loading a second, different document
        const buff2 = await fs.readFile("test/data/test_3_with_images.pdf");
        doc2 = await library.loadDocument(buff2);

        // Verify the second document loaded correctly despite the previous error
        expect(doc2).toBeDefined();
        expect(doc2.getPageCount()).toBe(1);
      } finally {
        doc1?.destroy();
        doc2?.destroy();
      }
    });
  });

  describe("PDFiumPage", () => {
    test("should render a bitmap of a page", async () => {
      await loadDocument("test_1.pdf", async (document) => {
        const buff = await document.getPage(0).render({
          scale: 1,
          render: "bitmap",
        });
        expect(buff.height).toBe(A4_SIZE.height);
        expect(buff.width).toBe(A4_SIZE.width);
        expect(buff.originalHeight).toBe(A4_SIZE.height);
        expect(buff.originalWidth).toBe(A4_SIZE.width);
        expect(buff.data.length).toBe(A4_SIZE.height * A4_SIZE.width * 4);
      });
    });
    test("should render a bitmap of a page with scale", async () => {
      await loadDocument("test_1.pdf", async (document) => {
        const buff = await document.getPage(0).render({
          scale: 3,
          render: "bitmap",
        });
        expect(buff.height).toBe(A4_SIZE.height * 3);
        expect(buff.width).toBe(A4_SIZE.width * 3);
        expect(buff.originalHeight).toBe(A4_SIZE.height);
        expect(buff.originalWidth).toBe(A4_SIZE.width);
        expect(buff.data.length).toBe(A4_SIZE.height * 3 * A4_SIZE.width * 3 * 4);
      });
    });

    test("should render a sharp image of a page", async () => {
      await loadDocument("test_1.pdf", async (document) => {
        const result = await document.getPage(0).render({
          scale: 1,
          render: renderFunction,
        });
        expect(result.height).toBe(A4_SIZE.height);
        expect(result.width).toBe(A4_SIZE.width);
        expect(result.originalHeight).toBe(A4_SIZE.height);
        expect(result.originalWidth).toBe(A4_SIZE.width);
        expect(result.data).toMatchImageSnapshot();
      });
    });

    test("should render a sharp image of a page with scale", async () => {
      await loadDocument("test_1.pdf", async (document) => {
        const result = await document.getPage(0).render({
          scale: 3,
          render: renderFunction,
        });
        expect(result.height).toBe(A4_SIZE.height * 3);
        expect(result.width).toBe(A4_SIZE.width * 3);
        expect(result.originalHeight).toBe(A4_SIZE.height);
        expect(result.originalWidth).toBe(A4_SIZE.width);
        expect(result.data).toMatchImageSnapshot();
      });
    });

    test("should render a sharp image of a page with custom smaller width and height", async () => {
      await loadDocument("test_1.pdf", async (document) => {
        const result = await document.getPage(0).render({
          // original size is 595x841, but let"s try use different proportions to see how it works
          width: 100,
          height: 100,
          render: renderFunction,
        });
        expect(result.height).toBe(100);
        expect(result.width).toBe(100);
        expect(result.originalHeight).toBe(A4_SIZE.height);
        expect(result.originalWidth).toBe(A4_SIZE.width);
        expect(result.data).toMatchImageSnapshot();
      });
    });

    test("should render a sharp image of a page with custom bigger width and height", async () => {
      await loadDocument("test_1.pdf", async (document) => {
        const result = await document.getPage(0).render({
          width: 9000,
          height: 4000,
          render: renderFunction,
        });
        expect(result.height).toBe(4000);
        expect(result.width).toBe(9000);
        expect(result.originalHeight).toBe(A4_SIZE.height);
        expect(result.originalWidth).toBe(A4_SIZE.width);
        expect(result.data).toMatchImageSnapshot();
      });
    });

    test("should render with a transparent background when transparent: true", async () => {
      await loadDocument("test_9_transparent.pdf", async (document) => {
        const result = await document.getPage(0).render({
          scale: 1,
          render: renderFunction,
          transparent: true,
        });

        // Top-left corner pixel should be fully transparent (alpha = 0).
        const { data: raw, info } = await sharp(result.data).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
        expect(info.channels).toBe(4);
        expect(raw[3]).toBe(0);

        expect(result.data).toMatchImageSnapshot();
      });
    });

    test("should render with a white background by default", async () => {
      await loadDocument("test_9_transparent.pdf", async (document) => {
        const result = await document.getPage(0).render({
          scale: 1,
          render: renderFunction,
        });

        // Top-left corner pixel should be fully opaque white (alpha = 255, RGB = 255,255,255).
        const { data: raw, info } = await sharp(result.data).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
        expect(info.channels).toBe(4);
        expect(raw[0]).toBe(255);
        expect(raw[1]).toBe(255);
        expect(raw[2]).toBe(255);
        expect(raw[3]).toBe(255);
      });
    });

    test("should call a custom render function", async () => {
      await loadDocument("test_1.pdf", async (document) => {
        const result = await document.getPage(0).render({
          scale: 1,
          render: async (options) => {
            expect(options.data).toBeInstanceOf(Uint8Array);
            expect(options.height).toBe(A4_SIZE.height);
            expect(options.width).toBe(A4_SIZE.width);
            return new TextEncoder().encode("test");
          },
        });
        expect(result).toEqual({
          data: new TextEncoder().encode("test"),
          height: A4_SIZE.height,
          width: A4_SIZE.width,
          originalHeight: A4_SIZE.height,
          originalWidth: A4_SIZE.width,
        });
      });
    });

    test("should extract text after rendering the same page", async () => {
      await loadDocument("test_1.pdf", async (document) => {
        const expected = document.getPage(0).getText();
        expect(expected.length).toBeGreaterThan(0);

        const page = document.getPage(0);
        await page.render({ scale: 1, render: "bitmap" });
        expect(page.getText()).toBe(expected);

        await page.render({ scale: 1, render: "bitmap", renderFormFields: true });
        expect(page.getText()).toBe(expected);
      });
    });

    test("should render the same page more than once", async () => {
      await loadDocument("test_1.pdf", async (document) => {
        const page = document.getPage(0);
        const first = await page.render({ scale: 1, render: "bitmap" });
        const second = await page.render({ scale: 1, render: "bitmap" });
        expect(second.data).toEqual(first.data);
        expect(page.getObjectCount()).toBe(182);
      });
    });

    test("should throw when using a closed page", async () => {
      await loadDocument("test_1.pdf", async (document) => {
        const page = document.getPage(0);
        page.close();
        page.close(); // closing twice is a no-op
        expect(() => page.getText()).toThrow("Page is closed");
        await expect(page.render()).rejects.toThrow("Page is closed");
      });
    });

    test("should close open pages when the document is destroyed", async () => {
      const buff = await fs.readFile("test/data/test_1.pdf");
      const document = await library.loadDocument(buff);
      const page = document.getPage(0);
      document.getPage(1).close();
      document.destroy();
      expect(() => page.getText()).toThrow("Page is closed");
    });

    test("should open a PDF with password", async () => {
      const buff = await fs.readFile("test/data/test_1_pass_12345678.pdf");
      const password = "12345678";
      const document = await library.loadDocument(buff, password);
      document.destroy();
    });

    test("should open a PDF with password 2", async () => {
      const buff = await fs.readFile("test/data/test_2_pass_12345678.pdf");
      const password = "12345678";
      const document = await library.loadDocument(buff, password);
      document.destroy();
    });
  });

  describe("PDFiumImageObject", () => {
    test("get page objects count", async () => {
      await loadDocument("test_1.pdf", async (document) => {
        const page = document.getPage(0);
        const count = page.getObjectCount();
        expect(count).toBe(182);
      });
    });

    test("get page objects count 2", async () => {
      await loadDocument("test_3_with_images.pdf", async (document) => {
        const page = document.getPage(0);
        const count = page.getObjectCount();
        expect(count).toBe(7);
      });
    });

    test("get page object", async () => {
      await loadDocument("test_3_with_images.pdf", async (document) => {
        const page = document.getPage(0);
        const object1 = page.getObject(0);
        expect(object1).toBeDefined();
      });
    });

    test("get page object type", async () => {
      await loadDocument("test_3_with_images.pdf", async (document) => {
        const page = document.getPage(0);
        const object1 = page.getObject(0);
        expect(object1.type).toBe("text");
      });
    });

    test("get page object type stat 1", async () => {
      await loadDocument("test_1.pdf", async (document) => {
        const page = document.getPage(0);
        const typeStat = new Map<string, number>();
        for (const object of page.objects()) {
          const type = object.type;
          typeStat.set(type, (typeStat.get(type) || 0) + 1);
        }
        const typeStatObj = Object.fromEntries(typeStat);
        expect(typeStatObj).toEqual({
          text: 182,
        });
      });
    });

    test("get page object type stat 2", async () => {
      await loadDocument("test_3_with_images.pdf", async (document) => {
        const page = document.getPage(0);
        const typeStat = new Map<string, number>();
        for (const object of page.objects()) {
          const type = object.type;
          typeStat.set(type, (typeStat.get(type) || 0) + 1);
        }
        const typeStatObj = Object.fromEntries(typeStat);
        expect(typeStatObj).toEqual({
          image: 3,
          text: 4,
        });
      });
    });

    test("get page object image", async () => {
      await loadDocument("test_3_with_images.pdf", async (document) => {
        for (const page of document.pages()) {
          for (const object of page.objects()) {
            if (object.type === "image") {
              const imageObj = object as PDFiumImageObject;

              const { data: image } = await imageObj.render({
                render: renderFunction,
              });
              expect(image).toBeInstanceOf(Uint8Array);
              expect(image).toMatchImageSnapshot();
            }
          }
        }
      });
    });

    test("get page object image raw", async () => {
      await loadDocument("test_4_with_images.pdf", async (document) => {
        const expected = [
          {
            size: 1523, // 1.5 KB
            width: 313,
            height: 234,
            filters: ["DCTDecode"],
          },
          {
            size: 14679, // 14 KB
            width: 313,
            height: 234,
            filters: ["DCTDecode"],
          },
          {
            size: 57828, // 57 KB
            width: 400,
            height: 400,
            filters: ["FlateDecode"],
          },
          {
            size: 680515, // 680 KB
            width: 640,
            height: 480,
            filters: ["FlateDecode"],
          },
          {
            size: 176469, // 176 KB
            width: 720,
            height: 486,
            filters: ["FlateDecode"],
          },
          {
            size: 1064661, // 1 MB
            width: 762,
            height: 1309,
            filters: ["FlateDecode"],
          },
        ];

        const result: { size: number; width: number; height: number; filters: string[] }[] = [];
        for (const page of document.pages()) {
          for (const object of page.objects()) {
            if (object.type === "image") {
              const imageObj = object as PDFiumImageObject;

              const image = await imageObj.getImageDataRaw();
              result.push({
                size: image.data.length,
                width: image.width,
                height: image.height,
                filters: image.filters,
              });
            }
          }
        }
        expect(result).toMatchObject(expected);
      });
    });

    test("get page object image jpeg", async () => {
      await loadDocument("test_4_with_images.pdf", async (document) => {
        for (const page of document.pages()) {
          for (const object of page.objects()) {
            if (object.type === "image") {
              const imageObj = object as PDFiumImageObject;

              const image = await imageObj.render({
                render: async (options) => {
                  const { default: sharp } = await import("sharp");
                  return await sharp(options.data, {
                    raw: {
                      width: options.width,
                      height: options.height,
                      channels: 4,
                    },
                  })
                    .jpeg()
                    .toBuffer();
                },
              });
              // we can't use "toMatchImageSnapshot" here because it doesn't support jpeg
              expect(image.data).toBeDefined();
            }
          }
        }
      });
    });
  });

  test("should render an image of a page without form elements", async () => {
    await loadDocument("test_6_with_form.pdf", async (document) => {
      const result = await document.getPage(0).render({
        scale: 3,
        render: renderFunction,
      });
      expect(result.data).toMatchImageSnapshot();
    });
  });

  test("should render an image of a page with form fields enabled", async () => {
    await loadDocument("test_6_with_form.pdf", async (document) => {
      const result = await document.getPage(0).render({
        scale: 3,
        renderFormFields: true,
        render: renderFunction,
      });
      expect(result.data).toMatchImageSnapshot();
    });
  });

  test("should render an image of a page without form elements (2)", async () => {
    await loadDocument("test_7_with_form.pdf", async (document) => {
      const result = await document.getPage(0).render({
        scale: 3,
        render: renderFunction,
      });
      expect(result.data).toMatchImageSnapshot();
    });
  });

  test("should render an image of a page with form fields enabled (2)", async () => {
    await loadDocument("test_7_with_form.pdf", async (document) => {
      const result = await document.getPage(0).render({
        scale: 3,
        renderFormFields: true,
        render: renderFunction,
      });
      expect(result.data).toMatchImageSnapshot();
    });
  });

  test("should render with signature", async () => {
    await loadDocument("test_8_with_signature.pdf", async (document) => {
      const result = await document.getPage(0).render({
        scale: 3,
        render: renderFunction,
        renderFormFields: true,
      });
      expect(result.data).toMatchImageSnapshot();
    });
  });

  test("should render a file in gray scale", async () => {
    const buff = await fs.readFile(`test/data/test_3_with_images.pdf`);
    const document = await library.loadDocument(buff);

    const page = document.getPage(0);
    const result = await page.render({
      scale: 1,
      colorSpace: "Gray",
      render: async (options) => {
        return await sharp(options.data, {
          raw: {
            width: options.width,
            height: options.height,
            channels: 1,
          },
        })
          .png()
          .toBuffer();
      },
    });

    const fileName = "test_3_with_images_gray.png";

    await promises.writeFile(fileName, result.data);

    // file should exist
    const stat = await promises.stat(fileName);

    expect(stat.isFile()).toBe(true);

    // comment this line if you want to see it
    await promises.rm(fileName);
    document.destroy();
  });

  test("should render gray scale", async () => {
    const buff = await fs.readFile(`test/data/test_3_with_images.pdf`);
    const document = await library.loadDocument(buff);

    const page = document.getPage(0);
    const result = await page.render({
      scale: 1,
      colorSpace: "Gray",
      render: "bitmap",
    });

    const metadata = await sharp(result.data, {
      raw: {
        width: result.width,
        height: result.height,
        channels: 1,
      },
    }).metadata();

    expect(metadata.channels).toBe(1);
    expect(metadata.hasAlpha).toBe(false);
    expect(result.data.length).toBe(result.width * result.height);

    document.destroy();
  });

  test("scale should be 1 by default, colorSpace to BGRA and render function to bitmap (thus no arguments needed)", async () => {
    const buff = await fs.readFile(`test/data/test_3_with_images.pdf`);
    const document = await library.loadDocument(buff);

    const page = document.getPage(0);
    const result = await page.render();

    const metadata = await sharp(result.data, {
      raw: {
        width: result.width,
        height: result.height,
        channels: 4,
      },
    }).metadata();

    expect(metadata.channels).toBe(4);
    expect(metadata.hasAlpha).toBe(true);
    expect(metadata.space).toBe("srgb");
    expect(result.data.length).toBe(result.width * result.height * 4);

    document.destroy();
  });

  test("should init with a custom instantiateWasm", async () => {
    const wasm = await fs.readFile("./src/vendor/pdfium.wasm");
    const customLibrary = await PDFiumLibrary.init({
      instantiateWasm: (imports, successCallback) => {
        void WebAssembly.instantiate(wasm, imports).then(({ instance, module }) => successCallback(instance, module));
      },
    });

    const document = await customLibrary.loadDocument(await fs.readFile("test/data/test_1.pdf"));
    expect(document.getPageCount()).toBe(4);

    document.destroy();
    customLibrary.destroy();
  });
});

describe("PDFiumLibrary.initBase", () => {
  test("names the missing wasm option when loading fails outside Node", async () => {
    const versions = Object.getOwnPropertyDescriptor(process, "versions")!;
    Object.defineProperty(process, "versions", { ...versions, value: {} });
    try {
      const init = PDFiumLibraryBase.initBase({
        vendor: async () => {
          throw new Error("pdfium.wasm not found");
        },
      });
      await expect(init).rejects.toThrow(/wasmUrl, wasmBinary is required[\s\S]*pdfium\.wasm not found/);
    } finally {
      Object.defineProperty(process, "versions", versions);
    }
  });

  test("keeps the original error in Node", async () => {
    const init = PDFiumLibraryBase.initBase({
      vendor: async () => {
        throw new Error("pdfium.wasm not found");
      },
    });
    await expect(init).rejects.toThrow(/^pdfium\.wasm not found$/);
  });
});
