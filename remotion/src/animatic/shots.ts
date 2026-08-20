/**
 * "The Leadership Gap" — 69s animatic shot list.
 * Times are seconds. Cuts are hard cuts unless `dissolve` is set.
 */
export type Shot = {
  img: string | null; // null = typographic card
  from: number;
  to: number;
  /** camera: [startScale, endScale, startX, endX, startY, endY] in px for translate */
  cam: [number, number, number, number, number, number];
  dissolve?: number; // seconds of cross-dissolve in
  dim?: number; // extra scrim opacity
};

export const SHOTS: Shot[] = [
  { img: "s01.jpg", from: 0.0, to: 6.1, cam: [1.06, 1.14, 0, -40, 0, 0], dissolve: 1.0 },
  { img: "s02.jpg", from: 6.1, to: 12.7, cam: [1.16, 1.05, 30, -20, 10, 0] },
  { img: "s03.jpg", from: 12.7, to: 16.2, cam: [1.2, 1.06, -40, 20, 0, 0] },
  { img: "s05.jpg", from: 16.2, to: 19.7, cam: [1.04, 1.12, -30, 30, 0, 0] },
  { img: "s04.jpg", from: 19.7, to: 24.7, cam: [1.14, 1.04, 40, -30, 0, 0] },
  { img: "s07.jpg", from: 24.7, to: 27.7, cam: [1.05, 1.16, 0, 40, 0, -10] },
  { img: "s08.jpg", from: 27.7, to: 30.7, cam: [1.16, 1.05, 0, 0, -20, 10] },
  { img: "s06.jpg", from: 30.7, to: 35.0, cam: [1.04, 1.13, 20, -30, 0, 0] },
  { img: "s01.jpg", from: 35.0, to: 39.4, cam: [1.34, 1.22, -120, 60, 40, 10] },
  { img: null, from: 39.4, to: 43.4, cam: [1, 1, 0, 0, 0, 0] },
  { img: "s09.jpg", from: 43.4, to: 52.0, cam: [1.12, 1.02, -30, 20, 0, 0], dissolve: 0.5 },
  { img: "s10.jpg", from: 52.0, to: 69.0, cam: [1.03, 1.13, 0, -30, 0, 0], dim: 0.18 },
];

export type Caption =
  | { kind: "statement"; from: number; to: number; lines: string[] }
  | { kind: "question"; from: number; to: number; lines: string[] }
  | { kind: "card"; from: number; to: number; lines: string[] }
  | {
      kind: "title";
      from: number;
      to: number;
      title: string[];
      sub: string;
    }
  | {
      kind: "end";
      from: number;
      to: number;
      firm: string;
      cta: string;
      url: string;
      note: string;
    };

export const CAPTIONS: Caption[] = [
  { kind: "statement", from: 1.2, to: 5.6, lines: ["Your organisation is already using AI."] },
  { kind: "question", from: 6.4, to: 12.2, lines: ["Is it leading AI deliberately?"] },
  { kind: "statement", from: 13.0, to: 19.2, lines: ["Teams experiment.", "Directions diverge."] },
  { kind: "statement", from: 20.0, to: 24.2, lines: ["Conflicting recommendations."] },
  { kind: "statement", from: 25.0, to: 30.2, lines: ["Speed increases.", "Governance does not."] },
  {
    kind: "question",
    from: 31.0,
    to: 38.8,
    lines: ["Who is accountable when an", "AI-supported decision goes wrong?"],
  },
  {
    kind: "card",
    from: 39.4,
    to: 43.4,
    lines: ["Not a technology problem.", "A leadership problem."],
  },
  {
    kind: "title",
    from: 47.6,
    to: 60.0,
    title: ["Strategic Leadership", "in the Age of AI"],
    sub: "Strategy · Governance · Human judgement · Organisational change",
  },
  {
    kind: "end",
    from: 61.0,
    to: 69.0,
    firm: "Bright Leadership Consulting",
    cta: "Discuss Executive Alignment",
    url: "brightleadershipconsulting.com",
    note: "CPD Standards Office — Provider 50838 · Organisational and executive-cohort delivery",
  },
];

export const DURATION_SECONDS = 69;
