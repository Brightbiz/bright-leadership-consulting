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
    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          // Check admin role
          const { data: hasAdminRole } = await supabase
            .rpc("has_role", { _user_id: session.user.id, _role: "admin" });
          setIsAdmin(!!hasAdminRole);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setIsLoading(false);
      }
    );

    // Check initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const { data: hasAdminRole } = await supabase
          .rpc("has_role", { _user_id: session.user.id, _role: "admin" });
        setIsAdmin(!!hasAdminRole);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    navigate("/admin/login");
  };

  return { user, isAdmin, isLoading, signOut };
};
