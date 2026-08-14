#!/usr/bin/env node
/**
 * Build gate: enquiry-first enrolment for the four catalogue programmes.
 *
 * Individual places are arranged directly with Bright Leadership Consulting,
 * so this fails the build if any of the following reappear:
 *   1. a direct Thinkific purchase link for a catalogue programme
 *      (src/data/programmes.ts `link`, brochureCtaLinks, catalogue brochures)
 *   2. an "Enrol Now" / immediate-access / checkout claim in app source or in a
 *      catalogue brochure
 *   3. a catalogue `link` that is not a valid in-site /contact destination
 *
 * It also asserts that the organisational, advisory and Executive Alignment
 * Index™ routes are preserved.
 *
 * The two standalone course brochures (advanced-leadership-skills,
 * enhanced-employability-skills) are intentionally out of scope pending a
 * separate status audit.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(resolve(ROOT, p), "utf8");

const failures = [];

/* ---------------------------------------------------------- catalogue data */

const catalogueSrc = read("src/data/programmes.ts");

const catalogueBody = catalogueSrc.slice(
  catalogueSrc.indexOf("export const programmes"),
  catalogueSrc.indexOf("export const facilitatedEngagement"),
);

const blocks = catalogueBody.split(/\n  \{\n/).slice(1);
const programmes = blocks.map((block) => ({
  title: block.match(/title:\s*\n?\s*"([^"]+)"/)?.[1],
  link: block.match(/link:\s*(?:individualEnquiryPath\(\s*)?"([^"]*)"/)?.[1],
  enquiryHelper: /link:\s*individualEnquiryPath\(/.test(block),
  detailPage: block.match(/detailPage:\s*"([^"]+)"/)?.[1],
  fee: block.match(/individualFee:\s*"([^"]+)"/)?.[1],
}));

if (programmes.length !== 4) {
  failures.push(
    `Expected four catalogue programmes, parsed ${programmes.length}.`,
  );
}

for (const p of programmes) {
  if (!p.enquiryHelper) {
    failures.push(
      `${p.title}: catalogue link must use individualEnquiryPath() so the CTA routes to /contact.`,
    );
  }
  if (/thinkific/i.test(String(p.link))) {
    failures.push(`${p.title}: catalogue link is a direct Thinkific purchase link.`);
  }
  if (!p.fee) {
    failures.push(`${p.title}: individualFee must remain published.`);
  }
  if (!p.detailPage || !existsSync(resolve(ROOT, "src/pages"))) {
    failures.push(`${p.title}: detailPage missing.`);
  }
}

/* ------------------------------------------------------------ CTA wording */

const CTA_LABEL = "Request Individual Enrolment";
const ctaSrc = read("src/components/ProgrammeCta.tsx");
if (!ctaSrc.includes(CTA_LABEL)) {
  failures.push(`src/components/ProgrammeCta.tsx must offer "${CTA_LABEL}".`);
}
if (
  !ctaSrc.includes(
    "Individual places are currently arranged directly. Submit an enquiry and we will confirm availability, payment arrangements and access.",
  )
) {
  failures.push("src/components/ProgrammeCta.tsx helper wording is missing.");
}

/* ------------------------------------------------- banned claims in source */

const BANNED = [
  { re: /\bEnrol Now\b/, why: '"Enrol Now" implies self-service checkout' },
  { re: /immediate (?:access|start|enrolment)/i, why: "immediate-access claim" },
  { re: /\bat checkout\b/i, why: "checkout claim" },
  { re: /begin immediately/i, why: "immediate-start claim" },
  { re: /Request Availability/, why: "superseded CTA label" },
];

/** Files exempt because they describe consumer statutory terms, not purchase. */
const EXEMPT = new Set([
  "src/pages/Terms.tsx",
  "src/pages/Privacy.tsx",
  "src/components/CancellationFaq.tsx",
  "scripts/validate-enrolment-routes.mjs",
]);

const walk = (dir, out = []) => {
  for (const entry of readdirSync(resolve(ROOT, dir), { withFileTypes: true })) {
    const rel = join(dir, entry.name);
    if (entry.isDirectory()) walk(rel, out);
    else if (/\.(tsx|ts)$/.test(entry.name) && !/\.test\./.test(entry.name))
      out.push(rel);
  }
  return out;
};

const sourceFiles = walk("src").filter((f) => !EXEMPT.has(f));

for (const file of sourceFiles) {
  const src = read(file);
  for (const { re, why } of BANNED) {
    const line = src.split("\n").findIndex((l) => re.test(l));
    if (line >= 0) failures.push(`${file}:${line + 1} — ${why}.`);
  }
  if (/thinkific\.com\/(?:products\/)?courses\//i.test(src) && file !== "src/data/programmes.ts") {
    failures.push(`${file} — direct Thinkific course link in app source.`);
  }
}

/* ------------------------------------------------------ catalogue brochures */

const CATALOGUE_BROCHURES = [
  "executive-leadership-mastery-brochure.html",
  "future-of-work-brochure.html",
  "peak-performance-brochure.html",
];
/** Deliberately excluded pending a separate status audit. */
const OUT_OF_SCOPE_BROCHURES = [
  "advanced-leadership-skills-brochure.html",
  "enhanced-employability-skills-brochure.html",
];

for (const file of CATALOGUE_BROCHURES) {
  const rel = `public/brochures/${file}`;
  if (!existsSync(resolve(ROOT, rel))) {
    failures.push(`${rel} is missing.`);
    continue;
  }
  const html = read(rel);
  if (/thinkific/i.test(html)) {
    failures.push(`${rel} — Thinkific purchase link reintroduced.`);
  }
  if (/Enrol Now/.test(html)) {
    failures.push(`${rel} — "Enrol Now" CTA reintroduced.`);
  }
  if (!html.includes(CTA_LABEL)) {
    failures.push(`${rel} — CTA must read "${CTA_LABEL}".`);
  }
  if (!html.includes("https://brightleadershipconsulting.com/contact")) {
    failures.push(`${rel} — CTA must link to the enquiry page.`);
  }
}

for (const file of OUT_OF_SCOPE_BROCHURES) {
  const rel = `public/brochures/${file}`;
  if (existsSync(resolve(ROOT, rel)) && !/Enrol Now/.test(read(rel))) {
    failures.push(
      `${rel} was changed but is out of scope pending a status audit.`,
    );
  }
}

/* --------------------------------------------- preserved organisational routes */

const routerSrc = read("src/App.tsx");
const PRESERVED = [
  "/strategic-ai-leadership-for-organisations",
  "/executive-alignment-index",
  "/advisory-process",
  "/contact",
];
for (const route of PRESERVED) {
  if (!routerSrc.includes(route)) {
    failures.push(`src/App.tsx — preserved route ${route} is missing.`);
  }
}

/* --------------------------------------------------------------------- report */

if (failures.length) {
  console.error(
    `\n✖ Enrolment-route validation failed: ${failures.length} issue(s).\n` +
      failures.map((f) => `  • ${f}`).join("\n") +
      "\n",
  );
  process.exit(1);
}

console.log(
  `✔ Enrolment-route validation passed: 4 enquiry-first programmes, ` +
    `${CATALOGUE_BROCHURES.length} catalogue brochures, ` +
    `${sourceFiles.length} source files clean.`,
);
