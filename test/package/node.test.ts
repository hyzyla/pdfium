import { execFileSync } from "node:child_process";
import path from "node:path";

import { expect, inject, test } from "vitest";
import webpack from "webpack";

// CI points TEST_NODE at other Node.js versions to run these on them too
const node = process.env.TEST_NODE ?? process.execPath;

test.for([
  { format: "ESM", script: "node.mjs", entry: "index.esm.js" },
  { format: "CommonJS", script: "node.cjs", entry: "index.cjs" },
  { format: "Inline", script: "node-inline.mjs", entry: "index.esm.base64.js" },
])("$format entry runs in Node.js and matches the source build", ({ script, entry }) => {
  const output = execFileSync(node, [script], { cwd: inject("packageDir"), encoding: "utf-8" });
  const { entry: resolved, ...result } = JSON.parse(output.trim().split("\n").at(-1)!);

  expect(path.basename(resolved)).toBe(entry);
  expect(result).toEqual(inject("expected"));
});

// Next.js bundles server code with webpack unless the package is listed in serverExternalPackages
test("ESM entry runs in Node.js when bundled with webpack", async () => {
  const dir = inject("packageDir");
  const outDir = path.join(dir, "node-webpack");
  const stats = await new Promise<webpack.Stats>((resolve, reject) => {
    webpack(
      {
        mode: "production",
        target: "node",
        context: dir,
        entry: "./node-webpack.mjs",
        output: { path: outDir, filename: "main.cjs" },
        performance: { hints: false },
      },
      (error, result) => (error ? reject(error) : resolve(result!)),
    );
  });
  if (stats.hasErrors() || stats.hasWarnings()) {
    throw new Error(stats.toString("errors-warnings"));
  }

  const output = execFileSync(node, [path.join(outDir, "main.cjs")], { cwd: dir, encoding: "utf-8" });
  expect(JSON.parse(output.trim().split("\n").at(-1)!)).toEqual(inject("expected"));
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
