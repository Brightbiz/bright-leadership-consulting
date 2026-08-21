import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import AuditShell from "@/components/aiAudit/AuditShell";
import OptionList from "@/components/aiAudit/OptionList";
import ReadinessResult from "@/components/aiAudit/ReadinessResult";
import RouteCard from "@/components/aiAudit/RouteCard";
import DetailsForm from "@/components/aiAudit/DetailsForm";

import {
  GENERAL_INTEREST_QUESTION,
  MISMATCH_COPY,
  PROGRAMME_PAGE_URL,
  Q10_OPTIONS,
  Q11A_OPTIONS,
  Q11_OPTIONS,
  Q12_OPTIONS,
  Q13_OPTIONS,
  Q14_OPTIONS,
  Q9_OPTIONS,
  QTY_OPTIONS,
  READINESS_QUESTIONS,
  type ProductKey,
} from "@/data/aiAudit/questions";
import {
  bandFor,
  classify,
  computeRoute,
  initialState,
  readinessTotal,
  resolvedQuantity,
  type Action,
  type AuditState,
  type Q10,
  type Q11Key,
  type Q11aKey,
  type Q12,
  type Q13,
  type Q14,
  type Q9,
} from "@/data/aiAudit/logic";
import { buildThinkificPurchaseUrl } from "@/data/aiAudit/thinkific";
import {
  trackAuditActionClick,
  trackAuditOutboundPurchase,
  trackAuditResultView,
  trackAuditStart,
  trackAuditStepView,
} from "@/lib/aiAuditAnalytics";

type Screen =
  | "intro"
  | "readiness"
  | "q9"
  | "q9a"
  | "q10"
  | "q11"
  | "q11a"
  | "q12"
  | "q13"
  | "q14"
  | "quantityUnresolved"
  | "result"
  | "mismatch"
  | "generalInterest"
  | "details";

const PROGRESS: Record<Screen, number> = {
  intro: 0,
  readiness: 0,
  q9: 54,
  q9a: 56,
  q10: 60,
  q11: 68,
  q11a: 72,
  q12: 80,
  q13: 86,
  q14: 92,
  quantityUnresolved: 96,
  details: 98,
  result: 100,
  mismatch: 100,
  generalInterest: 100,
};

const primaryBtn =
  "min-h-[44px] rounded-sm bg-gold px-6 py-3 text-[15px] font-medium text-navy transition-colors hover:bg-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:cursor-not-allowed disabled:opacity-45";
const secondaryBtn =
  "min-h-[44px] rounded-sm border border-navy-foreground/25 px-5 py-3 text-[15px] transition-colors hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy";
const backLink =
  "min-h-[44px] text-[14px] text-navy-foreground/70 underline underline-offset-4 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:opacity-40";

