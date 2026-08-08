#!/usr/bin/env node
/**
 * validate-cpd-hours.mjs
 *
 * Verifies that every downloadable asset (public/**.html) and every PDF
 * generator (src/utils/*PdfGenerator.ts) states CPD hours values that match
 * src/data/programmes.ts exactly.
 *
 * Rules enforced:
 *  1. "CPD Point(s)" is banned everywhere — we accredit hours, not points.
 *  2. Any programme-level CPD hours range in a mapped asset must equal the
 *     catalogue range for that programme (per-module figures below 10 hours,
 *     e.g. "1.5–2 CPD hours", are ignored).
 *  3. Each mapped asset must state its programme's range at least once.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
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

/**
 * Maps each downloadable asset / generator to the programme it describes.
 * Assets not listed here are still scanned for banned "CPD Points" wording
 * and for any CPD hours range that matches no programme in the catalogue.
 */
const ASSET_MAP = {
  "public/downloads/executive-leadership-mastery-overview.html": "Executive Leadership Mastery Programme",
  "public/downloads/executive-leadership-mastery-introduction.html": "Executive Leadership Mastery Programme",
  "public/brochures/executive-leadership-mastery-brochure.html": "Executive Leadership Mastery Programme",
  "src/utils/fillablePdfGenerator.ts": "Executive Leadership Mastery Programme",
  "public/downloads/strategic-leadership-ai-workbook.html": "Strategic Leadership in the Age of AI",
  "src/utils/strategicLeadershipPdfGenerator.ts": "Strategic Leadership in the Age of AI",
  "public/brochures/future-of-work-brochure.html": "Future Workplace and Workforce Strategy Programme",
  "public/brochures/peak-performance-brochure.html": "Strategic Productivity and Peak Performance Accelerator",
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
const PER_MODULE_CEILING = 10; // figures below this are per-module, not programme totals

const errors = [];

for (const file of targets) {
  const rel = relative(ROOT, file);
  const text = decode(readFileSync(file, "utf8"));
  const lines = text.split("\n");
  const expected = byTitle(ASSET_MAP[rel]);

  lines.forEach((line, i) => {
    const lineNo = i + 1;

    for (const p of line.matchAll(POINTS_RE)) {
      errors.push(
        `${rel}:${lineNo} uses "${p[0]}" — CPD is accredited in hours, not points.`
      );
    }

    for (const r of line.matchAll(RANGE_RE)) {
      const min = Number(r[1]);
      const max = Number(r[2]);
      if (max < PER_MODULE_CEILING) continue; // per-module figure

      if (expected) {
        if (min !== expected.min || max !== expected.max) {
          errors.push(
            `${rel}:${lineNo} states "${min}–${max} CPD hours" but ${CATALOGUE} says "${expected.cpdHours}" for ${expected.title}.`
          );
        }
      } else if (!programmes.some((p) => p.min === min && p.max === max)) {
        errors.push(
          `${rel}:${lineNo} states "${min}–${max} CPD hours", which matches no programme in ${CATALOGUE}.`
        );
      }
    }
  });

  if (expected) {
    const wanted = new RegExp(
      `${expected.min}\\s*(?:–|-)\\s*${expected.max}\\b`
    );
    if (!wanted.test(text)) {
      errors.push(
        `${rel} is mapped to "${expected.title}" but never states its CPD range "${expected.cpdHours}".`
      );
    }
  }
}

if (errors.length > 0) {
  console.error("\n✖ CPD hours validation failed:\n");
  for (const e of errors) console.error(`  - ${e}`);
  console.error(
    `\n${errors.length} problem(s). Update the asset copy (or ${CATALOGUE}) so the values match.\n`
  );
  process.exit(1);
}

console.log(
  `✓ CPD hours consistent across ${targets.length} asset(s) for ${programmes.length} programme(s):`
);
for (const p of programmes) console.log(`    ${p.title}: ${p.cpdHours}`);
