import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import {
  bandFor,
  classify,
  readinessTotal,
  resolvedQuantity,
  type Action,
  type AuditState,
} from "@/data/aiAudit/logic";
import { reportEnquiryConversion } from "@/lib/analytics";
import { trackAuditRequestSubmitted } from "@/lib/aiAuditAnalytics";

interface DetailsFormProps {
  action: Action;
  product: string;
  state: AuditState;
  onBack: () => void;
}

const FIELDS = [
  { id: "firstName", label: "First name", type: "text", autoComplete: "given-name" },
  { id: "lastName", label: "Surname", type: "text", autoComplete: "family-name" },
  { id: "email", label: "Work email", type: "email", autoComplete: "email" },
  { id: "organisation", label: "Organisation", type: "text", autoComplete: "organization" },
  { id: "jobTitle", label: "Job title", type: "text", autoComplete: "organization-title" },
] as const;

type FieldId = (typeof FIELDS)[number]["id"];

const inputClass =
  "mt-2 h-12 w-full rounded-sm border border-navy-foreground/25 bg-navy px-4 text-[15px] text-navy-foreground placeholder:text-navy-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy";

/**
 * Contact and delivery details. Reached only after the result and
 * recommendation have been shown, and only for a specific selected action.
 * Required transaction fields are separate from optional marketing consent.
 */
const DetailsForm = ({ action, product, state, onBack }: DetailsFormProps) => {
  const [values, setValues] = useState<Record<FieldId, string>>({
    firstName: "",
    lastName: "",
    email: "",
    organisation: "",
    jobTitle: "",
  });
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const quantity = resolvedQuantity(state);
  const complete =
    FIELDS.every(({ id }) => values[id].trim().length > 0) && values.email.includes("@");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complete || status === "sending") return;
    setStatus("sending");
    setErrorMessage("");

    const score = readinessTotal(state);

    const { error } = await supabase.functions.invoke("submit-ai-audit", {
      body: {
        requestType: action.kind,
        actionLabel: action.label,
        product,
        readinessScore: score,
        readinessBand: bandFor(score).title,
        classification: classify(state),
        participantQuantity: quantity,
        routing: {
          q9: state.q9,
          q9a: state.q9a,
          q10: state.q10,
          q11: state.q11,
          q11a: state.q11a,
          q12: state.q12,
          q13: state.q13,
          q14: state.q14,
        },
        contact: {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          organisation: values.organisation.trim(),
          jobTitle: values.jobTitle.trim(),
        },
        marketingConsent,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(
        "We could not record that request. Please try again, or email enquiries@brightleadershipconsulting.com and we will complete it manually.",
      );
      return;
    }

    trackAuditRequestSubmitted(action.kind, quantity);
    reportEnquiryConversion();
    setStatus("done");
  };

  if (status === "done") {
    return (
      <section aria-labelledby="details-confirmed">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">Request recorded</p>
        <h1 id="details-confirmed" className="mt-3 font-serif text-3xl leading-tight">
          {action.label} — confirmed
        </h1>
        <p className="mt-4 max-w-[600px] text-[15px] leading-relaxed text-navy-foreground/75">
          Your request has been recorded against your organisational record
          {quantity ? ` for ${quantity} digital ${quantity === 1 ? "place" : "places"}` : ""}. We will
          respond by email with the material requested and the next step. No payment has been taken.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-8 min-h-[44px] rounded-sm border border-navy-foreground/25 px-5 py-3 text-[15px] transition-colors hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
        >
          Return to my result
        </button>
      </section>
    );
  }

  return (
    <section aria-labelledby="details-heading">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
        Contact and delivery details
      </p>
      <h1 id="details-heading" className="mt-3 font-serif text-3xl leading-tight">
        Proceeding with: {action.label}
      </h1>
      <p className="mt-4 max-w-[600px] text-[15px] leading-relaxed text-navy-foreground/75">
        We'll use these details to provide your complete result, administer any purchase or
        information request you select, and maintain the appropriate organisational record. Marketing
        communications require separate consent.
      </p>

      {quantity !== null && (
        <p className="mt-4 font-mono text-[13px] tracking-[0.04em] text-navy-foreground/80">
          Confirmed quantity carried into this request: {quantity}{" "}
          {quantity === 1 ? "digital place" : "digital places"}
        </p>
      )}

      <form onSubmit={submit} className="mt-8 max-w-[520px]" noValidate>
        {FIELDS.map(({ id, label, type, autoComplete }) => (
          <div key={id} className="mb-5">
            <label htmlFor={`audit-${id}`} className="text-[14px] text-navy-foreground/80">
              {label} <span aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              id={`audit-${id}`}
              type={type}
              autoComplete={autoComplete}
              required
              value={values[id]}
              onChange={(e) => setValues((v) => ({ ...v, [id]: e.target.value }))}
              className={inputClass}
            />
          </div>
        ))}

        <label className="flex items-start gap-3 text-[14px] leading-relaxed text-navy-foreground/75">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-gold"
          />
          <span>
            I'd also like to receive occasional executive briefings and programme updates (optional —
            not required to proceed).
          </span>
        </label>

        <p className="mt-5 text-[13px] leading-relaxed text-navy-foreground/50">
          Details submitted here are held only to administer this request and the related
          organisational record, and are retained for 24 months unless you ask us to remove them
          sooner. See our{" "}
          <Link
            to="/privacy"
            className="underline underline-offset-4 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            privacy notice
          </Link>
          .
        </p>

        {status === "error" && (
          <p role="alert" className="mt-5 text-[14px] leading-relaxed text-gold-muted">
            {errorMessage}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[44px] text-[14px] text-navy-foreground/70 underline underline-offset-4 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            ← Back to my result
          </button>
          <button
            type="submit"
            disabled={!complete || status === "sending"}
            className={cn(
              "min-h-[44px] rounded-sm bg-gold px-6 py-3 text-[15px] font-medium text-navy transition-colors hover:bg-gold-muted",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy",
              "disabled:cursor-not-allowed disabled:opacity-45",
            )}
          >
            {status === "sending" ? "Recording…" : "Submit request"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default DetailsForm;
