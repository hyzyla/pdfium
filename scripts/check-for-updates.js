const { Octokit } = require("@octokit/rest");
const { execSync } = require("child_process");
const fs = require("fs");
const axios = require("axios");
const unzipper = require("unzipper");
// const prettier = require("prettier");

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
});

async function checkForUpdates() {
  const { data: latestRelease } = await octokit.repos.getLatestRelease({
    owner: "paulocoutinhox",
    repo: "pdfium-lib",
  });

  const lastCheckedRelease = fs
    .readFileSync("src/vendor/LAST_RELEASE.txt", "utf-8")
    .trim();

  if (latestRelease.tag_name !== lastCheckedRelease) {
    const response = await axios.get(latestRelease.zipball_url, {
      responseType: "stream",
    });

    response.data.pipe(unzipper.Extract({ path: "src/vendor" }));

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

    fs.writeFileSync("LAST_RELEASE", latestRelease.tag_name);
  }
}

checkForUpdates();
