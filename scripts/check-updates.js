const { Octokit } = require("@octokit/rest");
const { execSync } = require("child_process");
const fs = require("fs").promises;
const axios = require("axios");
const zlib = require("zlib");
const tar = require("tar");
const stream = require("stream");
const { promisify } = require("util");
// const prettier = require("prettier");
const pipeline = promisify(stream.pipeline);

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
});

async function checkForUpdates() {
  // Get latest release
  const { data: latestRelease } = await octokit.repos.getLatestRelease({
    owner: "paulocoutinhox",
    repo: "pdfium-lib",
  });

  const lastCheckedReleaseFile = await fs.readFile(
    "src/vendor/LAST_RELEASE.txt",
    "utf-8"
  );
  const lastCheckedRelease = lastCheckedReleaseFile.trim();

  if (latestRelease.tag_name === lastCheckedRelease) {
    console.log("No updates found");
    return;
  }

  try {
    // Download wasm asset
    const wasmAssetUrl = latestRelease.assets.find(
      (asset) => asset.name === "wasm.tgz"
    ).browser_download_url;

    const response = await axios({
      url: wasmAssetUrl,
      method: "GET",
      responseType: "stream",
    });

    // Create archive folder
    await fs.mkdir("src/vendor/archive", { recursive: false });

    // Unzip archive
    await pipeline(
      response.data,
      zlib.createGunzip(),
      tar.extract({ cwd: "src/vendor/archive" })
    );

    execSync(`npx prettier --write src/vendor`);

    execSync(
      `git config --global user.email "github-actions[bot]@users.noreply.github.com" && git config --global user.name "github-actions[bot]"`
    );
    execSync(
      `git add . && git commit -m "Update to ${latestRelease.tag_name}"`
    );
    execSync(
      `git push origin "refs/heads/main:refs/heads/update-to-${latestRelease.tag_name}"`
    );

    await octokit.pulls.create({
      owner: "hyzyla",
      repo: "pdfium",
      title: `Update to ${latestRelease.tag_name}`,
      head: `update-to-${latestRelease.tag_name}`,
      base: "main",
    });

    await fs.writeFile("LAST_RELEASE", latestRelease.tag_name);
  } finally {
    // Remove archive folder
    await fs.rm("src/vendor/archive", { recursive: true });
  }
}

checkForUpdates();
