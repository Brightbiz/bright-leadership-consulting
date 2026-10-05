/**
 * Consent-gated loader for the single Google tag (gtag.js).
 *
 * Nothing from Google is requested until a category is granted:
 *  - Analytics granted   → gtag.js is fetched and GA4 is configured.
 *  - Advertising granted → gtag.js is fetched and the Google Ads tag is configured.
 * The two categories are independent. Withdrawing a category sets Google's
 * documented per-tag disable flag (`ga-disable-<ID>`), which stops all hits
 * from that tag, returns Consent Mode signals to denied, clears analytics
 * cookies and reloads the page so gtag.js is no longer present at all.
 */

export const GA4_ID = "G-FX0BYSEL34";
export const ADS_ID = "AW-18382257167";

type W = Window & Record<string, unknown>;

let scriptRequested = false;
let jsCalled = false;
let gaConfigured = false;
let adsConfigured = false;
let gaActive = false;
let adsActive = false;
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
    if (name === "_ga" || name.startsWith("_ga_") || name === "_gid") {
      domains.forEach((d) => {
        document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
      });
    }
  });
}

export function applyTagConsent(analytics: boolean, advertising: boolean) {
  if (typeof window === "undefined") return;
  const w = window as unknown as W;
  let needsReload = false;

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
      needsReload = true;
    }
  }

  if (advertising) {
    w[`ga-disable-${ADS_ID}`] = false;
    ensureScript();
    if (!adsConfigured) {
      adsConfigured = true;
      gtag("config", ADS_ID);
    }
    adsActive = true;
  } else {
    w[`ga-disable-${ADS_ID}`] = true;
    if (adsActive) needsReload = true;
    adsActive = false;
  }
  if (needsReload) window.location.reload();
}

export const isAnalyticsActive = () => gaActive;
export const isAdsActive = () => adsActive;

/** Path of the last page_view GA4 received, used to avoid double counting. */
export function markGaPath(path: string): boolean {
  if (path === lastGaPath) return false;
  lastGaPath = path;
  return true;
}
