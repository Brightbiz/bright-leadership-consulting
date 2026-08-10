#!/usr/bin/env node
/**
 * Redirect + indexability check for the AI programme page.
 *
 * Static mode (runs in the build):
 *   - every legacy AI URL has a <Navigate> redirect to /strategic-leadership-ai
 *   - the canonical route is actually defined
 *   - sitemap.xml lists the canonical URL and none of the legacy ones
 *   - robots.txt does not disallow the canonical path
 *
 * Live mode (`node scripts/validate-redirects.mjs --live [origin]`):
 *   - the canonical URL responds 200
 *   - each legacy URL is served (SPA fallback) so the client redirect can run
 */
import { readFileSync } from "node:fs";

const CANONICAL = "/strategic-leadership-ai";
const LEGACY_PATHS = ["/programs/ai-leadership", "/ai-leadership"];
const DEFAULT_ORIGIN = "https://brightleadershipconsulting.com";

const errors = [];
const app = readFileSync("src/App.tsx", "utf8");

// Redirects use <KeepQueryRedirect>, a thin wrapper around
// <Navigate ... replace /> that carries the query string through so campaign
// parameters (gclid / gbraid / wbraid / utm_*) survive the redirect.
if (!/const KeepQueryRedirect[\s\S]{0,400}useLocation\(\)[\s\S]{0,300}<Navigate to=\{`\$\{to\}\$\{search\}`\} replace/.test(app)) {
  errors.push(
    "KeepQueryRedirect must resolve to <Navigate to={`${to}${search}`} replace /> so campaign parameters are preserved",
  );
}

for (const legacy of LEGACY_PATHS) {
  const routeLine = app
    .split("\n")
    .find((l) => l.includes(`path="${legacy}"`) || l.includes(`path='${legacy}'`));
  if (!routeLine) {
    errors.push(`Missing redirect route for legacy URL ${legacy} in src/App.tsx`);
  } else if (!routeLine.includes(`to="${CANONICAL}"`)) {
    errors.push(`Legacy URL ${legacy} does not redirect to ${CANONICAL}: ${routeLine.trim()}`);
  } else if (!/<(Navigate[^>]*replace|KeepQueryRedirect)\b/.test(routeLine)) {
    errors.push(
      `Redirect for ${legacy} must use <KeepQueryRedirect> or <Navigate ... replace /> so history is not polluted`,
    );
  }
}


if (!app.includes(`path="${CANONICAL}"`)) {
  errors.push(`Canonical route ${CANONICAL} is not defined in src/App.tsx`);
}

// Sitemap must advertise the canonical URL only.
let sitemap = "";
try {
  sitemap = readFileSync("public/sitemap.xml", "utf8");
} catch {
  errors.push("public/sitemap.xml is missing — the new page cannot be discovered");
}
if (sitemap) {
  if (!sitemap.includes(CANONICAL)) {
    errors.push(`sitemap.xml does not list ${CANONICAL}`);
  }
  for (const legacy of LEGACY_PATHS) {
    if (new RegExp(`<loc>[^<]*${legacy.replace(/\//g, "\\/")}<`).test(sitemap)) {
      errors.push(`sitemap.xml still lists legacy URL ${legacy} — remove it`);
    }
  }
}

// robots.txt must not block the canonical path.
try {
  const robots = readFileSync("public/robots.txt", "utf8");
  const blocked = robots
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^Disallow:/i.test(l))
    .map((l) => l.split(":")[1].trim())
    .filter((p) => p === "/" || (p && CANONICAL.startsWith(p)));
  if (blocked.length) {
    errors.push(`robots.txt disallows ${CANONICAL} via: ${blocked.join(", ")}`);
  }
} catch {
  /* no robots.txt — crawlers default to allow */
}

if (process.argv.includes("--live")) {
  const origin =
    process.argv.find((a) => a.startsWith("http"))?.replace(/\/$/, "") ?? DEFAULT_ORIGIN;

  for (const path of [CANONICAL, ...LEGACY_PATHS]) {
    const url = `${origin}${path}`;
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) {
        errors.push(`${url} returned ${res.status} (expected 200 so the SPA can resolve it)`);
        continue;
      }
      if (path === CANONICAL) {
        // The app is client-rendered, so the shell is checked rather than page copy.
        const html = await res.text();
        if (!/<div id="root"/.test(html)) {
          errors.push(`${url} responded 200 but did not serve the application shell`);
        }
      }
      console.log(`  ok  ${url} → ${res.status}`);
    } catch (err) {
      errors.push(`${url} could not be fetched: ${err.message}`);
    }
  }
  console.log(
    "  note  index coverage itself is only observable in Google Search Console; this check confirms the URLs are reachable and crawlable.",
  );
}

if (errors.length) {
  console.error("\nRedirect validation failed:\n");
  for (const e of errors) console.error(`  - ${e}`);
  console.error("");
  process.exit(1);
}

console.log(
  `validate-redirects: ${LEGACY_PATHS.length} legacy AI URLs redirect to ${CANONICAL}; sitemap and robots allow indexing.`,
);
