import { z } from "npm:zod@3";

/**
 * Transport-independent handler for the admin CRM sync.
 *
 * All privileged capability is injected (Deps) so the authorisation, CORS,
 * validation, rate-limit, idempotency and audit behaviour can be exercised in
 * unit tests without a database, without service-role credentials and without
 * ever running a production sync.
 *
 * AAL2 is deliberately NOT required here: ADMIN_MFA_ENFORCED remains false and
 * assurance-level gating for this privileged action belongs to the separately
 * approved future MFA-enforcement stage.
 */

/** Approved browser origins for this administrative endpoint. */
export const ALLOWED_ORIGINS = [
  "https://brightleadershipconsulting.com",
  "https://www.brightleadershipconsulting.com",
  "https://blc-host-internal.lovable.app",
  "https://id-preview--43b21fe4-e960-444b-bb8f-f71668f51cbd.lovable.app",
];

/** Approved request schema: an optional short operator reason, nothing else. */
export const BodySchema = z
  .object({ reason: z.string().min(3).max(200).optional() })
  .strict();

export const RATE_LIMIT_PER_HOUR = 3;
export const IDEMPOTENCY_WINDOW_MS = 60_000;
export const RATE_LIMIT_KEY = "admin_sync_crm";
export const AUDIT_ACTION = "crm_sync";

export type Operator = { id: string; email: string | null };

export type PriorRun = { at: string; synced: number } | null;

export type Deps = {
  /** Server-side token validation. Never trusts client-supplied identity. */
  getUser: (token: string) => Promise<Operator | null>;
  /** has_role(user.id,'admin') through a client carrying the caller's token. */
  isAdmin: (token: string, userId: string) => Promise<boolean>;
  /** Successful syncs by this operator within the trailing hour. */
  recentSyncCount: (userId: string) => Promise<number>;
  recordAttempt: (userId: string) => Promise<void>;
  /** Most recent successful sync for replay suppression. */
  lastSuccessfulRun: (userId: string) => Promise<PriorRun>;
  writeAudit: (entry: {
    operatorId: string;
    operatorEmail: string | null;
    action: string;
    outcome: "success" | "failure" | "replayed";
    synced: number | null;
    at: string;
  }) => Promise<void>;
  /** Service-role invocation of sync_existing_leads_to_crm(). */
  runSync: () => Promise<number>;
  now: () => number;
  /** Protected server-side diagnostics only. */
  logError: (context: string, detail: unknown) => void;
};

export type HandlerResult = {
  status: number;
  body: unknown | null;
  headers: Record<string, string>;
};

const corsFor = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin ?? "",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  Vary: "Origin",
});

export async function handleAdminSyncCrm(
  req: Request,
  deps: Deps,
): Promise<HandlerResult> {
  const origin = req.headers.get("origin");
  const allowed = origin !== null && ALLOWED_ORIGINS.includes(origin);
  const headers = { ...corsFor(allowed ? origin : null), "Content-Type": "application/json" };

  // Non-browser callers (no Origin) are permitted; a present but unapproved
  // origin is rejected without any CORS grant.
  if (origin !== null && !allowed) {
    return { status: 403, body: { error: "Origin not allowed" }, headers: { "Content-Type": "application/json" } };
  }

  if (req.method === "OPTIONS") {
    return { status: 204, body: null, headers };
  }

  if (req.method !== "POST") {
    return { status: 405, body: { error: "Method not allowed" }, headers };
  }

  const authorization = req.headers.get("authorization") ?? "";
  const token = authorization.toLowerCase().startsWith("bearer ")
    ? authorization.slice(7).trim()
    : "";
  if (!token) {
    return { status: 401, body: { error: "Authentication required" }, headers };
  }

  let operator: Operator | null = null;
  try {
    operator = await deps.getUser(token);
  } catch (error) {
    deps.logError("getUser", error);
  }
  if (!operator) {
    return { status: 401, body: { error: "Authentication required" }, headers };
  }

  let isAdmin = false;
  try {
    isAdmin = await deps.isAdmin(token, operator.id);
  } catch (error) {
    deps.logError("isAdmin", error);
  }
  if (!isAdmin) {
    return { status: 403, body: { error: "Not authorised" }, headers };
  }

  let raw: unknown = {};
  const text = await req.text();
  if (text.trim().length > 0) {
    try {
      raw = JSON.parse(text);
    } catch {
      return { status: 400, body: { error: "Invalid JSON body" }, headers };
    }
  }
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return { status: 400, body: { error: parsed.error.flatten().fieldErrors }, headers };
  }

  // Replay suppression: an identical operator request inside the window
  // returns the prior result instead of running a second sync.
  const prior = await deps.lastSuccessfulRun(operator.id);
  if (prior && deps.now() - Date.parse(prior.at) < IDEMPOTENCY_WINDOW_MS) {
    return {
      status: 200,
      body: { synced: prior.synced, at: prior.at, replayed: true },
      headers,
    };
  }

  const recent = await deps.recentSyncCount(operator.id);
  if (recent >= RATE_LIMIT_PER_HOUR) {
    return {
      status: 429,
      body: { error: "Too many sync requests. Please try again later." },
      headers,
    };
  }
  await deps.recordAttempt(operator.id);

  const at = new Date(deps.now()).toISOString();
  try {
    const synced = await deps.runSync();
    await deps.writeAudit({
      operatorId: operator.id,
      operatorEmail: operator.email,
      action: AUDIT_ACTION,
      outcome: "success",
      synced,
      at,
    });
    return { status: 200, body: { synced, at }, headers };
  } catch (error) {
    deps.logError("runSync", error);
    await deps.writeAudit({
      operatorId: operator.id,
      operatorEmail: operator.email,
      action: AUDIT_ACTION,
      outcome: "failure",
      synced: null,
      at,
    });
    return { status: 500, body: { error: "Sync could not be completed" }, headers };
  }
}
