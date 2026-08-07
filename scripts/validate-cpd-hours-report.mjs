#!/usr/bin/env node
/**
 * validate-cpd-hours-report.mjs
 *
 * Enhanced CPD hours validator. Runs the same checks as validate-cpd-hours.mjs
 * but, when mismatches are found, writes a detailed JSON and HTML report to
 * the output directory instead of only printing console errors.
 *
 * Usage:
 *   node scripts/validate-cpd-hours-report.mjs
 *   node scripts/validate-cpd-hours-report.mjs --root ./my-project --out ./reports
 */

import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const args = process.argv.slice(2);
const ROOT = resolve(args.includes("--root") ? args[args.indexOf("--root") + 1] : process.cwd());
const OUT_DIR = resolve(args.includes("--out") ? args[args.indexOf("--out") + 1] : "/mnt/documents/cpd-validation-report");
const ALWAYS_WRITE = args.includes("--always-write");
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
];

/* ----------------------------------------------------------------- checking */

const decode = (s) =>
  s
    .replace(/&ndash;|&mdash;|&#8211;|&#8212;/g, "–")
    .replace(/&nbsp;/g, " ");

const RANGE_RE =
  /(\d+(?:\.\d+)?)\s*(?:–|-)\s*(\d+(?:\.\d+)?)\s*(?:accredited\s+)?CPD\s*hours/gi;
const POINTS_RE = /CPD\s*Points?\b/gi;
const PER_MODULE_CEILING = 10;

const mismatches = [];
const summary = {
  generatedAt: new Date().toISOString(),
  root: ROOT,
  catalogue: CATALOGUE,
  programmes: programmes.map((p) => ({ title: p.title, cpdHours: p.cpdHours })),
  filesScanned: targets.length,
  totalMismatches: 0,
  passed: false,
};

for (const file of targets) {
  const rel = relative(ROOT, file);
  const text = decode(readFileSync(file, "utf8"));
  const lines = text.split("\n");
  const expected = byTitle(ASSET_MAP[rel]);

  lines.forEach((line, i) => {
    const lineNo = i + 1;

    for (const p of line.matchAll(POINTS_RE)) {
      mismatches.push({
        type: "banned-term",
        file: rel,
        line: lineNo,
        found: p[0],
        expected: "CPD hours (not points)",
        message: `${rel}:${lineNo} uses "${p[0]}" — CPD is accredited in hours, not points.`,
      });
    }

    for (const r of line.matchAll(RANGE_RE)) {
      const min = Number(r[1]);
      const max = Number(r[2]);
      if (max < PER_MODULE_CEILING) continue;

      if (expected) {
        if (min !== expected.min || max !== expected.max) {
          mismatches.push({
            type: "range-mismatch",
            file: rel,
            line: lineNo,
            found: `${min}–${max} CPD hours`,
            expected: `${expected.cpdHours} for "${expected.title}"`,
            programme: expected.title,
            message: `${rel}:${lineNo} states "${min}–${max} CPD hours" but ${CATALOGUE} says "${expected.cpdHours}" for ${expected.title}.`,
          });
        }
      } else if (!programmes.some((p) => p.min === min && p.max === max)) {
        mismatches.push({
          type: "unknown-range",
          file: rel,
          line: lineNo,
          found: `${min}–${max} CPD hours`,
          expected: "a range matching one of the programmes in the catalogue",
          message: `${rel}:${lineNo} states "${min}–${max} CPD hours", which matches no programme in ${CATALOGUE}.`,
        });
      }
    }
  });

  if (expected) {
    const wanted = new RegExp(
      `${expected.min}\\s*(?:–|-)\\s*${expected.max}\\b`
    );
    if (!wanted.test(text)) {
      mismatches.push({
        type: "missing-range",
        file: rel,
        line: null,
        found: null,
        expected: `${expected.cpdHours} for "${expected.title}"`,
        programme: expected.title,
        message: `${rel} is mapped to "${expected.title}" but never states its CPD range "${expected.cpdHours}".`,
      });
    }
  }
}

summary.totalMismatches = mismatches.length;
summary.passed = mismatches.length === 0;

/* ------------------------------------------------------------------ reports */

function writeReports() {
  mkdirSync(OUT_DIR, { recursive: true });

  const jsonPath = join(OUT_DIR, "report.json");
  const htmlPath = join(OUT_DIR, "report.html");

  writeFileSync(jsonPath, JSON.stringify({ summary, mismatches }, null, 2));

  const rows = mismatches
    .map(
      (mm) => `
      <tr>
        <td><span class="badge ${mm.type}">${mm.type}</span></td>
        <td><code>${mm.file}</code>${mm.line ? ` <span class="line">line ${mm.line}</span>` : ""}</td>
        <td>${mm.found ? `<code>${mm.found}</code>` : "—"}</td>
        <td><code>${mm.expected}</code></td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CPD Hours Validation Report</title>
  <style>
    :root { --navy:#0f1c2e; --gold:#c5a05a; --pearl:#f7f5f0; --charcoal:#2d2d2d; --red:#b91c1c; --green:#15803d; }
    * { box-sizing: border-box; }
    body { font-family: Inter, system-ui, sans-serif; background: var(--pearl); color: var(--charcoal); margin: 0; padding: 2rem; }
    .container { max-width: 1100px; margin: 0 auto; background: #fff; border: 1px solid #e5e5e5; padding: 2rem; }
    h1 { font-family: "Libre Baskerville", Georgia, serif; color: var(--navy); margin-top: 0; }
    .status { display: inline-block; padding: 0.35rem 0.75rem; border-radius: 999px; font-weight: 600; font-size: 0.875rem; }
    .status.pass { background: #dcfce7; color: var(--green); }
    .status.fail { background: #fee2e2; color: var(--red); }
    .meta { margin: 1.5rem 0; color: #555; font-size: 0.9rem; }
    .meta dt { font-weight: 600; display: inline-block; min-width: 120px; }
    .meta dd { display: inline; margin: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; font-size: 0.9rem; }
    th { text-align: left; background: var(--navy); color: #fff; padding: 0.75rem; font-weight: 500; }
    td { padding: 0.75rem; border-bottom: 1px solid #e5e5e5; vertical-align: top; }
    tr:nth-child(even) { background: #fafafa; }
    code { font-family: "SF Mono", Monaco, monospace; background: #f1f1f1; padding: 0.15rem 0.35rem; border-radius: 4px; font-size: 0.85em; }
    .line { color: #777; font-size: 0.8rem; }
    .badge { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600; }
    .badge.range-mismatch { background: #fee2e2; color: var(--red); }
    .badge.banned-term { background: #ffedd5; color: #9a3412; }
    .badge.unknown-range { background: #fef3c7; color: #92400e; }
    .badge.missing-range { background: #e0f2fe; color: #075985; }
    .programmes { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .programme { border-left: 3px solid var(--gold); padding-left: 1rem; }
    .programme .title { font-weight: 600; color: var(--navy); }
    .programme .hours { color: #555; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>CPD Hours Validation Report</h1>
    <span class="status ${summary.passed ? "pass" : "fail"}">
      ${summary.passed ? "PASS" : `FAIL — ${summary.totalMismatches} mismatch${summary.totalMismatches === 1 ? "" : "es"}`}
    </span>

    <dl class="meta">
      <dt>Generated</dt><dd>${new Date(summary.generatedAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC</dd><br />
      <dt>Catalogue</dt><dd>${summary.catalogue}</dd><br />
      <dt>Files scanned</dt><dd>${summary.filesScanned}</dd>
    </dl>

    <h2>Expected programme ranges</h2>
    <div class="programmes">
      ${programmes
        .map((p) => `<div class="programme"><div class="title">${p.title}</div><div class="hours">${p.cpdHours}</div></div>`)
        .join("")}
    </div>

    ${
      mismatches.length > 0
        ? `<h2>Mismatches</h2>
    <table>
      <thead>
        <tr><th>Type</th><th>Source file</th><th>Found</th><th>Expected</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`
        : `<h2>Mismatches</h2><p>No CPD hours mismatches found.</p>`
    }
  </div>
</body>
</html>`;

  writeFileSync(htmlPath, html);

  return { jsonPath, htmlPath };
}

/* -------------------------------------------------------------------- exit */

if (mismatches.length > 0) {
  const { jsonPath, htmlPath } = writeReports();
  console.error("\n✖ CPD hours validation failed.\n");
  for (const mm of mismatches) console.error(`  - ${mm.message}`);
  console.error(`\nDetailed reports written to:`);
  console.error(`  JSON: ${jsonPath}`);
  console.error(`  HTML: ${htmlPath}\n`);
  process.exit(1);
}

const { jsonPath, htmlPath } = writeReports();
console.log(`✓ CPD hours consistent across ${targets.length} asset(s) for ${programmes.length} programme(s).`);
console.log(`  Reports written to:`);
console.log(`    JSON: ${jsonPath}`);
console.log(`    HTML: ${htmlPath}`);
for (const p of programmes) console.log(`    ${p.title}: ${p.cpdHours}`);
