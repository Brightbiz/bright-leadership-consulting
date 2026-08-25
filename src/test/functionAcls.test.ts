import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

/**
 * ACL regression guard for the reviewed public SECURITY DEFINER functions.
 *
 * Non-destructive by construction: this suite reads the committed privilege
 * manifest and the hardening migration only. It never opens a database
 * connection, never uses a service-role key, and never executes
 * public.purge_expired_ai_audit_data(). The live database comparison lives in
 * scripts/verify-function-acls.mjs, which runs server-side in CI with
 * SUPABASE_DB_URL and skips when no credentials are present.
 */

type Manifest = {
  requiredOwner: string;
  requiredSearchPath: string;
  functions: {
    signature: string;
    execute: string[];
    securityDefiner: boolean;
    reason: string;
  }[];
};

const manifest: Manifest = JSON.parse(
  readFileSync("scripts/expected-function-acls.json", "utf8"),
);
const fn = (signature: string) => {
  const found = manifest.functions.find((f) => f.signature === signature);
  expect(found, `${signature} missing from the ACL manifest`).toBeTruthy();
  return found!;
};

const PURGE = "purge_expired_ai_audit_data()";
const MIGRATION =
  "supabase/migrations/20260825123453_68af6a61-4ed6-4636-afec-9202f4608160.sql";

describe("purge_expired_ai_audit_data ACL", () => {
  const purge = fn(PURGE);

  it("is not executable by PUBLIC, anon or authenticated", () => {
    expect(purge.execute).not.toContain("PUBLIC");
    expect(purge.execute).not.toContain("public");
    expect(purge.execute).not.toContain("anon");
    expect(purge.execute).not.toContain("authenticated");
  });

  it("remains executable by service_role only", () => {
    expect(purge.execute).toEqual(["service_role"]);
  });

  it("remains SECURITY DEFINER, postgres-owned, with a fixed search_path", () => {
    expect(purge.securityDefiner).toBe(true);
    expect(manifest.requiredOwner).toBe("postgres");
    expect(manifest.requiredSearchPath).toBe("search_path=public");
  });

  it("is pinned by a reversible revoke migration", () => {
    const sql = readFileSync(MIGRATION, "utf8");
    for (const role of ["authenticated", "anon", "PUBLIC"]) {
      expect(sql).toMatch(
        new RegExp(
          `REVOKE EXECUTE ON FUNCTION public\\.purge_expired_ai_audit_data\\(\\) FROM ${role}`,
        ),
      );
    }
    expect(sql).toContain(
      "GRANT EXECUTE ON FUNCTION public.purge_expired_ai_audit_data() TO service_role",
    );
    expect(sql).toMatch(/Reversible:/);
  });
});

describe("other reviewed SECURITY DEFINER functions", () => {
  const EXPECTED: Record<string, string[]> = {
    "has_role(uuid,app_role)": ["authenticated", "service_role"],
    "admin_audit_subject_request(text,text)": ["authenticated", "service_role"],
    "retry_ai_audit_crm_mirror(uuid)": ["authenticated", "service_role"],
    "record_ai_audit_submission(text,text,text,text,text,integer,text,text,jsonb,boolean,text,text,text,integer,text)":
      ["service_role"],
    "cleanup_old_rate_limits()": ["service_role"],
    "sync_existing_leads_to_crm()": ["service_role"],
  };

  it("covers exactly the seven reviewed functions", () => {
    expect(manifest.functions.map((f) => f.signature).sort()).toEqual(
      [PURGE, ...Object.keys(EXPECTED)].sort(),
    );
  });

  it.each(Object.entries(EXPECTED))(
    "keeps the approved grants for %s",
    (signature, roles) => {
      const target = fn(signature);
      expect(target.execute).toEqual(roles);
      expect(target.securityDefiner).toBe(true);
      expect(target.execute).not.toContain("anon");
      expect(target.execute).not.toContain("PUBLIC");
    },
  );
});

describe("credential hygiene", () => {
  it("keeps the manifest and this suite free of service-role material", () => {
    const files = [
      "scripts/expected-function-acls.json",
      "scripts/verify-function-acls.mjs",
      "src/test/functionAcls.test.ts",
    ];
    for (const file of files) {
      const src = readFileSync(file, "utf8");
      expect(src).not.toMatch(/SUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*["'][^"']+["']/);
      expect(src).not.toMatch(/eyJ[A-Za-z0-9_-]{20,}\./);
    }
  });

  it("never invokes the purge function from test or frontend code", () => {
    const src = readFileSync("src/test/functionAcls.test.ts", "utf8");
    expect(src).not.toMatch(/rpc\(\s*["']purge_expired_ai_audit_data["']/);
  });
});
