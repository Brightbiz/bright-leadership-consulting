import { useCallback, useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  isDuplicateEnrolment, isValidParticipantEmail, normaliseParticipantEmail, LP_SUPPORT_EMAIL,
} from "@/lib/participants";

interface Participant {
  id: string; email: string; full_name: string; organisation: string | null;
  thinkific_user_id: string | null; thinkific_account_status: string;
}
interface Enrolment {
  id: string; participant_id: string; cohort_code: string;
  enrolment_status: string; invitation_status: string;
}

const ACCOUNT_LABELS: Record<string, string> = {
  not_checked: "Not checked", existing_account: "Existing Thinkific account",
  new_account_needed: "New account needed", account_created: "Account created",
};
const INVITE_LABELS: Record<string, string> = { not_sent: "Not sent", sent: "Sent", accepted: "Accepted (recorded manually)" };

const AdminParticipants = () => {
  const { user, isAdmin, isLoading } = useAdminAuth();
  const { toast } = useToast();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [form, setForm] = useState({ email: "", full_name: "", organisation: "", cohort_code: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [p, e] = await Promise.all([
      supabase.from("lp_participants").select("*").order("created_at", { ascending: false }),
      supabase.from("lp_enrolments").select("*").order("created_at", { ascending: false }),
    ]);
    if (p.error || e.error) {
      toast({ title: "Could not load participants", variant: "destructive" });
      return;
    }
    setParticipants(p.data as Participant[]);
    setEnrolments(e.data as Enrolment[]);
  }, [toast]);

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  if (isLoading) return null;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  const addParticipant = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const email = normaliseParticipantEmail(form.email);
    const cohort = form.cohort_code.trim();
    if (!isValidParticipantEmail(email) || !form.full_name.trim() || !cohort) {
      toast({ title: "Email, name and cohort are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    // Reuse the existing record for this email address rather than creating a second one.
    let participant = participants.find((p) => p.email === email);
    if (!participant) {
      const { data, error } = await supabase.from("lp_participants")
        .insert({ email, full_name: form.full_name.trim(), organisation: form.organisation.trim() || null })
        .select().single();
      if (error) { setSaving(false); toast({ title: "Could not save participant", description: error.message, variant: "destructive" }); return; }
      participant = data as Participant;
    }
    if (isDuplicateEnrolment(enrolments, participant.id, cohort)) {
      setSaving(false);
      toast({ title: "Already added to this cohort", description: `${email} is already on the list for ${cohort}.`, variant: "destructive" });
      await load();
      return;
    }
    const { error } = await supabase.from("lp_enrolments").insert({ participant_id: participant.id, cohort_code: cohort });
    setSaving(false);
    if (error) {
      toast({ title: error.code === "23505" ? "Already added to this cohort" : "Could not add enrolment", variant: "destructive" });
    } else {
      toast({ title: "Participant added", description: "No email has been sent." });
      setForm({ email: "", full_name: "", organisation: "", cohort_code: cohort });
    }
    await load();
  };

  const updateParticipant = async (id: string, patch: Partial<Participant>) => {
    const { error } = await supabase.from("lp_participants").update(patch).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.code === "23505" ? "That Thinkific account is linked to another participant." : error.message, variant: "destructive" });
    load();
  };
  const updateEnrolment = async (id: string, patch: Partial<Enrolment> & { invitation_sent_at?: string | null }) => {
    const { error } = await supabase.from("lp_enrolments").update(patch).eq("id", id);
    if (error) toast({ title: "Update failed", variant: "destructive" });
    load();
  };

  const byId = new Map(participants.map((p) => [p.id, p]));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-28 space-y-8">
        <div>
          <Link to="/admin/crm" className="text-sm text-muted-foreground underline">Back to CRM</Link>
          <h1 className="font-serif text-3xl mt-2">Leading People participants</h1>
          <p className="text-sm text-muted-foreground mt-2">
            One record per email address. Statuses are recorded here only — nothing on this page sends email or changes Thinkific.
            Joining invitations are a separate action from {LP_SUPPORT_EMAIL}. "Enrolled" and "Accepted" are recorded manually by an admin and are not verified Thinkific activity; adding someone here does not enrol them in Thinkific.
          </p>
        </div>

        <form onSubmit={addParticipant} className="grid gap-3 md:grid-cols-5 items-end border border-border p-4">
          <Input aria-label="Email" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input aria-label="Full name" placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <Input aria-label="Organisation" placeholder="Organisation" value={form.organisation} onChange={(e) => setForm({ ...form, organisation: e.target.value })} />
          <Input aria-label="Cohort" placeholder="Cohort (e.g. LP-2027-01)" value={form.cohort_code} onChange={(e) => setForm({ ...form, cohort_code: e.target.value })} />
          <Button type="submit" disabled={saving}>Add to cohort</Button>
        </form>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead><TableHead>Cohort</TableHead>
                <TableHead>Thinkific account</TableHead><TableHead>Thinkific user ID</TableHead>
                <TableHead>Enrolment (manual record)</TableHead><TableHead>Invitation (manual record)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrolments.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-muted-foreground">No participants yet.</TableCell></TableRow>
              )}
              {enrolments.map((en) => {
                const p = byId.get(en.participant_id);
                if (!p) return null;
                return (
                  <TableRow key={en.id}>
                    <TableCell><div className="font-medium">{p.full_name}</div><div className="text-xs text-muted-foreground">{p.email}{p.organisation ? ` · ${p.organisation}` : ""}</div></TableCell>
                    <TableCell><Badge variant="outline">{en.cohort_code}</Badge></TableCell>
                    <TableCell>
                      <Select value={p.thinkific_account_status} onValueChange={(v) => updateParticipant(p.id, { thinkific_account_status: v })}>
                        <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
                        <SelectContent>{Object.entries(ACCOUNT_LABELS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input aria-label="Thinkific user ID" className="w-36" defaultValue={p.thinkific_user_id ?? ""}
                        onBlur={(e) => { const v = e.target.value.trim() || null; if (v !== p.thinkific_user_id) updateParticipant(p.id, { thinkific_user_id: v }); }} />
                    </TableCell>
                    <TableCell>
                      <Select value={en.enrolment_status} onValueChange={(v) => updateEnrolment(en.id, { enrolment_status: v })}>
                        <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="enrolled">Enrolled (recorded manually)</SelectItem><SelectItem value="withdrawn">Withdrawn</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={en.invitation_status} onValueChange={(v) => updateEnrolment(en.id, { invitation_status: v, invitation_sent_at: v === "not_sent" ? null : new Date().toISOString() })}>
                        <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                        <SelectContent>{Object.entries(INVITE_LABELS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminParticipants;
