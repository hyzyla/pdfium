import fs from "node:fs";

import { PDFiumLibrary } from "@hyzyla/pdfium";

import { probe } from "./probe.js";

const library = await PDFiumLibrary.init();
const result = await probe(library, fs.readFileSync("test.pdf"));
library.destroy();

console.log(JSON.stringify(result));
