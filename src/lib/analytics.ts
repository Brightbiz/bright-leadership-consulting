/**
 * Lightweight, provider-agnostic analytics layer.
 *
 * Events are pushed to `window.dataLayer` and, when a GA4 measurement ID is
 * configured, forwarded to gtag.js. If no provider is configured the calls are
 * inert — no errors, no network requests — so CTA instrumentation can ship
 * ahead of the analytics account being connected.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env
  .VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY as string | undefined;

let initialised = false;

export function initAnalytics() {
  if (initialised || typeof window === "undefined") return;
  initialised = true;

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer!.push(args);
    };
  }

  if (!MEASUREMENT_ID) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID);
}

/** Send a named event with parameters to whichever provider is configured. */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
  window.gtag?.("event", name, params);
}

/** Track a route change as a GA4 page_view (gtag only auto-tracks first load). */
export function trackPageView(path: string) {
  trackEvent("page_view", { page_path: path, page_location: window.location.href });
}

export interface CourseCtaEvent {
  /** Programme title, e.g. "Executive Leadership Mastery Programme". */
  programme: string;
  /** Destination Thinkific URL. */
  url: string;
  /** Where the CTA lives, e.g. "/courses" or "brochure:future-of-work". */
  surface: string;
  /** CTA label as rendered, e.g. "View Programme & Enrol". */
  label: string;
}

/**
 * Conversion event for every Thinkific enrolment CTA (site pages and brochures).
 * Reported as `course_cta_click` — mark it as a conversion in your analytics
 * dashboard to track enrolment intent.
 */
export function trackCourseCtaClick(event: CourseCtaEvent) {
  trackEvent("course_cta_click", {
    programme_name: event.programme,
    destination_url: event.url,
    cta_surface: event.surface,
    cta_label: event.label,
    outbound: true,
  });
}

export interface ProgrammeCtaEvent {
  programme: string;
  destination: string;
  surface: string;
  label: string;
  /** Whether the click leaves the site for the enrolment platform. */
  outbound: boolean;
  /** High-level CTA intent: enrol, enquiry, or advisory. */
  intent: "enrol" | "enquiry" | "advisory";
}

/**
 * Generic ProgrammeCta interaction. Fires alongside the intent-specific
 * events below so every click carries both a precise event name and a
 * common `programme_cta_click` event for funnel analysis by programme.
 */
function trackProgrammeCtaClick(event: ProgrammeCtaEvent) {
  trackEvent("programme_cta_click", {
    programme_name: event.programme,
    destination_url: event.destination,
    cta_surface: event.surface,
    cta_label: event.label,
    cta_intent: event.intent,
    outbound: event.outbound,
  });
}

/** A direct enrolment click ("Enrol Now"). Reported as `programme_enrol_click`. */
export function trackProgrammeEnrolClick(event: Omit<ProgrammeCtaEvent, "intent" | "outbound">) {
  const payload: ProgrammeCtaEvent = { ...event, intent: "enrol", outbound: true };
  trackEvent("programme_enrol_click", {
    programme_name: payload.programme,
    destination_url: payload.destination,
    cta_surface: payload.surface,
    cta_label: payload.label,
    outbound: payload.outbound,
  });
  trackProgrammeCtaClick(payload);
}

/** An enquiry click ("Request Availability" / "Request Enrolment Link"). Reported as `programme_enquiry_click`. */
export function trackProgrammeEnquiryClick(event: Omit<ProgrammeCtaEvent, "intent" | "outbound">) {
  const payload: ProgrammeCtaEvent = { ...event, intent: "enquiry", outbound: false };
  trackEvent("programme_enquiry_click", {
    programme_name: payload.programme,
    destination_url: payload.destination,
    cta_surface: payload.surface,
    cta_label: payload.label,
    outbound: payload.outbound,
  });
  trackProgrammeCtaClick(payload);
}

/** An advisory click ("Discuss Executive Alignment"). Reported as `programme_advisory_click`. */
export function trackProgrammeAdvisoryClick(event: Omit<ProgrammeCtaEvent, "intent" | "outbound">) {
  const payload: ProgrammeCtaEvent = { ...event, intent: "advisory", outbound: false };
  trackEvent("programme_advisory_click", {
    programme_name: payload.programme,
    destination_url: payload.destination,
    cta_surface: payload.surface,
    cta_label: payload.label,
    outbound: payload.outbound,
  });
  trackProgrammeCtaClick(payload);
}

export interface ProgrammeViewEvent {
  /** Programme title, e.g. "Strategic Leadership in the Age of AI". */
  programme: string;
  /** Route the programme page is served from. */
  surface: string;
}

/**
 * Fired once per mount of an internal programme detail page. Pair with
 * `course_cta_click` on the same `programme_name` to measure the
 * page-view → Thinkific enrolment click-through rate.
 */
export function trackProgrammeView(event: ProgrammeViewEvent) {
  trackEvent("programme_view", {
    programme_name: event.programme,
    page_surface: event.surface,
  });
}

export interface ProgrammeDetailClickEvent {
  /** Programme title. */
  programme: string;
  /** Where the link lives, e.g. "/courses#comparison". */
  surface: string;
  /** In-site destination, e.g. "/future-of-work". */
  destination: string;
  /** Which control was used, e.g. "table-heading" or "cta-detail-link". */
  control: string;
}

/**
 * Click on an in-site programme detail link (comparison table headings and the
 * "View programme detail" CTA). Reported as `programme_detail_click`.
 */
export function trackProgrammeDetailClick(event: ProgrammeDetailClickEvent) {
  trackEvent("programme_detail_click", {
    programme_name: event.programme,
    cta_surface: event.surface,
    destination_url: event.destination,
    cta_control: event.control,
  });
}

export interface ProgrammeSelectorChoiceEvent {
  /** Programme recommended by the chosen route. */
  programme: string;
  /** The "If" condition the visitor acted on. */
  condition: string;
  /** 1-based position of the route in the selector. */
  position: number;
  /** CTA label acted on, e.g. "Enrol Now". */
  label: string;
  /** Destination of the CTA. */
  destination: string;
}

/**
 * A visitor acting on one of the "which programme is right for me?" routes.
 * Reported as `programme_selector_choice`; group by `programme_name` to see
 * which self-diagnosed constraint converts best.
 */
export function trackProgrammeSelectorChoice(event: ProgrammeSelectorChoiceEvent) {
  trackEvent("programme_selector_choice", {
    programme_name: event.programme,
    selector_condition: event.condition,
    selector_position: event.position,
    cta_label: event.label,
    destination_url: event.destination,
    cta_surface: "/courses#which-programme",
  });
}

/**
 * Fired once when a measured section scrolls into view. Provides the
 * denominator for click-through rates on the comparison table and selector.
 */
export function trackSectionView(section: string, surface: string) {
  trackEvent("section_view", { section_name: section, page_surface: surface });
}
