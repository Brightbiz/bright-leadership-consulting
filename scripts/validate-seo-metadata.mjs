#!/usr/bin/env node
/**
 * Build gate: SEO metadata must match the programme catalogue.
 *
 * For every programme in src/data/programmes.ts that has an in-site detail
 * page, this checks the page's <ProgrammeMeta> / <CourseSchema> usage so
 * titles, JSON-LD and canonical URLs can never drift from the approved
 * programme wording (titles, CPD hour ranges, fees).
 *
 * Checks per programme detail page:
 *   1. the file exists and renders ProgrammeMeta + CourseSchema
 *   2. both components reference the exact catalogue title
 *   3. the canonical path self-references the catalogue detailPage
 *   4. the page title carries the catalogue CPD hour range
 *   5. the meta description carries the CPD hour range and the published fee
 *   6. the title stays within a sane SERP length
 *   7. sitemap.xml lists the page on the canonical origin
 *
 * Plus site-wide: SEOHead's origin equals SITE_ORIGIN, and /courses
 * canonicalises to itself.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(resolve(ROOT, p), "utf8");

const MAX_TITLE_LENGTH = 70;

/* ------------------------------------------------------------- catalogue */

const catalogueSrc = read("src/data/programmes.ts");

const SITE_ORIGIN = catalogueSrc.match(/SITE_ORIGIN\s*=\s*"([^"]+)"/)?.[1];
if (!SITE_ORIGIN) {
  console.error("✖ Could not read SITE_ORIGIN from src/data/programmes.ts");
  process.exit(1);
}

/** Minimal literal parse of the programmes array — no transpiler needed. */
function parseCatalogue(src) {
  const body = src.slice(
    src.indexOf("export const programmes"),
    src.indexOf("export const facilitatedEngagement"),
  );
  const blocks = body.split(/\n  \{\n/).slice(1);
  return blocks.map((block) => ({
    title: block.match(/title:\s*\n?\s*"([^"]+)"/)?.[1],
    detailPage: block.match(/detailPage:\s*"([^"]+)"/)?.[1],
    cpdHours: block.match(/cpdHours:\s*"([^"]+)"/)?.[1],
    individualFee: block.match(/individualFee:\s*"([^"]+)"/)?.[1],
  }));
}

const programmes = parseCatalogue(catalogueSrc);
if (programmes.length !== 4 || programmes.some((p) => !p.title)) {
  console.error(
    `✖ Expected four parsable programmes in src/data/programmes.ts, got ${programmes.length}.`,
  );
  process.exit(1);
}

/* -------------------------------------------------------- page discovery */

const ROUTES = read("src/App.tsx");

