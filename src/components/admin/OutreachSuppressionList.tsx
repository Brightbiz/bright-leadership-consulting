import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Trash2, ShieldOff } from "lucide-react";

interface Suppression {
  id: string;
  email: string;
  reason: string | null;
  created_at: string;
}

// Addresses on this list are never emailed by any outreach send.
const OutreachSuppressionList = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<Suppression[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await (supabase as any)
      .from("outreach_suppressions")
      .select("id, email, reason, created_at")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Could not load suppression list", variant: "destructive" });
    setRows(data ?? []);
    setLoading(false);
  }, [toast]);

  useEffect(() => { void load(); }, [load]);

  const add = async () => {
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      toast({ title: "Enter a valid email address", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await (supabase as any)
      .from("outreach_suppressions")
      .insert({ email: clean, reason: reason.trim() || null, added_by: user?.id ?? null });
    setSaving(false);
    if (error) {
      toast({
        title: error.code === "23505" ? "Already on the suppression list" : "Could not add address",
        variant: "destructive",
      });
      return;
    }
    setEmail("");
    setReason("");
    toast({ title: "Added — this address will not be emailed" });
    void load();
  };

  const remove = async (row: Suppression) => {
    if (!window.confirm(`Only remove ${row.email} if they have since asked to hear from Bright again. Opt-outs are permanent, even if the address appears in a future Apollo export. Remove?`)) return;
    const { error } = await (supabase as any).from("outreach_suppressions").delete().eq("id", row.id);
    if (error) toast({ title: "Could not remove address", variant: "destructive" });
    void load();
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <ShieldOff className="h-4 w-4 text-muted-foreground" />
        <h2 className="font-serif text-xl text-foreground">Suppression list</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
        People who have asked not to be contacted. Any address here is skipped by every outreach send, including scheduled ones.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Input placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="sm:max-w-xs" />
        <Input placeholder="Reason (optional, e.g. replied asking not to be contacted)" value={reason} onChange={(e) => setReason(e.target.value)} />
        <Button onClick={add} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
        </Button>
      </div>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No addresses suppressed.</p>
      ) : (
        <ul className="divide-y divide-border border border-border">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <div className="min-w-0">
                <span className="text-foreground">{r.email}</span>
                {r.reason && <span className="text-muted-foreground"> — {r.reason}</span>}
                <span className="block text-xs text-muted-foreground">
                  Added {new Date(r.created_at).toLocaleDateString("en-GB")}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => remove(r)} aria-label={`Remove ${r.email}`}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default OutreachSuppressionList;
