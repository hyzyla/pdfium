import fs from "node:fs";
import path from "node:path";

// Runs after `tsc --emitDeclarationOnly`, which writes a .d.ts for every source
// file, including ones that only run inside the worker.

const IMPORT = /((?:from |import\()")(\.{1,2}\/[^"]+)\.(c?)js"/g;

// Calls `visit` for every declaration file reachable from `entry`
function walk(entry, visit, seen = new Set()) {
  const file = path.normalize(entry);
  if (seen.has(file)) {
    return seen;
  }
  seen.add(file);
  const source = fs.readFileSync(file, "utf-8");
  visit(file, source);
  for (const [, , specifier, cjs] of source.matchAll(IMPORT)) {
    walk(path.join(path.dirname(file), `${specifier}${cjs ? ".d.cts" : ".d.ts"}`), visit, seen);
  }
  return seen;
}

// TypeScript reads .d.ts files in a "type": "module" package as ESM, so the
// CommonJS entry gets .d.cts copies whose relative imports point at each other.
walk("dist/index.cjs.d.ts", (file, source) => {
  fs.writeFileSync(file.replace(/\.d\.ts$/, ".d.cts"), source.replace(IMPORT, '$1$2.cjs"'));
});

// Keep only the declarations reachable from the types in package.json
const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
const entries = new Set([pkg.types]);
(function collect(value) {
  for (const [key, child] of Object.entries(value)) {
    if (key === "types") {
      entries.add(child);
    } else if (typeof child === "object") {
      collect(child);
    }
  }
})(pkg.exports);

const used = new Set();
for (const entry of entries) {
  walk(entry, () => {}, used);
}
for (const file of fs.globSync("dist/**/*.d.{ts,cts}")) {
  if (!used.has(path.normalize(file))) {
    fs.rmSync(file);
  }
}
