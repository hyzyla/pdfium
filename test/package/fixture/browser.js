import { PDFiumLibrary } from "@hyzyla/pdfium";
import { PDFiumLibrary as Base64Library } from "@hyzyla/pdfium/browser/base64";
import { PDFiumLibrary as CdnLibrary } from "@hyzyla/pdfium/browser/cdn";
import { PDFiumWorkerClient } from "@hyzyla/pdfium/worker";

import { probe } from "./probe.js";

// Resolves to the error a call fails with. Gives up after a few seconds, so a
// call that never settles shows up as "timed out" instead of hanging the test.
function failure(call) {
  const timeout = new Promise((resolve) => setTimeout(resolve, 5000, "timed out"));
  const outcome = call().then(
    () => "resolved",
    (error) => String(error),
  );
  return Promise.race([outcome, timeout]);
}

// Probes every browser entry point and leaves the results on window for the
// test to read. Bundlers differ in how they turn assets into URLs, so each
// bundler's entry file resolves those and passes them in.
export async function probeBrowserEntries({ wasmUrl, pdfUrl }) {
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

  // Loading the wasm can fail, and that has to reach the caller as an error
  const missingWasmUrl = new URL("missing.wasm", location.href).href;
  window.failures = {
    "@hyzyla/pdfium": await failure(() => PDFiumLibrary.init({ wasmUrl: missingWasmUrl })),
    "@hyzyla/pdfium/worker": await failure(async () => {
      const client = await PDFiumWorkerClient.spawn({ wasmUrl: missingWasmUrl });
      await client.loadDocument(bytes.slice());
    }),
  };
  window.results = results;
}
