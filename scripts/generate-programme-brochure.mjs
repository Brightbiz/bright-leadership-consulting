#!/usr/bin/env node
/**
 * generate-programme-brochure.mjs
 *
 * Builds the downloadable programme portfolio brochure at
 * public/downloads/programme-portfolio.pdf entirely from the authoritative
 * sources, so the PDF wording can never drift:
 *
 *   - src/data/programmes.ts     — titles, subtitles, descriptions, features,
 *                                  CPD hours, fees, payment plans
 *   - src/data/accreditation.ts  — approved CPD / certificate wording
 *   - src/data/cpd-faq.json      — the CPD hours FAQ shown on /courses
 *
 * Usage: node scripts/generate-programme-brochure.mjs
 */

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const ROOT = resolve(process.cwd());
const OUT = resolve(ROOT, "public/downloads/programme-portfolio.pdf");

/* ------------------------------------------------------------- source parse */

const read = (p) => readFileSync(join(ROOT, p), "utf8");

const catalogueSrc = read("src/data/programmes.ts");
const accreditationSrc = read("src/data/accreditation.ts");
const faq = JSON.parse(read("src/data/cpd-faq.json"));

/** Pulls `export const NAME = "…";` (single or multi-line) out of a TS module. */
const constString = (src, name) => {
  const re = new RegExp(`export const ${name}\\s*(?::[^=]+)?=\\s*\\n?\\s*"([\\s\\S]*?)";`);
  const m = src.match(re);
  if (!m) throw new Error(`Could not read ${name} from src/data/accreditation.ts`);
  return m[1].replace(/\\"/g, '"');
};

const CPD_PROVIDER_STATEMENT = constString(accreditationSrc, "CPD_PROVIDER_STATEMENT");
const CPD_PARTICIPANT_STATEMENT = constString(accreditationSrc, "CPD_PARTICIPANT_STATEMENT");
const CPD_CERTIFICATE_SCOPE_NOTE = constString(accreditationSrc, "CPD_CERTIFICATE_SCOPE_NOTE");
const CPD_SCOPE_STATEMENT = constString(accreditationSrc, "CPD_SCOPE_STATEMENT");

/** Parses the programme objects out of the catalogue array. */
const parseProgrammes = () => {
  const start = catalogueSrc.indexOf("export const programmes");
  const body = catalogueSrc.slice(start, catalogueSrc.indexOf("\n];", start));
  const blocks = body.split(/\n  \{\n/).slice(1);

  const field = (block, key) => {
    const m = block.match(new RegExp(`${key}:\\s*\\n?\\s*"([\\s\\S]*?)",?\\n`));
    return m ? m[1].replace(/\\"/g, '"').replace(/\s*\n\s*/g, " ").trim() : undefined;
  };

  return blocks.map((block) => {
    const featuresRaw = block.match(/features:\s*\[([\s\S]*?)\]/);
    const features = featuresRaw
      ? [...featuresRaw[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
      : [];
    return {
      title: field(block, "title"),
      subtitle: field(block, "subtitle"),
      description: field(block, "description"),
      cpdHours: field(block, "cpdHours"),
      individualFee: field(block, "individualFee"),
      paymentPlanDetail: field(block, "paymentPlanDetail"),
      link: field(block, "link"),
      detailPage: field(block, "detailPage"),
      features,
    };
  });
};

const programmes = parseProgrammes().filter((p) => p.title);
if (programmes.length !== 4) {
  console.error(`✖ Expected 4 programmes in the catalogue, parsed ${programmes.length}.`);
  process.exit(1);
}

const programmeHours = programmes
  .map((p) => `${p.title}: ${p.cpdHours ?? "on request"}`)
  .join(". ");

const faqItems = faq.items.map(({ q, a }) => ({
  q,
  a: a.replace("{{PROGRAMME_HOURS}}", programmeHours),
}));

/* ------------------------------------------------------------------ layout */

const PAGE = [595.28, 841.89]; // A4 portrait
const MARGIN = 64;
const WIDTH = PAGE[0] - MARGIN * 2;

const INK = rgb(0.11, 0.12, 0.14);
const MUTED = rgb(0.38, 0.4, 0.43);
const RULE = rgb(0.85, 0.86, 0.88);
const NAVY = rgb(0.09, 0.15, 0.28);

const doc = await PDFDocument.create();
doc.setTitle("Bright Leadership Consulting — Programme Portfolio");
doc.setAuthor("Bright Leadership Consulting");
doc.setSubject("Accredited executive development programmes, CPD hours and fees");
doc.setCreator("Bright Leadership Consulting");

const serif = await doc.embedFont(StandardFonts.TimesRoman);
const serifBold = await doc.embedFont(StandardFonts.TimesRomanBold);
const sans = await doc.embedFont(StandardFonts.Helvetica);
const sansBold = await doc.embedFont(StandardFonts.HelveticaBold);

/** WinAnsi covers en dash, ™, £ and curly quotes; only NBSP needs replacing. */
const ascii = (s) => s.replace(/\u00a0/g, " ");

let page = doc.addPage(PAGE);
let y = PAGE[1] - MARGIN;
let pageNo = 1;

const footer = () => {
  page.drawText(ascii("Bright Leadership Consulting  |  brightleadershipconsulting.com"), {
    x: MARGIN,
    y: 40,
    size: 7.5,
    font: sans,
    color: MUTED,
  });
  const label = `${pageNo}`;
  page.drawText(label, {
    x: PAGE[0] - MARGIN - sans.widthOfTextAtSize(label, 7.5),
    y: 40,
    size: 7.5,
    font: sans,
    color: MUTED,
  });
};

const newPage = () => {
  footer();
  page = doc.addPage(PAGE);
  pageNo += 1;
  y = PAGE[1] - MARGIN;
};

const need = (h) => {
  if (y - h < MARGIN + 30) newPage();
};

const wrap = (text, font, size, maxWidth) => {
  const lines = [];
  for (const para of ascii(text).split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    lines.push(line);
  }
  return lines;
};

const text = (str, { font = sans, size = 9.5, color = INK, lead = 1.5, gap = 0, indent = 0 } = {}) => {
  const lines = wrap(str, font, size, WIDTH - indent);
  for (const line of lines) {
    need(size * lead);
    page.drawText(line, { x: MARGIN + indent, y: y - size, size, font, color });
    y -= size * lead;
  }
  y -= gap;
};

const kicker = (str) => {
  need(24);
  page.drawText(ascii(str.toUpperCase()), {
    x: MARGIN,
    y: y - 8,
    size: 7.5,
    font: sansBold,
    color: MUTED,
  });
  y -= 20;
};

const rule = (gap = 16) => {
  need(gap + 4);
  page.drawLine({
    start: { x: MARGIN, y: y - 4 },
    end: { x: MARGIN + WIDTH, y: y - 4 },
    thickness: 0.75,
    color: RULE,
  });
  y -= gap;
};

/* ------------------------------------------------------------------- cover */

y -= 40;
kicker("Bright Leadership Consulting");
text("Programme Portfolio", { font: serifBold, size: 30, lead: 1.2, gap: 6 });
text("Accredited executive development programmes, CPD hours and fees", {
  font: serif,
  size: 13,
  color: MUTED,
  gap: 20,
});
rule(22);
text(CPD_PROVIDER_STATEMENT, { size: 9.5, gap: 8 });
text(CPD_SCOPE_STATEMENT, { size: 9.5, color: MUTED, gap: 24 });

newPage();

/* -------------------------------------------------------------- programmes */

kicker("The Catalogue");
text("Four Programmes", { font: serifBold, size: 18, lead: 1.3, gap: 14 });

programmes.forEach((p, i) => {
  const before = pageNo;
  need(210);
  // Only separate siblings that share a page; a fresh page needs no rule.
  if (i > 0 && pageNo === before) rule(20);

  text(p.title, { font: serifBold, size: 14, lead: 1.3, gap: 2 });
  if (p.subtitle) text(p.subtitle, { size: 9, color: MUTED, gap: 8 });
  if (p.description) text(p.description, { size: 9.5, lead: 1.55, gap: 10 });

  const facts = [
    p.cpdHours ? `Accredited CPD hours: ${p.cpdHours}` : null,
    p.individualFee ? `Individual enrolment: ${p.individualFee}` : null,
    p.paymentPlanDetail ? p.paymentPlanDetail : null,
    p.detailPage ? `Detail: brightleadershipconsulting.com${p.detailPage}` : null,
  ].filter(Boolean);

  for (const fact of facts) {
    text(fact, { size: 9, font: sansBold, color: NAVY, lead: 1.5 });
  }
  y -= 8;

  for (const feature of p.features) {
    text(`-  ${feature}`, { size: 9, color: MUTED, lead: 1.5, indent: 8 });
  }
  y -= 10;
});

/* --------------------------------------------------------- accreditation */

need(200);
rule(24);
kicker("Accreditation");
text("CPD Hours and Certificates", { font: serifBold, size: 18, lead: 1.3, gap: 14 });
text(CPD_PARTICIPANT_STATEMENT, { size: 9.5, lead: 1.55, gap: 8 });
text(CPD_CERTIFICATE_SCOPE_NOTE, { size: 9.5, lead: 1.55, gap: 20 });
rule(20);

for (const item of faqItems) {
  need(80);
  text(item.q, { font: serifBold, size: 11.5, lead: 1.35, gap: 4 });
  text(item.a, { size: 9.5, lead: 1.55, gap: 16 });
}

rule(20);
text("Enquiries: admin@brightleadershipconsulting.com", { size: 9, font: sansBold });
text(
  "This brochure is generated from the live programme catalogue. Fees are in GBP and stated per participant.",
  { size: 8.5, color: MUTED, gap: 0 },
);

footer();

/* -------------------------------------------------------------------- write */

const bytes = await doc.save();
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, bytes);

console.log(
  `✓ Programme portfolio PDF written to ${relative(ROOT, OUT)} — ${programmes.length} programmes, ${faqItems.length} FAQ entries, ${doc.getPageCount()} page(s).`,
);
