import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  EDL,
  EDL_ACCESS_ROUTES,
  EDL_CTA,
  EDL_FUNDING_ROUTES,
  EDL_PLACEHOLDERS,
  EDL_PRIVACY_NOTICE_VERSION,
  EDL_REFERRAL_SOURCES,
  EDL_YES_NO_UNSURE,
} from "@/data/edlIntensive";
import { trackProgrammeApplicationStart, trackProgrammeApplicationSubmit } from "@/lib/analytics";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const field =
  "mt-2 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";
const labelClass = "text-sm font-medium text-foreground";
const hint = "mt-1 text-xs text-muted-foreground";

const STEPS = [
  "Identity",
  "Responsibility",
  "Decision trigger",
  "Confidentiality",
  "Commitment",
  "Declaration",
] as const;

interface FormState {
  // Step 1
  fullName: string;
  workEmail: string;
  telephone: string;
  roleTitle: string;
  organisation: string;
  sector: string;
  country: string;
  timeZone: string;
  linkedinUrl: string;
  referralSource: string;
  referralDetail: string;
  // Step 2
  respCurrent: string;
  respDecisionTypes: string;
  respApprovals: string;
  respAuthority: string;
  // Step 3
  decisionStatement: string;
  decisionDeadline: string;
  decisionWhyNow: string;
  decisionAtRisk: string;
  decisionAlreadyDecided: string;
  decisionAlternatives: string;
  decisionOffLimits: string;
  anonymisable: string;
  // Step 4
  conflictNote: string;
  ackAuthorised: boolean;
  ackNoRecording: boolean;
  ackConfidentialityLimits: boolean;
  // Step 5
  commitAttend: boolean;
  commitWeek4: boolean;
  commitAppliedWork: boolean;
  commitChallenge: boolean;
  commitConfidentiality: boolean;
  fundingRoute: string;
  sponsorName: string;
  sponsorRole: string;
  sponsorEmail: string;
  orgLegalName: string;
  poRequired: string;
  vendorOnboardingRequired: string;
  expectedApprovalDate: string;
  accessRoute: string;
  accessDetail: string;
  accessContactMethod: string;
  // Step 6
  declAccurate: boolean;
  declNoAdmissionGuarantee: boolean;
  declEmployerFundingSubject: boolean;
  declNoOutcomeGuarantee: boolean;
  declPrivacyRead: boolean;
  marketingConsent: boolean;
}

const EMPTY: FormState = {
  fullName: "",
  workEmail: "",
  telephone: "",
  roleTitle: "",
  organisation: "",
  sector: "",
  country: "",
  timeZone: "",
  linkedinUrl: "",
  referralSource: "",
  referralDetail: "",
  respCurrent: "",
  respDecisionTypes: "",
  respApprovals: "",
  respAuthority: "",
  decisionStatement: "",
  decisionDeadline: "",
  decisionWhyNow: "",
  decisionAtRisk: "",
  decisionAlreadyDecided: "",
  decisionAlternatives: "",
  decisionOffLimits: "",
  anonymisable: "",
  conflictNote: "",
  ackAuthorised: false,
  ackNoRecording: false,
  ackConfidentialityLimits: false,
  commitAttend: false,
  commitWeek4: false,
  commitAppliedWork: false,
  commitChallenge: false,
  commitConfidentiality: false,
  fundingRoute: "",
  sponsorName: "",
  sponsorRole: "",
  sponsorEmail: "",
  orgLegalName: "",
  poRequired: "",
  vendorOnboardingRequired: "",
  expectedApprovalDate: "",
  accessRoute: "",
  accessDetail: "",
  accessContactMethod: "",
  declAccurate: false,
  declNoAdmissionGuarantee: false,
  declEmployerFundingSubject: false,
  declNoOutcomeGuarantee: false,
  declPrivacyRead: false,
  marketingConsent: false,
};

