const fs = require("node:fs");

const { PDFiumLibrary } = require("@hyzyla/pdfium");

// Node.js 18 has no global crypto, which probe.js hashes with
globalThis.crypto ??= require("node:crypto").webcrypto;

async function main() {
  const { probe } = await import("./probe.js");
  const library = await PDFiumLibrary.init();
  const result = await probe(library, fs.readFileSync("test.pdf"));
  library.destroy();

  console.log(JSON.stringify({ entry: require.resolve("@hyzyla/pdfium"), ...result }));
}

void main();
