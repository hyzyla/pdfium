import { probeBrowserEntries } from "./browser.js";

await probeBrowserEntries({
  wasmUrl: new URL("@hyzyla/pdfium/pdfium.wasm", import.meta.url).href,
  pdfUrl: new URL("./test.pdf", import.meta.url).href,
});
