#!/usr/bin/env node
/**
 * Live ACL regression check for public SECURITY DEFINER functions.
 *
 * Non-destructive: it only reads pg_proc. It never executes any of the
 * functions, in particular never public.purge_expired_ai_audit_data().
 *
 * Credentials are never bundled or exposed to frontend/browser code: the
 * connection string is read from the server-side environment only
 * (SUPABASE_DB_URL / DATABASE_URL). Without it the check skips with exit 0 so
 * local and browser test runs never need database credentials.
 *
 * Usage: SUPABASE_DB_URL=... node scripts/verify-function-acls.mjs
 */
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const expected = JSON.parse(
  readFileSync(resolve(ROOT, "scripts/expected-function-acls.json"), "utf8"),
);

const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
if (!dbUrl) {
  console.log(
    "• verify-function-acls: no SUPABASE_DB_URL/DATABASE_URL present — live ACL check skipped.",
  );
  process.exit(0);
}

const SQL = `
select p.oid::regprocedure::text as sig,
       pg_get_userbyid(p.proowner) as owner,
       p.prosecdef as definer,
       coalesce(array_to_string(p.proconfig, ','), '') as config,
       coalesce((
         select string_agg(a.grantee::regrole::text, ',' order by a.grantee::regrole::text)
         from aclexplode(p.proacl) a
         where a.privilege_type = 'EXECUTE'
       ), '') as grantees
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.prosecdef
order by 1;
`;

const raw = execFileSync("psql", [dbUrl, "-Atc", SQL], { encoding: "utf8" });
const live = new Map();
for (const line of raw.trim().split("\n").filter(Boolean)) {
  const [sig, owner, definer, config, grantees] = line.split("|");
  live.set(sig.replace(/^public\./, ""), {
    owner,
    definer: definer === "t",
    config,
    grantees: grantees ? grantees.split(",") : [],
  });
}

/** Roles that must never hold EXECUTE on a reviewed definer function. */
const NEVER = ["-", "public", "anon"];
const failures = [];

for (const fn of expected.functions) {
  const actual = live.get(fn.signature);
  if (!actual) {
    failures.push(`${fn.signature} — not found in the public schema.`);
    continue;
  }
  if (actual.owner !== expected.requiredOwner) {
    failures.push(`${fn.signature} — owner is ${actual.owner}, expected ${expected.requiredOwner}.`);
  }
  if (actual.definer !== fn.securityDefiner) {
    failures.push(`${fn.signature} — SECURITY DEFINER flag changed.`);
  }
  if (!actual.config.split(",").includes(expected.requiredSearchPath)) {
    failures.push(`${fn.signature} — search_path is not fixed to public (${actual.config || "unset"}).`);
  }
  for (const role of NEVER) {
    if (actual.grantees.includes(role)) {
      failures.push(`${fn.signature} — EXECUTE granted to ${role === "-" ? "PUBLIC" : role}.`);
    }
  }
  for (const role of ["anon", "authenticated", "service_role"]) {
    const allowed = fn.execute.includes(role);
    const held = actual.grantees.includes(role);
    if (allowed && !held) failures.push(`${fn.signature} — expected EXECUTE for ${role} is missing.`);
    if (!allowed && held) failures.push(`${fn.signature} — unexpected EXECUTE granted to ${role}.`);
  }
}

if (failures.length) {
  console.error(
    `\n✖ Function ACL verification failed: ${failures.length} issue(s).\n` +
      failures.map((f) => `  • ${f}`).join("\n") +
      "\n",
  );
  process.exit(1);
}

console.log(
  `✔ Function ACL verification passed for ${expected.functions.length} SECURITY DEFINER functions.`,
);
