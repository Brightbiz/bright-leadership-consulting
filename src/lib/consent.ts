/**
 * Cookie consent store + Google Consent Mode v2 bridge.
 *
 * One optional category:
 *  - analytics → analytics_storage (Google Analytics 4)
 *
 * The Google Ads tag and its Advertising category were removed (no active
 * campaigns); the ad_storage, ad_user_data and ad_personalization signals
 * remain denied by default in index.html and are never updated.
 *
 * Only one storage item is used — a strictly necessary consent-preference
 * record. Consent defaults (all signals denied) are set in index.html;
 * gtag.js itself is not loaded until Analytics is granted (see googleTag.ts).
 *
 * Records from the earlier banners (v1 single-category, v2 two-category) are
 * discarded so the visitor is asked again with the current choices.
 */

import { applyTagConsent } from "./googleTag";

export const CONSENT_STORAGE_KEY = "blc.cookie-consent.v3";
const LEGACY_STORAGE_KEYS = ["blc.cookie-consent.v1", "blc.cookie-consent.v2"];
export const OPEN_PREFERENCES_EVENT = "blc:open-cookie-preferences";

export interface ConsentChoices {
  analytics: boolean;
}

export interface ConsentRecord extends ConsentChoices {
  /** ISO timestamp of the recorded decision. */
  decidedAt: string;
  version: 3;
}

type Listener = (record: ConsentRecord | null) => void;

const listeners = new Set<Listener>();

function readRaw(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed?.version !== 3) return null;
    if (typeof parsed.analytics !== "boolean") return null;
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

function pushConsentUpdate({ analytics }: ConsentChoices) {
  if (typeof window === "undefined") return;
  window.gtag?.("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
  });
  // Google's tag is only fetched/configured once Analytics is granted.
  applyTagConsent(analytics);
}

/** Record a decision, update Consent Mode, and notify subscribers. */
export function setConsent(choices: ConsentChoices) {
  const record: ConsentRecord = {
    analytics: choices.analytics,
    decidedAt: new Date().toISOString(),
    version: 3,
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

/** Withdraw consent: the analytics signal returns to denied. */
export function withdrawConsent() {
  setConsent({ analytics: false });
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
 * visitor who has actively accepted Analytics.
 */
export function applyStoredConsent() {
  try {
    LEGACY_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    /* ignore */
  }
  const record = readRaw();
  if (record?.analytics) pushConsentUpdate(record);
  else applyTagConsent(false);
  // A change made in another open tab applies here immediately.
  window.addEventListener("storage", (event) => {
    if (event.key !== CONSENT_STORAGE_KEY) return;
    const next = readRaw();
    pushConsentUpdate(next ?? { analytics: false });
    listeners.forEach((listener) => listener(next));
  });
}
