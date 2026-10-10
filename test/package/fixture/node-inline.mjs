import fs from "node:fs";

import { PDFiumLibrary } from "@hyzyla/pdfium/inline";

import { probe } from "./probe.js";

// The wasm is inside the JavaScript, so this keeps working after a bundler
// moves the code and leaves pdfium.wasm behind
const library = await PDFiumLibrary.init({ disableBase64Warning: true });
const result = await probe(library, fs.readFileSync("test.pdf"));
library.destroy();

console.log(JSON.stringify({ entry: import.meta.resolve("@hyzyla/pdfium/inline"), ...result }));
