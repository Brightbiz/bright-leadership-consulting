/**
 * Authoritative programme list.
 * Every surface (homepage, /courses, footer, enquiry form) reads from here
 * so the portfolio can never drift between pages.
 */

export type Programme = {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  /** Enrolment / platform link (external) */
  link: string;
  /** Optional in-site detail page */
  detailPage?: string;
};

export const programmes: Programme[] = [
  {
    title: "Executive Leadership Mastery",
    subtitle: "Flagship 33-Module Programme",
    description:
      "A 33-module pathway integrating seven leadership disciplines into a single CPD-accredited development architecture. 80+ hours of structured content. 66 CPD points.",
    features: [
      "7 Integrated Leadership Disciplines",
      "80+ Hours of Executive Content",
      "66 CPD Points Accredited",
      "Self-Directed, Cohort-Based or 1:1",
    ],
    link: "https://bright-leadership-consulting.thinkific.com/courses/new-executive-leadership-mastery-program",
    detailPage: "/executive-leadership-mastery",
  },
  {
    title: "Strategic Leadership in the Age of AI",
    subtitle: "AI Governance & Leadership Framework",
    description:
      "Equips senior leaders with the governance frameworks and strategic clarity required to direct artificial intelligence adoption at board level.",
    features: [
      "AI Strategic Implications Assessment",
      "Governance Framework Development",
      "AI Leadership Blueprint™ Creation",
      "Responsible Adoption Protocols",
    ],
    link: "https://bright-leadership-consulting.thinkific.com/products/courses/ai-leadership",
  },
  {
    title: "The Future of Work",
    subtitle: "Navigating Workforce Transformation",
    description:
      "Addresses the structural shifts redefining how organisations attract, develop and retain talent — from hybrid models to workforce strategy.",
    features: [
      "Workforce Strategy Development",
      "Hybrid & Remote Leadership Models",
      "Talent Retention Frameworks",
      "Organisational Design Principles",
    ],
    link: "https://bright-leadership-consulting.thinkific.com/courses/the-future-of-work",
  },
  {
    title: "Strategic Productivity & Peak Performance",
    subtitle: "High-Impact Executive Performance",
    description:
      "A structured programme for senior leaders optimising personal and team performance, grounded in evidence-based executive performance frameworks.",
    features: [
      "Executive Performance Diagnostics",
      "Productivity System Design",
      "Energy & Focus Management",
      "Team Performance Optimisation",
    ],
    link: "https://bright-leadership-consulting.thinkific.com/courses/achieving-peak-performance",
  },
];

/**
 * Corporate Retreats are a facilitated organisational engagement, not a
 * course, and are deliberately held outside the programme catalogue.
 */
export const facilitatedEngagement = {
  title: "Corporate Retreats",
  subtitle: "2–3 Day Facilitated Engagements",
  description:
    "Intensive facilitated engagements for leadership teams and boards. Diagnostic-led design, outcome-focused facilitation, confidential delivery.",
  features: [
    "Diagnostic-Led Programme Design",
    "Board & Leadership Team Focus",
    "Outcome-Focused Facilitation",
    "Confidential Engagement Protocol",
  ],
  link: "/contact",
};

/** Options offered in the enquiry form's "Programme of interest" field. */
export const programmeInterestOptions = [
  ...programmes.map((p) => p.title),
  facilitatedEngagement.title,
  "Executive Alignment Index™ (diagnostic)",
  "Not yet decided",
];
