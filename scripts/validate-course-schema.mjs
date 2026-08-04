#!/usr/bin/env node
/**
 * Build gate: renders the course pages (jsdom) and validates the emitted
 * Course / ItemList JSON-LD — required fields present, no empty values.
 * Fails the build on any violation.
 */
import { spawnSync } from "node:child_process";

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["vitest", "run", "src/test/courseSchema.test.tsx"],
  { stdio: "inherit", env: { ...process.env, CI: "true" } }
);

if (result.status !== 0) {
  console.error(
    "\n✖ Course schema validation failed: the rendered JSON-LD is missing required Course fields or contains empty values.\n"
  );
  process.exit(result.status ?? 1);
}

console.log("✔ Course schema validation passed: JSON-LD Course fields are complete.");