/** Long-text limits, exactly as approved in the programme brief. */
const LIMITS: Partial<Record<keyof FormState, number>> = {
  respCurrent: 600,
  respDecisionTypes: 600,
  respApprovals: 400,
  respAuthority: 500,
  decisionStatement: 600,
  decisionWhyNow: 500,
  decisionAtRisk: 600,
  decisionAlreadyDecided: 400,
  decisionAlternatives: 600,
  decisionOffLimits: 400,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The two repeated controls read the live form through context, so they stay
 * mounted between keystrokes and never lose focus mid-answer.
 */
interface FormContextValue {
  form: FormState;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  errors: Record<string, string>;
}

const FormContext = createContext<FormContextValue | null>(null);
const useFormContext = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("Form controls must be rendered inside the application form.");
  return ctx;
};

/** Long-text control with an approved character limit and live counter. */
const LongText = ({
  id,
  question,
  note,
  required = true,
}: {
  id: keyof FormState;
  question: string;
  note?: string;
  required?: boolean;
}) => {
  const { form, set, errors } = useFormContext();
  const max = LIMITS[id] ?? 600;
  const value = String(form[id] ?? "");
  return (
    <div>
      <label className={labelClass} htmlFor={id as string}>
        {question}{" "}
        <span className="text-muted-foreground">({required ? "required" : "optional"})</span>
      </label>
      <textarea
        id={id as string}
        rows={4}
        maxLength={max}
        className={field}
        value={value}
        onChange={(e) => set(id, e.target.value as FormState[typeof id])}
        aria-invalid={!!errors[id as string]}
        aria-describedby={`${id as string}-count`}
      />
      <p id={`${id as string}-count`} className={hint}>
        {note ? `${note} ` : ""}
        {value.length}/{max} characters.
      </p>
    </div>
  );
};

const Check = ({
  id,
  children,
  required = true,
}: {
  id: keyof FormState;
  children: React.ReactNode;
  required?: boolean;
}) => {
  const { form, set, errors } = useFormContext();
  return (
    <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 accent-[hsl(var(--navy))]"
        checked={form[id] === true}
        onChange={(e) => set(id, e.target.checked as FormState[typeof id])}
        aria-invalid={!!errors[id as string]}
      />
      <span>
        {children} <span className="text-muted-foreground">({required ? "required" : "optional"})</span>
      </span>
    </label>
  );
};


