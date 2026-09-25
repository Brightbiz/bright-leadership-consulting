import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { format, addDays } from "date-fns";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import EmployerOfferInvoice, { buildEmployerOfferInvoiceText } from "@/components/EmployerOfferInvoice";
import {
  EMPLOYER_OFFER_DEFAULT_EXPIRY_DAYS,
  EMPLOYER_OFFER_FEE_GBP,
  EMPLOYER_OFFER_STATUS_LABELS,
  EMPLOYER_OFFER_TERMS_APPROVED,
  EMPLOYER_OFFER_TERMS_VERSION,
} from "@/data/employerOffer";
import {
  BRIGHT_ADMIN_EMAIL,
  EMPLOYER_OFFER_INVOICE_PAYMENT_INSTRUCTIONS,
  EMPLOYER_OFFER_PAYMENT_DUE_DAYS,
  LEGAL_CONTRACTING_IDENTITY,
  LEGAL_SUPPLIER_ADDRESS,
} from "@/data/legal";

type OfferRow = {
  id: string; token: string; contact_submission_id: string | null;
  employer_organisation: string; signatory_name: string; signatory_email: string;
  participant_name: string; participant_role: string | null; participant_email: string | null;
  fee_gbp: number; terms_version: string; status: string; expires_at: string; issued_at: string;
  issued_by_email: string | null; first_opened_at: string | null; last_opened_at: string | null; open_count: number;
  accepted_at: string | null; accepted_name: string | null; accepted_role: string | null; accepted_email: string | null;
  po_number: string | null; invoice_contact: string | null; non_standard_request: string | null; referred_at: string | null;
  paid_at: string | null; withdrawn_at: string | null; superseded_by: string | null;
  accepted_at_uk: string | null; paid_marked_by: string | null; paid_marked_by_email: string | null; paid_marked_at_uk: string | null;
  invoice_number: string | null; invoice_date: string | null; payment_due_date: string | null; invoice_description: string | null;
  invoice_net_amount_gbp: number | null; invoice_vat_amount_gbp: number | null; invoice_total_gbp: number | null;
  invoice_payment_instructions: string | null; invoice_contact_email: string | null; supplier_contracting_identity: string | null; supplier_address: string | null;
};

const db = supabase as any;
const SITE = "https://brightleadershipconsulting.com";
const offerUrl = (t: string) => `${SITE}/offer/${t}`;
const offerReference = (o: OfferRow) => `ELM-${o.id.slice(0, 8).toUpperCase()}`;
const effective = (o: OfferRow) =>
  o.status === "issued" && new Date(o.expires_at) < new Date() ? "expired" : o.status;
const dt = (v: string | null) => (v ? format(new Date(v), "d MMM yyyy, HH:mm") : "—");
const formatUkDateTime = (value: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
    timeZoneName: "short",
  }).format(value);

const empty = { employer_organisation: "", signatory_name: "", signatory_email: "", participant_name: "", participant_role: "", participant_email: "", expiry_days: String(EMPLOYER_OFFER_DEFAULT_EXPIRY_DAYS) };

