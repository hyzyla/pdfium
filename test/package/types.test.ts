import { execFileSync } from "node:child_process";
import path from "node:path";

import { inject, test } from "vitest";

const tsc = path.resolve("node_modules/.bin/tsc");

test.for([
  { resolution: "node16", flags: [] },
  { resolution: "bundler", flags: ["--module", "preserve", "--moduleResolution", "bundler"] },
])("type declarations check with $resolution resolution", ({ flags }) => {
  // Throws with the compiler output when there are type errors
  execFileSync(tsc, ["--project", inject("packageDir"), ...flags], { encoding: "utf-8" });
});
