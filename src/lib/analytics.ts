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
  /** Programme title, e.g. "Executive Leadership Mastery". */
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
