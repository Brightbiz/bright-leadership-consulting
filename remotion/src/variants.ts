export type Variant = {
  id: string;
  label: string;
  hook: string[];
  hookKicker: string;
  thesis: { lead: string; lines: string[] };
  structure: { eyebrow: string; heading: string; rows: [string, string][] };
  programme: {
    eyebrow: string;
    title: string[];
    facts: [string, string][];
    note: string;
  };
  close: { line: string; sub: string };
};

/** A — Institutional conviction: declarative, unhedged, board register. */
export const conviction: Variant = {
  id: "conviction",
  label: "Institutional conviction",
  hookKicker: "Executive Programmes",
  hook: ["AI", "is now", "a governance", "question."],
  thesis: {
    lead: "Not a technology question.",
    lines: [
      "Boards are being asked to approve",
      "decisions they cannot yet interrogate.",
      "That gap is a leadership gap.",
    ],
  },
  structure: {
    eyebrow: "The Structure",
    heading: "Strategy. Governance. Change.",
    rows: [
      ["01", "Where AI changes the strategic position"],
      ["02", "What the board must be able to interrogate"],
      ["03", "How the organisation absorbs the change"],
      ["04", "What leadership is accountable for"],
    ],
  },
  programme: {
    eyebrow: "Executive Programme",
    title: ["Strategic Leadership", "in the Age of AI"],
    facts: [
      ["Format", "Facilitated executive programme"],
      ["Accreditation", "CPD Standards Office — Provider 50838"],
      ["Individual fee", "£1,297"],
    ],
    note: "Delivered for leadership teams, executive cohorts and organisations.",
  },
  close: {
    line: "Discuss Executive Alignment",
    sub: "brightleadershipconsulting.com",
  },
};

/** B — Provocative edge: confrontational, names the exposure. */
export const provocative: Variant = {
  id: "provocative",
  label: "Provocative edge",
  hookKicker: "Executive Programmes",
  hook: ["Your board", "cannot", "govern what", "it does not", "understand."],
  thesis: {
    lead: "And it is already signing off on it.",
    lines: [
      "AI decisions are being taken below board level,",
      "with consequences that land above it.",
      "No one in the room can challenge them.",
    ],
  },
  structure: {
    eyebrow: "Uncomfortable Questions",
    heading: "Answer these, or don't.",
    rows: [
      ["01", "Who is accountable when the model is wrong?"],
      ["02", "Which decisions have you already delegated?"],
      ["03", "What would you need to see to intervene?"],
      ["04", "Could you defend this to a regulator?"],
    ],
  },
  programme: {
    eyebrow: "Executive Programme",
    title: ["Strategic Leadership", "in the Age of AI"],
    facts: [
      ["Built for", "Boards that intend to stay in control"],
      ["Accreditation", "CPD Standards Office — Provider 50838"],
      ["Individual fee", "£1,297"],
    ],
    note: "Facilitated for leadership teams and executive cohorts. UK-delivered.",
  },
  close: {
    line: "Discuss Executive Alignment",
    sub: "brightleadershipconsulting.com",
  },
};
