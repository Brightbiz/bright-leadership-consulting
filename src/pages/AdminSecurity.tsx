import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, ShieldCheck, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ADMIN_MFA_ENFORCED,
  cleanUpUnverifiedFactors,
} from "@/lib/adminMfa";

type Factor = { id: string; friendly_name?: string | null; created_at?: string; status: string };

type Enrolment = { factorId: string; qrSvg: string; secret: string; uri: string };

const AdminSecurity = () => {
  const { user, isAdmin, isLoading } = useAdminAuth();
  const { toast } = useToast();
  const [factors, setFactors] = useState<Factor[]>([]);
  const [loadingFactors, setLoadingFactors] = useState(true);
  const [enrolment, setEnrolment] = useState<Enrolment | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [unenrollCode, setUnenrollCode] = useState("");
  const [unenrollTarget, setUnenrollTarget] = useState<string | null>(null);

  const refresh = async () => {
    setLoadingFactors(true);
    const { data } = await supabase.auth.mfa.listFactors();
    setFactors(((data?.all ?? []) as Factor[]).filter((f) => f.status === "verified"));
    setLoadingFactors(false);
  };

  useEffect(() => {
    if (user && isAdmin) refresh();
  }, [user, isAdmin]);

  const startEnrolment = async () => {
    setBusy(true);
    try {
      await cleanUpUnverifiedFactors();
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: `Authenticator ${new Date().toISOString().slice(0, 10)}`,
      });
      if (error) throw error;
      setEnrolment({
        factorId: data.id,
        qrSvg: data.totp.qr_code,
        secret: data.totp.secret,
        uri: data.totp.uri,
      });
      setCode("");
    } catch (error: any) {
      toast({ title: "Could not start enrolment", description: error.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const cancelEnrolment = async () => {
    setBusy(true);
    try {
      if (enrolment) await supabase.auth.mfa.unenroll({ factorId: enrolment.factorId });
      setEnrolment(null);
      setCode("");
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const verifyEnrolment = async () => {
    if (!enrolment) return;
    setBusy(true);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: enrolment.factorId,
      });
      if (challengeError) throw challengeError;
      const { error } = await supabase.auth.mfa.verify({
        factorId: enrolment.factorId,
        challengeId: challenge.id,
        code: code.trim(),
      });
      if (error) throw error;
      toast({ title: "Authenticator verified", description: "The factor is now active on this account." });
      setEnrolment(null);
      setCode("");
      await refresh();
    } catch (error: any) {
      toast({
        title: "Code rejected",
        description: error.message || "That code is not valid. The factor remains unverified.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const confirmUnenroll = async () => {
    if (!unenrollTarget) return;
    setBusy(true);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: unenrollTarget,
      });
      if (challengeError) throw challengeError;
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: unenrollTarget,
        challengeId: challenge.id,
        code: unenrollCode.trim(),
      });
      if (verifyError) throw verifyError;
      const { error } = await supabase.auth.mfa.unenroll({ factorId: unenrollTarget });
      if (error) throw error;
      toast({ title: "Authenticator removed" });
      setUnenrollTarget(null);
      setUnenrollCode("");
      await refresh();
    } catch (error: any) {
      toast({
        title: "Removal blocked",
        description: error.message || "A valid current code is required to remove a factor.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md space-y-4 text-center">
          <p className="text-muted-foreground">Administrator sign-in is required.</p>
          <Link to="/admin/login">
            <Button variant="outline">Go to administrator login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <Link to="/admin">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to administration
          </Button>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="mb-6 flex items-start gap-3">
            {factors.length > 0 ? (
              <ShieldCheck className="mt-1 h-5 w-5 text-primary" />
            ) : (
              <ShieldAlert className="mt-1 h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <h1 className="font-serif text-2xl font-semibold text-foreground">
                Administrator authentication
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Time-based one-time password (TOTP) factors for {user.email}.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Enforcement status:{" "}
                <span className="font-medium">
                  {ADMIN_MFA_ENFORCED ? "enforced on protected routes" : "staged — not enforced"}
                </span>
                . Enrolment does not sign you out and does not change existing access.
              </p>
            </div>
          </div>

          <section className="space-y-3 border-t border-border pt-6">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Verified authenticators
            </h2>
            {loadingFactors ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : factors.length === 0 ? (
              <p className="text-sm text-muted-foreground">None enrolled.</p>
            ) : (
              <ul className="space-y-2">
                {factors.map((f) => (
                  <li
                    key={f.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"
                  >
                    <div className="text-sm">
                      <p className="font-medium text-foreground">{f.friendly_name || "Authenticator"}</p>
                      <p className="text-xs text-muted-foreground">
                        Added {f.created_at ? new Date(f.created_at).toLocaleDateString("en-GB") : "—"}
                      </p>
                    </div>
                    {unenrollTarget === f.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={unenrollCode}
                          onChange={(e) => setUnenrollCode(e.target.value)}
                          placeholder="Current code"
                          inputMode="numeric"
                          className="h-9 w-32"
                          aria-label="Current authenticator code"
                        />
                        <Button size="sm" onClick={confirmUnenroll} disabled={busy}>
                          Confirm
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setUnenrollTarget(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setUnenrollTarget(f.id)}>
                        Remove
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-8 space-y-4 border-t border-border pt-6">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Add an authenticator
            </h2>

            {!enrolment ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Enrol the authenticator on two devices, or store the secret in your password manager, so
                  that losing one device does not lock the account.
                </p>
                <Button onClick={startEnrolment} disabled={busy} variant="teal">
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Add authenticator
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className="mx-auto w-40 [&>svg]:h-full [&>svg]:w-full"
                  aria-label="Authenticator QR code"
                  dangerouslySetInnerHTML={{ __html: enrolment.qrSvg }}
                />
                <div className="rounded-lg border border-border bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Manual setup key</p>
                  <p className="break-all font-mono text-sm text-foreground">{enrolment.secret}</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="totp" className="text-sm font-medium text-foreground">
                    Enter the current 6-digit code
                  </label>
                  <Input
                    id="totp"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="000000"
                    className="h-12 max-w-[10rem] tracking-[0.3em]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={verifyEnrolment} disabled={busy || code.trim().length < 6} variant="teal">
                    {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Verify and activate
                  </Button>
                  <Button onClick={cancelEnrolment} variant="ghost" disabled={busy}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminSecurity;
