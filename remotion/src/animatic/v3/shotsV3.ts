/**
 * "When Everyone Has AI" — 69s principal organisational-page film.
 * Governed by blc-ai-animatic-scripts-v3.md (§3, §3.1).
 *
 * Conditions enforced here:
 *  1. Convergence occupies the opening act only (0–16.6s); the hinge at 16.6s
 *     pivots into the positive proposition, which owns the remaining time.
 *  2. Gold appears at four beats only, each a named act of leadership judgement.
 *  3. The five capabilities play as ONE integrated kinetic sequence (no cards).
 *  4. EAI™ claim uses the approved short end-card formulation only.
 */

export type ShotV3 = {
  img: string | null;
  from: number;
  to: number;
  /** camera: [startScale, endScale, startX, endX, startY, endY] */
  cam: [number, number, number, number, number, number];
  dissolve?: number;
  dim?: number;
  /** Gold key-light beat: 0–1 intensity. Only for named acts of judgement. */
  gold?: number;
  /** Seconds into the shot at which the gold light arrives. */
  goldAt?: number;
  /** Judgement represented — documentation, kept in source for review. */
  judgement?: string;
};

export type CaptionV3 =
  | { kind: "statement"; from: number; to: number; lines: string[] }
  | { kind: "question"; from: number; to: number; lines: string[] }
  | {
      kind: "hinge";
      from: number;
      to: number;
      /** Each line is a list of tokens; gold: true marks the judgement word. */
      lines: { text: string; gold?: boolean }[][];
    }
  | { kind: "card"; from: number; to: number; lines: string[] }
  | { kind: "kinetic"; from: number; to: number; phrases: string[] }
  | { kind: "title"; from: number; to: number; title: string[]; sub: string }
  | {
      kind: "end";
      from: number;
      to: number;
      programme?: string[];
      firm: string;
      cta: string;
      url: string;
      note: string;
    };

/* ------------------------------------------------------------------ 69s ---- */

export const SHOTS_69: ShotV3[] = [
  // Act 1 — convergence (pattern established, no gold)
  { img: "s01.jpg", from: 0.0, to: 6.0, cam: [1.05, 1.14, 0, -38, 0, 6], dissolve: 1.0 },
  { img: "s02.jpg", from: 6.0, to: 11.4, cam: [1.16, 1.04, 28, -22, 8, 0] },
  { img: "s07.jpg", from: 11.4, to: 16.6, cam: [1.18, 1.05, -40, 24, 0, 0], dim: 0.08 },
  // The hinge — one window warms as the organisation aligns behind a choice
  {
    img: "s08.jpg",
    from: 16.6,
    to: 22.2,
    cam: [1.06, 1.16, 20, -30, 0, -8],
    gold: 0.5,
    goldAt: 2.6,
    judgement: "aligning the organisation behind a deliberate choice",
  },
  // Typographic interruption (rule only)
  { img: null, from: 22.2, to: 27.4, cam: [1, 1, 0, 0, 0, 0] },
  // Proposition — a leader looks up from the screen
  {
    img: "s09.jpg",
    from: 27.4, 
    to: 35.2,
    cam: [1.14, 1.03, -34, 20, 6, 0],
    dissolve: 0.5,
    gold: 0.46,
    goldAt: 2.2,
    judgement: "challenging the consensus answer",
  },
  // Proprietary knowledge the model does not hold
  {
    img: "s06.jpg",
    from: 35.2,
    to: 41.6,
    cam: [1.05, 1.15, 26, -24, 0, 0],
    gold: 0.42,
    goldAt: 1.6,
    judgement: "introducing proprietary organisational knowledge",
  },
  // Integrated kinetic capability sequence (navy field, rule only)
  { img: null, from: 41.6, to: 52.8, cam: [1, 1, 0, 0, 0, 0] },
  // The differentiated choice, made and held — same window, resolved
  {
    img: "s08.jpg",
    from: 52.8,
    to: 58.2,
    cam: [1.16, 1.06, -26, 18, -6, 0],
    dissolve: 0.6,
    gold: 0.52,
    goldAt: 1.2,
    judgement: "the differentiated choice, made and held",
  },
  // Title and end card
  { img: "s10.jpg", from: 58.2, to: 69.0, cam: [1.03, 1.13, 0, -28, 0, 0], dim: 0.22, dissolve: 0.7 },
];

