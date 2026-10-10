import { webcrypto } from "node:crypto";
import fs from "node:fs";

import { PDFiumLibrary } from "@hyzyla/pdfium";

import { probe } from "./probe.js";

// Node.js 18 has no global crypto, which probe.js hashes with
globalThis.crypto ??= webcrypto;

const library = await PDFiumLibrary.init();
const result = await probe(library, fs.readFileSync("test.pdf"));
library.destroy();

console.log(JSON.stringify({ entry: import.meta.resolve("@hyzyla/pdfium"), ...result }));
