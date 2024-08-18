import { promises as fs } from "node:fs";
import sharp from "sharp";

import { toMatchImageSnapshot } from "jest-image-snapshot";
import { test, describe, expect, beforeAll, afterAll } from "vitest";

import { type PDFiumDocument, PDFiumLibrary, PDFiumPage, PDFiumPageRenderOptions } from "../src/index";
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


test("adds 1 + 2 to equal 3", () => {
  expect(1 + 2).toBe(3);
});

describe("PDFium", () => {
  let library: PDFiumLibrary;
  beforeAll(async () => {
    library = await PDFiumLibrary.init();
  });

  afterAll(() => {
    library.destroy();
  });

  async function loadDocument(
    filename: string,
    callback: (document: PDFiumDocument) => Promise<void>,
  ) {
    const buff = await fs.readFile(`test/data/${filename}`);
    const document = await library.loadDocument(buff);
    await callback(document);
    document.destroy();
  }

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
        expect(buff.data.length).toBe(
          A4_SIZE.height * 3 * A4_SIZE.width * 3 * 4,
        );
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
          // original size is 595x841, but let's try use different proportions to see how it works
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
        ]

        const result: any[] = [];
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
              })
            }
          }
        }
        expect(result).toMatchObject(expected)
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
                }
              });
              // we can't use "toMatchImageSnapshot" here because it doesn't support jpeg
              expect(image.data).toBeDefined();
            }
          }
        }
      });
    });
  });
});
