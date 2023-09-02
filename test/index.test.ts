import { PDFiumLibrary } from '../src/index';
import { promises as fs } from 'fs';

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

  test('should load a document from a buffer and return the number of pages', async () => {
    const buff = await fs.readFile('test/data/test_1.pdf');

    const document = await library.loadDocument(buff);
    const numOfPages = document.getPageCount();
    expect(numOfPages).toBe(4);
    document.destroy();
  });
});
