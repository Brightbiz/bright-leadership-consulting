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
  /**
   * Whether the enrolment platform link is live and purchasable.
   * When false the surface must show "Request Availability" (→ /contact)
   * instead of an enrolment link, so no CTA can lead to a 404.
   */
  enrolmentAvailable?: boolean;
  /** Individual self-directed enrolment fee, when published publicly (GBP). */
  individualFee?: string;
  /** Accredited CPD hours range, as stated on the accreditation record. */
  cpdHours?: string;

  /** Optional social-preview image path under /public (absolute path from site root) */
  ogImage?: string;
};



export const programmes: Programme[] = [
  {
    title: "Executive Leadership Mastery",
    subtitle: "Flagship 33-Module Programme",
    description:
      "A 33-module pathway integrating seven leadership disciplines into a single CPD-accredited development architecture. 50–66 accredited CPD hours.",
    features: [
      "7 Integrated Leadership Disciplines",
      "50–66 Accredited CPD Hours",
      "Accredited CPD Activity (Provider 50838)",
      "Self-Directed, Cohort-Based or 1:1",
    ],
    link: "https://bright-leadership-consulting.thinkific.com/products/courses/new-executive-leadership-mastery-program",
    detailPage: "/executive-leadership-mastery",
    enrolmentAvailable: true,
    cpdHours: "50–66 CPD hours",

    individualFee: "£1,297",
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
    link: "https://bright-leadership-consulting.thinkific.com/products/courses/strategic-leadership-in-the-age-of-ai",
    detailPage: "/strategic-leadership-ai",
    enrolmentAvailable: true,
    cpdHours: "20–30 CPD hours",
    individualFee: "£895",

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
    link: "https://bright-leadership-consulting.thinkific.com/products/courses/the-future-of-work",
    detailPage: "/future-of-work",
    enrolmentAvailable: false,
    cpdHours: "20–25 CPD hours",


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
    link: "https://bright-leadership-consulting.thinkific.com/products/courses/achieving-peak-performance",
    detailPage: "/strategic-productivity-peak-performance",
    enrolmentAvailable: false,
    cpdHours: "20–25 CPD hours",


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

/**
 * Single source of truth for the static brochure CTA links in
 * `public/brochures/*.html`. Keyed by the `data-programme` attribute on each
 * brochure's `.cta-btn` anchor; the Vite plugin in
 * `scripts/vite-plugin-brochure-links.ts` rewrites those hrefs on dev start
 * and on every build, so brochures can never drift from the catalogue.
 */
export const brochureCtaLinks: Record<string, string> = {
  "executive-leadership-mastery": programmes[0].link,
  "future-of-work": programmes[2].link,
  "peak-performance": programmes[3].link,
  // Standalone Thinkific courses that sit outside the four-programme catalogue.
  "advanced-leadership-skills":
    "https://bright-leadership-consulting.thinkific.com/products/courses/executive-leadership-mastery-program",
  "enhanced-employability-skills":
    "https://bright-leadership-consulting.thinkific.com/products/courses/employability-skills-for-employees",
};

/** Site origin used for canonical and social-preview URLs. */
export const SITE_ORIGIN = "https://brightleadershipconsulting.com";

/** Default social-preview image when a programme has no dedicated one. */
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

export type ProgrammeMeta = {
  title: string;
  description: string;
  path: string;
  canonical: string;
  image: string;
};

/**
 * Derives Open Graph / Twitter Card metadata for a single programme.
 * Programmes without an in-site detail page canonicalise to /courses.
 */
export function getProgrammeMeta(programme: Programme): ProgrammeMeta {
  const path = programme.detailPage ?? "/courses";
  const image = programme.ogImage ?? DEFAULT_OG_IMAGE;
  return {
    title: `${programme.title} | Bright Leadership Consulting`,
    description: programme.description,
    path,
    canonical: `${SITE_ORIGIN}${path}`,
    image: image.startsWith("http") ? image : `${SITE_ORIGIN}${image}`,
  };
}

/** Lookup by catalogue title. Returns null for unknown titles. */
export function getProgrammeMetaByTitle(title: string): ProgrammeMeta | null {
  const programme = programmes.find((p) => p.title === title);
  return programme ? getProgrammeMeta(programme) : null;
}