/** Resolves the page component file that App.tsx routes to for a path. */
function pageFileForRoute(routePath) {
  const escaped = routePath.replace(/[/-]/g, (c) => `\\${c}`);
  const elementSrc = ROUTES.match(
    new RegExp(`path="${escaped}"\\s+element=\\{([^]*?)\\}\\s*/>`),
  )?.[1];
  if (!elementSrc) return null;

  // Routes wrap pages (e.g. <PageTransition><Page /></PageTransition>);
  // take the innermost component that resolves to a file under src/pages.
  const names = [...elementSrc.matchAll(/<([A-Z][A-Za-z0-9_]*)/g)].map((m) => m[1]);
  for (const name of names.reverse()) {
    const importPath =
      ROUTES.match(
        new RegExp(`${name}\\s*=\\s*lazy\\(\\(\\)\\s*=>\\s*import\\("([^"]+)"\\)`),
      )?.[1] ?? ROUTES.match(new RegExp(`import ${name} from "([^"]+)"`))?.[1];
    if (!importPath) continue;
    const file =
      importPath.replace(/^@\//, "src/").replace(/^\.\//, "src/") + ".tsx";
    if (file.startsWith("src/pages/") && existsSync(resolve(ROOT, file))) return file;
  }
  return null;
}

/** Reads a prop value off a JSX element, resolving `{CONST}` references. */
function propValue(elementSrc, fileSrc, prop) {
  const literal = elementSrc.match(new RegExp(`${prop}=\\{?"([^"]*)"\\}?`));
  if (literal) return literal[1];
  const ref = elementSrc.match(new RegExp(`${prop}=\\{([A-Za-z0-9_]+)\\}`))?.[1];
  if (!ref) return null;
  return fileSrc.match(new RegExp(`(?:const|let)\\s+${ref}\\s*=\\s*"([^"]+)"`))?.[1] ?? null;
}

/** Extracts a self-closing JSX element by component name. */
function element(fileSrc, name) {
  const start = fileSrc.indexOf(`<${name}`);
  if (start === -1) return null;
  const end = fileSrc.indexOf("/>", start);
  return end === -1 ? null : fileSrc.slice(start, end + 2);
}

/* ----------------------------------------------------------- the checks */

const errors = [];
const checked = [];
const sitemap = existsSync(resolve(ROOT, "public/sitemap.xml"))
  ? read("public/sitemap.xml")
  : "";

for (const programme of programmes) {
  const { title, detailPage, cpdHours, individualFee } = programme;
  if (!detailPage) continue;

  const file = pageFileForRoute(detailPage);
  if (!file) {
    errors.push(`${title}: no routed page component found for ${detailPage} in src/App.tsx`);
    continue;
  }

  const src = read(file);
  const meta = element(src, "ProgrammeMeta");
  const schema = element(src, "CourseSchema");

  if (!meta) {
    errors.push(`${file}: missing <ProgrammeMeta /> — page has no title/canonical/og tags`);
  }
  if (!schema) {
    errors.push(`${file}: missing <CourseSchema /> — page emits no Course JSON-LD`);
  }
  if (!meta || !schema) continue;

  const metaTitleRef = propValue(meta, src, "programmeTitle");
  const schemaTitleRef = propValue(schema, src, "programmeTitle");
  const pageTitle = propValue(meta, src, "title");
  const description = propValue(meta, src, "description");
  const canonicalPath = propValue(meta, src, "path") ?? detailPage;

  if (metaTitleRef !== title) {
    errors.push(
      `${file}: ProgrammeMeta programmeTitle is "${metaTitleRef}", catalogue says "${title}"`,
    );
  }
  if (schemaTitleRef !== title) {
    errors.push(
      `${file}: CourseSchema programmeTitle is "${schemaTitleRef}", catalogue says "${title}"`,
    );
  }
  if (canonicalPath !== detailPage) {
    errors.push(
      `${file}: canonical path "${canonicalPath}" does not self-reference the catalogue detailPage "${detailPage}"`,
    );
  }
  if (pageTitle && pageTitle.length > MAX_TITLE_LENGTH) {
    errors.push(
      `${file}: page title is ${pageTitle.length} chars (max ${MAX_TITLE_LENGTH}): "${pageTitle}"`,
    );
  }

  // CPD hours are stated as "20–25 CPD hours"; match the numeric range only,
  // so titles may phrase it as "20–25 CPD Hours".
  const range = cpdHours?.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (range) {
    const pattern = new RegExp(`${range[1]}\\s*[–-]\\s*${range[2]}`);
    if (pageTitle && !pattern.test(pageTitle)) {
      errors.push(`${file}: page title omits the catalogue CPD range "${cpdHours}"`);
    }
    if (description && !pattern.test(description)) {
      errors.push(`${file}: meta description omits the catalogue CPD range "${cpdHours}"`);
    }
  }

  if (individualFee && description && !description.includes(individualFee)) {
    errors.push(
      `${file}: meta description omits the published fee ${individualFee}`,
    );
  }

  if (sitemap && !sitemap.includes(`${SITE_ORIGIN}${detailPage}`)) {
    errors.push(`public/sitemap.xml: missing ${SITE_ORIGIN}${detailPage}`);
  }

  checked.push(`${detailPage} → ${title}`);
}

/* -------------------------------------------------------- site-wide tags */

const seoHead = read("src/components/SEOHead.tsx");
const seoOrigin = seoHead.match(/SITE_URL\s*=\s*"([^"]+)"/)?.[1];
if (seoOrigin !== SITE_ORIGIN) {
  errors.push(
    `src/components/SEOHead.tsx: SITE_URL "${seoOrigin}" does not match SITE_ORIGIN "${SITE_ORIGIN}"`,
  );
}

const coursesSrc = read("src/pages/Courses.tsx");
const coursesMeta = element(coursesSrc, "SEOHead");
if (!coursesMeta) {
  errors.push("src/pages/Courses.tsx: missing <SEOHead /> tags");
} else if (propValue(coursesMeta, coursesSrc, "path") !== "/courses") {
  errors.push("src/pages/Courses.tsx: canonical path does not self-reference /courses");
}
if (!element(coursesSrc, "CourseSchema")) {
  errors.push("src/pages/Courses.tsx: missing <CourseSchema /> ItemList JSON-LD");
}

/* -------------------------------------------------------------- reporting */

if (errors.length) {
  console.error("\n✖ SEO metadata validation failed:\n");
  for (const error of errors) console.error(`  - ${error}`);
  console.error(
    "\nFix the page metadata (or the catalogue) so titles, JSON-LD and canonical URLs match src/data/programmes.ts.\n",
  );
  process.exit(1);
}

console.log(
  `✔ SEO metadata validation passed: ${checked.length} programme pages match the catalogue (titles, JSON-LD, canonical URLs).`,
);
for (const line of checked) console.log(`  · ${line}`);
