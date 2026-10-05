/**
 * Consent-gated loader for the Google Analytics tag (gtag.js).
 *
 * Nothing from Google is requested until Analytics consent is granted:
 *  - Analytics granted → gtag.js is fetched and GA4 is configured.
 * Withdrawing consent sets Google's documented per-tag disable flag
 * (`ga-disable-<ID>`), which stops all hits from the tag, returns Consent
 * Mode signals to denied, clears analytics cookies and reloads the page so
 * gtag.js is no longer present at all.
 *
 * The Google Ads tag was removed (no active campaigns); only GA4 remains.
 */

export const GA4_ID = "G-FX0BYSEL34";

type W = Window & Record<string, unknown>;

let scriptRequested = false;
let jsCalled = false;
let gaConfigured = false;
let gaActive = false;
let lastGaPath: string | null = null;

function gtag(...args: unknown[]) {
  window.gtag?.(...args);
}

function ensureScript() {
  if (!jsCalled) {
    jsCalled = true;
    gtag("js", new Date());
  }
  if (scriptRequested) return;
  scriptRequested = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(s);
}

function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (name === "_ga" || name.startsWith("_ga_") || name === "_gid" || name.startsWith("_gcl_")) {
      domains.forEach((d) => {
        document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
      });
    }
  });
}

export function applyTagConsent(analytics: boolean) {
  if (typeof window === "undefined") return;
  const w = window as unknown as W;

  if (analytics) {
    w[`ga-disable-${GA4_ID}`] = false;
    ensureScript();
    if (!gaConfigured) {
      gaConfigured = true;
      // This config call sends the page_view for the page currently open.
      gtag("config", GA4_ID, {
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
      lastGaPath = window.location.pathname + window.location.search;
    }
    gaActive = true;
  } else {
    w[`ga-disable-${GA4_ID}`] = true;
    if (gaActive) {
      // gtag.js cannot be unloaded and still emits cookieless pings while
      // loaded, so a withdrawal clears cookies and reloads the page without it.
      clearAnalyticsCookies();
      gaActive = false;
      window.location.reload();
    }
  }
}

export const isAnalyticsActive = () => gaActive;

/** Path of the last page_view GA4 received, used to avoid double counting. */
export function markGaPath(path: string): boolean {
  if (path === lastGaPath) return false;
  lastGaPath = path;
  return true;
}
