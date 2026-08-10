/**
 * Cookie consent store + Google Consent Mode v2 bridge.
 *
 * Only one storage item is used — a strictly necessary consent-preference
 * record. Nothing else is written before a clear positive action by the
 * visitor. Consent defaults (all four v2 signals denied) are set in
 * index.html before the Google tag configuration executes; this module only
 * issues `consent` updates and persists the visitor's choice.
 */

export const CONSENT_STORAGE_KEY = "blc.cookie-consent.v1";
export const OPEN_PREFERENCES_EVENT = "blc:open-cookie-preferences";

export interface ConsentRecord {
  /** Advertising measurement (Google Ads conversion measurement). */
  advertising: boolean;
  /** ISO timestamp of the recorded decision. */
  decidedAt: string;
  version: 1;
}

type Listener = (record: ConsentRecord | null) => void;

const listeners = new Set<Listener>();

function readRaw(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (typeof parsed?.advertising !== "boolean") return null;
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

function pushConsentUpdate(advertising: boolean) {
  if (typeof window === "undefined") return;
  const state = advertising ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    ad_storage: state,
    analytics_storage: state,
    ad_user_data: state,
    ad_personalization: state,
  });
}

/** Record a decision, update Consent Mode, and notify subscribers. */
export function setConsent(advertising: boolean) {
  const record: ConsentRecord = {
    advertising,
    decidedAt: new Date().toISOString(),
    version: 1,
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* storage unavailable — the session still respects the in-memory update */
  }
  pushConsentUpdate(advertising);
  listeners.forEach((listener) => listener(record));
}

/** Withdraw consent entirely: all four signals return to denied. */
export function withdrawConsent() {
  setConsent(false);
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
 * visitor who has actively accepted advertising measurement.
 */
export function applyStoredConsent() {
  const record = readRaw();
  if (record?.advertising) pushConsentUpdate(true);
}
