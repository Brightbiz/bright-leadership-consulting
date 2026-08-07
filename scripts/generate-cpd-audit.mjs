#!/usr/bin/env node
/**
 * generate-cpd-audit.mjs
 *
 * Produces a machine-readable snapshot of every downloadable asset's stated
 * CPD hours alongside the expected range from src/data/programmes.ts.
 * The snapshot is consumed by the admin-only audit page at /admin/cpd-audit.
 *
 * Usage:
 *   node scripts/generate-cpd-audit.mjs
 *   node scripts/generate-cpd-audit.mjs --out public/cpd-audit.json
 */

import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const args = process.argv.slice(2);
const ROOT = resolve(args.includes("--root") ? args[args.indexOf("--root") + 1] : process.cwd());
const OUT = resolve(
  ROOT,
  args.includes("--out") ? args[args.indexOf("--out") + 1] : "public/cpd-audit.json"
);
const CATALOGUE = "src/data/programmes.ts";

/* ---------------------------------------------------------------- catalogue */

const source = readFileSync(join(ROOT, CATALOGUE), "utf8");
const programmes = [];
const blockRe = /title:\s*"([^"]+)"[\s\S]*?cpdHours:\s*"([^"]+)"/g;
let m;
while ((m = blockRe.exec(source)) !== null) {
  const [, title, cpdHours] = m;
  const range = cpdHours.match(/(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)/);
  if (!range) {
    console.error(`✖ Unparseable cpdHours for "${title}": ${cpdHours}`);
    process.exit(1);
  }
  programmes.push({ title, cpdHours, min: Number(range[1]), max: Number(range[2]) });
}
if (programmes.length === 0) {
  console.error(`✖ No programmes with cpdHours found in ${CATALOGUE}`);
  process.exit(1);
}
const byTitle = (t) => programmes.find((p) => p.title === t);

/* Kept in sync with scripts/validate-cpd-hours-report.mjs */
const ASSET_MAP = {
  "public/downloads/executive-leadership-mastery-overview.html": "Executive Leadership Mastery",
  "public/downloads/executive-leadership-mastery-introduction.html": "Executive Leadership Mastery",
  "public/brochures/executive-leadership-mastery-brochure.html": "Executive Leadership Mastery",
  "src/utils/fillablePdfGenerator.ts": "Executive Leadership Mastery",
  "public/downloads/strategic-leadership-ai-workbook.html": "Strategic Leadership in the Age of AI",
  "src/utils/strategicLeadershipPdfGenerator.ts": "Strategic Leadership in the Age of AI",
  "public/brochures/future-of-work-brochure.html": "The Future of Work",
  "public/brochures/peak-performance-brochure.html": "Strategic Productivity & Peak Performance",
};

/* -------------------------------------------------------------- file walker */

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
};

const targets = [
  ...walk(join(ROOT, "public")).filter((f) => f.endsWith(".html")),
  ...walk(join(ROOT, "src/utils")).filter((f) => /PdfGenerator\.ts$/.test(f)),
].filter((f) => relative(ROOT, f) !== relative(ROOT, OUT));

/* ----------------------------------------------------------------- scanning */

const decode = (s) =>
  s.replace(/&ndash;|&mdash;|&#8211;|&#8212;/g, "–").replace(/&nbsp;/g, " ");

const RANGE_RE =
  /(\d+(?:\.\d+)?)\s*(?:–|-)\s*(\d+(?:\.\d+)?)\s*(?:accredited\s+)?CPD\s*hours/gi;
const POINTS_RE = /CPD\s*Points?\b/gi;
const PER_MODULE_CEILING = 10;

const assets = [];

for (const file of targets) {
  const rel = relative(ROOT, file);
  const text = decode(readFileSync(file, "utf8"));
  // Strip HTML tags so markup between the number and the "CPD Hours" label
  // (e.g. <div class="num">20&ndash;25</div><div class="label">CPD Hours</div>)
  // does not hide a valid range. Newlines are preserved so line numbers hold.
  const lines = text.replace(/<[^>]*>/g, " ").split("\n");
  const expected = byTitle(ASSET_MAP[rel]);

  const found = [];
  const bannedTerms = [];

  lines.forEach((line, i) => {
    const lineNo = i + 1;
    for (const p of line.matchAll(POINTS_RE)) {
      bannedTerms.push({ line: lineNo, term: p[0] });
    }
    for (const r of line.matchAll(RANGE_RE)) {
      const min = Number(r[1]);
      const max = Number(r[2]);
      if (max < PER_MODULE_CEILING) continue;
      found.push({ line: lineNo, min, max, value: `${min}–${max} CPD hours` });
    }
  });

  // Skip unmapped files that say nothing about CPD at all.
  if (!expected && found.length === 0 && bannedTerms.length === 0) continue;

  let status = "ok";
  const issues = [];

  if (bannedTerms.length > 0) {
    status = "error";
    issues.push(
      `Uses "CPD Points" on line(s) ${bannedTerms.map((b) => b.line).join(", ")} — CPD is accredited in hours.`
    );
  }

  if (expected) {
    const wrong = found.filter((f) => f.min !== expected.min || f.max !== expected.max);
    if (wrong.length > 0) {
      status = "error";
      issues.push(
        `States ${[...new Set(wrong.map((w) => w.value))].join(", ")} but the catalogue says ${expected.cpdHours}.`
      );
    }
    if (found.length === 0) {
      status = "error";
      issues.push(`Mapped to "${expected.title}" but never states its CPD range ${expected.cpdHours}.`);
    }
  } else {
    const unknown = found.filter(
      (f) => !programmes.some((p) => p.min === f.min && p.max === f.max)
    );
    if (unknown.length > 0) {
      status = "error";
      issues.push(
        `States ${[...new Set(unknown.map((u) => u.value))].join(", ")}, which matches no programme in the catalogue.`
      );
    } else if (status === "ok") {
      status = "unmapped";
    }
  }

  assets.push({
    file: rel,
    programme: expected ? expected.title : null,
    expected: expected ? expected.cpdHours : null,
    found: [...new Set(found.map((f) => f.value))],
    occurrences: found,
    bannedTerms,
    status,
    issues,
  });
}

assets.sort((a, b) => (a.programme || "zzz").localeCompare(b.programme || "zzz") || a.file.localeCompare(b.file));

const snapshot = {
  generatedAt: new Date().toISOString(),
  catalogue: CATALOGUE,
  programmes: programmes.map((p) => ({
    title: p.title,
    cpdHours: p.cpdHours,
    assetCount: assets.filter((a) => a.programme === p.title).length,
  })),
  filesScanned: targets.length,
  assets,
  summary: {
    total: assets.length,
    ok: assets.filter((a) => a.status === "ok").length,
    unmapped: assets.filter((a) => a.status === "unmapped").length,
    errors: assets.filter((a) => a.status === "error").length,
  },
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(snapshot, null, 2));

console.log(
  `✓ CPD audit snapshot written to ${relative(ROOT, OUT)} — ${snapshot.summary.total} asset(s), ${snapshot.summary.errors} with issues.`
);
