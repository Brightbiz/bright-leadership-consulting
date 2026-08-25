import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  AUDIT_ACTION,
  handleAdminSyncCrm,
  RATE_LIMIT_KEY,
  RATE_LIMIT_PER_HOUR,
  type Deps,
} from "./handler.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
/** Server-side only. Never returned, logged or sent to a browser. */
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  const service = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const deps: Deps = {
    getUser: async (token) => {
      const scoped = createClient(SUPABASE_URL, ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
      const { data, error } = await scoped.auth.getUser();
      if (error || !data.user) return null;
      return { id: data.user.id, email: data.user.email ?? null };
    },
    isAdmin: async (token, userId) => {
      // Role confirmation uses the caller's own session, never service-role
      // impersonation and never client-supplied role information.
      const scoped = createClient(SUPABASE_URL, ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
      const { data, error } = await scoped.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      if (error) return false;
      return data === true;
    },
    recentSyncCount: async (userId) => {
      const windowStart = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count } = await service
        .from("rate_limits")
        .select("*", { count: "exact", head: true })
        .eq("form_type", RATE_LIMIT_KEY)
        .eq("ip_address", `${RATE_LIMIT_KEY}:${userId}`)
        .gte("created_at", windowStart);
      return count ?? 0;
    },
    recordAttempt: async (userId) => {
      await service.from("rate_limits").insert({
        form_type: RATE_LIMIT_KEY,
        ip_address: `${RATE_LIMIT_KEY}:${userId}`,
      });
    },
    lastSuccessfulRun: async (userId) => {
      const { data } = await service
        .from("admin_action_log")
        .select("created_at, details")
        .eq("action", AUDIT_ACTION)
        .eq("outcome", "success")
        .eq("operator_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!data) return null;
      const synced = Number((data.details as { synced?: number } | null)?.synced ?? 0);
      return { at: data.created_at as string, synced };
    },
    writeAudit: async (entry) => {
      await service.from("admin_action_log").insert({
        operator_id: entry.operatorId,
        operator_email: entry.operatorEmail,
        action: entry.action,
        outcome: entry.outcome,
        details: { synced: entry.synced, at: entry.at, limit_per_hour: RATE_LIMIT_PER_HOUR },
      });
    },
    runSync: async () => {
      const { data, error } = await service.rpc("sync_existing_leads_to_crm");
      if (error) throw new Error(error.message);
      return Number(data ?? 0);
    },
    now: () => Date.now(),
    logError: (context, detail) => {
      // Protected server log only; never surfaced in a response body.
      console.error(`admin-sync-crm ${context} failure`, detail instanceof Error ? detail.message : detail);
    },
  };

  const result = await handleAdminSyncCrm(req, deps);
  return new Response(result.body === null ? null : JSON.stringify(result.body), {
    status: result.status,
    headers: result.headers,
  });
});
