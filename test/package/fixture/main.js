import { PDFiumLibrary } from "@hyzyla/pdfium";
import { PDFiumLibrary as Base64Library } from "@hyzyla/pdfium/browser/base64";
import { PDFiumLibrary as CdnLibrary } from "@hyzyla/pdfium/browser/cdn";
import wasmUrl from "@hyzyla/pdfium/pdfium.wasm?url";
import { PDFiumWorkerClient } from "@hyzyla/pdfium/worker";

import { probe } from "./probe.js";
import pdfUrl from "./test.pdf?url";

const entries = {
  "@hyzyla/pdfium": () => PDFiumLibrary.init({ wasmUrl }),
  "@hyzyla/pdfium/browser/cdn": () => CdnLibrary.init({ disableCDNWarning: true }),
  "@hyzyla/pdfium/browser/base64": () => Base64Library.init({ disableBase64Warning: true }),
  "@hyzyla/pdfium/worker": () => PDFiumWorkerClient.spawn({ wasmUrl: new URL(wasmUrl, location.href).href }),
};

const response = await fetch(pdfUrl);
const bytes = new Uint8Array(await response.arrayBuffer());

const results = {};
for (const [name, init] of Object.entries(entries)) {
  try {
    const library = await init();
    // The worker client transfers the buffer, so each entry gets its own copy
    results[name] = await probe(library, bytes.slice());
    await library.destroy();
  } catch (error) {
    results[name] = { error: String(error?.stack ?? error) };
  }
}
window.results = results;
