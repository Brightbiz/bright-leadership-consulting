import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import EmployerOfferInvoice from "@/components/EmployerOfferInvoice";
import {
  BRIGHT_OFFER_QUESTIONS_TEXT,
  BRIGHT_POST_PURCHASE_QUESTIONS_TEXT,
} from "@/data/legal";
import {
  employerOfferTerms,
  getEmployerOfferAcceptanceStatement,
  getEmployerOfferConfirmations,
} from "@/data/employerOffer";
import { trackEvent } from "@/lib/analytics";

type Offer = {
  id: string;
  offer_reference: string;
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
  accepted_role: string | null;
  accepted_at_uk: string | null;
  accepted_offer_terms_version: string | null;
  accepted_offer_terms_text: string | null;
  po_number: string | null;
  invoice_contact: string | null;
  invoice_number: string | null;
  invoice_date: string | null;
  payment_due_date: string | null;
  invoice_description: string | null;
  invoice_net_amount_gbp: number | null;
  invoice_vat_amount_gbp: number | null;
  invoice_total_gbp: number | null;
  invoice_payment_instructions: string | null;
  invoice_contact_email: string | null;
  supplier_contracting_identity: string | null;
  supplier_address: string | null;
};

const call = (body: Record<string, unknown>) =>
  supabase.functions.invoke("employer-offer", { body });

const fmtGbp = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

const parseTermsText = (value: string | null | undefined) =>
  (value ?? "")
    .split(/\n{2,}/)
    .map((block) => {
      const [heading = "Offer term", ...body] = block.split("\n");
      return { heading, body: body.join("\n").trim() };
    })
    .filter((term) => term.heading || term.body);

const EmployerOffer = () => {
  const { token = "" } = useParams();
  const [status, setStatus] = useState<string>("loading");
  const [offer, setOffer] = useState<Offer | null>(null);
  const [mode, setMode] = useState<"accept" | "refer">("accept");
  const [form, setForm] = useState({ name: "", role: "", email: "", po_number: "", invoice_contact: "", message: "" });
  const [checks, setChecks] = useState({ terms: false, authority: false, participant: false, privacy: false });
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
            confirm_terms: checks.terms,
            confirm_authority: checks.authority,
            confirm_participant: checks.participant,
            confirm_privacy: checks.privacy,
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
    if (data.offer) setOffer(data.offer);
    trackEvent(mode === "accept" ? "elm_employer_offer_accept" : "elm_employer_offer_refer", {
      enquiry_type: "elm_employer_funded",
    });
  };

  const inputCls = "h-12 bg-muted/30 border-border/50 focus:border-secondary";
  const displayedTerms = offer?.accepted_offer_terms_text
    ? parseTermsText(offer.accepted_offer_terms_text)
    : employerOfferTerms;
  const confirmationTexts = offer
    ? getEmployerOfferConfirmations(offer.employer_organisation, offer.participant_name)
    : null;
  const termsVersionDisplay = offer?.accepted_offer_terms_version ?? offer?.terms_version;

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
                <dt className="text-muted-foreground">Offer reference</dt><dd className="text-foreground">{offer.offer_reference}</dd>
                <dt className="text-muted-foreground">Programme</dt><dd className="text-foreground">{offer.programme}</dd>
                <dt className="text-muted-foreground">Employer</dt><dd className="text-foreground">{offer.employer_organisation}</dd>
                <dt className="text-muted-foreground">Named participant</dt>
                <dd className="text-foreground">{offer.participant_name}{offer.participant_role ? `, ${offer.participant_role}` : ""}</dd>
                <dt className="text-muted-foreground">Fee</dt><dd className="text-foreground">{fmtGbp(offer.fee_gbp)} for one individual place</dd>
                <dt className="text-muted-foreground">Payment</dt><dd className="text-foreground">By invoice</dd>
                <dt className="text-muted-foreground">Valid until</dt><dd className="text-foreground">{format(new Date(offer.expires_at), "d MMMM yyyy")}</dd>
                <dt className="text-muted-foreground">Terms version</dt><dd className="text-foreground">{termsVersionDisplay}</dd>
              </dl>

              <section className="space-y-5 mb-14">
                <h2 className="font-serif text-xl text-foreground">Terms of this offer</h2>
                {displayedTerms.map((t) => (
                  <div key={t.heading}>
                    <h3 className="text-sm font-medium text-foreground mb-1">{t.heading}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{t.body}</p>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground">
                  <Link to="/terms" className="underline underline-offset-4">Terms and Conditions</Link>{" · "}
                  <Link to="/privacy" className="underline underline-offset-4">Privacy Notice</Link>
                </p>
                {status === "issued" && (
                  <p className="text-sm text-foreground">{BRIGHT_OFFER_QUESTIONS_TEXT}</p>
                )}
              </section>

              {status === "accepted" || status === "paid" ? (
                <div className="space-y-8" role="status">
                  <div className="border-l-2 border-secondary pl-5">
                    <h2 className="font-serif text-xl text-foreground mb-2">Offer accepted</h2>
                    <p className="body-brief">
                      Acceptance was recorded{offer.accepted_at_uk ? ` on ${offer.accepted_at_uk}` : ""}
                      {offer.accepted_name ? ` by ${offer.accepted_name}` : ""}
                      {offer.accepted_role ? `, ${offer.accepted_role}` : ""}, on behalf of {offer.employer_organisation}.
                    </p>
                    <p className="body-brief mt-4">
                      Programme access will be enabled for {offer.participant_name} within two business days after cleared payment in full and the information needed to create their access have been received.
                    </p>
                    <p className="body-brief mt-4">{BRIGHT_POST_PURCHASE_QUESTIONS_TEXT}</p>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Offer reference: {offer.offer_reference} · Offer terms version: {termsVersionDisplay}
                    </p>
                  </div>
                  <EmployerOfferInvoice invoice={offer} showCopy />
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
                      <label className="text-sm space-y-2 block">Employer legal name and invoicing address<Textarea required value={form.invoice_contact} onChange={set("invoice_contact")} /></label>
                      <label className="text-sm space-y-2 block">Purchase order number (if applicable)<Input value={form.po_number} onChange={set("po_number")} className={inputCls} /></label>
                      {Object.entries(confirmationTexts ?? {}).map(([k, text]) => (
                        <label key={k} className="flex items-start gap-3 text-sm text-foreground min-h-11">
                          <input type="checkbox" className="mt-1" checked={checks[k as keyof typeof checks]} onChange={(e) => setChecks((c) => ({ ...c, [k]: e.target.checked }))} />
                          {text}
                        </label>
                      ))}
                      <p className="border-l-2 border-secondary pl-4 text-sm leading-relaxed text-muted-foreground">
                        {getEmployerOfferAcceptanceStatement(offer.employer_organisation)}
                      </p>
                    </>
                  ) : (
                    <label className="text-sm space-y-2 block">
                      Describe the requirement (for example, a different participant, payment terms or supplier onboarding)
                      <Textarea required minLength={10} value={form.message} onChange={set("message")} rows={5} />
                    </label>
                  )}

                  {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
                  <Button type="submit" disabled={busy} className="min-h-11">
                    {mode === "accept" ? "Accept offer and form contract" : "Send to Bright Leadership Consulting"}
                  </Button>
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
