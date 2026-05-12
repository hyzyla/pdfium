import { promises as fs } from "node:fs";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { PDFiumLibrary } from "../src/index.esm";
import { WorkerDispatcher } from "../src/worker/dispatcher";
import type { GetPageResult, LoadDocumentResult, RenderResult } from "../src/worker/protocol";

describe("WorkerDispatcher", () => {
  let dispatcher: WorkerDispatcher;
  let id: number;

  beforeEach(async () => {
    const wasmBinary = await fs.readFile("./src/vendor/pdfium.wasm");
    dispatcher = new WorkerDispatcher(() =>
      PDFiumLibrary.init({ wasmBinary: wasmBinary.buffer.slice(0) as ArrayBuffer }),
    );
    id = 1;
  });

  afterEach(async () => {
    await dispatcher.dispatch({ id: id++, type: "destroy" });
  });

  test("loads a document and returns a handle", async () => {
    const bytes = await fs.readFile("./test/data/test_1.pdf");
    const result = await dispatcher.dispatch({ id: id++, type: "loadDocument", bytes });
    const value = result.value as LoadDocumentResult;
    expect(value.doc).toMatch(/^d_\d+$/);
    expect(dispatcher.liveDocumentCount()).toBe(1);
  });

  test("propagates errors as exceptions for non-PDF input", async () => {
    const bytes = await fs.readFile("./test/data/test_5.txt");
    await expect(dispatcher.dispatch({ id: id++, type: "loadDocument", bytes })).rejects.toThrow();
    expect(dispatcher.liveDocumentCount()).toBe(0);
  });

  test("returns page count and individual pages", async () => {
    const bytes = await fs.readFile("./test/data/test_1.pdf");
    const loadResult = await dispatcher.dispatch({ id: id++, type: "loadDocument", bytes });
    const docHandle = (loadResult.value as LoadDocumentResult).doc;

    const countResult = await dispatcher.dispatch({ id: id++, type: "doc.getPageCount", doc: docHandle });
    expect(countResult.value).toBe(4);

    const pageResult = await dispatcher.dispatch({
      id: id++,
      type: "doc.getPage",
      doc: docHandle,
      pageIndex: 0,
    });
    const pageValue = pageResult.value as GetPageResult;
    expect(pageValue.page).toMatch(/^p_\d+$/);
    expect(pageValue.pageIndex).toBe(0);
    expect(dispatcher.livePageCount()).toBe(1);
  });

  test("renders a page and marks the buffer as transferable", async () => {
    const bytes = await fs.readFile("./test/data/test_1.pdf");
    const docHandle = (
      (await dispatcher.dispatch({ id: id++, type: "loadDocument", bytes })).value as LoadDocumentResult
    ).doc;
    const pageHandle = (
      (await dispatcher.dispatch({ id: id++, type: "doc.getPage", doc: docHandle, pageIndex: 0 }))
        .value as GetPageResult
    ).page;

    const renderResult = await dispatcher.dispatch({
      id: id++,
      type: "page.render",
      page: pageHandle,
      options: { scale: 1, colorSpace: "BGRA" },
    });
    const value = renderResult.value as RenderResult;
    expect(value.width).toBeGreaterThan(0);
    expect(value.height).toBeGreaterThan(0);
    expect(value.data).toBeInstanceOf(Uint8Array);
    expect(value.data.length).toBe(value.width * value.height * 4);
    expect(renderResult.transfer).toEqual([value.data.buffer]);
  });

  test("destroying a document also drops its page handles", async () => {
    const bytes = await fs.readFile("./test/data/test_1.pdf");
    const docHandle = (
      (await dispatcher.dispatch({ id: id++, type: "loadDocument", bytes })).value as LoadDocumentResult
    ).doc;
    await dispatcher.dispatch({ id: id++, type: "doc.getPage", doc: docHandle, pageIndex: 0 });
    await dispatcher.dispatch({ id: id++, type: "doc.getPage", doc: docHandle, pageIndex: 1 });
    expect(dispatcher.livePageCount()).toBe(2);

    await dispatcher.dispatch({ id: id++, type: "doc.destroy", doc: docHandle });
    expect(dispatcher.liveDocumentCount()).toBe(0);
    expect(dispatcher.livePageCount()).toBe(0);
  });

  test("rejects calls referencing unknown handles", async () => {
    await expect(dispatcher.dispatch({ id: id++, type: "doc.getPageCount", doc: "d_999" })).rejects.toThrow(
      /Unknown document handle/,
    );
    await expect(dispatcher.dispatch({ id: id++, type: "page.getText", page: "p_999" })).rejects.toThrow(
      /Unknown page handle/,
    );
  });
});
