/**
 * AI Leadership Readiness Audit — browser session controls.
 *
 * Three responsibilities, all confined to the current browser session:
 *  1. A per-session idempotency key so repeated clicks or retries cannot create
 *     duplicate audit responses, request records, CRM rows or analytics events.
 *  2. Temporary preservation of unfinished answers in `sessionStorage` only.
 *     Contact details are never written here, and answers are cleared on
 *     successful completion.
 *  3. Environment detection so staging traffic is excluded from production
 *     analytics, with an explicit indicator for authorised testing.
 */

const KEY_ID = "blc.audit.session.id";
const KEY_STARTED = "blc.audit.session.startedAt";
const KEY_ANSWERS = "blc.audit.progress";
const KEY_TEST = "blc.audit.testMode";

/** Hosts permitted to report production analytics. */
const PRODUCTION_HOSTS = ["brightleadershipconsulting.com", "www.brightleadershipconsulting.com"];

const safeSession = (): Storage | null => {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
};

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

/** Stable idempotency key for this browser session's audit attempt. */
export function auditSessionId(): string {
  const store = safeSession();
  if (!store) return newId();
  let id = store.getItem(KEY_ID);
  if (!id) {
    id = newId();
    store.setItem(KEY_ID, id);
    store.setItem(KEY_STARTED, String(Date.now()));
  }
  return id;
}

/** Milliseconds since this audit attempt began — the credible-time check. */
export function auditElapsedMs(): number {
  const store = safeSession();
  const started = Number(store?.getItem(KEY_STARTED));
  if (!Number.isFinite(started) || started <= 0) return 0;
  return Date.now() - started;
}

/** Starts a fresh attempt: new idempotency key, new clock, no saved answers. */
export function resetAuditSession() {
  const store = safeSession();
  if (!store) return;
  store.removeItem(KEY_ANSWERS);
  store.setItem(KEY_ID, newId());
  store.setItem(KEY_STARTED, String(Date.now()));
}

/* ------------------------------------------------- unfinished progress ---- */

export interface SavedProgress {
  screen: string;
  readinessIndex: number;
  /** Answers only. No contact details are ever stored. */
  state: unknown;
  savedAt: number;
}

export function saveProgress(progress: Omit<SavedProgress, "savedAt">) {
  const store = safeSession();
  if (!store) return;
  try {
    store.setItem(KEY_ANSWERS, JSON.stringify({ ...progress, savedAt: Date.now() }));
  } catch {
    /* storage full or blocked — progress preservation is best-effort only */
  }
}

export function loadProgress(): SavedProgress | null {
  const store = safeSession();
  if (!store) return null;
  try {
    const raw = store.getItem(KEY_ANSWERS);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedProgress;
    if (!parsed || typeof parsed.screen !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Called after a successful completion — saved answers must not persist. */
export function clearProgress() {
  safeSession()?.removeItem(KEY_ANSWERS);
}

/* ------------------------------------------------------------ environment - */

/** True on any host other than the live public domain. */
export function isStagingHost(): boolean {
  if (typeof window === "undefined") return true;
  return !PRODUCTION_HOSTS.includes(window.location.hostname);
}

/**
 * Authorised test indicator. Set with `?audit_test=1` (persists for the
 * session) and cleared with `?audit_test=0`. Test events are tagged so they can
 * be identified or excluded downstream.
 */
export function syncTestMode(search: string) {
  const store = safeSession();
  if (!store) return;
  const value = new URLSearchParams(search).get("audit_test");
  if (value === "1") store.setItem(KEY_TEST, "1");
  if (value === "0") store.removeItem(KEY_TEST);
}

export function isTestMode(): boolean {
  return safeSession()?.getItem(KEY_TEST) === "1";
}
