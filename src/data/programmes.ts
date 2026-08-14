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
  /**
   * Primary enrolment destination.
   * While individual places are arranged directly, this is an in-site enquiry
   * path (/contact?programme=...). It becomes an external https platform URL
   * only when self-service purchase is genuinely available again.
   */
  link: string;
  /** Optional in-site detail page */
  detailPage?: string;
  /**
   * Whether a self-service purchase route is live.
   * All four catalogue programmes are currently arranged directly, so this is
   * false and every surface must show "Request Individual Enrolment"
   * (→ /contact) instead of a purchase link.
   */
  enrolmentAvailable?: boolean;
  /** Individual fee (GBP). Fixed and published; never presented as indicative. */
  individualFee?: string;
  /** Short instalment summary shown alongside the individual fee. */
  paymentPlanSummary?: string;
  /** Full instalment breakdown, shown on the programme detail page. */
  paymentPlanDetail?: string;
  /** Accredited CPD hours range, as stated on the accreditation record. */
  cpdHours?: string;

  /** Optional social-preview image path under /public (absolute path from site root) */
  ogImage?: string;
};



/**
 * In-site enquiry destination for an individual place, with the programme
 * preselected in the enquiry form's "Programme of interest" field.
 */
export const individualEnquiryPath = (title: string) =>
  `/contact?programme=${encodeURIComponent(title)}`;

export const programmes: Programme[] = [
  {
    title: "Executive Leadership Mastery Programme",
    subtitle: "33 Core Modules, Plus Welcome and Foundation Chapter",
    description:
      "33 core modules — plus an additional welcome and foundation chapter — integrating seven leadership disciplines into a single accredited development architecture. 50–66 accredited CPD hours.",
    features: [
      "7 Integrated Leadership Disciplines",
      "50–66 Accredited CPD Hours",
      "Accredited CPD Activity (Provider 50838)",
      "Self-Directed, Cohort-Based or 1:1",
    ],
    link: individualEnquiryPath(
      "Executive Leadership Mastery Programme",
    ),
    detailPage: "/executive-leadership-mastery",
    enrolmentAvailable: false,
    cpdHours: "50–66 CPD hours",

    individualFee: "£1,297",
    paymentPlanSummary: "a three-month payment plan is available",
    paymentPlanDetail:
      "Pay in full: £1,297. Or pay in three monthly instalments of £435. Total payable: £1,305. The first instalment is taken at enrolment; the remaining two are collected on the same date in each of the following two months. Programme access continues after the final instalment.",
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
    link: individualEnquiryPath(
      "Strategic Leadership in the Age of AI",
    ),
    detailPage: "/strategic-leadership-ai",
    enrolmentAvailable: false,
    cpdHours: "20–30 CPD hours",
    individualFee: "£895",

  },
  {
    title: "Future Workplace and Workforce Strategy Programme",
    subtitle: "Navigating Workforce Transformation",
    description:
      "Addresses the structural shifts redefining how organisations attract, develop and retain talent — from hybrid models to workforce strategy.",
    features: [
      "Workforce Strategy Development",
      "Hybrid & Remote Leadership Models",
      "Talent Retention Frameworks",
      "Organisational Design Principles",
    ],
    link: individualEnquiryPath(
      "Future Workplace and Workforce Strategy Programme",
    ),
    detailPage: "/future-of-work",
    enrolmentAvailable: false,
    individualFee: "£449",
    cpdHours: "20–25 CPD hours",


  },
  {
    title: "Strategic Productivity and Peak Performance Accelerator",
    subtitle: "High-Impact Executive Performance",
    description:
      "A structured programme for senior leaders optimising personal and team performance, grounded in evidence-based executive performance frameworks.",
    features: [
      "Executive Performance Diagnostics",
      "Productivity System Design",
      "Energy & Focus Management",
      "Team Performance Optimisation",
    ],
    link: individualEnquiryPath(
      "Strategic Productivity and Peak Performance Accelerator",
    ),
    detailPage: "/strategic-productivity-peak-performance",
    enrolmentAvailable: false,
    individualFee: "£499",
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
  // Individual places for the four catalogue programmes are arranged directly,
  // so brochure CTAs route to the enquiry page rather than a purchase link.
  "executive-leadership-mastery": `${"https://brightleadershipconsulting.com"}/contact`,
  "future-of-work": "https://brightleadershipconsulting.com/contact",
  "peak-performance": "https://brightleadershipconsulting.com/contact",
  // Standalone Thinkific courses that sit outside the four-programme catalogue.
  "advanced-leadership-skills":
    "https://bright-leadership-consulting.thinkific.com/products/courses/executive-leadership-mastery-program",
  "enhanced-employability-skills":
    "https://bright-leadership-consulting.thinkific.com/products/courses/employability-skills-for-employees",
};

/**
 * CTA label for each brochure anchor, keyed by `data-programme`.
 * Only the four catalogue programmes are managed here; the two standalone
 * course brochures are intentionally left untouched pending a status audit.
 */
export const brochureCtaLabels: Record<string, string> = {
  "executive-leadership-mastery": "Request Individual Enrolment",
  "future-of-work": "Request Individual Enrolment",
  "peak-performance": "Request Individual Enrolment",
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
