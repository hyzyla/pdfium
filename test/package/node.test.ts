import { execFileSync } from "node:child_process";
import path from "node:path";

import { expect, inject, test } from "vitest";

test.for([
  { format: "ESM", script: "node.mjs", entry: "index.esm.js" },
  { format: "CommonJS", script: "node.cjs", entry: "index.cjs" },
])("$format loads the wasm from the package and matches the source build", ({ script, entry }) => {
  const output = execFileSync(process.execPath, [script], { cwd: inject("packageDir"), encoding: "utf-8" });
  const { entry: resolved, ...result } = JSON.parse(output.trim().split("\n").at(-1)!);

  expect(path.basename(resolved)).toBe(entry);
  expect(result).toEqual(inject("expected"));
});

test("package.json can be resolved", () => {
  const output = execFileSync(process.execPath, ["-p", 'require.resolve("@hyzyla/pdfium/package.json")'], {
    cwd: inject("packageDir"),
    encoding: "utf-8",
  });
  expect(output.trim()).toMatch(/node_modules\/@hyzyla\/pdfium\/package\.json$/);
});
