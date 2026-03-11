import { PDFDocument, PDFFont, StandardFonts, rgb, PDFPage, PDFTextField } from 'pdf-lib';

// ── Brand Colors (Charcoal / Teal / Gold palette) ──
const COLORS = {
  charcoal: rgb(0.122, 0.122, 0.122),    // #1F1F1F
  teal: rgb(0.122, 0.361, 0.388),         // #1F5C63
  tealLight: rgb(0.91, 0.95, 0.953),      // #E8F2F3
  gold: rgb(0.788, 0.635, 0.153),         // #C9A227
  white: rgb(1, 1, 1),
  text: rgb(0.122, 0.122, 0.122),
  muted: rgb(0.42, 0.42, 0.42),
  lightBg: rgb(0.98, 0.98, 0.98),
  border: rgb(0.9, 0.9, 0.9),
};

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

// ── Text Sanitisation ──
function sanitize(text: string): string {
  return text
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/[\u2022\u2023\u2043]/g, '*')
    .replace(/\u00A0/g, ' ')
    .replace(/\u2122/g, '(TM)')
    .replace(/[^\x00-\x7F]/g, (char) => {
      const allowed = 'àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ';
      return allowed.includes(char) ? char : '';
    });
}

// ── Text Wrapping ──
function wrapText(text: string, maxWidth: number, font: PDFFont, fontSize: number): string[] {
  const sanitized = sanitize(text);
  const words = sanitized.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, fontSize) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// ── Fonts Interface ──
interface Fonts {
  regular: PDFFont;
  bold: PDFFont;
  italic: PDFFont;
}

// ── Field Counter ──
let fieldCounter = 0;
function fieldName(prefix: string): string {
  return `${prefix}_${fieldCounter++}`;
}

// ── Draw a fillable text field ──
function addTextField(
  page: PDFPage,
  form: ReturnType<PDFDocument['getForm']>,
  name: string,
  x: number,
  y: number,
  width: number,
  height: number,
  multiline = false
): PDFTextField {
  const tf = form.createTextField(name);
  tf.addToPage(page, {
    x,
    y: y - height,
    width,
    height,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: rgb(1, 1, 1),
  });
  if (multiline) tf.enableMultiline();
  return tf;
}

// ── Draw section header bar ──
function drawSectionHeader(
  page: PDFPage,
  sectionNum: string,
  title: string,
  y: number,
  fonts: Fonts
): number {
  // Teal background bar
  page.drawRectangle({
    x: MARGIN,
    y: y - 32,
    width: CONTENT_WIDTH,
    height: 37,
    color: COLORS.teal,
  });

  // Section number + title
  const label = `SECTION ${sectionNum}: ${sanitize(title)}`;
  page.drawText(label, {
    x: MARGIN + 15,
    y: y - 24,
    size: 12,
    font: fonts.bold,
    color: COLORS.white,
  });

  return y - 55;
}

// ── Draw gold accent rule ──
function drawAccentRule(page: PDFPage, y: number): number {
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: MARGIN + 60, y },
    thickness: 3,
    color: COLORS.gold,
  });
  return y - 20;
}

// ── Draw instruction box ──
function drawInstructionBox(
  page: PDFPage,
  text: string,
  y: number,
  fonts: Fonts
): number {
  const lines = wrapText(text, CONTENT_WIDTH - 40, fonts.regular, 10);
  const boxH = lines.length * 14 + 20;

  page.drawRectangle({
    x: MARGIN,
    y: y - boxH,
    width: CONTENT_WIDTH,
    height: boxH,
    color: COLORS.tealLight,
  });
  // Left accent bar
  page.drawRectangle({
    x: MARGIN,
    y: y - boxH,
    width: 3,
    height: boxH,
    color: COLORS.teal,
  });

  let ty = y - 14;
  for (const line of lines) {
    page.drawText(line, { x: MARGIN + 15, y: ty, size: 10, font: fonts.regular, color: COLORS.text });
    ty -= 14;
  }

  return y - boxH - 15;
}

// ── Draw labeled text field group ──
function drawFieldGroup(
  page: PDFPage,
  form: ReturnType<PDFDocument['getForm']>,
  label: string,
  y: number,
  fonts: Fonts,
  height = 70,
  prefix = 'field'
): number {
  page.drawText(sanitize(label), {
    x: MARGIN,
    y,
    size: 9,
    font: fonts.bold,
    color: COLORS.muted,
  });
  y -= 12;
  addTextField(page, form, fieldName(prefix), MARGIN, y, CONTENT_WIDTH, height, true);
  return y - height - 12;
}

// ── Draw table with fillable cells ──
function drawTable(
  page: PDFPage,
  form: ReturnType<PDFDocument['getForm']>,
  headers: string[],
  rows: Array<{ label?: string; cols: number }>,
  y: number,
  fonts: Fonts,
  prefix: string
): number {
  const colCount = headers.length;
  const colWidth = CONTENT_WIDTH / colCount;
  const headerH = 24;
  const cellH = 45;

  // Header row
  page.drawRectangle({
    x: MARGIN,
    y: y - headerH,
    width: CONTENT_WIDTH,
    height: headerH,
    color: COLORS.tealLight,
  });
  page.drawLine({
    start: { x: MARGIN, y: y - headerH },
    end: { x: MARGIN + CONTENT_WIDTH, y: y - headerH },
    thickness: 2,
    color: COLORS.teal,
  });

  for (let i = 0; i < colCount; i++) {
    page.drawText(sanitize(headers[i]), {
      x: MARGIN + i * colWidth + 8,
      y: y - 16,
      size: 8,
      font: fonts.bold,
      color: COLORS.teal,
    });
  }

  y -= headerH;

  // Data rows
  for (const row of rows) {
    const startCol = row.label ? 1 : 0;

    if (row.label) {
      page.drawText(sanitize(row.label), {
        x: MARGIN + 8,
        y: y - 18,
        size: 9,
        font: fonts.bold,
        color: COLORS.text,
      });
    }

    for (let c = startCol; c < colCount; c++) {
      addTextField(
        page, form, fieldName(prefix),
        MARGIN + c * colWidth + 4,
        y,
        colWidth - 8,
        cellH - 4,
        true
      );
    }

    // Row divider
    page.drawLine({
      start: { x: MARGIN, y: y - cellH },
      end: { x: MARGIN + CONTENT_WIDTH, y: y - cellH },
      thickness: 0.5,
      color: COLORS.border,
    });

    y -= cellH;
  }

  return y - 10;
}

