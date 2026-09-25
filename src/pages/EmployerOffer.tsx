import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { employerOfferTerms } from "@/data/employerOffer";
import { trackEvent } from "@/lib/analytics";

type Offer = {
  programme: string;
  employer_organisation: string;
  signatory_name: string;
  participant_name: string;
  participant_role: string | null;
  fee_gbp: number;
  payment_method: string;
  terms_version: string;
  expires_at: string;
  issued_at: string;
  accepted_at: string | null;
  accepted_name: string | null;
};

const call = (body: Record<string, unknown>) =>
  supabase.functions.invoke("employer-offer", { body });

const fmtGbp = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

const EmployerOffer = () => {
  const { token = "" } = useParams();
  const [status, setStatus] = useState<string>("loading");
  const [offer, setOffer] = useState<Offer | null>(null);
  const [mode, setMode] = useState<"accept" | "refer">("accept");
  const [form, setForm] = useState({ name: "", role: "", email: "", po_number: "", invoice_contact: "", message: "" });
  const [checks, setChecks] = useState({ terms: false, authority: false, participant: false });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const viewed = useRef(false);

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    call({ action: "view", token }).then(({ data, error }) => {
      if (error || !data?.status) return setStatus("not_found");
      setStatus(data.status);
      setOffer(data.offer);
      trackEvent("elm_employer_offer_view", { enquiry_type: "elm_employer_funded", offer_status: data.status });
    });
  }, [token]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const body =
      mode === "accept"
        ? {
            action: "accept", token, terms_version: offer?.terms_version,
            name: form.name, role: form.role, email: form.email,
            po_number: form.po_number, invoice_contact: form.invoice_contact,
            confirm_terms: checks.terms, confirm_authority: checks.authority, confirm_participant: checks.participant,
          }
        : { action: "refer", token, message: form.message };
    const { data, error: err } = await call(body);
    setBusy(false);
    if (err || data?.error) {
      let msg = data?.error;
      try { msg = msg ?? (await (err as { context?: Response })?.context?.json())?.error; } catch { /* ignore */ }
      return setError(msg ?? "The request could not be recorded. Please try again.");
    }
    setStatus(data.status);
    trackEvent(mode === "accept" ? "elm_employer_offer_accept" : "elm_employer_offer_refer", {
      enquiry_type: "elm_employer_funded",
    });
  };

  const inputCls = "h-12 bg-muted/30 border-border/50 focus:border-secondary";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Employer-Funded Enrolment Offer — Bright Leadership Consulting" path="/offer" noindex />
      <Header />
      <main className="pt-36 pb-24 lg:pt-44 section-pearl">
        <div className="container-brief max-w-[680px]">
          <p className="kicker mb-6">Private Offer</p>

          {status === "loading" && <p className="body-brief">Loading offer.</p>}

          {(status === "not_found" || (!offer && status !== "loading")) && (
            <>
              <h1 className="heading-section mb-6">
                {status === "expired" ? "This offer has expired" : status === "withdrawn" || status === "superseded" ? "This offer is no longer available" : "Offer not found"}
              </h1>
              <p className="body-brief">
                Please contact Bright Leadership Consulting if you require a current offer.{" "}
                <Link to="/contact" className="underline underline-offset-4">Contact</Link>
              </p>
            </>
          )}

          {offer && (
            <>
              <h1 className="heading-hero mb-8">Employer-funded enrolment offer</h1>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm mb-12 border-t border-b border-border py-6">
                <dt className="text-muted-foreground">Programme</dt><dd className="text-foreground">{offer.programme}</dd>
                <dt className="text-muted-foreground">Employer</dt><dd className="text-foreground">{offer.employer_organisation}</dd>
                <dt className="text-muted-foreground">Named participant</dt>
                <dd className="text-foreground">{offer.participant_name}{offer.participant_role ? `, ${offer.participant_role}` : ""}</dd>
                <dt className="text-muted-foreground">Fee</dt><dd className="text-foreground">{fmtGbp(offer.fee_gbp)} for one individual place</dd>
                <dt className="text-muted-foreground">Payment</dt><dd className="text-foreground">By invoice</dd>
                <dt className="text-muted-foreground">Valid until</dt><dd className="text-foreground">{format(new Date(offer.expires_at), "d MMMM yyyy")}</dd>
                <dt className="text-muted-foreground">Terms version</dt><dd className="text-foreground">{offer.terms_version}</dd>
              </dl>

              <section className="space-y-5 mb-14">
                <h2 className="font-serif text-xl text-foreground">Terms of this offer</h2>
                {employerOfferTerms.map((t) => (
                  <div key={t.heading}>
                    <h3 className="text-sm font-medium text-foreground mb-1">{t.heading}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t.body}</p>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground">
                  <Link to="/terms" className="underline underline-offset-4">Terms and Conditions</Link>{" · "}
                  <Link to="/privacy" className="underline underline-offset-4">Privacy Notice</Link>
                </p>
              </section>

              {status === "accepted" || status === "paid" ? (
                <div className="border-l-2 border-secondary pl-5" role="status">
                  <h2 className="font-serif text-xl text-foreground mb-2">Offer accepted</h2>
                  <p className="body-brief">
                    Acceptance has been recorded. An invoice will be issued to the invoicing contact provided.
                    Access is issued to the named participant once payment has been received.
                  </p>
                </div>
              ) : status === "referred" ? (
                <div className="border-l-2 border-secondary pl-5" role="status">
                  <h2 className="font-serif text-xl text-foreground mb-2">Referred to Bright Leadership Consulting</h2>
                  <p className="body-brief">Your requirement has been recorded. Bright Leadership Consulting will respond directly. No purchase has been made.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-6">
                  <div role="radiogroup" aria-label="Response" className="flex flex-wrap gap-6 text-sm">
                    {(["accept", "refer"] as const).map((m) => (
                      <label key={m} className="flex items-center gap-2 min-h-11 cursor-pointer">
                        <input type="radio" name="mode" checked={mode === m} onChange={() => setMode(m)} />
                        {m === "accept" ? "Accept these standard terms" : "We have a non-standard requirement"}
                      </label>
                    ))}
                  </div>

                  {mode === "accept" ? (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <label className="text-sm space-y-2">Your full name<Input required value={form.name} onChange={set("name")} className={inputCls} /></label>
                        <label className="text-sm space-y-2">Your role<Input required value={form.role} onChange={set("role")} className={inputCls} /></label>
                      </div>
                      <label className="text-sm space-y-2 block">Your work email<Input required type="email" value={form.email} onChange={set("email")} className={inputCls} /></label>
                      <label className="text-sm space-y-2 block">Invoicing contact and address<Textarea required value={form.invoice_contact} onChange={set("invoice_contact")} /></label>
                      <label className="text-sm space-y-2 block">Purchase order number (if applicable)<Input value={form.po_number} onChange={set("po_number")} className={inputCls} /></label>
                      {([
                        ["authority", `I am authorised to accept this offer on behalf of ${offer.employer_organisation}.`],
                        ["participant", `The place is for ${offer.participant_name} and cannot be transferred without Bright Leadership Consulting's approval.`],
                        ["terms", "I have read and accept the terms of this offer."],
                      ] as const).map(([k, text]) => (
                        <label key={k} className="flex items-start gap-3 text-sm text-foreground min-h-11">
                          <input type="checkbox" className="mt-1" checked={checks[k]} onChange={(e) => setChecks((c) => ({ ...c, [k]: e.target.checked }))} />
                          {text}
                        </label>
                      ))}
                    </>
                  ) : (
                    <label className="text-sm space-y-2 block">
                      Describe the requirement (for example, a different participant, payment terms or supplier onboarding)
                      <Textarea required minLength={10} value={form.message} onChange={set("message")} rows={5} />
                    </label>
                  )}

                  {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
                  <button type="submit" disabled={busy} className="btn-brief min-h-11">
                    {mode === "accept" ? "Accept offer" : "Send to Bright Leadership Consulting"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmployerOffer;
