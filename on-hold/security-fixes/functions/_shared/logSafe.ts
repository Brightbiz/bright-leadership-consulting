// Allow-listed diagnostic fields for email-provider failures. Never pass the
// provider response body, recipient, subject, message text or credentials.

export type EmailErrorCategory =
  | "auth_refused"
  | "domain_unverified"
  | "rate_limited"
  | "invalid_request"
  | "provider_unavailable"
  | "network"
  | "rejected"
  | "unclassified";

export function emailErrorCategory(status: number | undefined, raw: unknown): EmailErrorCategory {
  const text = String(raw ?? "").toLowerCase();
  if (status === 401 || status === 403) {
    return /domain|verif/.test(text) ? "domain_unverified" : "auth_refused";
  }
  if (status === 429) return "rate_limited";
  if (status === 400 || status === 422) {
    return /domain|verif/.test(text) ? "domain_unverified" : "invalid_request";
  }
  if (status !== undefined && status >= 500) return "provider_unavailable";
  if (status === undefined && /network|fetch|dns|timeout|abort|socket|econn/.test(text)) return "network";
  if (status === 200) return "rejected";
  return "unclassified";
}

export interface SafeEmailLog {
  event: string;
  reference?: string;
  status?: number;
  category: EmailErrorCategory;
}

const REF_PATTERN = /^[A-Za-z0-9:_-]{1,80}$/;

/** Builds the only object that may be logged for an email failure. */
export function safeEmailLog(
  event: string,
  opts: { reference?: string; status?: number; raw?: unknown },
): SafeEmailLog {
  const log: SafeEmailLog = { event, category: emailErrorCategory(opts.status, opts.raw) };
  if (opts.reference && REF_PATTERN.test(opts.reference)) log.reference = opts.reference;
  if (typeof opts.status === "number") log.status = opts.status;
  return log;
}