// ══════════════════════════════════════════════
//  MAIN GENERATOR
// ══════════════════════════════════════════════
export async function generateStrategicLeadershipPDF(): Promise<Uint8Array> {
  fieldCounter = 0;
  const pdf = await PDFDocument.create();
  const form = pdf.getForm();

  const fonts: Fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    italic: await pdf.embedFont(StandardFonts.HelveticaOblique),
  };

  // ════════════ COVER PAGE ════════════
  const cover = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  cover.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: COLORS.charcoal });

  // Badge
  const badge = 'EXECUTIVE PROGRAM WORKBOOK';
  const badgeW = fonts.regular.widthOfTextAtSize(badge, 9) + 40;
  cover.drawRectangle({
    x: (PAGE_WIDTH - badgeW) / 2,
    y: PAGE_HEIGHT - 150,
    width: badgeW, height: 26,
    borderColor: COLORS.gold, borderWidth: 1,
    color: COLORS.gold, opacity: 0.15,
  });
  cover.drawText(badge, {
    x: (PAGE_WIDTH - fonts.regular.widthOfTextAtSize(badge, 9)) / 2,
    y: PAGE_HEIGHT - 142,
    size: 9, font: fonts.regular, color: COLORS.gold,
  });

  // Title
  const titleLines = wrapText('Strategic Leadership in the Age of AI', CONTENT_WIDTH - 40, fonts.bold, 30);
  let cy = PAGE_HEIGHT - 220;
  for (const line of titleLines) {
    const w = fonts.bold.widthOfTextAtSize(line, 30);
    cover.drawText(line, { x: (PAGE_WIDTH - w) / 2, y: cy, size: 30, font: fonts.bold, color: COLORS.white });
    cy -= 38;
  }

  // Subtitle
  const sub = 'Executive Leadership Program';
  cover.drawText(sub, {
    x: (PAGE_WIDTH - fonts.regular.widthOfTextAtSize(sub, 14)) / 2,
    y: cy - 10, size: 14, font: fonts.regular, color: rgb(0.7, 0.7, 0.7),
  });

  // Framework label
  const fw = 'AUGMENTED LEADERSHIP(TM) FRAMEWORK';
  cover.drawText(fw, {
    x: (PAGE_WIDTH - fonts.regular.widthOfTextAtSize(fw, 10)) / 2,
    y: cy - 45, size: 10, font: fonts.regular, color: COLORS.gold,
  });

  // Divider
  cover.drawLine({
    start: { x: PAGE_WIDTH / 2 - 40, y: cy - 75 },
    end: { x: PAGE_WIDTH / 2 + 40, y: cy - 75 },
    thickness: 2, color: COLORS.gold,
  });

  // Tagline
  const tag1 = 'AI will transform organisations.';
  const tag2 = 'Augmented leaders will determine which ones succeed.';
  cover.drawText(tag1, {
    x: (PAGE_WIDTH - fonts.italic.widthOfTextAtSize(tag1, 11)) / 2,
    y: cy - 100, size: 11, font: fonts.italic, color: rgb(0.55, 0.55, 0.55),
  });
  cover.drawText(tag2, {
    x: (PAGE_WIDTH - fonts.italic.widthOfTextAtSize(tag2, 11)) / 2,
    y: cy - 116, size: 11, font: fonts.italic, color: rgb(0.55, 0.55, 0.55),
  });

  // Footer
  const cfooter = '(c) Bright Leadership Consulting  -  CPD Accredited Programme  -  Confidential';
  cover.drawText(cfooter, {
    x: (PAGE_WIDTH - fonts.regular.widthOfTextAtSize(cfooter, 7)) / 2,
    y: 40, size: 7, font: fonts.regular, color: rgb(0.4, 0.4, 0.4),
  });

  // ════════════ INTRODUCTION PAGE ════════════
  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  page.drawText('How to Use This Workbook', { x: MARGIN, y, size: 22, font: fonts.bold, color: COLORS.teal });
  y = drawAccentRule(page, y - 10);
  y -= 10;

  const introText = 'This workbook accompanies the programme Strategic Leadership in the Age of AI. It is designed to help you translate course insights into practical leadership actions and strategy development within your organisation.';
  const introLines = wrapText(introText, CONTENT_WIDTH, fonts.regular, 10);
  for (const line of introLines) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 15;
  }
  y -= 10;

  const steps = [
    { title: 'Read & Reflect', desc: "Engage with each section's context before completing the exercises." },
    { title: 'Complete Exercises', desc: 'Use the fillable fields to capture your thinking in real time.' },
    { title: 'Build Your Blueprint', desc: 'Each section feeds into your final AI Leadership Blueprint Canvas.' },
    { title: 'Take Action', desc: 'Translate insights into a concrete Leadership Action Plan.' },
  ];

  for (let i = 0; i < steps.length; i++) {
    page.drawRectangle({
      x: MARGIN, y: y - 48, width: CONTENT_WIDTH, height: 52,
      color: COLORS.lightBg, borderColor: COLORS.border, borderWidth: 1,
    });
    page.drawRectangle({ x: MARGIN, y: y - 48, width: 4, height: 52, color: COLORS.teal });

    page.drawText(`${i + 1}`, { x: MARGIN + 14, y: y - 16, size: 18, font: fonts.bold, color: COLORS.teal });
    page.drawText(steps[i].title, { x: MARGIN + 38, y: y - 16, size: 11, font: fonts.bold, color: COLORS.text });
    page.drawText(steps[i].desc, { x: MARGIN + 38, y: y - 36, size: 9, font: fonts.regular, color: COLORS.muted });
    y -= 60;
  }

  y -= 10;
  y = drawInstructionBox(page, 'By the end of the programme, you will complete an AI Leadership Blueprint - a strategic action document you can present to your board or executive team.', y, fonts);

  // ════════════ SECTION 1: Leadership in the Age of AI ════════════
  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;
  y = drawSectionHeader(page, '1', 'Leadership in the Age of AI', y, fonts);

  const s1Intro = 'Artificial intelligence is transforming industries, organisations, and leadership responsibilities. Before exploring specific frameworks, reflect on where you and your organisation stand today.';
  const s1Lines = wrapText(s1Intro, CONTENT_WIDTH, fonts.regular, 10);
  for (const line of s1Lines) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 15;
  }
  y -= 10;

  page.drawText('REFLECTION EXERCISE', { x: MARGIN, y, size: 11, font: fonts.bold, color: COLORS.teal });
  y -= 20;

  const s1Qs = [
    'How is AI currently used within your organisation?',
    'Which decisions in your organisation rely heavily on data?',
    'Which leadership responsibilities cannot be automated?',
    'How might AI change leadership roles in the next five years?',
  ];
  for (let i = 0; i < s1Qs.length; i++) {
    page.drawText(`${i + 1}. ${s1Qs[i]}`, { x: MARGIN + 5, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 16;
  }

  y -= 5;
  y = drawFieldGroup(page, form, 'YOUR REFLECTIONS', y, fonts, 120, 's1_reflect');

  // ════════════ SECTION 2: AI Opportunity Mapping ════════════
  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;
  y = drawSectionHeader(page, '2', 'AI Opportunity Mapping', y, fonts);

  const s2Intro = 'AI creates opportunities to improve efficiency, decision-making, and innovation. Identify potential AI opportunities across your organisation\'s key business areas.';
  for (const line of wrapText(s2Intro, CONTENT_WIDTH, fonts.regular, 10)) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 15;
  }
  y -= 10;

  y = drawTable(page, form,
    ['BUSINESS AREA', 'CURRENT CHALLENGE', 'AI OPPORTUNITY', 'POTENTIAL VALUE'],
    [
      { label: 'Customer Service', cols: 4 },
      { label: 'Supply Chain', cols: 4 },
      { label: 'HR & Talent', cols: 4 },
      { label: 'Finance', cols: 4 },
      { label: 'Operations', cols: 4 },
    ],
    y, fonts, 's2_opp'
  );

  // ════════════ SECTION 3: AI Strategy Canvas ════════════
  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;
  y = drawSectionHeader(page, '3', 'AI Strategy Canvas', y, fonts);

  const s3Intro = 'Use this canvas to align AI initiatives with your organisation\'s strategic objectives. Each row represents a strategic priority and the AI initiative that supports it.';
  for (const line of wrapText(s3Intro, CONTENT_WIDTH, fonts.regular, 10)) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 15;
  }
  y -= 10;

  y = drawTable(page, form,
    ['STRATEGIC OBJECTIVE', 'AI INITIATIVE', 'EXPECTED IMPACT', 'TIMELINE'],
    [
      { label: 'Improve Customer Experience', cols: 4 },
      { label: 'Reduce Operational Costs', cols: 4 },
      { label: 'Increase Decision Speed', cols: 4 },
      { label: 'Strengthen Governance', cols: 4 },
    ],
    y, fonts, 's3_canvas'
  );

  // ════════════ SECTION 4: AI Leadership Maturity Assessment ════════════
  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;
  y = drawSectionHeader(page, '4', 'AI Leadership Maturity Assessment', y, fonts);

  const s4Intro = 'Organisations typically progress through five stages of AI maturity. Understanding where your organisation sits today is the first step toward a deliberate transformation strategy.';
  for (const line of wrapText(s4Intro, CONTENT_WIDTH, fonts.regular, 10)) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 15;
  }
  y -= 10;

  const maturityLevels = [
    { level: '1', name: 'Awareness', desc: 'AI is recognised but rarely used in practice.' },
    { level: '2', name: 'Experimentation', desc: 'Pilot projects and early experimentation underway.' },
    { level: '3', name: 'Operational Adoption', desc: 'AI integrated into operational processes.' },
    { level: '4', name: 'Strategic Integration', desc: 'AI supports strategic decision-making at executive level.' },
    { level: '5', name: 'Intelligent Enterprise', desc: 'AI embedded across the entire organisation.' },
  ];

  for (const ml of maturityLevels) {
    page.drawRectangle({
      x: MARGIN, y: y - 28, width: CONTENT_WIDTH, height: 30,
      color: COLORS.lightBg, borderColor: COLORS.border, borderWidth: 0.5,
    });
    page.drawText(ml.level, { x: MARGIN + 12, y: y - 20, size: 16, font: fonts.bold, color: COLORS.teal });
    page.drawText(ml.name, { x: MARGIN + 38, y: y - 14, size: 10, font: fonts.bold, color: COLORS.text });
    page.drawText(ml.desc, { x: MARGIN + 38, y: y - 26, size: 8, font: fonts.regular, color: COLORS.muted });
    y -= 34;
  }

  y -= 10;
  page.drawText('EXERCISE', { x: MARGIN, y, size: 11, font: fonts.bold, color: COLORS.teal });
  y -= 18;

  y = drawFieldGroup(page, form, 'WHICH STAGE BEST DESCRIBES YOUR ORGANISATION?', y, fonts, 22, 's4_stage');
  y = drawFieldGroup(page, form, 'WHY? WHAT EVIDENCE SUPPORTS YOUR ASSESSMENT?', y, fonts, 60, 's4_evidence');
  y = drawFieldGroup(page, form, 'WHAT WOULD NEED TO CHANGE TO REACH THE NEXT LEVEL?', y, fonts, 60, 's4_next');

  // ════════════ SECTION 5: AI-Augmented Decision Making ════════════
  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;
  y = drawSectionHeader(page, '5', 'AI-Augmented Decision Making', y, fonts);

  const s5Intro = 'AI can support decision-making by providing insights, forecasts, and analysis. However, leaders must combine:';
  for (const line of wrapText(s5Intro, CONTENT_WIDTH, fonts.regular, 10)) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 15;
  }
  y -= 5;
  y = drawInstructionBox(page, 'Data  +  AI Insights  +  Human Judgement', y, fonts);
  y -= 5;

  page.drawText('REFLECTION QUESTIONS', { x: MARGIN, y, size: 11, font: fonts.bold, color: COLORS.teal });
  y -= 18;

  y = drawFieldGroup(page, form, '1. WHICH DECISIONS COULD BENEFIT FROM AI INSIGHTS?', y, fonts, 55, 's5_q1');
  y = drawFieldGroup(page, form, '2. WHERE SHOULD HUMAN JUDGEMENT REMAIN CENTRAL?', y, fonts, 55, 's5_q2');
  y = drawFieldGroup(page, form, '3. HOW CAN LEADERS PREVENT OVER-RELIANCE ON AI?', y, fonts, 55, 's5_q3');

  // Decision Classification Matrix
  if (y > 200) {
    page.drawText('DECISION CLASSIFICATION MATRIX', { x: MARGIN, y, size: 11, font: fonts.bold, color: COLORS.teal });
    y -= 18;

    const quadrants = ['AI-Led Decisions', 'AI-Augmented Decisions', 'Human-Led Decisions', 'Collaborative Decisions'];
    const halfW = (CONTENT_WIDTH - 10) / 2;
    for (let i = 0; i < 4; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const qx = MARGIN + col * (halfW + 10);
      const qy = y - row * 75;

      page.drawRectangle({
        x: qx, y: qy - 65, width: halfW, height: 68,
        borderColor: COLORS.border, borderWidth: 1,
      });
      page.drawText(quadrants[i], {
        x: qx + 8, y: qy - 14, size: 8, font: fonts.bold, color: COLORS.teal,
      });
      addTextField(page, form, fieldName('s5_matrix'), qx + 4, qy - 18, halfW - 8, 42, true);
    }
    y -= 160;
  }

  // ════════════ SECTION 6: Executive AI Prompt Library ════════════
  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;
  y = drawSectionHeader(page, '6', 'Executive AI Prompt Library', y, fonts);

  const s6Intro = 'Generative AI tools can assist leaders in exploring strategic questions. The quality of AI output is directly proportional to the quality of the prompt.';
  for (const line of wrapText(s6Intro, CONTENT_WIDTH, fonts.regular, 10)) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 15;
  }
  y -= 10;

  const prompts = [
    { cat: 'MARKET ANALYSIS', text: '"Analyse emerging opportunities in the renewable energy sector and identify three strategic implications for a mid-cap industrial company."' },
    { cat: 'RISK ANALYSIS', text: '"Identify the top five strategic risks facing the global banking industry over the next 24 months, with probability and impact assessment."' },
    { cat: 'INNOVATION', text: '"Suggest three AI-enabled service innovations for healthcare providers that could be piloted within six months."' },
  ];

  for (const p of prompts) {
    page.drawRectangle({
      x: MARGIN, y: y - 48, width: CONTENT_WIDTH, height: 50,
      color: COLORS.lightBg, borderColor: COLORS.border, borderWidth: 1,
    });
    page.drawText(p.cat, { x: MARGIN + 10, y: y - 14, size: 8, font: fonts.bold, color: COLORS.teal });
    const pLines = wrapText(p.text, CONTENT_WIDTH - 20, fonts.italic, 9);
    let py = y - 28;
    for (const pl of pLines) {
      page.drawText(pl, { x: MARGIN + 10, y: py, size: 9, font: fonts.italic, color: COLORS.text });
      py -= 12;
    }
    y -= 56;
  }

  y -= 5;
  page.drawText('EXERCISE: Write three prompts relevant to your organisation', {
    x: MARGIN, y, size: 10, font: fonts.bold, color: COLORS.teal,
  });
  y -= 18;

  for (let i = 1; i <= 3; i++) {
    y = drawFieldGroup(page, form, `PROMPT ${i}`, y, fonts, 45, 's6_prompt');
  }

  // ════════════ SECTION 7: Cross-Functional AI Leadership ════════════
  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;
  y = drawSectionHeader(page, '7', 'Cross-Functional AI Leadership', y, fonts);

  const s7Intro = 'AI initiatives require collaboration across functions. Successful AI transformation is never a technology project alone - it is a leadership coordination challenge.';
  for (const line of wrapText(s7Intro, CONTENT_WIDTH, fonts.regular, 10)) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 15;
  }
  y -= 5;
  y = drawInstructionBox(page, 'AI initiatives require alignment between: Technology Teams, Business Units, Operations, Compliance, and Senior Leadership.', y, fonts);

  page.drawText('STAKEHOLDER MAPPING EXERCISE', { x: MARGIN, y, size: 11, font: fonts.bold, color: COLORS.teal });
  y -= 18;

  const stakeholders = ['Chief Technology Officer', 'Head of Operations', 'Chief People Officer', 'Compliance Lead'];
  const halfW = (CONTENT_WIDTH - 10) / 2;
  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const sx = MARGIN + col * (halfW + 10);
    const sy = y - row * 95;

    page.drawRectangle({
      x: sx, y: sy - 85, width: halfW, height: 88,
      borderColor: COLORS.border, borderWidth: 1,
    });
    page.drawText('ROLE / FUNCTION', { x: sx + 8, y: sy - 12, size: 7, font: fonts.bold, color: COLORS.muted });
    addTextField(page, form, fieldName('s7_role'), sx + 4, sy - 16, halfW - 8, 18);
    page.drawText('RESPONSIBILITY IN AI INITIATIVE', { x: sx + 8, y: sy - 42, size: 7, font: fonts.bold, color: COLORS.muted });
    addTextField(page, form, fieldName('s7_resp'), sx + 4, sy - 48, halfW - 8, 32, true);
  }
  y -= 200;

  // ════════════ SECTION 7B: Leadership Speech Exercise ════════════
  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;

  page.drawRectangle({ x: MARGIN, y: y - 2, width: CONTENT_WIDTH, height: 4, color: COLORS.teal });
  y -= 16;
  page.drawText('LEADERSHIP SPEECH EXERCISE', { x: MARGIN, y, size: 13, font: fonts.bold, color: COLORS.teal });
  y -= 16;
  page.drawText('Communicating AI Transformation', { x: MARGIN, y, size: 10, font: fonts.italic, color: COLORS.muted });
  y -= 25;

  const speechIntro = 'Your organisation has decided to adopt AI technologies. As a senior leader, you must address employees and explain the AI strategy. Prepare a short leadership speech (2\u20133 minutes) covering the questions below.';
  for (const line of wrapText(speechIntro, CONTENT_WIDTH, fonts.regular, 10)) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 15;
  }
  y -= 5;

  const speechParts = [
    { label: 'PART 1 \u2014 WHY AI MATTERS', prompt: 'Why is AI important for your industry and organisation? How will it help remain competitive?' },
    { label: 'PART 2 \u2014 IMPACT ON EMPLOYEES', prompt: 'How will AI change the way people work? What new opportunities will it create? How will you support employees?' },
    { label: 'PART 3 \u2014 ORGANISATIONAL VISION', prompt: 'What future does the organisation want to create? What values will guide AI adoption?' },
  ];

  for (const sp of speechParts) {
    page.drawText(sp.label, { x: MARGIN, y, size: 9, font: fonts.bold, color: COLORS.teal });
    y -= 14;
    const spLines = wrapText(sp.prompt, CONTENT_WIDTH - 10, fonts.italic, 8);
    for (const sl of spLines) {
      page.drawText(sl, { x: MARGIN + 5, y, size: 8, font: fonts.italic, color: COLORS.muted });
      y -= 11;
    }
    y -= 2;
    y = drawFieldGroup(page, form, 'KEY POINTS', y, fonts, 55, 's7b_speech');
  }

  page.drawText('SPEECH DRAFT', { x: MARGIN, y, size: 11, font: fonts.bold, color: COLORS.teal });
  y -= 14;
  y = drawInstructionBox(page, 'Opening: Why AI matters. Middle: Opportunities & concerns. Conclusion: Vision & commitment.', y, fonts);
  y = drawFieldGroup(page, form, 'YOUR SPEECH', y, fonts, 120, 's7b_draft');

  // ════════════ SECTION 7C: Growth Opportunity Mapping ════════════
  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;

  page.drawRectangle({ x: MARGIN, y: y - 2, width: CONTENT_WIDTH, height: 4, color: COLORS.gold });
  y -= 16;
  page.drawText('GROWTH OPPORTUNITY MAPPING', { x: MARGIN, y, size: 13, font: fonts.bold, color: COLORS.teal });
  y -= 16;
  page.drawText('Translating AI Capabilities into Business Growth', { x: MARGIN, y, size: 10, font: fonts.italic, color: COLORS.muted });
  y -= 25;

  const growthIntro = 'AI Opportunity Mapping identifies what AI can do inside the organisation. Growth Opportunity Mapping translates those capabilities into new revenue, markets, and competitive advantage. For each AI capability, ask: Could this become an external product, service, or competitive advantage?';
  for (const line of wrapText(growthIntro, CONTENT_WIDTH, fonts.regular, 10)) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 15;
  }
  y -= 5;

  y = drawTable(page, form,
    ['GROWTH AREA', 'OPPORTUNITY', 'AI ENABLER', 'REVENUE / STRATEGIC IMPACT'],
    [
      { label: 'New Products', cols: 4 },
      { label: 'Market Expansion', cols: 4 },
      { label: 'Customer Innovation', cols: 4 },
      { label: 'New Revenue Streams', cols: 4 },
      { label: 'Partnerships', cols: 4 },
    ],
    y, fonts, 's7c_growth'
  );

  y -= 5;
  page.drawText('GROWTH STRATEGY SUMMARY', { x: MARGIN, y, size: 11, font: fonts.bold, color: COLORS.teal });
  y -= 18;
  y = drawFieldGroup(page, form, 'TOP GROWTH OPPORTUNITY & LEADERSHIP ACTION REQUIRED', y, fonts, 70, 's7c_summary');
  y = drawFieldGroup(page, form, 'WHAT NEW CAPABILITIES ARE NEEDED TO PURSUE THIS OPPORTUNITY?', y, fonts, 70, 's7c_capabilities');

  // ════════════ SECTION 8: AI Transformation Taskforce ════════════
  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;
  y = drawSectionHeader(page, '8', 'AI Transformation Taskforce', y, fonts);

  const s8Intro = 'Many organisations create a dedicated AI leadership group to coordinate transformation. Design the composition and mandate of your organisation\'s AI taskforce.';
  for (const line of wrapText(s8Intro, CONTENT_WIDTH, fonts.regular, 10)) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 15;
  }
  y -= 10;

  y = drawTable(page, form,
    ['ROLE', 'SUGGESTED OWNER', 'KEY MANDATE'],
    [
      { label: 'Executive Sponsor', cols: 3 },
      { label: 'AI Strategy Lead', cols: 3 },
      { label: 'Technology Lead', cols: 3 },
      { label: 'Operations Lead', cols: 3 },
      { label: 'Risk & Compliance Lead', cols: 3 },
      { label: 'HR / Talent Lead', cols: 3 },
    ],
    y, fonts, 's8_task'
  );

  // ════════════ SECTION 9: Responsible AI Governance ════════════
  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;
  y = drawSectionHeader(page, '9', 'Responsible AI Governance', y, fonts);

  const s9Intro = 'Responsible AI leadership requires strong governance. Without clear principles, AI initiatives risk eroding trust, creating compliance exposure, and producing unintended consequences.';
  for (const line of wrapText(s9Intro, CONTENT_WIDTH, fonts.regular, 10)) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 15;
  }
  y -= 10;

  page.drawText('GOVERNANCE PILLARS', { x: MARGIN, y, size: 11, font: fonts.bold, color: COLORS.teal });
  y -= 18;

  const pillars = [
    { title: 'Transparency', q: 'How will AI decisions be explained?' },
    { title: 'Fairness & Bias', q: 'How will you prevent algorithmic bias?' },
    { title: 'Accountability', q: 'Who is responsible when AI makes an error?' },
    { title: 'Data Privacy', q: 'How will sensitive data be protected?' },
  ];

  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const px = MARGIN + col * (halfW + 10);
    const py = y - row * 95;

    page.drawRectangle({
      x: px, y: py - 85, width: halfW, height: 88,
      color: COLORS.lightBg,
    });
    page.drawRectangle({
      x: px, y: py, width: halfW, height: 3,
      color: COLORS.teal,
    });
    page.drawText(pillars[i].title, { x: px + 10, y: py - 16, size: 9, font: fonts.bold, color: COLORS.teal });
    page.drawText(pillars[i].q, { x: px + 10, y: py - 30, size: 8, font: fonts.italic, color: COLORS.muted });
    addTextField(page, form, fieldName('s9_gov'), px + 6, py - 38, halfW - 12, 40, true);
  }

  y -= 200;
  y = drawFieldGroup(page, form, 'LIST THE GOVERNANCE PRINCIPLES YOUR ORGANISATION SHOULD ADOPT', y, fonts, 100, 's9_principles');

  // ════════════ SECTION 10: AI Leadership Blueprint Canvas ════════════
  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;
  y = drawSectionHeader(page, '10', 'AI Leadership Blueprint Canvas', y, fonts);

  const s10Intro = 'This is the centrepiece of your workbook. Synthesise everything you have learned into a single strategic document that can be presented to your board or executive team.';
  for (const line of wrapText(s10Intro, CONTENT_WIDTH, fonts.regular, 10)) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 15;
  }
  y -= 5;
  y = drawInstructionBox(page, 'This canvas draws from every previous section. Take time to consolidate your insights into clear, actionable statements.', y, fonts);

  y = drawTable(page, form,
    ['AREA', 'KEY INSIGHTS & STRATEGIC DIRECTION'],
    [
      { label: 'Organisational Context', cols: 2 },
      { label: 'AI Opportunities', cols: 2 },
      { label: 'Leadership Capabilities Required', cols: 2 },
      { label: 'Governance Considerations', cols: 2 },
      { label: 'Transformation Roadmap', cols: 2 },
    ],
    y, fonts, 's10_blueprint'
  );

