import fs from "node:fs";

// TypeScript reads .d.ts files in a "type": "module" package as ESM, so the
// CommonJS entry gets .d.cts copies whose relative imports point at each other.
for (const file of fs.globSync("dist/**/*.d.ts")) {
  const source = fs.readFileSync(file, "utf-8").replace(/((?:from |import\()"\.{1,2}\/[^"]+)\.js"/g, '$1.cjs"');
  fs.writeFileSync(file.replace(/\.d\.ts$/, ".d.cts"), source);
}