const AiAudit = () => {
  const { search } = useLocation();
  const [state, setState] = useState<AuditState>(initialState);
  const [screen, setScreen] = useState<Screen>("intro");
  const [readinessIndex, setReadinessIndex] = useState(0);
  const [history, setHistory] = useState<Screen[]>([]);
  const [qtyChoice, setQtyChoice] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{ action: Action; product: string } | null>(
    null,
  );
  const [resultReported, setResultReported] = useState(false);

  const route = useMemo(() => computeRoute(state), [state]);
  const classification = useMemo(() => classify(state), [state]);

  const goto = (next: Screen) => {
    setHistory((h) => [...h, screen]);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    if (screen === "readiness" && readinessIndex > 0) {
      setReadinessIndex((i) => i - 1);
      return;
    }
    setHistory((h) => {
      const previous = h[h.length - 1];
      if (previous) setScreen(previous);
      return h.slice(0, -1);
    });
  };

  useEffect(() => {
    trackAuditStepView(screen, PROGRESS[screen]);
  }, [screen]);

  /* --------------------------------------------------------- result event */

  useEffect(() => {
    if (screen !== "result" || resultReported) return;
    const recommended =
      "recommended" in route ? String(route.recommended.product) : route.type;
    trackAuditResultView({
      score: readinessTotal(state),
      band: bandFor(readinessTotal(state)).title,
      classification,
      recommendedProduct: state.stillUncertain ? "digitalUnresolved" : recommended,
      alternativeProduct: "alternative" in route ? (route.alternative ?? null) : null,
      quantityResolved: resolvedQuantity(state) !== null,
    });
    setResultReported(true);
  }, [screen, resultReported, route, state, classification]);

  /* -------------------------------------------------------------- handlers */

  const answerReadiness = (value: number) =>
    setState((s) => {
      const readiness = [...s.readiness];
      readiness[readinessIndex] = value;
      return { ...s, readiness };
    });

  const setQ9 = (v: Q9) => {
    setState((s) => ({ ...s, q9: v }));
    if (v === "F") goto("q9a");
    else if (v === "G") goto("generalInterest");
    else goto("q10");
  };

  const setQ9a = (v: "yes" | "no") => {
    setState((s) => ({ ...s, q9a: v }));
    goto(v === "no" ? "mismatch" : "q10");
  };

  const setQ10 = (v: Q10) => {
    setState((s) => ({ ...s, q10: v }));
    goto("q11");
  };

  const toggleQ11 = (key: Q11Key) =>
    setState((s) => {
      if (key === "recommendMe") {
        const turningOn = !s.q11.recommendMe;
        return {
          ...s,
          q11: {
            digital: false,
            digitalNamed: false,
            digitalDiscussion: false,
            facilitated: false,
            tailored: false,
            recommendMe: turningOn,
          },
        };
      }
      const next = { ...s.q11, [key]: !s.q11[key] };
      if (next[key]) next.recommendMe = false;
      return { ...s, q11: next };
    });

  const toggleQ11a = (key: Q11aKey) =>
    setState((s) => {
      if (key === "uncertain") {
        return { ...s, q11a: s.q11a.includes("uncertain") ? [] : ["uncertain"] };
      }
      const without = s.q11a.filter((k) => k !== "uncertain");
      return {
        ...s,
        q11a: without.includes(key) ? without.filter((k) => k !== key) : [...without, key],
      };
    });

  const afterQ11 = () => goto(state.q11.tailored ? "q11a" : "q12");

  const afterQ14 = () => {
    setState((s) => ({ ...s, exactQty: null }));
    if (route.type === "unresolved") {
      setQtyChoice(null);
      goto("quantityUnresolved");
      return;
    }
    goto("result");
  };

  const finaliseQty = () => {
    if (qtyChoice === "still") {
      setState((s) => ({ ...s, stillUncertain: true, exactQty: null }));
    } else if (qtyChoice) {
      setState((s) => ({
        ...s,
        q10: qtyChoice as Q10,
        stillUncertain: false,
        exactQty: null,
      }));
    }
    goto("result");
  };

  const onExactQtyChange = (raw: string) => {
    const n = Number(raw);
    setState((s) => ({
      ...s,
      exactQty: raw.trim() === "" ? null : Number.isInteger(n) ? n : Number.NaN,
    }));
  };

  const restart = () => {
    setState(initialState());
    setReadinessIndex(0);
    setHistory([]);
    setQtyChoice(null);
    setPendingAction(null);
    setResultReported(false);
    setScreen("intro");
    window.scrollTo({ top: 0 });
  };

  const downloadPublicSummary = () => {
    const content = [
      "Bright Leadership Consulting",
      "AI Leadership Readiness Audit — Public Summary",
      "",
      "The audit examines how an organisation connects AI with leadership judgement across",
      "strategic purpose, constructive challenge, human judgement, accountability, governance",
      "and risk, leadership alignment, organisational change and responsible execution.",
      "",
      `Programme information: ${PROGRAMME_PAGE_URL}`,
      "",
      "No personal data was collected to generate this file.",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "bright-ai-leadership-public-summary.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Result-page action. The verified programme-platform purchase is the only
   * outbound route, and only for a buyer purchasing for themselves; every other
   * action collects details in-site first.
   */
  const onAction = (
    action: Action,
    emphasis: "primary" | "secondary" | "tertiary",
    product: ProductKey,
  ) => {
    trackAuditActionClick({
      action: action.kind,
      label: action.label,
      product,
      classification,
      emphasis,
      quantity: resolvedQuantity(state),
    });

    if (action.kind === "thinkific") {
      const destination = buildThinkificPurchaseUrl({ campaignSearch: search });
      trackAuditOutboundPurchase(destination);
      window.setTimeout(() => window.location.assign(destination), 120);
      return;
    }

    if (action.kind === "info" && classification === "Not currently qualified") {
      downloadPublicSummary();
      return;
    }

    if (action.kind === "email") {
      window.location.href =
        "mailto:enquiries@brightleadershipconsulting.com?subject=AI%20Leadership%20Readiness%20Audit%20-%20question";
      return;
    }

    setPendingAction({ action, product });
    goto("details");
  };

  /* --------------------------------------------------------------- screens */

  const stepLabel = useMemo(() => {
    if (screen === "readiness") return `Readiness question ${readinessIndex + 1} of 8`;
    const labels: Record<Exclude<Screen, "readiness">, string> = {
      intro: "AI Leadership Readiness Audit",
      q9: "Objective",
      q9a: "Related leadership need",
      q10: "Participants",
      q11: "Delivery format",
      q11a: "Tailored delivery reason",
      q12: "Timing",
      q13: "Decision role",
      q14: "Purchasing preference",
      quantityUnresolved: "Participant estimate",
      details: "Contact and delivery details",
      result: "Your readiness result and recommended route",
      mismatch: "Your readiness result",
      generalInterest: "Your readiness result",
    };
    return labels[screen as Exclude<Screen, "readiness">];
  }, [screen, readinessIndex]);

  const renderScreen = () => {
    if (screen === "intro") {
      return (
        <section>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
            A four-minute diagnostic
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight">
            Is your organisation leading —{" "}
            <em className="text-gold not-italic">or just nodding along?</em>
          </h1>
          <p className="mt-6 max-w-[560px] text-[15px] leading-relaxed text-navy-foreground/75">
            Eight questions on how your organisation connects AI with leadership judgement, followed
            by a short set of questions to match you to the right route. You'll get an immediate
            readiness result and a personalised recommendation — no call required to reach a decision.
          </p>
          <button
            type="button"
            className={`${primaryBtn} mt-8`}
            onClick={() => {
              trackAuditStart();
              goto("readiness");
            }}
          >
            Start the audit
          </button>
          <p className="mt-5 max-w-[560px] text-[13px] leading-relaxed text-navy-foreground/50">
            This is decision support based on your responses, not a verified assessment of the whole
            organisation.
          </p>
        </section>
      );
    }

    if (screen === "readiness") {
      const item = READINESS_QUESTIONS[readinessIndex];
      const selected = state.readiness[readinessIndex];
      return (
        <section>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
            Readiness · Question {readinessIndex + 1} of 8 — {item.dim}
          </p>
          <h1 className="mt-4 max-w-[620px] font-serif text-2xl leading-snug">{item.q}</h1>
          <OptionList
            legend={item.q}
            name={`readiness-${readinessIndex}`}
            options={item.opts.map((o, i) => [String(i + 1), o] as const)}
            value={selected ? String(selected) : null}
            onChange={(v) => answerReadiness(Number(v))}
          />
          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              className={backLink}
              disabled={readinessIndex === 0}
              onClick={back}
            >
              ← Back
            </button>
            <button
              type="button"
              className={primaryBtn}
              disabled={!selected}
              onClick={() => {
                if (readinessIndex < 7) setReadinessIndex((i) => i + 1);
                else goto("q9");
              }}
            >
              {readinessIndex === 7 ? "Continue" : "Next"}
            </button>
          </div>
        </section>
      );
    }

    if (screen === "q9" || screen === "q10") {
      const isQ9 = screen === "q9";
      return (
        <section>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
            {isQ9 ? "Routing · What are you primarily trying to achieve?" : "Routing · Who would participate?"}
          </p>
          <h1 className="mt-4 font-serif text-2xl leading-snug">Select the closest answer.</h1>
          <OptionList
            legend={isQ9 ? "Primary objective" : "Participants"}
            name={screen}
            options={isQ9 ? Q9_OPTIONS : Q10_OPTIONS}
            value={isQ9 ? state.q9 : state.q10}
            onChange={(v) => (isQ9 ? setQ9(v as Q9) : setQ10(v as Q10))}
          />
          <div className="mt-8">
            <button type="button" className={backLink} onClick={back}>
              ← Back
            </button>
          </div>
        </section>
      );
    }

    if (screen === "q9a") {
      return (
        <section>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">Routing</p>
          <h1 className="mt-4 max-w-[620px] font-serif text-2xl leading-snug">
            Do you also have a related leadership-development need — governance, judgement,
            accountability or alignment?
          </h1>
          <OptionList
            legend="Related leadership-development need"
            name="q9a"
            options={[
              ["yes", "Yes"],
              ["no", "No"],
            ] as const}
            value={state.q9a}
            onChange={(v) => setQ9a(v as "yes" | "no")}
          />
          <div className="mt-8">
            <button type="button" className={backLink} onClick={back}>
              ← Back
            </button>
          </div>
        </section>
      );
    }

    if (screen === "q11") {
      const anySpecific = Q11_OPTIONS.some(
        ([k]) => k !== "recommendMe" && state.q11[k as Q11Key],
      );
      const disabled: Q11Key[] = state.q11.recommendMe
        ? (Q11_OPTIONS.filter(([k]) => k !== "recommendMe").map(([k]) => k) as Q11Key[])
        : anySpecific
          ? ["recommendMe"]
          : [];
      return (
        <section>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
            Routing · What delivery format would be acceptable?
          </p>
          <h1 className="mt-4 font-serif text-2xl leading-snug">Select all that apply.</h1>
          <OptionList
            legend="Acceptable delivery formats"
            name="q11"
            multiple
            options={Q11_OPTIONS}
            value={Q11_OPTIONS.filter(([k]) => state.q11[k as Q11Key]).map(([k]) => k) as Q11Key[]}
            disabledValues={disabled}
            onChange={(v) => toggleQ11(v as Q11Key)}
          />
          <div className="mt-8 flex items-center justify-between gap-4">
            <button type="button" className={backLink} onClick={back}>
              ← Back
            </button>
            <button
              type="button"
              className={primaryBtn}
              disabled={!Object.values(state.q11).some(Boolean)}
              onClick={afterQ11}
            >
              Next
            </button>
          </div>
        </section>
      );
    }

    if (screen === "q11a") {
      return (
        <section>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
            Routing · Tailored delivery — confirm the reason
          </p>
          <h1 className="mt-4 font-serif text-2xl leading-snug">
            Which of these applies? Select all that apply.
          </h1>
          <OptionList
            legend="Tailored delivery reasons"
            name="q11a"
            multiple
            options={Q11A_OPTIONS}
            value={state.q11a}
            onChange={(v) => toggleQ11a(v as Q11aKey)}
          />
          <div className="mt-8 flex items-center justify-between gap-4">
            <button type="button" className={backLink} onClick={back}>
              ← Back
            </button>
            <button
              type="button"
              className={primaryBtn}
              disabled={state.q11a.length === 0}
              onClick={() => goto("q12")}
            >
              Next
            </button>
          </div>
        </section>
      );
    }

    if (screen === "q12" || screen === "q13" || screen === "q14") {
      const config = {
        q12: {
          eyebrow: "Routing · When is access or delivery required?",
          options: Q12_OPTIONS,
          value: state.q12,
          set: (v: string) => setState((s) => ({ ...s, q12: v as Q12 })),
          next: () => goto("q13"),
          label: "Next",
        },
        q13: {
          eyebrow: "Routing · What role do you have in the purchasing decision?",
          options: Q13_OPTIONS,
          value: state.q13,
          set: (v: string) => setState((s) => ({ ...s, q13: v as Q13 })),
          next: () => goto("q14"),
          label: "Next",
        },
        q14: {
          eyebrow: "Routing · How would you prefer to purchase?",
          options: Q14_OPTIONS,
          value: state.q14,
          set: (v: string) => setState((s) => ({ ...s, q14: v as Q14 })),
          next: afterQ14,
          label: "See my result",
        },
      }[screen];

      return (
        <section>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
            {config.eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-2xl leading-snug">Select the closest answer.</h1>
          <OptionList
            legend={config.eyebrow}
            name={screen}
            options={config.options}
            value={config.value}
            onChange={config.set}
          />
          <div className="mt-8 flex items-center justify-between gap-4">
            <button type="button" className={backLink} onClick={back}>
              ← Back
            </button>
            <button
              type="button"
              className={primaryBtn}
              disabled={!config.value}
              onClick={config.next}
            >
              {config.label}
            </button>
          </div>
        </section>
      );
    }

    if (screen === "quantityUnresolved") {
      return (
        <section>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
            Recommended format: Digital programme access
          </p>
          <h1 className="mt-4 max-w-[620px] font-serif text-2xl leading-snug">
            The appropriate number of places depends on who needs to participate. Select the closest
            current estimate to view the relevant purchasing route.
          </h1>
          <OptionList
            legend="Closest current estimate"
            name="quantity"
            options={QTY_OPTIONS}
            value={qtyChoice}
            onChange={(v) => setQtyChoice(v)}
          />
          <div className="mt-8 flex items-center justify-between gap-4">
            <button type="button" className={backLink} onClick={back}>
              ← Back
            </button>
            <button type="button" className={primaryBtn} disabled={!qtyChoice} onClick={finaliseQty}>
              Continue
            </button>
          </div>
        </section>
      );
    }

    if (screen === "mismatch") {
      return (
        <>
          <ReadinessResult state={state} />
          <hr className="my-10 border-navy-foreground/15" />
          <p className="max-w-[620px] text-[15px] leading-relaxed text-navy-foreground/75">
            {MISMATCH_COPY}
          </p>
          <button type="button" className={`${secondaryBtn} mt-8`} onClick={restart}>
            Retake the audit
          </button>
        </>
      );
    }

    if (screen === "generalInterest") {
      return (
        <>
          <ReadinessResult state={state} />
          <hr className="my-10 border-navy-foreground/15" />
          <p className="max-w-[620px] text-[15px] leading-relaxed text-navy-foreground/75">
            {GENERAL_INTEREST_QUESTION}
          </p>
          <div className="mt-8 flex flex-col items-start gap-4">
            <button type="button" className={secondaryBtn} onClick={downloadPublicSummary}>
              Download the public summary
            </button>
            <a
              href={PROGRAMME_PAGE_URL}
              className="text-[14px] text-navy-foreground/70 underline underline-offset-4 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
            >
              View programme information
            </a>
          </div>
          <button type="button" className={`${secondaryBtn} mt-10`} onClick={restart}>
            Retake the audit
          </button>
        </>
      );
    }

    if (screen === "details" && pendingAction) {
      return (
        <DetailsForm
          action={pendingAction.action}
          product={pendingAction.product}
          state={state}
          onBack={() => {
            setPendingAction(null);
            back();
          }}
        />
      );
    }

    // Result
    const rawProduct = "recommended" in route ? route.recommended.product : "individual";
    const recommendedProduct: ProductKey =
      rawProduct === "unresolved" || rawProduct === "organisational-unresolved"
        ? "digitalUnresolved"
        : rawProduct;
    const alternative = "alternative" in route ? (route.alternative ?? null) : null;
    const showAlternative = Boolean(alternative);

    return (
      <>
        <ReadinessResult state={state} />
        <hr className="my-10 border-navy-foreground/15" />
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
          Recommended route
        </p>
        <div className="mt-5 grid gap-5">
          <RouteCard
            product={recommendedProduct}
            isRecommended
            state={state}
            participantNote={
              state.stillUncertain ||
              ((recommendedProduct === "facilitated" || recommendedProduct === "tailored") &&
                state.q10 === "H")
            }
            onExactQtyChange={onExactQtyChange}
            onAction={onAction}
          />
          {showAlternative && alternative && (
            <RouteCard
              product={alternative}
              isRecommended={false}
              state={state}
              onExactQtyChange={onExactQtyChange}
              onAction={onAction}
            />
          )}
        </div>
        <button type="button" className={`${secondaryBtn} mt-10`} onClick={restart}>
          Retake the audit
        </button>
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>AI Leadership Readiness Audit | Bright Leadership Consulting</title>
        <meta
          name="description"
          content="An eight-question diagnostic on how your organisation connects AI with leadership judgement, with an immediate readiness result and a recommended route."
        />
        {/* Unpublished pending review: excluded from search and social discovery. */}
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AuditShell progress={PROGRESS[screen]} stepLabel={stepLabel}>
        {renderScreen()}
      </AuditShell>
    </>
  );
};

export default AiAudit;
