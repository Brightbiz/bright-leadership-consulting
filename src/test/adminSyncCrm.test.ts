import { describe, it, expect } from "vitest";
import {
  ALLOWED_ORIGINS,
  handleAdminSyncCrm,
  RATE_LIMIT_PER_HOUR,
  type Deps,
} from "../../supabase/functions/admin-sync-crm/handler";

/**
 * Authorisation and safety tests for the admin CRM sync endpoint.
 *
 * Non-destructive by construction: every dependency is a fake. No database
 * connection is opened, no service-role credential exists in this file, no CRM
 * record is written and sync_existing_leads_to_crm() is never executed.
 */

const ORIGIN = ALLOWED_ORIGINS[0];
const ADMIN = { id: "11111111-1111-1111-1111-111111111111", email: "admin@example.test" };

type Recorded = {
  audits: Parameters<Deps["writeAudit"]>[0][];
  syncs: number;
  attempts: number;
};

const makeDeps = (
  overrides: Partial<Deps> = {},
  recorded: Recorded = { audits: [], syncs: 0, attempts: 0 },
) => {
  const deps: Deps = {
    getUser: async (token) => (token === "valid" ? ADMIN : null),
    isAdmin: async () => true,
    recentSyncCount: async () => 0,
    recordAttempt: async () => {
      recorded.attempts += 1;
    },
    lastSuccessfulRun: async () => null,
    writeAudit: async (entry) => {
      recorded.audits.push(entry);
    },
    runSync: async () => {
      recorded.syncs += 1;
      return 7;
    },
    now: () => Date.parse("2026-08-25T17:00:00.000Z"),
    logError: () => undefined,
    ...overrides,
  };
  return { deps, recorded };
};

const request = (init: {
  method?: string;
  origin?: string | null;
  token?: string | null;
  body?: string;
}) => {
  const headers = new Headers();
  if (init.origin !== null) headers.set("origin", init.origin ?? ORIGIN);
  if (init.token !== null) headers.set("authorization", `Bearer ${init.token ?? "valid"}`);
  return new Request("https://example.test/admin-sync-crm", {
    method: init.method ?? "POST",
    headers,
    body: init.method === "GET" ? undefined : (init.body ?? "{}"),
  });
};

describe("admin-sync-crm handler", () => {
  it("rejects a request with no bearer token (401)", async () => {
    const { deps, recorded } = makeDeps();
    const res = await handleAdminSyncCrm(request({ token: null }), deps);
    expect(res.status).toBe(401);
    expect(recorded.syncs).toBe(0);
  });

  it("rejects an invalid or expired token (401)", async () => {
    const { deps, recorded } = makeDeps();
    const res = await handleAdminSyncCrm(request({ token: "expired" }), deps);
    expect(res.status).toBe(401);
    expect(recorded.syncs).toBe(0);
  });

  it("rejects an authenticated non-administrator (403)", async () => {
    const { deps, recorded } = makeDeps({ isAdmin: async () => false });
    const res = await handleAdminSyncCrm(request({}), deps);
    expect(res.status).toBe(403);
    expect(recorded.syncs).toBe(0);
  });

  it("allows a valid administrator and records the audit outcome", async () => {
    const { deps, recorded } = makeDeps();
    const res = await handleAdminSyncCrm(request({}), deps);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ synced: 7 });
    expect(recorded.syncs).toBe(1);
    expect(recorded.audits[0]).toMatchObject({
      operatorId: ADMIN.id,
      action: "crm_sync",
      outcome: "success",
      synced: 7,
    });
  });

  it("rejects an unsupported method (405)", async () => {
    const { deps } = makeDeps();
    const res = await handleAdminSyncCrm(request({ method: "GET" }), deps);
    expect(res.status).toBe(405);
  });

  it("rejects an invalid body (400)", async () => {
    const { deps, recorded } = makeDeps();
    const res = await handleAdminSyncCrm(
      request({ body: JSON.stringify({ unexpected: true }) }),
      deps,
    );
    expect(res.status).toBe(400);
    expect(recorded.syncs).toBe(0);
  });

  it("rejects a disallowed origin without granting CORS", async () => {
    const { deps, recorded } = makeDeps();
    const res = await handleAdminSyncCrm(request({ origin: "https://attacker.test" }), deps);
    expect(res.status).toBe(403);
    expect(res.headers["Access-Control-Allow-Origin"]).toBeUndefined();
    expect(recorded.syncs).toBe(0);
  });

  it("returns 429 once the operator hourly limit is reached", async () => {
    const { deps, recorded } = makeDeps({
      recentSyncCount: async () => RATE_LIMIT_PER_HOUR,
    });
    const res = await handleAdminSyncCrm(request({}), deps);
    expect(res.status).toBe(429);
    expect(recorded.syncs).toBe(0);
  });

  it("suppresses a duplicate request inside the idempotency window", async () => {
    const { deps, recorded } = makeDeps({
      lastSuccessfulRun: async () => ({ at: "2026-08-25T16:59:30.000Z", synced: 7 }),
    });
    const res = await handleAdminSyncCrm(request({}), deps);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ replayed: true, synced: 7 });
    expect(recorded.syncs).toBe(0);
    expect(recorded.audits).toHaveLength(0);
  });

  it("returns a generic error and records the failure when the sync fails", async () => {
    const { deps, recorded } = makeDeps({
      runSync: async () => {
        throw new Error("permission denied for function sync_existing_leads_to_crm");
      },
    });
    const res = await handleAdminSyncCrm(request({}), deps);
    expect(res.status).toBe(500);
    expect(JSON.stringify(res.body)).not.toMatch(/permission denied|service_role|sync_existing/i);
    expect(recorded.audits[0]).toMatchObject({ outcome: "failure", synced: null });
  });

  it("keeps the service-role key out of the handler source", () => {
    const source = require("node:fs").readFileSync(
      "supabase/functions/admin-sync-crm/handler.ts",
      "utf8",
    );
    expect(source).not.toMatch(/SERVICE_ROLE/);
  });
});
