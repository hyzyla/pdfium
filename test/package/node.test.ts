import { execFileSync } from "node:child_process";
import path from "node:path";

import { expect, inject, test } from "vitest";

// CI points TEST_NODE at other Node.js versions to run these on them too
const node = process.env.TEST_NODE ?? process.execPath;

test.for([
  { format: "ESM", script: "node.mjs", entry: "index.esm.js" },
  { format: "CommonJS", script: "node.cjs", entry: "index.cjs" },
  { format: "Base64", script: "node-base64.mjs", entry: "index.esm.base64.js" },
])("$format entry runs in Node.js and matches the source build", ({ script, entry }) => {
  const output = execFileSync(node, [script], { cwd: inject("packageDir"), encoding: "utf-8" });
  const { entry: resolved, ...result } = JSON.parse(output.trim().split("\n").at(-1)!);

  expect(path.basename(resolved)).toBe(entry);
  expect(result).toEqual(inject("expected"));
});

test("package.json can be resolved", () => {
  const output = execFileSync(node, ["-p", 'require.resolve("@hyzyla/pdfium/package.json")'], {
    cwd: inject("packageDir"),
    encoding: "utf-8",
  });
  expect(output.trim()).toMatch(/node_modules\/@hyzyla\/pdfium\/package\.json$/);
});

test("built files can't be imported directly", () => {
  const script = 'try { require.resolve("@hyzyla/pdfium/dist/index.cjs") } catch (e) { console.log(e.code) }';
  const output = execFileSync(node, ["-e", script], { cwd: inject("packageDir"), encoding: "utf-8" });
  expect(output.trim()).toBe("ERR_PACKAGE_PATH_NOT_EXPORTED");
});
