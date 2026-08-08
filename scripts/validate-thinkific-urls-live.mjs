#!/usr/bin/env node
/**
 * Live link validation for every Thinkific URL referenced by the site.
 *
 * Sources checked:
 *   - src/data/programmes.ts  (catalogue `link` values + brochureCtaLinks)
 *   - public/brochures/*.html (rendered CTA hrefs)
 *
 * Behaviour:
 *   - Any URL that returns a non-200 status fails the build.
 *   - Slugs listed in KNOWN_UNPUBLISHED are reported as warnings, not failures
 *     (courses that exist on Thinkific but are not published yet).
 *   - Network unavailable (DNS/connection error) => skipped with a warning, so
 *     offline/CI-sandbox builds are not blocked. Set STRICT_LINK_CHECK=1 to
 *     turn those into failures instead.
 *   - Set SKIP_LINK_CHECK=1 to bypass entirely.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Matches both the canonical /products/courses/ paths and the intentionally
// allowed legacy /courses/ paths still served by Thinkific.
const URL_RE =
  /https:\/\/bright-leadership-consulting\.thinkific\.com\/(?:products\/)?courses\/[a-z0-9-]+/gi;

/** Slugs known to be unpublished on Thinkific — warn instead of fail. */
const KNOWN_UNPUBLISHED = new Set([
  "achieving-peak-performance",
  "executive-leadership-mastery-program",
  "employability-skills-for-employees",
]);

if (process.env.SKIP_LINK_CHECK === "1") {
  console.log("• Live Thinkific URL check skipped (SKIP_LINK_CHECK=1).");
  process.exit(0);
}

const sources = ["src/data/programmes.ts"];
const brochureDir = "public/brochures";
try {
  for (const f of readdirSync(brochureDir)) {
    if (f.endsWith(".html")) sources.push(join(brochureDir, f));
  }
} catch {
  /* no brochures directory */
}

/** url -> Set(files) */
const found = new Map();
for (const file of sources) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  for (const match of text.match(URL_RE) ?? []) {
    const url = match.toLowerCase();
    if (!found.has(url)) found.set(url, new Set());
    found.get(url).add(file);
  }
}

if (found.size === 0) {
  console.log("✔ Live Thinkific URL check: no Thinkific URLs referenced.");
  process.exit(0);
}

const slugOf = (url) => url.split("/").pop();

async function check(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { redirect: "follow", signal: controller.signal });
    }
    return { status: res.status };
  } catch (err) {
    return { status: 0, error: err?.message ?? String(err) };
  } finally {
    clearTimeout(timer);
  }
}

const urls = [...found.keys()].sort();
const results = await Promise.all(urls.map(check));

const failures = [];
const warnings = [];
const unreachable = [];

urls.forEach((url, i) => {
  const { status, error } = results[i];
  const files = [...found.get(url)].join(", ");
  if (status === 200) return;
  if (status === 0) {
    unreachable.push({ url, files, error });
  } else if (KNOWN_UNPUBLISHED.has(slugOf(url))) {
    warnings.push({ url, files, status });
  } else {
    failures.push({ url, files, status });
  }
});

for (const w of warnings) {
  console.warn(
    `⚠ ${w.status} (known unpublished) ${w.url}\n    referenced in: ${w.files}`
  );
}

if (unreachable.length > 0) {
  const strict = process.env.STRICT_LINK_CHECK === "1";
  for (const u of unreachable) {
    console.warn(`⚠ unreachable ${u.url} (${u.error})`);
  }
  if (strict) {
    console.error("\n✖ Live Thinkific URL check failed: network unreachable (STRICT_LINK_CHECK=1).\n");
    process.exit(1);
  }
  console.warn("• Network unavailable — live status checks skipped for the URLs above.");
}

if (failures.length > 0) {
  console.error(
    `\n✖ Live Thinkific URL check failed: ${failures.length} URL(s) did not return 200.\n`
  );
  for (const f of failures) {
    console.error(`  ${f.status}  ${f.url}\n    referenced in: ${f.files}`);
  }
  console.error(
    "\n  Fix the slug in src/data/programmes.ts (single source of truth), or add it to\n" +
      "  KNOWN_UNPUBLISHED in scripts/validate-thinkific-urls-live.mjs if the course is\n" +
      "  intentionally not published yet.\n"
  );
  process.exit(1);
}

console.log(
  `✔ Live Thinkific URL check passed: ${urls.length - warnings.length - unreachable.length}/${urls.length} URL(s) returned 200` +
    (warnings.length ? `, ${warnings.length} known unpublished` : "") +
    (unreachable.length ? `, ${unreachable.length} unreachable (skipped)` : "") +
    "."
);