const EdlApply = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const startedRef = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Move focus to the new screen's heading, leaving same-screen controls alone.
  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  const noteStart = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    const params = new URLSearchParams(window.location.search);
    trackProgrammeApplicationStart({
      programme: EDL.title,
      source: params.get("utm_source") ?? undefined,
    });
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    noteStart();
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  };

  const requiredText = (key: keyof FormState, message: string, into: Record<string, string>) => {
    if (!String(form[key] ?? "").trim()) into[key as string] = message;
  };

  const validateStep = (index: number) => {
    const e: Record<string, string> = {};
    if (index === 0) {
      requiredText("fullName", "Please provide your full name.", e);
      if (!EMAIL.test(form.workEmail.trim())) e.workEmail = "Please provide a valid work email address.";
      requiredText("telephone", "Please provide a telephone number.", e);
      requiredText("roleTitle", "Please provide your current role or title.", e);
      requiredText("organisation", "Please provide your organisation.", e);
      requiredText("sector", "Please provide your sector.", e);
      requiredText("country", "Please select your country.", e);
      requiredText("timeZone", "Please select your time zone.", e);
      requiredText("referralSource", "Please tell us how you heard about the programme.", e);
    }
    if (index === 1) {
      requiredText("respCurrent", "Please describe your present responsibilities.", e);
      requiredText("respDecisionTypes", "Please describe the decisions you shape.", e);
      requiredText("respApprovals", "Please describe whose approval is required.", e);
      requiredText("respAuthority", "Please describe your implementation authority or access.", e);
    }
    if (index === 2) {
      requiredText("decisionStatement", "Please complete the decision statement.", e);
      requiredText("decisionDeadline", "Please provide the decision deadline.", e);
      requiredText("decisionWhyNow", "Please explain why this matters now.", e);
      requiredText("decisionAtRisk", "Please describe what is at risk.", e);
      requiredText("decisionAlreadyDecided", "Please state what is already decided.", e);
      requiredText("decisionAlternatives", "Please describe the genuine alternatives.", e);
      requiredText("decisionOffLimits", "Please state what must not be discussed in a cohort.", e);
      requiredText("anonymisable", "Please answer the anonymisation question.", e);
    }
    if (index === 3) {
      if (!form.ackAuthorised) e.ackAuthorised = "This confirmation is required.";
      if (!form.ackNoRecording) e.ackNoRecording = "This confirmation is required.";
      if (!form.ackConfidentialityLimits) e.ackConfidentialityLimits = "This confirmation is required.";
    }
    if (index === 4) {
      if (!form.commitAttend) e.commitAttend = "This commitment is required.";
      if (!form.commitWeek4) e.commitWeek4 = "This commitment is required.";
      if (!form.commitAppliedWork) e.commitAppliedWork = "This commitment is required.";
      if (!form.commitChallenge) e.commitChallenge = "This commitment is required.";
      if (!form.commitConfidentiality) e.commitConfidentiality = "This commitment is required.";
      requiredText("fundingRoute", "Please select a funding route.", e);
      if (form.fundingRoute === "Employer-funded") {
        requiredText("sponsorName", "Please provide the approver's name.", e);
        requiredText("sponsorRole", "Please provide the approver's role.", e);
        if (!EMAIL.test(form.sponsorEmail.trim()))
          e.sponsorEmail = "Please provide a valid approver work email address.";
        requiredText("orgLegalName", "Please provide the organisation's legal name.", e);
        requiredText("poRequired", "Please answer the purchase-order question.", e);
        requiredText("vendorOnboardingRequired", "Please answer the vendor-onboarding question.", e);
      }
      requiredText("accessRoute", "Please answer the access-support question.", e);
    }
    if (index === 5) {
      if (!form.declAccurate) e.declAccurate = "This confirmation is required.";
      if (!form.declNoAdmissionGuarantee) e.declNoAdmissionGuarantee = "This confirmation is required.";
      if (!form.declEmployerFundingSubject)
        e.declEmployerFundingSubject = "This confirmation is required.";
      if (!form.declNoOutcomeGuarantee) e.declNoOutcomeGuarantee = "This confirmation is required.";
      if (!form.declPrivacyRead) e.declPrivacyRead = "This confirmation is required.";
    }
    setErrors(e);
    if (Object.keys(e).length > 0) {
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return false;
    }
    return true;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    if (!validateStep(5)) return;

    setSubmitting(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const { data, error } = await supabase.functions.invoke("submit-edl-application", {
        body: {
          kind: "application",
          payload: {
            ...form,
            privacyNoticeVersion: EDL_PRIVACY_NOTICE_VERSION,
            utmSource: params.get("utm_source") ?? "",
            utmMedium: params.get("utm_medium") ?? "",
            utmCampaign: params.get("utm_campaign") ?? "",
            gclid: params.get("gclid") ?? "",
          },
        },
      });
      if (error) throw error;
      if (data?.error) {
        toast({
          title: "Application could not be submitted",
          description: data.error,
          variant: "destructive",
        });
        return;
      }
      trackProgrammeApplicationSubmit({
        programme: EDL.title,
        fundingRoute: form.fundingRoute,
        recruitmentSource: form.referralSource,
      });
      setSubmitted(true);
    } catch {
      toast({
        title: "Application could not be submitted",
        description: "Your answers have been kept. Please try again shortly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const errorList = Object.entries(errors);



  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead
          title="Application received — Executive Decision Leadership Intensive"
          description="Your founding-cohort application has been received."
          path={EDL.applyRoute}
          noindex
        />
        <Header />
        <main>
          <section className="pt-36 pb-32 lg:pt-44 section-pearl">
            <div className="container-brief">
              <div className="max-w-[620px] rounded-sm border border-border bg-background p-8 lg:p-10">
                <CheckCircle className="mb-5 h-6 w-6 text-gold" aria-hidden="true" />
                <h1 className="mb-6 font-serif text-2xl font-semibold text-foreground">
                  Thank you. Your application has been received.
                </h1>
                <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Applications are reviewed for programme fit, decision-case
                    suitability, confidentiality and cohort composition. Submission
                    does not guarantee admission. If clarification is required, you
                    may be invited to a focused 20-minute suitability conversation.
                  </p>
                  <p className="text-foreground">
                    You will receive the next step by {EDL_PLACEHOLDERS.responsePeriod}.
                  </p>
                </div>
                <p className="mt-8 text-sm">
                  <Link to={EDL.route} className="link-quiet">
                    Return to the programme
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (windowState !== "open") {
    const before = windowState === "before";
    return (
      <div className="min-h-screen bg-background">
        <SEOHead
          title="Applications — Executive Decision Leadership Intensive"
          description="Application window for the Executive Decision Leadership Intensive founding cohort."
          path={EDL.applyRoute}
          noindex
        />
        <Header />
        <main>
          <section className="pt-36 pb-32 lg:pt-44 section-pearl">
            <div className="container-brief">
              <div className="max-w-[620px] rounded-sm border border-border bg-background p-8 lg:p-10">
                <p className="kicker mb-6">Founding cohort · Six places</p>
                <h1 className="mb-6 font-serif text-2xl font-semibold text-foreground">
                  {before
                    ? "Applications open on 14 September 2026."
                    : "Applications for the founding cohort have closed."}
                </h1>
                <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    The application window is {EDL.applicationsWindow}. Applications
                    close at {EDL.closingTime}.
                  </p>
                  <p>{EDL.programmeLine}</p>
                </div>
                <p className="mt-8 text-sm">
                  <Link to={EDL.route} className="link-quiet">
                    Return to the programme
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Apply — Executive Decision Leadership Intensive"
        description="Apply for one of six places in the Executive Decision Leadership Intensive founding cohort."
        path={EDL.applyRoute}
        noindex
      />
      <Header />

      <main>
        <section className="pt-36 pb-24 lg:pt-44 lg:pb-32 section-pearl">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <p className="kicker mb-6">Founding cohort · Six places</p>
              <h1 className="heading-hero mb-8">{EDL_CTA.primary}</h1>

              <div className="mb-10 space-y-5 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Apply for one of six places in the {EDL.title} founding cohort.
                  The application establishes whether your role, decision case,
                  authority and participation requirements are suitable. It should
                  take approximately 12–15 minutes.
                </p>
                <p>
                  Do not include privileged, personal, regulated or commercially
                  protected information. Use role labels rather than names and
                  describe only what is required to assess suitability.
                </p>
                <p className="text-xs">
                  Your answers are held in this browser only while you complete the
                  form. There is no saved-and-resume route, so please complete the
                  application in one session.
                </p>
              </div>

              {/* Six-step progress indicator */}
              <nav aria-label="Application progress" className="mb-10">
                <ol className="flex flex-wrap gap-x-4 gap-y-2">
                  {STEPS.map((name, i) => (
                    <li
                      key={name}
                      aria-current={i === step ? "step" : undefined}
                      className={`font-mono text-[11px] uppercase tracking-[0.14em] ${
                        i === step
                          ? "text-gold"
                          : i < step
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {i + 1}. {name}
                    </li>
                  ))}
                </ol>
                <div
                  role="progressbar"
                  aria-valuemin={1}
                  aria-valuemax={STEPS.length}
                  aria-valuenow={step + 1}
                  aria-label={`Step ${step + 1} of ${STEPS.length}`}
                  className="mt-4 h-[2px] w-full overflow-hidden rounded bg-border"
                >
                  <div
                    className="h-full bg-gold transition-[width] duration-500"
                    style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  />
                </div>
              </nav>

              {errorList.length > 0 && (
                <div
                  ref={summaryRef}
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

              <FormContext.Provider value={{ form, set, errors }}>
              <form onSubmit={onSubmit} noValidate>

                {/* Honeypot — visually and programmatically hidden. */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="companyWebsite">Company website</label>
                  <input id="companyWebsite" name="companyWebsite" tabIndex={-1} autoComplete="off" />
                </div>

                <motion.div key={step} {...fade}>
                  <h2
                    ref={headingRef}
                    tabIndex={-1}
                    className="mb-8 font-serif text-xl font-semibold text-foreground outline-none"
                  >
                    Step {step + 1} of {STEPS.length} — {STEPS[step]}
                  </h2>

                  {/* Step 1 — Identity */}
                  {step === 0 && (
                    <div className="space-y-6">
                      {(
                        [
                          ["fullName", "Full name", "text"],
                          ["workEmail", "Work email", "email"],
                          ["telephone", "Telephone number", "tel"],
                          ["roleTitle", "Current role or title", "text"],
                          ["organisation", "Organisation", "text"],
                          ["sector", "Sector", "text"],
                          ["country", "Country", "text"],
                        ] as const
                      ).map(([key, question, type]) => (
                        <div key={key}>
                          <label className={labelClass} htmlFor={key}>
                            {question} <span className="text-muted-foreground">(required)</span>
                          </label>
                          <input
                            id={key}
                            type={type}
                            className={field}
                            value={form[key]}
                            onChange={(e) => set(key, e.target.value)}
                            aria-invalid={!!errors[key]}
                          />
                        </div>
                      ))}

                      <div>
                        <label className={labelClass} htmlFor="timeZone">
                          Time zone <span className="text-muted-foreground">(required)</span>
                        </label>
                        <input
                          id="timeZone"
                          className={field}
                          value={form.timeZone}
                          onChange={(e) => set("timeZone", e.target.value)}
                          onFocus={() =>
                            !form.timeZone &&
                            set("timeZone", Intl.DateTimeFormat().resolvedOptions().timeZone ?? "")
                          }
                          aria-invalid={!!errors.timeZone}
                        />
                        <p className={hint}>
                          All published session times are UK time. UK clocks change on
                          25 October 2026.
                        </p>
                      </div>

                      <div>
                        <label className={labelClass} htmlFor="linkedinUrl">
                          LinkedIn profile <span className="text-muted-foreground">(optional)</span>
                        </label>
                        <input
                          id="linkedinUrl"
                          type="url"
                          className={field}
                          value={form.linkedinUrl}
                          onChange={(e) => set("linkedinUrl", e.target.value)}
                        />
                      </div>

                      <div>
                        <label className={labelClass} htmlFor="referralSource">
                          How did you hear about the programme?{" "}
                          <span className="text-muted-foreground">(required)</span>
                        </label>
                        <select
                          id="referralSource"
                          className={field}
                          value={form.referralSource}
                          onChange={(e) => set("referralSource", e.target.value)}
                          aria-invalid={!!errors.referralSource}
                        >
                          <option value="">Please select</option>
                          {EDL_REFERRAL_SOURCES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={labelClass} htmlFor="referralDetail">
                          Further detail <span className="text-muted-foreground">(optional)</span>
                        </label>
                        <input
                          id="referralDetail"
                          className={field}
                          value={form.referralDetail}
                          onChange={(e) => set("referralDetail", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2 — Responsibility */}
                  {step === 1 && (
                    <div className="space-y-8">
                      <LongText
                        id="respCurrent"
                        question="Describe your present executive or senior leadership responsibilities."
                      />
                      <LongText
                        id="respDecisionTypes"
                        question="What types of organisational decisions are you authorised or expected to shape?"
                      />
                      <LongText
                        id="respApprovals"
                        question="Whose formal approval is normally required for decisions of this significance?"
                        note="Use roles, not names."
                      />
                      <LongText
                        id="respAuthority"
                        question="What implementation authority or access to the decision owner do you have?"
                      />
                    </div>
                  )}

                  {/* Step 3 — Decision trigger */}
                  {step === 2 && (
                    <div className="space-y-8">
                      <p className="rounded-sm border-l-2 border-gold bg-background p-5 text-sm leading-relaxed text-foreground">
                        Do not name protected individuals, customers, transactions or
                        confidential projects.
                      </p>

                      <LongText
                        id="decisionStatement"
                        question="Complete: “By [date], [role] must decide whether to…”"
                      />

                      <div>
                        <label className={labelClass} htmlFor="decisionDeadline">
                          Decision deadline <span className="text-muted-foreground">(required)</span>
                        </label>
                        <input
                          id="decisionDeadline"
                          type="date"
                          className={field}
                          value={form.decisionDeadline}
                          onChange={(e) => set("decisionDeadline", e.target.value)}
                          aria-invalid={!!errors.decisionDeadline}
                        />
                      </div>

                      <LongText id="decisionWhyNow" question="Why does this matter now?" />
                      <LongText
                        id="decisionAtRisk"
                        question="What money, time, capability, reputation or organisational standing is at risk?"
                      />
                      <LongText id="decisionAlreadyDecided" question="What is already decided?" />
                      <LongText
                        id="decisionAlternatives"
                        question="What genuine alternatives remain?"
                      />
                      <LongText
                        id="decisionOffLimits"
                        question="What must not be discussed in a cohort?"
                      />

                      <fieldset>
                        <legend className={labelClass}>
                          Can this case be anonymised sufficiently for cohort work?{" "}
                          <span className="text-muted-foreground">(required)</span>
                        </legend>
                        <div className="mt-3 space-y-2">
                          {EDL_YES_NO_UNSURE.map((v) => (
                            <label key={v} className="flex items-center gap-3 text-sm text-muted-foreground">
                              <input
                                type="radio"
                                name="anonymisable"
                                value={v}
                                className="h-4 w-4 accent-[hsl(var(--navy))]"
                                checked={form.anonymisable === v}
                                onChange={() => set("anonymisable", v)}
                                aria-invalid={!!errors.anonymisable}
                              />
                              {v}
                            </label>
                          ))}
                        </div>
                        {form.anonymisable === "No" && (
                          <p className="mt-4 rounded-sm border border-border bg-background p-4 text-sm leading-relaxed text-muted-foreground">
                            Your application will still be considered. It is referred
                            for human review, and a neutral executive case or an
                            individual route may be considered instead.
                          </p>
                        )}
                      </fieldset>
                    </div>
                  )}

                  {/* Step 4 — Confidentiality and conflict */}
                  {step === 3 && (
                    <div className="space-y-8">
                      <LongText
                        id="conflictNote"
                        question="Identify any organisation, sector or named commercial conflict that could make a shared cohort inappropriate."
                        note="Do not disclose unnecessary detail."
                        required={false}
                      />

                      <div className="space-y-5 border-t border-border pt-6">
                        <Check id="ackAuthorised">
                          I have not included information I am not authorised to disclose.
                        </Check>
                        <Check id="ackNoRecording">
                          I understand that sessions are not recorded and that AI meeting
                          assistants and transcription tools are prohibited.
                        </Check>
                        <Check id="ackConfidentialityLimits">
                          I understand that participant confidentiality reduces risk but
                          cannot guarantee absolute confidentiality.
                        </Check>
                      </div>

                      <p className="text-xs leading-relaxed text-muted-foreground">
                        The{" "}
                        <Link to="/terms" className="link-quiet">
                          Participant Confidentiality Undertaking
                        </Link>{" "}
                        is in legal review and is not presented for binding acceptance
                        at application stage.
                      </p>
                    </div>
                  )}

                  {/* Step 5 — Commitment, funding and access */}
                  {step === 4 && (
                    <div className="space-y-10">
                      <fieldset className="space-y-5">
                        <legend className="mb-2 font-serif text-base font-semibold text-foreground">
                          Participation
                        </legend>
                        <Check id="commitAttend">
                          I can attend the orientation and all four scheduled laboratories.
                        </Check>
                        <Check id="commitWeek4">
                          I understand that Week 4 is mandatory and that completion also
                          requires programme outputs and the 30-day review.
                        </Check>
                        <Check id="commitAppliedWork">
                          I will complete the required applied work between sessions.
                        </Check>
                        <Check id="commitChallenge">
                          I will challenge and receive challenge without treating peer
                          discussion as professional advice.
                        </Check>
                        <Check id="commitConfidentiality">
                          I will comply with the confidentiality protocol.
                        </Check>
                      </fieldset>

                      <fieldset>
                        <legend className={labelClass}>
                          How would the place be funded?{" "}
                          <span className="text-muted-foreground">(required)</span>
                        </legend>
                        <div className="mt-3 space-y-2">
                          {EDL_FUNDING_ROUTES.map((v) => (
                            <label key={v} className="flex items-center gap-3 text-sm text-muted-foreground">
                              <input
                                type="radio"
                                name="fundingRoute"
                                value={v}
                                className="h-4 w-4 accent-[hsl(var(--navy))]"
                                checked={form.fundingRoute === v}
                                onChange={() => set("fundingRoute", v)}
                                aria-invalid={!!errors.fundingRoute}
                              />
                              {v}
                            </label>
                          ))}
                        </div>

                        {form.fundingRoute === "Employer-funded" && (
                          <div className="mt-6 space-y-6 border-l-2 border-border pl-6">
                            {(
                              [
                                ["sponsorName", "Sponsor or approver name", "text"],
                                ["sponsorRole", "Sponsor or approver role", "text"],
                                ["sponsorEmail", "Sponsor or approver work email", "email"],
                                ["orgLegalName", "Organisation legal name", "text"],
                              ] as const
                            ).map(([key, question, type]) => (
                              <div key={key}>
                                <label className={labelClass} htmlFor={key}>
                                  {question} <span className="text-muted-foreground">(required)</span>
                                </label>
                                <input
                                  id={key}
                                  type={type}
                                  className={field}
                                  value={form[key]}
                                  onChange={(e) => set(key, e.target.value)}
                                  aria-invalid={!!errors[key]}
                                />
                              </div>
                            ))}

                            {(
                              [
                                ["poRequired", "Purchase order required?"],
                                ["vendorOnboardingRequired", "Vendor onboarding required?"],
                              ] as const
                            ).map(([key, question]) => (
                              <div key={key}>
                                <label className={labelClass} htmlFor={key}>
                                  {question} <span className="text-muted-foreground">(required)</span>
                                </label>
                                <select
                                  id={key}
                                  className={field}
                                  value={form[key]}
                                  onChange={(e) => set(key, e.target.value)}
                                  aria-invalid={!!errors[key]}
                                >
                                  <option value="">Please select</option>
                                  {EDL_YES_NO_UNSURE.map((v) => (
                                    <option key={v} value={v}>
                                      {v}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ))}

                            <div>
                              <label className={labelClass} htmlFor="expectedApprovalDate">
                                Expected approval date{" "}
                                <span className="text-muted-foreground">(optional)</span>
                              </label>
                              <input
                                id="expectedApprovalDate"
                                type="date"
                                className={field}
                                value={form.expectedApprovalDate}
                                onChange={(e) => set("expectedApprovalDate", e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </fieldset>

                      <fieldset>
                        <legend className={labelClass}>
                          Do you require a reasonable adjustment or access support to
                          participate fully?{" "}
                          <span className="text-muted-foreground">(required)</span>
                        </legend>
                        <p className={hint}>
                          We do not ask for a diagnosis. Tell us only what the programme
                          needs to arrange.
                        </p>
                        <div className="mt-3 space-y-2">
                          {EDL_ACCESS_ROUTES.map((r) => (
                            <label
                              key={r.value}
                              className="flex items-start gap-3 text-sm text-muted-foreground"
                            >
                              <input
                                type="radio"
                                name="accessRoute"
                                value={r.value}
                                className="mt-0.5 h-4 w-4 accent-[hsl(var(--navy))]"
                                checked={form.accessRoute === r.value}
                                onChange={() => set("accessRoute", r.value)}
                                aria-invalid={!!errors.accessRoute}
                              />
                              {r.label}
                            </label>
                          ))}
                        </div>

                        {form.accessRoute === "yes" && (
                          <div className="mt-5">
                            <label className={labelClass} htmlFor="accessDetail">
                              What should the programme arrange?{" "}
                              <span className="text-muted-foreground">(optional)</span>
                            </label>
                            <textarea
                              id="accessDetail"
                              rows={3}
                              maxLength={1000}
                              className={field}
                              value={form.accessDetail}
                              onChange={(e) => set("accessDetail", e.target.value)}
                            />
                            <p className={hint}>
                              Held as a separate restricted record and never included in
                              routine notifications or analytics.
                            </p>
                          </div>
                        )}

                        {form.accessRoute === "private" && (
                          <div className="mt-5">
                            <label className={labelClass} htmlFor="accessContactMethod">
                              Preferred confidential contact method{" "}
                              <span className="text-muted-foreground">(optional)</span>
                            </label>
                            <input
                              id="accessContactMethod"
                              className={field}
                              value={form.accessContactMethod}
                              onChange={(e) => set("accessContactMethod", e.target.value)}
                            />
                          </div>
                        )}
                      </fieldset>
                    </div>
                  )}

                  {/* Step 6 — Declaration */}
                  {step === 5 && (
                    <div className="space-y-8">
                      <div className="space-y-5">
                        <Check id="declAccurate">
                          The information provided is accurate to the best of my knowledge.
                        </Check>
                        <Check id="declNoAdmissionGuarantee">
                          I understand that submission does not guarantee admission.
                        </Check>
                        <Check id="declEmployerFundingSubject">
                          I understand that employer funding remains subject to confirmation.
                        </Check>
                        <Check id="declNoOutcomeGuarantee">
                          I understand that the programme does not guarantee a favourable
                          organisational or commercial outcome.
                        </Check>
                        <Check id="declPrivacyRead">
                          I have read the{" "}
                          <Link to="/privacy" className="link-quiet">
                            Programme Privacy Notice
                          </Link>
                          .
                        </Check>
                      </div>

                      <p className="border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
                        The Enrolment and Cancellation Terms are not accepted at this
                        stage. They are accepted after a conditional offer and before any
                        payment or employer commitment.
                      </p>

                      <div className="border-t border-border pt-6">
                        <Check id="marketingConsent" required={false}>
                          I would like to receive occasional Bright Leadership Consulting
                          insights and programme updates. I can unsubscribe at any time.
                        </Check>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Navigation */}
                <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-border pt-8">
                  {step > 0 && (
                    <button type="button" onClick={back} className="link-quiet text-sm">
                      Back
                    </button>
                  )}

                  {step < STEPS.length - 1 ? (
                    <button type="button" onClick={next} className="btn-brief">
                      Continue
                    </button>
                  ) : (
                    <button type="submit" className="btn-brief" disabled={submitting}>
                      {submitting ? "Submitting…" : "Submit application"}
                    </button>
                  )}

                  <Link to={EDL.route} className="link-quiet ml-auto text-sm">
                    Exit application
                  </Link>
                </div>
              </form>
              </FormContext.Provider>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EdlApply;