// ════════════ SECTION 11: Capstone Project Guide ════════════
  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;
  y = drawSectionHeader(page, '11', 'Capstone Project Guide', y, fonts);

  const s11Intro = 'The capstone project allows you to apply the concepts, frameworks, and tools from this programme to your own organisation. Your task is to develop an AI Leadership Blueprint — a strategic plan outlining how artificial intelligence can be implemented responsibly and effectively within your organisation.';
  for (const line of wrapText(s11Intro, CONTENT_WIDTH, fonts.regular, 10)) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 15;
  }
  y -= 5;

  // Two-stage process boxes
  page.drawText('CAPSTONE PROCESS', { x: MARGIN, y, size: 11, font: fonts.bold, color: COLORS.teal });
  y -= 18;

  // Stage 1 box
  page.drawRectangle({
    x: MARGIN, y: y - 55, width: CONTENT_WIDTH, height: 58,
    color: COLORS.lightBg, borderColor: COLORS.teal, borderWidth: 2,
  });
  page.drawText('STAGE 1', { x: MARGIN + 12, y: y - 18, size: 8, font: fonts.bold, color: COLORS.teal });
  page.drawText('Blueprint Canvas', { x: MARGIN + 12, y: y - 32, size: 12, font: fonts.bold, color: COLORS.text });
  const stage1Desc = 'Use the AI Leadership Blueprint Canvas (Section 10) to map out the key elements of your strategy at a high level. This step helps you organise your thinking before developing the full blueprint.';
  let ty = y - 48;
  for (const line of wrapText(stage1Desc, CONTENT_WIDTH - 20, fonts.regular, 8)) {
    page.drawText(line, { x: MARGIN + 12, y: ty, size: 8, font: fonts.regular, color: COLORS.muted });
    ty -= 11;
  }
  y -= 70;

  // Stage 2 box
  page.drawRectangle({
    x: MARGIN, y: y - 55, width: CONTENT_WIDTH, height: 58,
    color: COLORS.lightBg, borderColor: COLORS.gold, borderWidth: 2,
  });
  page.drawText('STAGE 2', { x: MARGIN + 12, y: y - 18, size: 8, font: fonts.bold, color: COLORS.gold });
  page.drawText('Blueprint Template', { x: MARGIN + 12, y: y - 32, size: 12, font: fonts.bold, color: COLORS.text });
  const stage2Desc = 'Use the AI Leadership Blueprint Template to develop a detailed strategic plan. This document becomes your final capstone submission.';
  ty = y - 48;
  for (const line of wrapText(stage2Desc, CONTENT_WIDTH - 20, fonts.regular, 8)) {
    page.drawText(line, { x: MARGIN + 12, y: ty, size: 8, font: fonts.regular, color: COLORS.muted });
    ty -= 11;
  }
  y -= 75;

  y = drawInstructionBox(page, 'Your blueprint should integrate: AI opportunities, leadership capabilities, governance considerations, and a transformation roadmap. The final document should be approximately 3-5 pages.', y, fonts);
  y -= 5;

  page.drawText('STEP-BY-STEP GUIDE', { x: MARGIN, y, size: 11, font: fonts.bold, color: COLORS.teal });
  y -= 18;

  const capstoneSteps = [
    { title: 'Organisational Context', desc: 'Describe your organisation, industry, and strategic priorities' },
    { title: 'AI Opportunities', desc: 'Identify areas where AI could create value' },
    { title: 'Leadership Capabilities', desc: 'Assess which capabilities require development' },
    { title: 'Governance Framework', desc: 'Define oversight and ethical guidelines' },
    { title: 'Transformation Roadmap', desc: 'Outline phases of AI implementation' },
    { title: 'Leadership Action Plan', desc: 'Specify first steps to begin implementation' },
  ];

  for (let i = 0; i < steps.length; i++) {
    const stepParts = steps[i].split(' — ');
    page.drawRectangle({
      x: MARGIN, y: y - 22, width: CONTENT_WIDTH, height: 25,
      color: COLORS.lightBg, borderColor: COLORS.border, borderWidth: 0.5,
    });
    page.drawText(`${i + 1}`, { x: MARGIN + 10, y: y - 10, size: 12, font: fonts.bold, color: COLORS.teal });
    page.drawText(stepParts[0], { x: MARGIN + 28, y: y - 10, size: 9, font: fonts.bold, color: COLORS.text });
    page.drawText(stepParts[1], { x: MARGIN + 28, y: y - 20, size: 8, font: fonts.regular, color: COLORS.muted });
    y -= 28;
  }

  y -= 5;
  y = drawFieldGroup(page, form, 'MY COMMITMENT: I will complete my AI Leadership Blueprint by', y, fonts, 22, 's11_commit');

  // ════════════ SECTION 12: AI Transformation Roadmap ════════════
  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;
  y = drawSectionHeader(page, '12', 'AI Transformation Roadmap', y, fonts);

  const s12Intro = 'Define the phases of your organisation\'s AI transformation. Each phase builds on the previous, creating a structured pathway from awareness to enterprise-wide integration.';
  for (const line of wrapText(s12Intro, CONTENT_WIDTH, fonts.regular, 10)) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 15;
  }
  y -= 10;

  const phases = [
    { num: '1', title: 'Discover', desc: 'Identify opportunities and evaluate feasibility.' },
    { num: '2', title: 'Design', desc: 'Develop strategy and define use cases.' },
    { num: '3', title: 'Deploy', desc: 'Launch pilot initiatives and validate assumptions.' },
    { num: '4', title: 'Develop', desc: 'Build organisational capability and refine processes.' },
    { num: '5', title: 'Scale', desc: 'Integrate AI across the enterprise.' },
  ];

  for (const phase of phases) {
    page.drawRectangle({
      x: MARGIN, y: y - 80, width: CONTENT_WIDTH, height: 83,
      color: COLORS.lightBg,
    });
    page.drawRectangle({
      x: MARGIN, y: y - 80, width: 3, height: 83,
      color: COLORS.teal,
    });

    page.drawText(`PHASE ${phase.num}`, { x: MARGIN + 12, y: y - 14, size: 8, font: fonts.bold, color: COLORS.teal });
    page.drawText(phase.title, { x: MARGIN + 12, y: y - 28, size: 12, font: fonts.bold, color: COLORS.text });
    page.drawText(phase.desc, { x: MARGIN + 12, y: y - 42, size: 8, font: fonts.regular, color: COLORS.muted });
    addTextField(page, form, fieldName('s12_phase'), MARGIN + 10, y - 48, CONTENT_WIDTH - 20, 28, true);
    y -= 90;
  }

  // ════════════ SECTION 13: Leadership Action Plan ════════════
  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;
  y = drawSectionHeader(page, '13', 'Leadership Action Plan', y, fonts);

  const s13Intro = 'Define concrete leadership actions you will take following this programme. Be specific about ownership, timelines, and expected outcomes.';
  for (const line of wrapText(s13Intro, CONTENT_WIDTH, fonts.regular, 10)) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 15;
  }
  y -= 10;

  y = drawTable(page, form,
    ['ACTION', 'OWNER', 'TIMELINE', 'EXPECTED OUTCOME'],
    [
      { cols: 4 },
      { cols: 4 },
      { cols: 4 },
      { cols: 4 },
      { cols: 4 },
    ],
    y, fonts, 's13_action'
  );

  // ════════════ SECTION 14: Final Reflection ════════════
  page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;
  y = drawSectionHeader(page, '14', 'Final Reflection', y, fonts);

  const s14Intro = 'After completing the programme, take time to consolidate your thinking. These four questions are designed to crystallise your most important commitments.';
  for (const line of wrapText(s13Intro, CONTENT_WIDTH, fonts.regular, 10)) {
    page.drawText(line, { x: MARGIN, y, size: 10, font: fonts.regular, color: COLORS.text });
    y -= 15;
  }
  y -= 10;

  const finalQs = [
    '1. What is the most important AI opportunity for your organisation?',
    '2. What leadership capability must you strengthen most?',
    '3. What will be your first leadership action after this programme?',
    '4. How will you communicate AI transformation to your team?',
  ];

  for (const q of finalQs) {
    y = drawFieldGroup(page, form, q, y, fonts, 65, 's13_final');
  }

  // Closing quote
  if (y > 150) {
    y -= 20;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: MARGIN + CONTENT_WIDTH, y },
      thickness: 0.5, color: COLORS.border,
    });
    y -= 30;

    const q1 = '"Artificial intelligence will transform organisations.';
    const q2 = 'Leadership will determine which ones succeed."';
    const q1w = fonts.italic.widthOfTextAtSize(q1, 13);
    const q2w = fonts.italic.widthOfTextAtSize(q2, 13);
    page.drawText(q1, { x: (PAGE_WIDTH - q1w) / 2, y, size: 13, font: fonts.italic, color: COLORS.text });
    page.drawText(q2, { x: (PAGE_WIDTH - q2w) / 2, y: y - 18, size: 13, font: fonts.italic, color: COLORS.text });

    const attr = 'AUGMENTED LEADERSHIP(TM) FRAMEWORK  -  BRIGHT LEADERSHIP CONSULTING';
    page.drawText(attr, {
      x: (PAGE_WIDTH - fonts.regular.widthOfTextAtSize(attr, 7)) / 2,
      y: y - 42, size: 7, font: fonts.regular, color: COLORS.muted,
    });
  }

  // ════════════ BACK COVER ════════════
  const back = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  back.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: COLORS.charcoal });

  const bc1 = 'PROGRAMME COMPLETE';
  const bc1w = fonts.regular.widthOfTextAtSize(bc1, 9) + 40;
  back.drawRectangle({
    x: (PAGE_WIDTH - bc1w) / 2, y: PAGE_HEIGHT / 2 + 60,
    width: bc1w, height: 26,
    borderColor: COLORS.gold, borderWidth: 1,
    color: COLORS.gold, opacity: 0.15,
  });
  back.drawText(bc1, {
    x: (PAGE_WIDTH - fonts.regular.widthOfTextAtSize(bc1, 9)) / 2,
    y: PAGE_HEIGHT / 2 + 68, size: 9, font: fonts.regular, color: COLORS.gold,
  });

  const bc2 = 'Strategic Leadership in the Age of AI';
  back.drawText(bc2, {
    x: (PAGE_WIDTH - fonts.bold.widthOfTextAtSize(bc2, 22)) / 2,
    y: PAGE_HEIGHT / 2 + 20, size: 22, font: fonts.bold, color: COLORS.white,
  });

  const bc3 = 'Executive Program Workbook';
  back.drawText(bc3, {
    x: (PAGE_WIDTH - fonts.regular.widthOfTextAtSize(bc3, 12)) / 2,
    y: PAGE_HEIGHT / 2 - 5, size: 12, font: fonts.regular, color: rgb(0.7, 0.7, 0.7),
  });

  back.drawLine({
    start: { x: PAGE_WIDTH / 2 - 40, y: PAGE_HEIGHT / 2 - 30 },
    end: { x: PAGE_WIDTH / 2 + 40, y: PAGE_HEIGHT / 2 - 30 },
    thickness: 2, color: COLORS.gold,
  });

  const bc4 = '(c) Bright Leadership Consulting  -  All Rights Reserved  -  Confidential';
  back.drawText(bc4, {
    x: (PAGE_WIDTH - fonts.regular.widthOfTextAtSize(bc4, 7)) / 2,
    y: 40, size: 7, font: fonts.regular, color: rgb(0.4, 0.4, 0.4),
  });

  // Footer on all content pages
  const pages = pdf.getPages();
  for (let i = 1; i < pages.length - 1; i++) {
    const p = pages[i];
    const ft = `Strategic Leadership in the Age of AI  -  Executive Workbook  -  Page ${i}`;
    p.drawText(ft, {
      x: (PAGE_WIDTH - fonts.regular.widthOfTextAtSize(ft, 7)) / 2,
      y: 25, size: 7, font: fonts.regular, color: COLORS.muted,
    });
  }

  return await pdf.save();
}

// ── Download Helper ──
export function downloadStrategicLeadershipPDF(pdfBytes: Uint8Array) {
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'strategic-leadership-ai-workbook.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
