#!/usr/bin/env node
/**
 * Build gate: payment-provider scripts may only load on pages that use them.
 *
 * The site takes no payment. Individual places are arranged directly with
 * Bright Leadership Consulting via an enquiry, and any card payment happens on
 * the third-party learning platform — never on this domain. So the allowlist
 * below is intentionally EMPTY: no route, component, brochure or HTML shell may
 * embed a PayPal, Stripe or other card-gateway script or SDK.
 *
 * If a genuine paying surface is ever added, add exactly that file to
 * ALLOWLIST with a reason. Any provider script found in a file that is not
 * allowlisted fails the build, which keeps a stray gateway tag (or a
 * re-introduced dependency) from shipping site-wide on pages that never
 * charge anyone.
 *
 * Checked surfaces:
 *   1. app source and public assets (src, public, scripts, index.html)
 *   2. dependency manifests (no gateway SDK may be installed)
 *   3. the built output in dist/, when present, so a provider pulled in by a
 *      transitive import is caught in the bundle as well
 *
 * Usage:
 *   node scripts/validate-payment-scripts.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve, join, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SELF = "scripts/validate-payment-scripts.mjs";

/**
 * Files permitted to reference a payment-provider script, each with the page
 * that justifies it. Empty: no page on this site takes payment.
 * @type {Record<string, string>}
 */
const ALLOWLIST = {};

/**
 * Loadable provider surfaces: script hosts, SDK package names and embed
 * attributes. Deliberately narrow so ordinary prose about "payment
 * arrangements" in Terms, Privacy and the programme FAQs does not trip the
 * gate — only an actual script/SDK/embed matches.
 */
const PROVIDER_PATTERNS = [
  { re: /js\.stripe\.com/i, why: "Stripe.js script host" },
  { re: /checkout\.stripe\.com/i, why: "Stripe Checkout host" },
  { re: /buy\.stripe\.com/i, why: "Stripe payment-link host" },
  { re: /\bapi\.stripe\.com/i, why: "Stripe API host" },
  { re: /@stripe\/(?:stripe-js|react-stripe-js)/i, why: "Stripe SDK import" },
  { re: /\bfrom\s+["']stripe["']/i, why: "Stripe server SDK import" },
  { re: /\bStripe\s*\(/, why: "Stripe client constructor" },
  { re: /www\.paypal\.com\/sdk/i, why: "PayPal JS SDK host" },
  { re: /www\.paypalobjects\.com/i, why: "PayPal hosted assets" },
  { re: /paypal\.com\/(?:cgi-bin\/webscr|donate|checkoutnow)/i, why: "PayPal checkout endpoint" },
  { re: /@paypal\/(?:react-paypal-js|paypal-js)/i, why: "PayPal SDK import" },
  { re: /\bpaypal\.Buttons\s*\(/, why: "PayPal Buttons embed" },
  { re: /js\.braintreegateway\.com/i, why: "Braintree script host" },
  { re: /braintree-web/i, why: "Braintree SDK import" },
  { re: /data-pp-(?:message|button)/i, why: "PayPal embed attribute" },
];

/** Dependency manifests: a gateway SDK must not be installed at all. */
const MANIFEST_PATTERNS = [
  /"@stripe\/[^"]+"/i,
  /"stripe"\s*:/i,
  /"@paypal\/[^"]+"/i,
  /"braintree(?:-web)?"\s*:/i,
];

const TEXT_EXT =
  /\.(?:tsx?|jsx?|mjs|cjs|css|html|json|md|txt|svg|ya?ml)$/i;

const failures = [];
const read = (p) => readFileSync(resolve(ROOT, p), "utf8");
const rel = (p) => p.split(sep).join("/");

const walk = (dir, out = []) => {
  const abs = resolve(ROOT, dir);
  if (!existsSync(abs)) return out;
  for (const entry of readdirSync(abs, { withFileTypes: true })) {
    const next = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      walk(next, out);
    } else {
      out.push(next);
    }
  }
  return out;
};

/** Scan one file's contents against the provider patterns. */
const scan = (file, contents, { requireAllowlist = true } = {}) => {
  const path = rel(file);
  for (const { re, why } of PROVIDER_PATTERNS) {
    if (!re.test(contents)) continue;
    if (requireAllowlist && ALLOWLIST[path]) continue;
    failures.push(
      `${path} — ${why} present. No page on this site takes payment; ` +
        `remove it, or allowlist the file in ${SELF} with the paying page that needs it.`,
    );
  }
};

/* ------------------------------------------- 1. app source and public assets */

const SOURCE_DIRS = ["src", "public", "scripts"];
const sourceFiles = [
  ...SOURCE_DIRS.flatMap((d) => walk(d)),
  ...(existsSync(resolve(ROOT, "index.html")) ? ["index.html"] : []),
].filter((f) => rel(f) !== SELF && TEXT_EXT.test(f));

let scanned = 0;
for (const file of sourceFiles) {
  let contents;
  try {
    contents = read(file);
  } catch {
    continue;
  }
  scanned += 1;
  scan(file, contents);
}

/* -------------------------------------------------- 2. dependency manifests */

for (const manifest of ["package.json"]) {
  if (!existsSync(resolve(ROOT, manifest))) continue;
  const contents = read(manifest);
  for (const re of MANIFEST_PATTERNS) {
    if (re.test(contents)) {
      failures.push(
        `${manifest} — payment-gateway SDK dependency ${re} is installed but no page takes payment.`,
      );
    }
  }
}

/* --------------------------------------------------------- 3. built bundles */

const distDir = resolve(ROOT, "dist");
let bundlesScanned = 0;
if (existsSync(distDir) && statSync(distDir).isDirectory()) {
  for (const file of walk("dist")) {
    if (!/\.(?:js|css|html)$/i.test(file)) continue;
    let contents;
    try {
      contents = read(file);
    } catch {
      continue;
    }
    bundlesScanned += 1;
    // Bundles are generated, so they can never be allowlisted individually:
    // a provider here means it was imported from somewhere in the app.
    scan(file, contents, { requireAllowlist: false });
  }
}

/* --------------------------------------------------------------- report out */

const allowlisted = Object.keys(ALLOWLIST);

if (failures.length) {
  console.error("\n✖ Payment-script check failed:\n");
  for (const f of failures) console.error(`  • ${f}`);
  console.error(
    `\n${failures.length} problem(s). Payment provider scripts may only load on an allowlisted paying page.\n`,
  );
  process.exit(1);
}

console.log(
  `✔ Payment-script check: no PayPal/Stripe/Braintree script, SDK or embed in ` +
    `${scanned} source files${bundlesScanned ? `, ${bundlesScanned} built bundles` : ""}; ` +
    `${allowlisted.length} allowlisted paying page(s).`,
);