const AdminEmployerOffers = () => {
  const { user, isAdmin, isLoading } = useAdminAuth();
  const { toast } = useToast();
  const [params] = useSearchParams();
  const submissionId = params.get("submission");
  const [rows, setRows] = useState<OfferRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await db.from("employer_offers").select("*").order("issued_at", { ascending: false });
    if (error) toast({ title: "Could not load offers", variant: "destructive" });
    setRows(data ?? []);
    setLoading(false);
  }, [toast]);

  useEffect(() => { if (isAdmin) void load(); }, [isAdmin, load]);

  // Prefill from the originating enquiry.
  useEffect(() => {
    if (!isAdmin || !submissionId) return;
    db.from("contact_submissions").select("name,email,company").eq("id", submissionId).maybeSingle()
      .then(({ data }: { data: { name: string; email: string; company: string | null } | null }) => {
        if (data) setForm((f) => ({ ...f, signatory_name: data.name, signatory_email: data.email, employer_organisation: data.company ?? "" }));
      });
  }, [isAdmin, submissionId]);

  if (isLoading) return <div className="min-h-screen grid place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const insertOffer = async (values: Partial<OfferRow> & { contact_submission_id: string | null }, days: number) => {
    const { data, error } = await db.from("employer_offers").insert({
      ...values,
      fee_gbp: EMPLOYER_OFFER_FEE_GBP,
      payment_method: "invoice",
      terms_version: EMPLOYER_OFFER_TERMS_VERSION,
      payment_due_days: EMPLOYER_OFFER_PAYMENT_DUE_DAYS,
      supplier_contracting_identity: LEGAL_CONTRACTING_IDENTITY,
      supplier_address: LEGAL_SUPPLIER_ADDRESS,
      supplier_vat_registered: false,
      invoice_is_vat_invoice: false,
      invoice_net_amount_gbp: EMPLOYER_OFFER_FEE_GBP,
      invoice_vat_amount_gbp: 0,
      invoice_total_gbp: EMPLOYER_OFFER_FEE_GBP,
      invoice_payment_instructions: EMPLOYER_OFFER_INVOICE_PAYMENT_INSTRUCTIONS,
      invoice_contact_email: BRIGHT_ADMIN_EMAIL,
      expires_at: addDays(new Date(), days).toISOString(),
      issued_by: user.id,
      issued_by_email: user.email,
    }).select().single();
    if (error) throw error;
    return data as OfferRow;
  };

  const issue = async (e: React.FormEvent) => {
    e.preventDefault();
    const days = Math.min(60, Math.max(1, parseInt(form.expiry_days) || EMPLOYER_OFFER_DEFAULT_EXPIRY_DAYS));
    setBusy(true);
    try {
      const o = await insertOffer({
        contact_submission_id: submissionId,
        employer_organisation: form.employer_organisation.trim(),
        signatory_name: form.signatory_name.trim(),
        signatory_email: form.signatory_email.trim().toLowerCase(),
        participant_name: form.participant_name.trim(),
        participant_role: form.participant_role.trim() || null,
        participant_email: form.participant_email.trim().toLowerCase() || null,
      }, days);
      await navigator.clipboard?.writeText(offerUrl(o.token)).catch(() => {});
      toast({ title: "Offer issued", description: "Private link copied." });
      setForm(empty);
      void load();
    } catch {
      toast({ title: "Offer could not be issued", variant: "destructive" });
    }
    setBusy(false);
  };

  const withdraw = async (o: OfferRow) => {
    if (!confirm("Withdraw this offer? The link will stop working.")) return;
    await db.from("employer_offers").update({ status: "withdrawn", withdrawn_at: new Date().toISOString() }).eq("id", o.id);
    void load();
  };

  const reissue = async (o: OfferRow) => {
    if (!EMPLOYER_OFFER_TERMS_APPROVED) return;
    try {
      const n = await insertOffer({
        contact_submission_id: o.contact_submission_id,
        employer_organisation: o.employer_organisation, signatory_name: o.signatory_name, signatory_email: o.signatory_email,
        participant_name: o.participant_name, participant_role: o.participant_role, participant_email: o.participant_email,
      }, EMPLOYER_OFFER_DEFAULT_EXPIRY_DAYS);
      await db.from("employer_offers").update({ status: "superseded", superseded_by: n.id }).eq("id", o.id);
      await navigator.clipboard?.writeText(offerUrl(n.token)).catch(() => {});
      toast({ title: "Offer reissued", description: "New private link copied. The previous link no longer works." });
      void load();
    } catch {
      toast({ title: "Offer could not be reissued", variant: "destructive" });
    }
  };

  const markPaid = async (o: OfferRow) => {
    if (!confirm("Mark this offer as paid?")) return;
    const now = new Date();
    await db.from("employer_offers").update({
      status: "paid",
      paid_at: now.toISOString(),
      paid_marked_by: user.id,
      paid_marked_by_email: user.email,
      paid_marked_at_uk: formatUkDateTime(now),
    }).eq("id", o.id);
    void load();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-24 container-brief">
        <Link to="/admin" className="link-quiet text-sm mb-6 inline-flex"><ArrowLeft className="h-3.5 w-3.5" /> Enquiries</Link>
        <h1 className="heading-section mb-2">Employer-funded ELM offers</h1>
        <p className="text-sm text-muted-foreground mb-10">Private offer links for one named participant. Terms version {EMPLOYER_OFFER_TERMS_VERSION}.</p>

        <section className="border border-border rounded-sm p-6 mb-12 max-w-[760px]">
          <h2 className="font-serif text-lg mb-4">Issue a new offer</h2>
          {!EMPLOYER_OFFER_TERMS_APPROVED && (
            <p className="text-sm border-l-2 border-destructive pl-4 mb-4 text-foreground">
              Issuing is disabled until the standard employer offer terms have been approved by Bright Leadership Consulting.
            </p>
          )}
          {submissionId && <p className="text-xs text-muted-foreground mb-4">Linked to enquiry {submissionId}</p>}
          <form onSubmit={issue} className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm space-y-1">Employer organisation<Input required value={form.employer_organisation} onChange={set("employer_organisation")} /></label>
            <label className="text-sm space-y-1">Offer valid for (days)<Input type="number" min={1} max={60} value={form.expiry_days} onChange={set("expiry_days")} /></label>
            <label className="text-sm space-y-1">Employer contact name<Input required value={form.signatory_name} onChange={set("signatory_name")} /></label>
            <label className="text-sm space-y-1">Employer contact email<Input required type="email" value={form.signatory_email} onChange={set("signatory_email")} /></label>
            <label className="text-sm space-y-1">Named participant<Input required value={form.participant_name} onChange={set("participant_name")} /></label>
            <label className="text-sm space-y-1">Participant role<Input value={form.participant_role} onChange={set("participant_role")} /></label>
            <label className="text-sm space-y-1 sm:col-span-2">Participant email<Input type="email" value={form.participant_email} onChange={set("participant_email")} /></label>
            <div className="sm:col-span-2 text-sm text-muted-foreground">Fee £{EMPLOYER_OFFER_FEE_GBP.toLocaleString("en-GB")} · payment by invoice · standard terms only</div>
            <Button type="submit" disabled={busy || !EMPLOYER_OFFER_TERMS_APPROVED} className="sm:col-span-2 w-fit">Issue offer and copy link</Button>
          </form>
        </section>

        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No offers issued yet.</p>
        ) : (
          <div className="space-y-4">
            {rows.map((o) => {
              const s = effective(o);
              return (
                <div key={o.id} className="border border-border rounded-sm p-5 text-sm">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="font-medium text-foreground">{o.employer_organisation}</span>
                    <span className="text-muted-foreground">for {o.participant_name}</span>
                    <Badge variant="outline">{EMPLOYER_OFFER_STATUS_LABELS[s] ?? s}</Badge>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2 text-muted-foreground">
                    <div>Issued: {dt(o.issued_at)}{o.issued_by_email ? ` by ${o.issued_by_email}` : ""}</div>
                    <div>Expires: {dt(o.expires_at)}</div>
                    <div>Opened: {o.open_count}× (first {dt(o.first_opened_at)})</div>
                    <div>Accepted: {dt(o.accepted_at)}{o.accepted_name ? ` by ${o.accepted_name}, ${o.accepted_role}` : ""}</div>
                    <div>Paid: {dt(o.paid_at)}</div>
                    <div>Withdrawn: {dt(o.withdrawn_at)}</div>
                  </div>
                  {o.accepted_email && <p className="mt-2">Acceptance email: {o.accepted_email} · PO: {o.po_number || "—"}</p>}
                  {o.accepted_at_uk && <p className="mt-1 text-muted-foreground">Acceptance recorded: {o.accepted_at_uk}</p>}
                  {o.invoice_number && <p className="mt-1 text-muted-foreground">Invoice: {o.invoice_number} · due {o.payment_due_date ?? "—"}</p>}
                  {o.paid_marked_by_email && <p className="mt-1 text-muted-foreground">Payment marked by {o.paid_marked_by_email}{o.paid_marked_at_uk ? ` on ${o.paid_marked_at_uk}` : ""}</p>}
                  {o.invoice_contact && <p className="mt-1 whitespace-pre-wrap">Invoicing: {o.invoice_contact}</p>}
                  {o.non_standard_request && <p className="mt-2 border-l-2 border-secondary pl-3 whitespace-pre-wrap">Non-standard request ({dt(o.referred_at)}): {o.non_standard_request}</p>}
                  {o.contact_submission_id && <p className="mt-1 text-xs text-muted-foreground">Enquiry {o.contact_submission_id}</p>}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {s === "issued" && <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(offerUrl(o.token)).then(() => toast({ title: "Link copied" }))}>Copy link</Button>}
                    {(s === "issued" || s === "referred") && <Button size="sm" variant="outline" onClick={() => withdraw(o)}>Withdraw</Button>}
                    {["issued", "expired", "referred", "withdrawn"].includes(s) && EMPLOYER_OFFER_TERMS_APPROVED && <Button size="sm" variant="outline" onClick={() => reissue(o)}>Reissue</Button>}
                    {["accepted", "paid"].includes(s) && <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(buildEmployerOfferInvoiceText({ ...o, offer_reference: offerReference(o) })).then(() => toast({ title: "Invoice text copied" }))}>Copy invoice</Button>}
                    {s === "accepted" && <Button size="sm" onClick={() => markPaid(o)}>Mark paid</Button>}
                  </div>
                  {["accepted", "paid"].includes(s) && (
                    <div className="mt-5">
                      <EmployerOfferInvoice invoice={{ ...o, offer_reference: offerReference(o) }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminEmployerOffers;
