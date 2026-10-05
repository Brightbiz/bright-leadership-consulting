/**
 * Cookie consent store + Google Consent Mode v2 bridge.
 *
 * Two independent, optional categories:
 *  - analytics   → analytics_storage (Google Analytics 4)
 *  - advertising → ad_storage, ad_user_data, ad_personalization (Google Ads)
 *
 * Only one storage item is used — a strictly necessary consent-preference
 * record. Consent defaults (all four v2 signals denied) are set in index.html;
 * gtag.js itself is not loaded until a category is granted (see googleTag.ts).
 *
 * Records from the earlier single-category banner (v1) are discarded so the
 * visitor is asked again with the separated choices.
 */

import { applyTagConsent } from "./googleTag";

export const CONSENT_STORAGE_KEY = "blc.cookie-consent.v2";
const LEGACY_STORAGE_KEYS = ["blc.cookie-consent.v1"];
export const OPEN_PREFERENCES_EVENT = "blc:open-cookie-preferences";

export interface ConsentChoices {
  analytics: boolean;
  advertising: boolean;
}

export interface ConsentRecord extends ConsentChoices {
  /** ISO timestamp of the recorded decision. */
  decidedAt: string;
  version: 2;
}

type Listener = (record: ConsentRecord | null) => void;

const listeners = new Set<Listener>();

function readRaw(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed?.version !== 2) return null;
    if (typeof parsed.analytics !== "boolean" || typeof parsed.advertising !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** The stored decision, or null when the visitor has not decided yet. */
export function getConsent(): ConsentRecord | null {
  return readRaw();
}

export function hasDecided(): boolean {
  return readRaw() !== null;
}

/** True only when the visitor has actively accepted analytics. */
export function hasAnalyticsConsent(): boolean {
  return readRaw()?.analytics === true;
}

/** True only when the visitor has actively accepted advertising. */
export function hasAdvertisingConsent(): boolean {
  return readRaw()?.advertising === true;
}

function pushConsentUpdate({ analytics, advertising }: ConsentChoices) {
  if (typeof window === "undefined") return;
  const ads = advertising ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  });
  // Google's tag is only fetched/configured for categories now granted.
  applyTagConsent(analytics, advertising);
}

/** Record a decision, update Consent Mode, and notify subscribers. */
export function setConsent(choices: ConsentChoices) {
  const record: ConsentRecord = {
    analytics: choices.analytics,
    advertising: choices.advertising,
    decidedAt: new Date().toISOString(),
    version: 2,
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    LEGACY_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    /* storage unavailable — the session still respects the in-memory update */
  }
  pushConsentUpdate(record);
  listeners.forEach((listener) => listener(record));
}

/** Withdraw consent entirely: all four signals return to denied. */
export function withdrawConsent() {
  setConsent({ analytics: false, advertising: false });
}

export function subscribeToConsent(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Reopen the preferences panel from anywhere (e.g. the footer link). */
export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}

/**
 * Re-apply a previously stored decision on load. The denied defaults are
 * already in place from index.html, so this only ever widens consent for a
 * visitor who has actively accepted a category.
 */
export function applyStoredConsent() {
  try {
    LEGACY_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    /* ignore */
  }
  const record = readRaw();
  if (record && (record.analytics || record.advertising)) pushConsentUpdate(record);
  else applyTagConsent(false, false);
  // A change made in another open tab applies here immediately.
  window.addEventListener("storage", (event) => {
    if (event.key !== CONSENT_STORAGE_KEY) return;
    const next = readRaw();
    pushConsentUpdate(next ?? { analytics: false, advertising: false });
    listeners.forEach((listener) => listener(next));
  });
}
