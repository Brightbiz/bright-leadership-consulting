/**
 * AI Leadership Readiness Audit — question set and approved copy.
 *
 * Source of truth: "AI Leadership Readiness Audit — Logic Map (FINAL)".
 * Every string here is approved copy. Do not reword without approval.
 */

export const AUDIT_ROUTE = "/ai-audit";

/** Public organisational programme page — the only programme information link. */
export const PROGRAMME_PAGE_URL =
  "https://brightleadershipconsulting.com/strategic-ai-leadership-for-organisations";

/** Approved, published price for one digital place. */
export const INDIVIDUAL_PRICE_GBP = 895;
export const INDIVIDUAL_PRICE_LABEL = "£895";

/** Approved CPD wording for all digital-access tiers. Controlled centrally. */
export const CPD_LINE =
  "Currently accredited for 20–30 CPD hours. Official CPDSO Certificate of Attendance for participants who satisfy the approved completion requirements.";

export type ReadinessQuestion = { dim: string; q: string; opts: string[] };

/** Part A — Q1–Q8. Options A–D score 1–4. Fixed order, no branching. */
export const READINESS_QUESTIONS: ReadinessQuestion[] = [
  {
    dim: "Strategic purpose",
    q: "How are AI initiatives connected to your organisation's strategic priorities?",
    opts: [
      "Initiatives are mainly driven by available tools or individual experimentation.",
      "Some initiatives support business priorities, but the connection is inconsistent.",
      "Most initiatives are evaluated against defined strategic priorities.",
      "AI investment begins with a clearly defined organisational problem, opportunity or strategic objective.",
    ],
  },
  {
    dim: "Constructive challenge",
    q: "What normally happens when AI supports an important recommendation?",
    opts: [
      "The recommendation is generally accepted when the output appears credible.",
      "It is challenged when someone happens to identify a concern.",
      "The team routinely tests it against assumptions and conflicting evidence.",
      "A defined process requires assumptions, evidence, limitations and alternatives to be examined.",
    ],
  },
  {
    dim: "Human judgement",
    q: "How does your organisation determine which decisions require distinctly human judgement?",
    opts: [
      "This has not been clearly considered.",
      "It is decided informally by those involved.",
      "Leaders generally understand where human judgement must remain decisive.",
      "Explicit principles define which decisions require human judgement, escalation or approval.",
    ],
  },
  {
    dim: "Accountability",
    q: "Who is accountable for consequential decisions informed by AI?",
    opts: [
      "Accountability is unclear or attributed to the system, data or provider.",
      "Responsibility is usually identified after an issue arises.",
      "A responsible leader is generally understood before the decision is made.",
      "Decision ownership, authority and escalation responsibilities are explicit in advance.",
    ],
  },
  {
    dim: "Governance and risk",
    q: "When are the wider consequences of an AI-supported decision considered?",
    opts: [
      "Usually after implementation or when a problem emerges.",
      "Primarily during technical, legal or compliance review.",
      "Before implementation, including operational, ethical and reputational consequences.",
      "Throughout the decision process, with defined challenge, thresholds and escalation arrangements.",
    ],
  },
  {
    dim: "Leadership alignment",
    q: "How aligned are leaders across strategy, technology, people, governance and operations?",
    opts: [
      "Functions are largely progressing independently.",
      "Information is shared, but priorities and assumptions differ.",
      "Leaders broadly agree on priorities, responsibilities and intended outcomes.",
      "Leaders work from a shared strategic direction with coordinated decisions and accountability.",
    ],
  },
  {
    dim: "Organisational change",
    q: "How are the effects of AI on roles, work and organisational behaviour addressed?",
    opts: [
      "Attention is concentrated mainly on the technology.",
      "Workforce implications are considered after implementation decisions.",
      "Role, capability and change implications are included in implementation planning.",
      "Leaders actively shape roles, capabilities, communication and adoption as part of the strategy.",
    ],
  },
  {
    dim: "Responsible execution",
    q: "What happens after an AI-related strategic decision is approved?",
    opts: [
      "Functions interpret and implement it independently.",
      "Actions are assigned, but dependencies and decision rights remain unclear.",
      "Responsibilities, measures and major dependencies are defined.",
      "Execution is coordinated across functions, with clear ownership, review points and adaptation.",
    ],
  },
];

export type Band = { max: number; title: string; teaser: string; body: string };

/** Fixed 8–32 scale. Respondent's own position only — never a peer comparison. */
export const BANDS: Band[] = [
  {
    max: 14,
    title: "Tool-Led",
    teaser: "AI activity is ahead of the leadership structures needed to direct it.",
    body: "Adoption is outpacing the strategic purpose, challenge and accountability needed to direct it well. That's a common starting point — not a disqualifier — but scaling from here without those foundations tends to produce more activity, not more advantage.",
  },
  {
    max: 21,
    title: "Experimenting but Fragmented",
    teaser: "Useful activity exists, but leadership practice varies across the organisation.",
    body: "Pockets of good practice exist, but they depend on who's involved rather than how the organisation works. The next gain comes from making that practice consistent, not from adopting more tools.",
  },
  {
    max: 27,
    title: "Strategically Directed",
    teaser: "AI is connected to strategy and judgement, with some capability still uneven.",
    body: "Most of the leadership infrastructure is in place. Progress from here is usually limited by the single weakest dimension, especially as adoption reaches more of the organisation.",
  },
  {
    max: 32,
    title: "Organisationally Aligned",
    teaser: "A comparatively coherent approach across strategy, judgement, governance and execution.",
    body: "The leadership capability is already differentiated. The next test is whether it survives growth, leadership turnover and increasing pressure to move fast.",
  },
];

