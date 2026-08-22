import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getAdminMfaState } from "@/lib/adminMfa";

const MAX_ATTEMPTS = 5;

const AdminVerifyMfa = () => {
  const [factorId, setFactorId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate("/admin/login", { replace: true });
        return;
      }
      const state = await getAdminMfaState();
      if (!state.hasVerifiedFactor) {
        navigate("/admin/security", { replace: true });
        return;
      }
      if (state.currentLevel === "aal2") {
        navigate("/admin", { replace: true });
        return;
      }
      const { data } = await supabase.auth.mfa.listFactors();
      setFactorId(data?.totp?.[0]?.id ?? null);
      setChecking(false);
    })();
  }, [navigate]);

  const submit = async () => {
    if (!factorId) return;
    setBusy(true);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;
      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: code.trim(),
      });
      if (error) throw error;
      toast({ title: "Verified", description: "This session is now at assurance level 2." });
      navigate("/admin", { replace: true });
    } catch (error: any) {
      const next = attempts + 1;
      setAttempts(next);
      setCode("");
      if (next >= MAX_ATTEMPTS) {
        await supabase.auth.signOut();
        toast({
          title: "Too many attempts",
          description: "The session has been ended. Sign in again.",
          variant: "destructive",
        });
        navigate("/admin/login", { replace: true });
        return;
      }
      toast({
        title: "Code rejected",
        description: error.message || `Invalid code. ${MAX_ATTEMPTS - next} attempt(s) remaining.`,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">Two-step verification</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the current 6-digit code from your authenticator.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            aria-label="Authenticator code"
            className="h-12 tracking-[0.3em]"
            disabled={busy}
          />
          <Button
            onClick={submit}
            variant="teal"
            size="lg"
            className="w-full"
            disabled={busy || code.trim().length < 6}
          >
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Verify
          </Button>
          <div className="text-center">
            <Link
              to="/admin/login"
              onClick={() => supabase.auth.signOut()}
              className="text-sm text-primary hover:underline"
            >
              Sign out
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVerifyMfa;
