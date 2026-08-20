/**
 * "The Leadership Gap — 30s bolder cut".
 * Three shots, hard cuts, one question at a time, end card lands at 24s.
 */
import type { Shot, Caption } from "./shots";

export const SHOTS_30: Shot[] = [
  // 1 — the room where it should be decided
  { img: "s01.jpg", from: 0.0, to: 10.0, cam: [1.06, 1.18, 0, -50, 0, 10], dissolve: 0.6 },
  // 2 — divergence: teams pulling in different directions
  { img: "s03.jpg", from: 10.0, to: 17.5, cam: [1.22, 1.04, -50, 30, 10, 0] },
  // 3 — the accountable individual
  { img: "s07.jpg", from: 17.5, to: 24.0, cam: [1.04, 1.18, 20, -30, 0, -12], dim: 0.12 },
  // 4 — end card
  { img: "s10.jpg", from: 24.0, to: 30.0, cam: [1.05, 1.14, 0, -24, 0, 0], dim: 0.3 },
];

export const CAPTIONS_30: Caption[] = [
  { kind: "statement", from: 0.9, to: 4.6, lines: ["Your organisation is", "already using AI."] },
  { kind: "question", from: 5.2, to: 9.4, lines: ["Is anyone leading it?"] },
  { kind: "statement", from: 10.4, to: 16.9, lines: ["Speed increases.", "Governance does not."] },
  {
    kind: "question",
    from: 17.9,
    to: 23.4,
    lines: ["Who answers for the next", "AI-supported decision?"],
  },
  {
    kind: "end",
    from: 24.0,
    to: 30.0,
    firm: "Bright Leadership Consulting",
    cta: "Discuss Executive Alignment",
    url: "brightleadershipconsulting.com",
    note: "Strategic Leadership in the Age of AI · CPD Standards Office — Provider 50838",
  },
];

export const DURATION_SECONDS_30 = 30;
