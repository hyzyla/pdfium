import { webcrypto } from "node:crypto";
import fs from "node:fs";

import { PDFiumLibrary } from "@hyzyla/pdfium/browser/base64";

import { probe } from "./probe.js";

// Node.js 18 has no global crypto, which probe.js hashes with
globalThis.crypto ??= webcrypto;

// The wasm is inside the JavaScript, so this keeps working after a bundler
// moves the code and leaves pdfium.wasm behind
const library = await PDFiumLibrary.init({ disableBase64Warning: true });
const result = await probe(library, fs.readFileSync("test.pdf"));
library.destroy();

console.log(JSON.stringify({ entry: import.meta.resolve("@hyzyla/pdfium/browser/base64"), ...result }));
