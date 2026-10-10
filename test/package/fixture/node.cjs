const fs = require("node:fs");

const { PDFiumLibrary } = require("@hyzyla/pdfium");

async function main() {
  const { probe } = await import("./probe.js");
  const library = await PDFiumLibrary.init();
  const result = await probe(library, fs.readFileSync("test.pdf"));
  library.destroy();

  console.log(JSON.stringify({ entry: require.resolve("@hyzyla/pdfium"), ...result }));
}

void main();
