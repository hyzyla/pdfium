// Loads a PDF and summarizes what came out of it. Every build runs the same
// probe, so the results can be compared with the ones from the source files.
// Works with both PDFiumLibrary and PDFiumWorkerClient.
export async function probe(library, bytes) {
  const document = await library.loadDocument(bytes);
  const page = await document.getPage(0);
  const text = await page.getText();
  const { width, height, data } = await page.render({ scale: 1 });
  const digest = await crypto.subtle.digest("SHA-256", data);
  const result = {
    pageCount: await document.getPageCount(),
    text,
    width,
    height,
    sha256: Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join(""),
  };
  await document.destroy();
  return result;
}
