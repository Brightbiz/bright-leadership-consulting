import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EDL, EDL_CTA, EDL_YES_NO_UNSURE } from "@/data/edlIntensive";
import { trackProgrammeEmployerInfoRequest } from "@/lib/analytics";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const field =
  "mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";
const label = "text-sm font-medium text-foreground";
const hint = "mt-1 text-xs text-muted-foreground";

interface FormState {
  requesterName: string;
  requesterRole: string;
  requesterOrganisation: string;
  requesterEmail: string;
  participantName: string;
  participantRole: string;
  participantEmail: string;
  invoiceRequired: string;
  poRequired: string;
  vendorOnboardingRequired: string;
  expectedDecisionDate: string;
  adminQuestion: string;
  privacyAck: boolean;
}

const EMPTY: FormState = {
  requesterName: "",
  requesterRole: "",
  requesterOrganisation: "",
  requesterEmail: "",
  participantName: "",
  participantRole: "",
  participantEmail: "",
  invoiceRequired: "",
  poRequired: "",
  vendorOnboardingRequired: "",
  expectedDecisionDate: "",
  adminQuestion: "",
  privacyAck: false,
};

const EdlEmployerInformation = () => {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.requesterName.trim()) next.requesterName = "Please provide your name.";
    if (!form.requesterRole.trim()) next.requesterRole = "Please provide your role.";
    if (!form.requesterOrganisation.trim())
      next.requesterOrganisation = "Please provide the organisation.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.requesterEmail.trim()))
      next.requesterEmail = "Please provide a valid work email address.";
    if (!form.privacyAck) next.privacyAck = "The privacy acknowledgement is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    if (!validate()) {
      document.getElementById("employer-error-summary")?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-edl-application", {
        body: { kind: "employer_request", payload: form },
      });
      if (error) throw error;
      if (data?.error) {
        toast({ title: "Request could not be sent", description: data.error, variant: "destructive" });
        return;
      }
      trackProgrammeEmployerInfoRequest({
        programme: EDL.title,
        invoiceRequired: form.invoiceRequired || "not stated",
        poRequired: form.poRequired || "not stated",
      });
      setSubmitted(true);
    } catch {
      toast({
        title: "Request could not be sent",
        description: "Please try again shortly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const errorList = Object.entries(errors);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Employer information — Executive Decision Leadership Intensive"
        description="Request employer-funding information for the Executive Decision Leadership Intensive founding cohort."
        path={EDL.employerRoute}
        noindex
      />
      <ScrollProgress />
      <Header />

      <main>
        <section className="pt-36 pb-24 lg:pt-44 lg:pb-32 section-pearl">
          <div className="container-brief">
            <div className="max-w-[620px]">
              <motion.p className="kicker mb-6" {...fade}>
                Employer funding
              </motion.p>
              <motion.h1 className="heading-hero mb-8" {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
                {EDL_CTA.secondary}
              </motion.h1>

              {submitted ? (
                <div className="rounded-sm border border-border bg-background p-8">
                  <CheckCircle className="mb-5 h-6 w-6 text-gold" aria-hidden="true" />
                  <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">
                    Thank you. We have received your employer-information request.
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Programme suitability must be established before an invoice or
                    payment route is issued.
                  </p>
                  <p className="mt-6 text-sm text-muted-foreground">
                    <Link to={EDL.route} className="link-quiet">
                      Return to the programme
                    </Link>
                  </p>
                </div>
              ) : (
                <>
                  <p className="mb-10 text-sm leading-relaxed text-muted-foreground">
                    Request a concise employer pack for the {EDL.title}. This does
                    not replace the application: programme suitability is
                    established before any invoice or payment route is issued. The
                    fee is {EDL.fee}
                  </p>

                  {errorList.length > 0 && (
                    <div
                      id="employer-error-summary"
                      tabIndex={-1}
                      role="alert"
                      className="mb-8 rounded-sm border border-destructive/40 bg-destructive/5 p-5"
                    >
                      <h2 className="mb-2 text-sm font-semibold text-foreground">
                        Please correct the following
                      </h2>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {errorList.map(([key, message]) => (
                          <li key={key}>{message}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <form onSubmit={onSubmit} noValidate className="space-y-8">
                    {/* Honeypot — visually and programmatically hidden. */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="companyWebsite">Company website</label>
                      <input id="companyWebsite" name="companyWebsite" tabIndex={-1} autoComplete="off" />
                    </div>

                    <fieldset className="space-y-6">
                      <legend className="mb-2 font-serif text-base font-semibold text-foreground">
                        Requester
                      </legend>

                      <div>
                        <label className={label} htmlFor="requesterName">
                          Your name <span className="text-muted-foreground">(required)</span>
                        </label>
                        <input
                          id="requesterName"
                          className={field}
                          value={form.requesterName}
                          onChange={(e) => set("requesterName", e.target.value)}
                          aria-invalid={!!errors.requesterName}
                          required
                        />
                      </div>

                      <div>
                        <label className={label} htmlFor="requesterRole">
                          Your role <span className="text-muted-foreground">(required)</span>
                        </label>
                        <input
                          id="requesterRole"
                          className={field}
                          value={form.requesterRole}
                          onChange={(e) => set("requesterRole", e.target.value)}
                          aria-invalid={!!errors.requesterRole}
                          required
                        />
                      </div>

                      <div>
                        <label className={label} htmlFor="requesterOrganisation">
                          Organisation <span className="text-muted-foreground">(required)</span>
                        </label>
                        <input
                          id="requesterOrganisation"
                          className={field}
                          value={form.requesterOrganisation}
                          onChange={(e) => set("requesterOrganisation", e.target.value)}
                          aria-invalid={!!errors.requesterOrganisation}
                          required
                        />
                      </div>

                      <div>
                        <label className={label} htmlFor="requesterEmail">
                          Work email <span className="text-muted-foreground">(required)</span>
                        </label>
                        <input
                          id="requesterEmail"
                          type="email"
                          className={field}
                          value={form.requesterEmail}
                          onChange={(e) => set("requesterEmail", e.target.value)}
                          aria-invalid={!!errors.requesterEmail}
                          required
                        />
                      </div>
                    </fieldset>

                    <fieldset className="space-y-6">
                      <legend className="mb-2 font-serif text-base font-semibold text-foreground">
                        Intended participant, if different
                      </legend>

                      <div>
                        <label className={label} htmlFor="participantName">
                          Name <span className="text-muted-foreground">(optional)</span>
                        </label>
                        <input
                          id="participantName"
                          className={field}
                          value={form.participantName}
                          onChange={(e) => set("participantName", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={label} htmlFor="participantRole">
                          Role <span className="text-muted-foreground">(optional)</span>
                        </label>
                        <input
                          id="participantRole"
                          className={field}
                          value={form.participantRole}
                          onChange={(e) => set("participantRole", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={label} htmlFor="participantEmail">
                          Email <span className="text-muted-foreground">(optional)</span>
                        </label>
                        <input
                          id="participantEmail"
                          type="email"
                          className={field}
                          value={form.participantEmail}
                          onChange={(e) => set("participantEmail", e.target.value)}
                        />
                      </div>
                    </fieldset>

                    <fieldset className="space-y-6">
                      <legend className="mb-2 font-serif text-base font-semibold text-foreground">
                        Administration
                      </legend>

                      {(
                        [
                          ["invoiceRequired", "Is an invoice required?"],
                          ["poRequired", "Is a purchase order required?"],
                          ["vendorOnboardingRequired", "Is vendor onboarding required?"],
                        ] as const
                      ).map(([key, question]) => (
                        <div key={key}>
                          <label className={label} htmlFor={key}>
                            {question} <span className="text-muted-foreground">(optional)</span>
                          </label>
                          <select
                            id={key}
                            className={field}
                            value={form[key]}
                            onChange={(e) => set(key, e.target.value)}
                          >
                            <option value="">Not stated</option>
                            {EDL_YES_NO_UNSURE.map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}

                      <div>
                        <label className={label} htmlFor="expectedDecisionDate">
                          Expected decision date <span className="text-muted-foreground">(optional)</span>
                        </label>
                        <input
                          id="expectedDecisionDate"
                          type="date"
                          className={field}
                          value={form.expectedDecisionDate}
                          onChange={(e) => set("expectedDecisionDate", e.target.value)}
                        />
                      </div>

                      <div>
                        <label className={label} htmlFor="adminQuestion">
                          Administrative question <span className="text-muted-foreground">(optional)</span>
                        </label>
                        <textarea
                          id="adminQuestion"
                          rows={4}
                          maxLength={1000}
                          className={field}
                          value={form.adminQuestion}
                          onChange={(e) => set("adminQuestion", e.target.value)}
                        />
                        <p className={hint}>
                          Please do not include confidential or commercially
                          protected detail.
                        </p>
                      </div>
                    </fieldset>

                    <div className="border-t border-border pt-6">
                      <label className="flex items-start gap-3 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          className="mt-0.5 h-4 w-4 accent-[hsl(var(--navy))]"
                          checked={form.privacyAck}
                          onChange={(e) => set("privacyAck", e.target.checked)}
                          aria-invalid={!!errors.privacyAck}
                          required
                        />
                        <span>
                          I have read the{" "}
                          <Link to="/privacy" className="link-quiet">
                            Programme Privacy Notice
                          </Link>{" "}
                          and understand how this request will be handled.{" "}
                          <span className="text-muted-foreground">(required)</span>
                        </span>
                      </label>
                    </div>

                    <button type="submit" className="btn-brief" disabled={submitting}>
                      {submitting ? "Sending…" : "Request employer information"}
                    </button>

                    <p className="text-xs leading-relaxed text-muted-foreground">
                      No payment route is issued from this page. Programme
                      suitability is established first.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EdlEmployerInformation;