export const CAPTIONS_69: CaptionV3[] = [
  { kind: "statement", from: 1.2, to: 5.4, lines: ["Every organisation now has", "the same AI."] },
  { kind: "statement", from: 6.0, to: 11.0, lines: ["Comparable tools.", "Comparable analysis."] },
  {
    kind: "statement",
    from: 11.4,
    to: 16.0,
    lines: ["Comparable options.", "Increasingly similar strategies."],
  },
  {
    kind: "hinge",
    from: 16.6,
    to: 22.0,
    lines: [
      [{ text: "Leadership", gold: true }, { text: " determines whether AI" }],
      [{ text: "produces efficiency, strategic" }],
      [{ text: "sameness — or distinctive advantage." }],
    ],
  },
  { kind: "card", from: 22.6, to: 27.0, lines: ["Not a technology problem.", "A distinction problem."] },
  {
    kind: "statement",
    from: 27.6,
    to: 35.0,
    lines: ["Advantage belongs to leadership teams", "that ask better questions."],
  },
  {
    kind: "statement",
    from: 35.4,
    to: 41.0,
    lines: ["And decide with more precision", "than their competitors can."],
  },
  {
    kind: "kinetic",
    from: 41.6,
    to: 52.5,
    phrases: [
      "See clearly",
      "Create value",
      "Choose intelligently",
      "Mobilise coherently",
      "Adapt strategically",
    ],
  },
  {
    kind: "question",
    from: 53.0,
    to: 58.0,
    lines: ["When everyone has AI, what will", "make your organisation different?"],
  },
  {
    kind: "title",
    from: 58.4,
    to: 63.0,
    title: ["Strategic Leadership", "in the Age of AI"],
    sub: "Bright Leadership Consulting",
  },
  {
    kind: "end",
    from: 63.0,
    to: 69.0,
    firm: "Bright Leadership Consulting",
    cta: "Discuss Organisational Delivery",
    url: "brightleadershipconsulting.com/strategic-ai-leadership-for-organisations",
    note: "Strategic Leadership in the Age of AI — organisational delivery · Accredited by The CPD Standards Office",

  },
];

export const DURATION_69 = 69;

/* ------------------------------------------------------------------ 30s ---- */

export const SHOTS_30_V3: ShotV3[] = [
  { img: "s01.jpg", from: 0.0, to: 5.0, cam: [1.05, 1.15, 0, -44, 0, 8], dissolve: 0.7 },
  { img: "s02.jpg", from: 5.0, to: 9.6, cam: [1.18, 1.04, 30, -20, 8, 0] },
  {
    img: "s08.jpg",
    from: 9.6,
    to: 15.4,
    cam: [1.06, 1.17, 22, -28, 0, -8],
    gold: 0.52,
    goldAt: 1.6,
    judgement: "aligning the organisation behind a deliberate choice",
  },
  { img: "s09.jpg", from: 15.4, to: 20.8, cam: [1.15, 1.03, -32, 18, 6, 0], dissolve: 0.5 },
  { img: "s04.jpg", from: 20.8, to: 25.9, cam: [1.04, 1.14, -24, 22, 0, 0], dim: 0.1 },
  { img: "s10.jpg", from: 25.9, to: 30.0, cam: [1.04, 1.13, 0, -22, 0, 0], dim: 0.26, dissolve: 0.6 },
];

export const CAPTIONS_30_V3: CaptionV3[] = [
  { kind: "statement", from: 0.9, to: 4.6, lines: ["Every organisation now has", "the same AI."] },
  {
    kind: "statement",
    from: 5.0,
    to: 9.0,
    lines: ["Comparable tools. Comparable analysis.", "Similar strategies."],
  },
  {
    kind: "hinge",
    from: 9.6,
    to: 15.0,
    lines: [
      [{ text: "Leadership", gold: true }, { text: " decides whether that" }],
      [{ text: "becomes efficiency, sameness" }],
      [{ text: "— or advantage." }],
    ],
  },
  {
    kind: "statement",
    from: 15.6,
    to: 20.4,
    lines: ["Advantage belongs to teams that ask", "better questions and decide", "with more precision."],
  },
  {
    kind: "question",
    from: 21.0,
    to: 25.6,
    lines: ["When everyone has AI, what will", "make yours different?"],
  },
  {
    kind: "end",
    from: 26.0,
    to: 30.0,
    programme: ["Strategic Leadership", "in the Age of AI"],
    firm: "Bright Leadership Consulting",
    cta: "Discuss Executive Alignment",
    url: "brightleadershipconsulting.com",
    note: "CPD Standards Office — Provider 50838",
  },
];

export const DURATION_30 = 30;
