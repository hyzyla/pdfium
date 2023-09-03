import { promises as fs } from 'fs';

import { toMatchImageSnapshot } from 'jest-image-snapshot';

import { PDFiumDocument, PDFiumLibrary, PDFiumPage } from '../src/index';

expect.extend({ toMatchImageSnapshot });

const A1_SIZE = {
  width: 595,
  height: 841,
};

test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});

describe('PDFium', () => {
  let library: PDFiumLibrary;
  beforeAll(async () => {
    library = await PDFiumLibrary.init();
  });

  afterAll(() => {
    library.destroy();
  });

  async function loadDocument(filename: string, callback: (document: PDFiumDocument) => Promise<void>) {
    const buff = await fs.readFile(`test/data/${filename}`);
    const document = await library.loadDocument(buff);
    await callback(document);
    document.destroy();
  }

  describe('PDFiumDocument', () => {
    test('should load a document from a buffer and return the number of pages', async () => {
      await loadDocument('test_1.pdf', async (document) => {
        const numOfPages = document.getPageCount();
        expect(numOfPages).toBe(4);
      });
    });

    test('shoul iterate over pages', async () => {
      await loadDocument('test_1.pdf', async (document) => {
        let i = 0;
        for (const page of document.pages()) {
          expect(page).toBeInstanceOf(PDFiumPage);
          expect(page.number).toBe(i);
          i++;
        }
      });
    });
  });

  describe('PDFiumPage', () => {
    test('should render a bitmap of a page', async () => {
      await loadDocument('test_1.pdf', async (document) => {
        const buff = await document.getPage(0).render({
          scale: 1,
          render: 'bitmap',
        });
        expect(buff.height).toBe(A1_SIZE.height);
        expect(buff.width).toBe(A1_SIZE.width);
        expect(buff.originalHeight).toBe(A1_SIZE.height);
        expect(buff.originalWidth).toBe(A1_SIZE.width);
        expect(buff.data.length).toBe(A1_SIZE.height * A1_SIZE.width * 4);
      });
    });
    test('should render a bitmap of a page with scale', async () => {
      await loadDocument('test_1.pdf', async (document) => {
        const buff = await document.getPage(0).render({
          scale: 3,
          render: 'bitmap',
        });
        expect(buff.height).toBe(A1_SIZE.height * 3);
        expect(buff.width).toBe(A1_SIZE.width * 3);
        expect(buff.originalHeight).toBe(A1_SIZE.height);
        expect(buff.originalWidth).toBe(A1_SIZE.width);
        expect(buff.data.length).toBe(A1_SIZE.height * 3 * A1_SIZE.width * 3 * 4);
      });
    });

    test('should render a sharp image of a page', async () => {
      await loadDocument('test_1.pdf', async (document) => {
        const result = await document.getPage(0).render({
          scale: 1,
          render: 'sharp',
        });
        expect(result.height).toBe(A1_SIZE.height);
        expect(result.width).toBe(A1_SIZE.width);
        expect(result.originalHeight).toBe(A1_SIZE.height);
        expect(result.originalWidth).toBe(A1_SIZE.width);
        expect(result.data).toMatchImageSnapshot();
      });
    });

    test('should render a sharp image of a page with scale', async () => {
      await loadDocument('test_1.pdf', async (document) => {
        const result = await document.getPage(0).render({
          scale: 3,
          render: 'sharp',
        });
        expect(result.height).toBe(A1_SIZE.height * 3);
        expect(result.width).toBe(A1_SIZE.width * 3);
        expect(result.originalHeight).toBe(A1_SIZE.height);
        expect(result.originalWidth).toBe(A1_SIZE.width);
        expect(result.data).toMatchImageSnapshot();
      });
    });

    test('should call a custom render function', async () => {
      await loadDocument('test_1.pdf', async (document) => {
        const result = await document.getPage(0).render({
          scale: 1,
          render: async (options) => {
            expect(options.data).toBeInstanceOf(Buffer);
            expect(options.height).toBe(A1_SIZE.height);
            expect(options.width).toBe(A1_SIZE.width);
            return Buffer.from('test');
          },
        });
        expect(result).toEqual({
          data: Buffer.from('test'),
          height: A1_SIZE.height,
          width: A1_SIZE.width,
          originalHeight: A1_SIZE.height,
          originalWidth: A1_SIZE.width,
        });
      });
    });
  });
});
