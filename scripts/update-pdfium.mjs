import { execSync } from "child_process";
import { promises as fs } from "fs";

import unzipper from "unzipper";

const VERSION_FILE = "src/vendor/LAST_RELEASE.txt";
const VENDOR_FILES = ["pdfium.js", "pdfium.esm.js", "pdfium.wasm"];

/**
 * Download the latest pdfium-lib wasm build into src/vendor folder
 */
async function updatePDFium() {
  // Get latest release
  const releaseResponse = await fetch("https://api.github.com/repos/paulocoutinhox/pdfium-lib/releases/latest");
  if (!releaseResponse.ok) {
    throw new Error(`Failed to get latest release: ${releaseResponse.status}`);
  }
  const lastRelease = await releaseResponse.json();
  const lastReleaseTag = lastRelease.tag_name;

  const currentTag = (await fs.readFile(VERSION_FILE, "utf-8")).trim();
  if (lastReleaseTag === currentTag) {
    console.log(`Already on the latest release: ${currentTag}`);
    return;
  }
  console.log(`Updating PDFium from ${currentTag} to ${lastReleaseTag}`);

  // Download wasm asset
  const wasmAsset = lastRelease.assets.find((asset) => asset.name === "wasm.zip");
  if (!wasmAsset) {
    const assetNames = lastRelease.assets.map((asset) => asset.name).join(", ");
    throw new Error(`No wasm.zip asset in release ${lastReleaseTag}, found: ${assetNames}`);
  }
  console.log(`Downloading wasm asset: ${wasmAsset.browser_download_url}`);

  const assetResponse = await fetch(wasmAsset.browser_download_url);
  if (!assetResponse.ok) {
    throw new Error(`Failed to download wasm asset: ${assetResponse.status}`);
  }

  // Copy files from the archive
  const archive = await unzipper.Open.buffer(Buffer.from(await assetResponse.arrayBuffer()));
  for (const name of VENDOR_FILES) {
    const entry = archive.files.find((file) => file.path === `release/node/${name}`);
    if (!entry) {
      throw new Error(`No release/node/${name} in wasm.zip`);
    }
    await fs.writeFile(`src/vendor/${name}`, await entry.buffer());
  }
  console.log("Copied files to src/vendor folder");

  execSync("npx oxfmt src/vendor/pdfium.js src/vendor/pdfium.esm.js");
  console.log("Formatted files");

  await fs.writeFile(VERSION_FILE, lastReleaseTag);
  console.log(
    `Updated to ${lastReleaseTag}. Run the checks (npx vitest run -u if image snapshots changed) and commit.`,
  );
}

await updatePDFium();
