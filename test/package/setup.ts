import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import type { TestProject } from "vitest/node";

import { PDFiumLibrary } from "../../src/index.esm";
// @ts-expect-error plain JS fixture without types
import { probe } from "./fixture/probe.js";

export type ProbeResult = { pageCount: number; text: string; width: number; height: number; sha256: string };

declare module "vitest" {
  export interface ProvidedContext {
    packageDir: string;
    packedFiles: string[];
    expected: ProbeResult;
  }
}

// Packs dist/ the way `npm publish` would and installs the tarball into a
// throwaway project outside the repo, so nothing resolves from the repo's own
// node_modules. The probe result from the source files is what every built
// entry point has to match.
export default async function setup(project: TestProject) {
  if (!fs.existsSync("dist/index.esm.js")) {
    throw new Error("dist/ is missing, run `npm run build:prod` first");
  }
  // Development builds log which entry point loaded
  if (fs.readFileSync("dist/index.esm.js", "utf-8").includes('console.log("PDFium')) {
    throw new Error("dist/ is a development build, run `npm run build:prod` first");
  }

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pdfium-package-"));
  fs.cpSync("test/package/fixture", dir, { recursive: true });
  fs.copyFileSync("test/data/test_1.pdf", path.join(dir, "test.pdf"));

  const [{ filename, files }] = JSON.parse(npm(["pack", "--json", "--pack-destination", dir], process.cwd()));
  npm(["install", "--no-audit", "--no-fund", path.join(dir, filename)], dir);

  const library = await PDFiumLibrary.init({
    wasmBinary: fs.readFileSync("src/vendor/pdfium.wasm"),
  });
  const expected: ProbeResult = await probe(library, fs.readFileSync("test/data/test_1.pdf"));
  library.destroy();

  project.provide("packageDir", dir);
  project.provide(
    "packedFiles",
    files.map((file: { path: string }) => file.path),
  );
  project.provide("expected", expected);

  return () => fs.rmSync(dir, { recursive: true, force: true });
}

function npm(args: string[], cwd: string) {
  return execFileSync("npm", args, { cwd, encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] });
}
