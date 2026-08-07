#!/usr/bin/env node
/**
 * Fails the build if any legacy Thinkific course slug remains.
 * Canonical form: https://bright-leadership-consulting.thinkific.com/products/courses/<slug>
 * Legacy form:    https://bright-leadership-consulting.thinkific.com/courses/<slug>
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["src", "public", "index.html"];
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", "build"]);
const EXTS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".html", ".json", ".md", ".css", ".txt", ".xml",
]);

const LEGACY = /thinkific\.com\/courses\//gi;

/** Legacy URLs that Thinkific still serves and are intentionally retained. */
const ALLOWED_LEGACY = new Set([
  "https://bright-leadership-consulting.thinkific.com/courses/the-future-of-work",
]);

function walk(path, out) {
  let s;
  try {
    s = statSync(path);
  } catch {
    return out;
  }
  if (s.isDirectory()) {
    for (const entry of readdirSync(path)) {
      if (SKIP_DIRS.has(entry)) continue;
      walk(join(path, entry), out);
    }
  } else if (EXTS.has(extname(path))) {
    out.push(path);
  }
  return out;
}

const files = ROOTS.flatMap((r) => walk(r, []));
const violations = [];

for (const file of files) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    LEGACY.lastIndex = 0;
    if (!LEGACY.test(line)) return;
    const urlMatch = line.match(
      /https:\/\/bright-leadership-consulting\.thinkific\.com\/courses\/[a-z0-9-]+/i
    );
    if (urlMatch && ALLOWED_LEGACY.has(urlMatch[0])) return;
    violations.push({ file, line: i + 1, text: line.trim().slice(0, 200) });
  });
}

if (violations.length > 0) {
  console.error(
    `\n✖ Link validation failed: ${violations.length} legacy Thinkific /courses/ link(s) found.\n` +
      `  Use the canonical /products/courses/ path instead.\n`
  );
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}\n    ${v.text}`);
  }
  console.error("");
  process.exit(1);
}

console.log(
  `✔ Link validation passed: no legacy Thinkific /courses/ slugs in ${files.length} scanned files.`
);
