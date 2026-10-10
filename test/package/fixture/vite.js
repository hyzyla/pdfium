import wasmUrl from "@hyzyla/pdfium/pdfium.wasm?url";

import { probeBrowserEntries } from "./browser.js";
import pdfUrl from "./test.pdf?url";

await probeBrowserEntries({ wasmUrl, pdfUrl });
