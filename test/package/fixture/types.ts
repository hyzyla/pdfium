import { PDFiumLibrary, type PDFiumPageRender } from "@hyzyla/pdfium";
import { PDFiumLibrary as Base64Library } from "@hyzyla/pdfium/browser/base64";
import { PDFiumLibrary as CdnLibrary } from "@hyzyla/pdfium/browser/cdn";
import { PDFiumWorkerClient, type PDFiumWorkerRenderResult } from "@hyzyla/pdfium/worker";

const library = await PDFiumLibrary.init({ wasmUrl: "/pdfium.wasm" });
const document = await library.loadDocument(new Uint8Array());
const page = document.getPage(0);
const render: PDFiumPageRender = await page.render({ scale: 2, render: "bitmap" });
const text: string = page.getText();
// @ts-expect-error the page count is a number, which proves the types aren't `any`
const pageCount: string = document.getPageCount();

await PDFiumLibrary.init({ wasmBinary: new Uint8Array() });
await PDFiumLibrary.init({
  instantiateWasm: (imports, successCallback) => {
    void WebAssembly.instantiate(new Uint8Array(), imports).then(({ instance, module }) =>
      successCallback(instance, module),
    );
  },
});

await CdnLibrary.init({ disableCDNWarning: true });
await Base64Library.init({ disableBase64Warning: true });

const client = await PDFiumWorkerClient.spawn({ wasmUrl: "/pdfium.wasm" });
const workerDocument = await client.loadDocument(new Uint8Array());
const workerPage = await workerDocument.getPage(0);
const workerRender: PDFiumWorkerRenderResult = await workerPage.render({ scale: 2 });

export { pageCount, render, text, workerRender };
