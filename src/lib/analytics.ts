/**
 * Lightweight, provider-agnostic analytics layer.
 *
 * Two Google tags are configured in index.html from a single gtag.js
 * instance: the GA4 property G-FX0BYSEL34 and the Google Ads conversion tag
 * AW-18382257167. Consent Mode v2 defaults (all four signals denied) are set
 * before either configures.
 *
 * Every event below is pushed to `window.dataLayer` (retained for any future
 * GTM/consumer) *and* sent to GA4 through a real `gtag('event', ...)` call
 * scoped with `send_to` so it never reaches the Ads tag. No names, email
 * addresses, organisation names or free-text are ever included.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** GA4 measurement ID for the Bright Leadership Consulting web stream. */
export const GA4_MEASUREMENT_ID = "G-FX0BYSEL34";

/** Google Ads conversion destination for a confirmed organisational enquiry. */
const ENQUIRY_CONVERSION_SEND_TO = "AW-18382257167/6zYBCLOIr98cEI_4q71E";

export function initAnalytics() {
  if (typeof window === "undefined") return;
  // The gtag stub, consent defaults and tag configuration are established in
  // index.html; this only guarantees dataLayer exists for the helpers below.
  window.dataLayer = window.dataLayer || [];
}

/**
 * Send a named event with parameters to the dataLayer and to GA4.
 *
 * Direct gtag.js does not consume `dataLayer.push({ event })` objects, so the
 * explicit `gtag('event', ...)` call below is what actually reaches GA4.
 * Parameters are passed through unchanged, so optional properties such as
 * `q14_value` stay absent (not null) when they were never supplied.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
  window.gtag?.("event", name, { ...params, send_to: GA4_MEASUREMENT_ID });
}

let initialPageViewSkipped = false;

/**
 * Track a route change as a GA4 page_view. The first call after load is not
 * forwarded to GA4: the `config` call in index.html already sent that page
 * view, and duplicating it would double-count the landing page.
 */
export function trackPageView(path: string) {
  const params = { page_path: path, page_location: window.location.href };
  if (!initialPageViewSkipped) {
    initialPageViewSkipped = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "page_view", ...params });
    return;
  }
  trackEvent("page_view", params);
}


let enquiryConversionSent = false;

/**
 * Google Ads conversion for a confirmed organisational / cohort enquiry.
 * Called only from the contact form's confirmed-success branch, never from a
 * click handler, and guarded so it can fire at most once per page session.
 * No redirect is required, so no URL is passed.
 */
export function reportEnquiryConversion() {
  if (typeof window === "undefined" || enquiryConversionSent) return;
  enquiryConversionSent = true;
  window.gtag?.("event", "conversion", {
    send_to: ENQUIRY_CONVERSION_SEND_TO,
  });
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

/** A direct self-service enrolment click. Reported as `programme_enrol_click`. */
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

/** An enquiry click ("Request Individual Enrolment"). Reported as `programme_enquiry_click`. */
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
  /** CTA label acted on, e.g. "Request Individual Enrolment". */
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

export interface PaymentSurfaceEvent {
  /** Provider identified, e.g. "stripe" | "paypal" | "braintree". */
  provider: string;
  /** What was seen, e.g. "script[https://js.stripe.com/v3]" or "iframe_focus". */
  surface: string;
  /** Route the surface appeared on. */
  page: string;
}

/**
 * A payment-provider script, iframe or embed appeared on the page.
 * This site takes no payment, so `expected: false` means an unintended
 * connection (tag manager, extension, third-party widget) is loading provider
 * UI and should be investigated.
 */
export function trackPaymentSurfaceDetected(
  event: PaymentSurfaceEvent & { expected: boolean },
) {
  trackEvent("payment_surface_detected", {
    payment_provider: event.provider,
    payment_surface: event.surface,
    page_path: event.page,
    expected_surface: event.expected,
  });
}

/**
 * A visitor clicked, submitted or focused inside payment-provider UI.
 * Highest-signal event: it means someone reached a payment control on a site
 * that is not meant to charge anyone.
 */
export function trackPaymentSurfaceInteraction(
  event: PaymentSurfaceEvent & { action: string },
) {
  trackEvent("payment_surface_interaction", {
    payment_provider: event.provider,
    payment_surface: event.surface,
    interaction: event.action,
    page_path: event.page,
    expected_surface: false,
  });
}
