import { supabase } from "@/integrations/supabase/client";

/**
 * Staged administrator MFA.
 *
 * ADMIN_MFA_ENFORCED === false  -> enrolment and challenge are fully available,
 *   but an AAL1 administrator session keeps its current access. No session is
 *   invalidated and no data-layer policy depends on AAL2 yet.
 *
 * Flip to true ONLY together with the approved AAL2 policy/function migration.
 */
export const ADMIN_MFA_ENFORCED = false;

export type AdminMfaState = {
  /** A verified TOTP factor exists on the account. */
  hasVerifiedFactor: boolean;
  /** Current assurance level of the session. */
  currentLevel: "aal1" | "aal2" | null;
  /** Assurance level the account is expected to reach. */
  nextLevel: "aal1" | "aal2" | null;
  /** Session is AAL1 while a verified factor exists -> challenge required. */
  challengeRequired: boolean;
};

export const getAdminMfaState = async (): Promise<AdminMfaState> => {
  const [{ data: aal }, { data: factors }] = await Promise.all([
    supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
    supabase.auth.mfa.listFactors(),
  ]);

  const hasVerifiedFactor = (factors?.totp?.length ?? 0) > 0;
  const currentLevel = (aal?.currentLevel as AdminMfaState["currentLevel"]) ?? null;
  const nextLevel = (aal?.nextLevel as AdminMfaState["nextLevel"]) ?? null;

  return {
    hasVerifiedFactor,
    currentLevel,
    nextLevel,
    challengeRequired: hasVerifiedFactor && currentLevel === "aal1",
  };
};

/** Remove any factor left unverified by an abandoned enrolment. */
export const cleanUpUnverifiedFactors = async () => {
  const { data } = await supabase.auth.mfa.listFactors();
  const stale = (data?.all ?? []).filter((f) => f.status !== "verified");
  for (const factor of stale) {
    await supabase.auth.mfa.unenroll({ factorId: factor.id });
  }
};
