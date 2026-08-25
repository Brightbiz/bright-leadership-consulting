#!/usr/bin/env node
/**
 * Legal-identity placement gate.
 *
 * Confirmed sole-trader identity: "Irene A. Agunbiade trading as Bright
 * Leadership Consulting". That identity is restricted to legal, transactional
 * and regulatory documentation. On this website it may appear ONLY in:
 *   - src/pages/Terms.tsx   — contracting and invoicing provisions
 *   - src/pages/Privacy.tsx — data-controller provision
 *
 * It is prohibited everywhere else (homepage, programme pages, Principal,
 * footer, marketing copy, JSON-LD, brochures, downloads, index.html).
 *
 * The former limited company, its number, registered-office wording and the
 * Wenlock Road address are prohibited site-wide. The Mildenhall address is
 * permitted, but only labelled as a correspondence address.
 *
 * Exits non-zero with file:line evidence on any violation.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();

/** Files permitted to carry the restricted proprietor identity. */
const IDENTITY_ALLOWED = new Set(["src/pages/Terms.tsx", "src/pages/Privacy.tsx"]);

/** Only the Privacy Notice may identify the data controller. */
const CONTROLLER_ALLOWED = new Set(["src/pages/Privacy.tsx"]);

const SCAN_DIRS = ["src", "public"];
const SCAN_FILES = ["index.html"];
const SCAN_EXT = /\.(tsx?|jsx?|html|json|xml|txt|md|mjs|css)$/i;
const SKIP_DIR = /(^|\/)(node_modules|dist|\.git)(\/|$)/;

/** Former-entity wording that must not appear anywhere on the public site. */
const PROHIBITED = [
  [/bright\s+business\s+solutions/i, "former limited-company name"],
  [/07\s?258\s?400/, "former company number"],
  [/\bcompany\s+(number|no\.?)\b/i, "company number wording"],
  [/\bregistration\s+number\b/i, "registration-number wording"],
  [/\bregistered\s+(office|in\s+england)/i, "registered-office wording"],
  [/registered\s+in\s+england\s+and\s+wales/i, "registered-in-England wording"],
  [/\bcompanies\s+house\b/i, "Companies House reference"],
  [/\bwenlock\s+road\b/i, "former Wenlock Road address"],
  [/\bN1\s?7GU\b/i, "former Wenlock Road postcode"],
  [/\bcompany\s+limited\b/i, "limited-company designation"],
  [/\blimited\s+company\b/i, "limited-company designation"],
  [/\bLtd\b/, "limited-company designation"],
];

/** Restricted proprietor / sole-trader identity wording. */
const IDENTITY = [
  /trading\s+as\s+bright\s+leadership\s+consulting/i,
  /under\s+the\s+business\s+name\s+bright\s+leadership\s+consulting/i,
  /\bsole\s+trader\b/i,
  /\bproprietor\b/i,
];

/** Data-controller identification wording. */
const CONTROLLER = [/\bdata\s+controller\b/i, /\bthe\s+controller\s+is\b/i];

const MILDENHALL = /82\s+James\s+Carter\s+Road/i;
const CORRESPONDENCE = /correspondence\s+(and\s+service\s+)?address/i;

const files = [];
const walk = (dir) => {
  if (SKIP_DIR.test(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (SCAN_EXT.test(entry)) files.push(full);
  }
};
for (const dir of SCAN_DIRS) walk(join(ROOT, dir));
for (const file of SCAN_FILES) files.push(join(ROOT, file));

const failures = [];
const fail = (rel, line, message) => failures.push(`${rel}:${line} — ${message}`);

for (const full of files) {
  const rel = relative(ROOT, full).split("\\").join("/");
  const lines = readFileSync(full, "utf8").split("\n");

  lines.forEach((text, i) => {
    const line = i + 1;

    for (const [pattern, label] of PROHIBITED) {
      if (pattern.test(text)) fail(rel, line, `prohibited ${label}: ${text.trim().slice(0, 120)}`);
    }

    if (IDENTITY.some((p) => p.test(text)) && !IDENTITY_ALLOWED.has(rel)) {
      fail(
        rel,
        line,
        "restricted proprietor identity outside Terms (contracting/invoicing) and Privacy (controller)"
      );
    }

    if (CONTROLLER.some((p) => p.test(text)) && !CONTROLLER_ALLOWED.has(rel)) {
      fail(rel, line, "data-controller wording outside the Privacy Notice");
    }

    if (MILDENHALL.test(text) && !CORRESPONDENCE.test(text)) {
      fail(rel, line, "Mildenhall address is not labelled as a correspondence address");
    }
  });
}

/* --------------------------------------------- footer and schema specifics */

const footer = readFileSync(join(ROOT, "src/components/Footer.tsx"), "utf8");
if (!/Principal-led executive advisory and development/.test(footer)) {
  failures.push("src/components/Footer.tsx — approved footer descriptor line is missing");
}
if (!/Correspondence address: 82 James Carter Road, Mildenhall, England IP28 7DE\./.test(footer)) {
  failures.push("src/components/Footer.tsx — approved correspondence-address line is missing");
}

const schemaFiles = ["src/components/OrganizationSchema.tsx", "src/components/CourseSchema.tsx"];
const SCHEMA_KEYS = [
  "legalName",
  "taxID",
  "vatID",
  "duns",
  "leiCode",
  "registrationNumber",
  "identifier",
];
for (const rel of schemaFiles) {
  const source = readFileSync(join(ROOT, rel), "utf8");
  for (const key of SCHEMA_KEYS) {
    if (new RegExp(`["']?${key}["']?\\s*:`).test(source)) {
      failures.push(`${rel} — JSON-LD must not include a "${key}" property`);
    }
  }
}

if (failures.length) {
  console.error(`\nLegal-identity validation FAILED (${failures.length} issue(s)):\n`);
  for (const line of failures) console.error(`  • ${line}`);
  console.error("");
  process.exit(1);
}

console.log(
  `Legal-identity validation passed — ${files.length} files scanned; ` +
    "restricted identity confined to Terms (contracting/invoicing) and Privacy (controller)."
);
