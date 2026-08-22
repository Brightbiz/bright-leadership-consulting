import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { ADMIN_MFA_ENFORCED, getAdminMfaState } from "@/lib/adminMfa";

interface UseAdminAuthReturn {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  /** True when a verified TOTP factor exists but this session is still AAL1. */
  mfaChallengeRequired: boolean;
  signOut: () => Promise<void>;
}

export const useAdminAuth = (): UseAdminAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaChallengeRequired, setMfaChallengeRequired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    let active = true;

    const evaluate = async (userId: string) => {
      const { data: hasAdminRole } = await supabase
        .rpc("has_role", { _user_id: userId, _role: "admin" });
      if (!active) return;
      setIsAdmin(!!hasAdminRole);

      if (hasAdminRole) {
        const state = await getAdminMfaState();
        if (!active) return;
        setMfaChallengeRequired(state.challengeRequired);
        // Staged: only redirect to the challenge once enforcement is approved.
        if (
          ADMIN_MFA_ENFORCED &&
          state.challengeRequired &&
          !location.pathname.startsWith("/admin/verify")
        ) {
          navigate("/admin/verify", { replace: true });
        }
      } else {
        setMfaChallengeRequired(false);
      }
    };

    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          void evaluate(session.user.id).finally(() => active && setIsLoading(false));
        } else {
          setUser(null);
          setIsAdmin(false);
          setMfaChallengeRequired(false);
          setIsLoading(false);
        }
      }
    );

    // Check initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        await evaluate(session.user.id);
      }
      if (active) setIsLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setMfaChallengeRequired(false);
    navigate("/admin/login");
  };

  return { user, isAdmin, isLoading, mfaChallengeRequired, signOut };

};