export const SCALING_CAUTION_COPY =
  "Your readiness result suggests the leadership foundations — challenge, accountability, governance — are still forming. This doesn't rule out access for a larger group, but the programme is likely to land best if it begins with a smaller foundational cohort that establishes shared language and decision ownership before wider rollout.";

/* --------------------------------------------------- routing question copy */

export const Q9_OPTIONS = [
  ["A", "Develop one leader's strategic AI capability."],
  ["B", "Develop several leaders through the same digital programme."],
  ["C", "Build shared understanding across a leadership team."],
  ["D", "Strengthen AI governance, judgement and accountability."],
  ["E", "Align executives around AI strategy and organisational change."],
  ["F", "Implement AI software, systems, coding or technical infrastructure."],
  ["G", "Explore the subject without a current development requirement."],
] as const;

export const Q10_OPTIONS = [
  ["A", "I would participate personally."],
  ["B", "One nominated leader."],
  ["C", "2–4 leaders."],
  ["D", "5–9 leaders."],
  ["E", "10–19 leaders."],
  ["F", "20 or more leaders."],
  ["G", "An intact executive or senior-leadership team."],
  ["H", "Not yet decided."],
] as const;

export const Q11_OPTIONS = [
  ["digital", "Self-directed digital learning"],
  ["digitalNamed", "Digital learning for several named leaders"],
  ["digitalDiscussion", "Digital learning supported by internal organisational discussions"],
  ["facilitated", "A facilitated team cohort"],
  ["tailored", "Tailored in-house delivery"],
  ["recommendMe", "I need the audit to recommend the most proportionate format"],
] as const;

export const Q11A_OPTIONS = [
  ["customisation", "Material customisation is required"],
  ["confidential", "The programme must address a live, confidential organisational priority"],
  ["advisory", "We need advisory support beyond the standard programme"],
  [
    "unsuitable",
    "The standard digital and facilitated-cohort packages are unsuitable for a stated operational reason",
  ],
  ["uncertain", "None of these — I selected tailored because I'm uncertain which format would suit us"],
] as const;

export const Q12_OPTIONS = [
  ["now", "Immediately"],
  ["30d", "Within 30 days"],
  ["3m", "Within three months"],
  ["6m", "Within six months"],
  ["later", "Later"],
  ["none", "No current timeframe"],
] as const;

export const Q13_OPTIONS = [
  ["approve", "I can give final approval"],
  ["share", "I share approval responsibility"],
  ["budget", "I control or manage the relevant budget"],
  ["sponsor", "I am the executive sponsor"],
  ["lead", "I am the internal programme lead or recommender"],
  ["research", "I am researching for a decision-maker"],
  ["none", "I am not involved in purchasing"],
] as const;

export const Q14_OPTIONS = [
  ["card", "Pay online by card"],
  ["invoice", "Receive an invoice"],
  ["po", "Use a purchase order"],
  ["download", "Download information for internal approval"],
  ["review", "Review the recommendation before deciding"],
  ["notready", "I am not ready to purchase"],
] as const;

export const QTY_OPTIONS = [
  ["A", "1 participant"],
  ["B", "1 participant (nominated)"],
  ["C", "2–4 participants"],
  ["D", "5–9 participants"],
  ["E", "10–19 participants"],
  ["F", "20+ participants"],
  ["G", "Intact executive or leadership team"],
  ["still", "I still cannot estimate"],
] as const;

/* ------------------------------------------------------------ product copy */

export type ProductKey =
  | "individual"
  | "multiple"
  | "organisational"
  | "facilitated"
  | "tailored"
  | "digitalUnresolved";

export const PRODUCT_META: Record<ProductKey, { title: string; incl: string; proposed?: string }> = {
  individual: {
    title: "Individual Digital Access",
    incl: `10 core leadership modules · applied assessment · AI Leadership Blueprint™ capstone. ${CPD_LINE}`,
  },
  multiple: {
    title: "Multiple Digital Places",
    incl: `The full digital programme, allocated individually to each participant. ${CPD_LINE}`,
  },
  organisational: {
    title: "Organisational Digital Access",
    incl: `The full digital programme across your organisation. ${CPD_LINE}`,
    proposed: "Participant allocation approach: proposed — subject to approval.",
  },
  facilitated: {
    title: "Facilitated Team Cohort",
    incl: "Digital programme access, with facilitated team sessions to apply the material together.",
    proposed: "Facilitated sessions: proposed — subject to approval.",
  },
  tailored: {
    title: "Tailored Organisational Delivery",
    incl: "Scoped individually around your organisational priority — combines advisory input with tailored programme design.",
  },
  digitalUnresolved: {
    title: "Digital Programme Access",
    incl: "Individual, Multiple and Organisational digital access all deliver the same core programme at different scale. No tier is committed until a participant number is confirmed.",
  },
};

export const MISMATCH_COPY =
  "Bright Leadership Consulting focuses on the leadership, strategic, governance and organisational dimensions of AI. It does not provide coding, software-development or technical implementation services. Your readiness result above still stands as decision-support information.";

export const GENERAL_INTEREST_QUESTION =
  "One question worth taking back to your organisation: where in your AI-supported decisions is judgement currently assumed rather than assigned?";

export const RESULT_DISCLAIMER =
  "This result reflects one respondent's answers, not a verified assessment of the whole organisation.";
