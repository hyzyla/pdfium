import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import axios from 'axios';

// eslint-disable-next-line no-undef
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

const VERSION_FILE = 'src/vendor/LAST_RELEASE.txt';
const WASM_ARCHIVE = 'src/vendor/wasm.zip';

/**
 * Check whether branch exists
 */
async function isBranchExists(branchName) {
  try {
    const { data: branch } = await octokit.repos.getBranch({
      owner: 'hyzyla',
      repo: 'pdfium',
      branch: branchName,
      request: {
        validate: false,
      },
    });
    if (branch) {
      return true;
    }
  } catch (e) {
    if (e.status !== 404) throw e;
  }
  return false;
}

async function checkForUpdates() {
  // Get latest release
  const { data: lastRelease } = await octokit.repos.getLatestRelease({
    owner: 'paulocoutinhox',
    repo: 'pdfium-lib',
  });
  const lastReleaseTag = lastRelease.tag_name;

  console.info(`Got latest release: "${lastReleaseTag}"`);

  const lastCheckedReleaseFile = await fs.readFile(VERSION_FILE, 'utf-8');
  const lastCheckedReleaseTag = lastCheckedReleaseFile.trim();
  console.log(`Last checked release: "${lastCheckedReleaseTag}"`);

  if (lastReleaseTag === lastCheckedReleaseTag) {
    console.log('No new release found', lastReleaseTag, lastCheckedReleaseTag);
    return;
  }

  const branchName = `update-to-${lastReleaseTag}`;
  execSync(`git config --global user.name 'Yevhenii Hyzyla'`);
  execSync(`git config --global user.email 'hyzyla@gmail.com'`);
  execSync(`git switch -c ${branchName}`);

  // check if branch exists
  if (await isBranchExists(branchName)) {
    console.log(`Branch ${branchName} already exists`);
    return;
  }

  try {
    // Download wasm asset
    const wasmAsset = lastRelease.assets.find((asset) => asset.name === 'wasm.zip');
    if (!wasmAsset) {
      const assetNames = lastRelease.assets.map((asset) => asset.name).join(', ');
      throw new Error(`No wasm.zip asset in release ${lastReleaseTag}, found: ${assetNames}`);
    }
    const wasmAssetUrl = wasmAsset.browser_download_url;
    console.log(`Downloading wasm asset: ${wasmAssetUrl}`);

    const response = await axios({
      url: wasmAssetUrl,
      method: 'GET',
      responseType: 'arraybuffer',
    });
    console.log(`Downloaded wasm asset: ${response.status}`);
    await fs.writeFile(WASM_ARCHIVE, response.data);

    // Unzip archive
    execSync(`unzip -q -o ${WASM_ARCHIVE} -d src/vendor`);
    console.log('Unzipped wasm asset to src/vendor folder');

    // Copy files
    await fs.copyFile('src/vendor/release/node/pdfium.js', 'src/vendor/pdfium.js');
    await fs.copyFile('src/vendor/release/node/pdfium.esm.js', 'src/vendor/pdfium.esm.js');
    await fs.copyFile('src/vendor/release/node/pdfium.wasm', 'src/vendor/pdfium.wasm');
    console.log('Copied files to src/vendor folder');

    // Only the generated JS goes through prettier; pdfium.d.ts is formatted by biome
    execSync(`npx prettier --write src/vendor/pdfium.js src/vendor/pdfium.esm.js`);
    console.log('Formatted files');

    await fs.writeFile('src/vendor/LAST_RELEASE.txt', lastReleaseTag);

    execSync(`git commit -am "Update PDFium"`);
    execSync(`git push origin ${branchName}`);

    await octokit.pulls.create({
      owner: 'hyzyla',
      repo: 'pdfium',
      title: `Update to ${lastReleaseTag}`,
      head: branchName,
      base: 'main',
      body: `Update PDFium from ${lastCheckedReleaseTag} to ${lastReleaseTag} version
               https://github.com/paulocoutinhox/pdfium-lib/releases/tag/${lastReleaseTag}`,
    });
    console.log('Created pull request');
  } finally {
    // Remove archive and its extracted folder
    await fs.rm(WASM_ARCHIVE, { force: true });
    await fs.rm('src/vendor/release', {
      recursive: true,
      force: true,
    });
  }
}

checkForUpdates();
