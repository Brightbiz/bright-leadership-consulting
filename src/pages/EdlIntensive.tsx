import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import {
  EDL,
  EDL_ARCHITECTURE,
  EDL_CONDITIONS,
  EDL_CTA,
  EDL_FAQ,
  EDL_INCLUDED,
  EDL_NOT_FOR,
  EDL_OUTCOMES,
  EDL_SCHEDULE,
  EDL_STAGES,
  EDL_SUITABLE_FOR,
} from "@/data/edlIntensive";
import { trackProgrammeApplyClick, trackProgrammePageView } from "@/lib/analytics";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

/** Coarse device category only. No identifiers are derived from the client. */
const deviceCategory = () => {
  if (typeof window === "undefined") return "unknown";
  const w = window.innerWidth;
  return w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop";
};

const CtaPair = ({ section }: { section: string }) => (
  <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
    <Link
      to={EDL.applyRoute}
      onClick={() =>
        trackProgrammeApplyClick({ programme: EDL.title, pageSection: section })
      }
      className="btn-brief"
    >
      {EDL_CTA.primary}
    </Link>
    <Link to={EDL.employerRoute} className="link-quiet text-sm">
      {EDL_CTA.secondary}
    </Link>
  </div>
);

const EdlIntensive = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    trackProgrammePageView({
      programme: EDL.title,
      source: params.get("utm_source") ?? undefined,
      campaign: params.get("utm_campaign") ?? undefined,
      deviceCategory: deviceCategory(),
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Staging: not indexed and not linked from navigation until the
          published legal documents and programme mailbox are approved. */}
      <SEOHead
        title="Executive Decision Leadership Intensive | Bright Leadership Consulting"
        description="A four-week, principal-led intensive for six executives facing consequential decisions. Live online from 20 October 2026. Admission by application."
        path={EDL.route}
        noindex
      />
      <ScrollProgress />
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-36 pb-24 lg:pt-44 lg:pb-32 bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Founding cohort · Six places · Live online
              </motion.p>

              <motion.h1
                className="heading-hero mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                {EDL.title}
              </motion.h1>

              <motion.div
                className="space-y-6"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                <p className="text-lg leading-relaxed text-foreground">
                  Make a consequential decision with greater clarity, disciplined
                  challenge and execution confidence.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  A four-week, principal-led intensive for six executives facing a
                  live strategic choice. Strengthen the decision itself while
                  developing a repeatable discipline to frame, test, align and
                  mobilise high-stakes choices.
                </p>

                <dl className="mt-10 space-y-4 border-l-2 border-border pl-6">
                  <div>
                    <dt className="sr-only">Programme dates</dt>
                    <dd className="text-sm text-foreground">{EDL.programmeLine}</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Implementation review</dt>
                    <dd className="text-sm text-muted-foreground">{EDL.reviewLine}</dd>
                  </div>
                  <div>
                    <dt className="sr-only">Fee</dt>
                    <dd className="text-sm text-foreground">{EDL.fee}</dd>
                  </div>
                </dl>
              </motion.div>

              <CtaPair section="hero" />

              <p className="mt-6 max-w-[520px] text-xs leading-relaxed text-muted-foreground">
                Application does not guarantee admission. No payment is requested
                before suitability has been established.
              </p>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* The decision problem */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                The decision problem
              </motion.p>
              <motion.h2
                className="heading-section mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Important decisions do not weaken for lack of intelligence.
              </motion.h2>
              <motion.div className="body-brief" {...fade} transition={{ ...fade.transition, delay: 0.2 }}>
                <p>
                  The most consequential decisions rarely fail because leaders lack
                  intelligence or commitment. They weaken when the decision itself
                  is poorly framed, critical assumptions are protected from
                  challenge, formal authority and practical influence diverge, or
                  implementation begins before people understand what has actually
                  been decided.
                </p>
                <p>
                  The {EDL.title} creates the disciplined space to address those
                  conditions around one real decision—without transferring your
                  accountability to a consultant, coach or cohort.
                </p>
              </motion.div>
            </div>

            <ol className="mt-12 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
              {EDL_CONDITIONS.map((c, i) => (
                <li key={c.label} className="rounded-sm bg-background p-8">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mb-3 font-serif text-base font-semibold text-foreground">
                    {c.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{c.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="section-divider" />

        {/* Outcomes */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Applied outputs
              </motion.p>
              <motion.h2 className="heading-section mb-4" {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
                What you will leave with
              </motion.h2>
              <ul className="mt-10 space-y-2 border-l-2 border-border pl-6">
                {EDL_OUTCOMES.map((o) => (
                  <li key={o} className="text-sm leading-relaxed text-muted-foreground">
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Programme journey */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Programme journey
              </motion.p>
              <motion.h2 className="heading-section mb-8" {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
                Four weeks. One consequential decision. A discipline that transfers.
              </motion.h2>
            </div>

            <ol className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
              {EDL_STAGES.map((s) => (
                <li key={s.stage} className="rounded-sm bg-background p-8">
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
                    {s.stage}
                  </p>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{s.purpose}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Applied output
                  </p>
                  <p className="mt-1 font-serif text-sm font-semibold text-foreground">{s.output}</p>
                </li>
              ))}
            </ol>

            <div className="body-brief mt-12 max-w-[680px]">
              <p>
                Short conceptual inputs are combined with executive cases,
                disciplined peer challenge, private application and workplace
                action. The programme excludes long lectures, generic motivation,
                forced disclosure and unstructured advice-giving.
              </p>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Included */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                What is included
              </motion.p>
              <motion.h2 className="heading-section mb-4" {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
                One fee. {EDL.fee}
              </motion.h2>
              <ul className="mt-10 space-y-2 border-l-2 border-border pl-6">
                {EDL_INCLUDED.map((i) => (
                  <li key={i} className="text-sm leading-relaxed text-muted-foreground">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Confidentiality */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Confidentiality
              </motion.p>
              <motion.h2 className="heading-section mb-8" {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
                Serious work requires disciplined confidentiality.
              </motion.h2>
              <div className="body-brief">
                <p>
                  Participants work with anonymised cases, control what they
                  disclose and may use a neutral executive case where necessary.
                  Sessions are not recorded. AI meeting assistants and automated
                  transcription are prohibited. Sensitive reasoning may be
                  transferred to the individual advisory session within the
                  published confidentiality and privacy boundaries.
                </p>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                <li>
                  <Link to="/terms" className="link-quiet text-sm">
                    Participant Confidentiality Undertaking
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="link-quiet text-sm">
                    Programme Privacy Notice
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="link-quiet text-sm">
                    Accessibility contact
                  </Link>
                </li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                The final Participant Confidentiality Undertaking and enrolment
                terms are in legal review. Nothing is presented for binding
                acceptance at application stage.
              </p>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Suitability */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Suitability
              </motion.p>
              <motion.h2 className="heading-section mb-12" {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
                Designed for executives carrying real decision responsibility
              </motion.h2>
            </div>

            <div className="grid gap-px bg-border md:grid-cols-2">
              <div className="rounded-sm bg-background p-8 lg:p-10">
                <h3 className="mb-6 font-serif text-base font-semibold text-foreground">
                  This programme is designed for
                </h3>
                <ul className="space-y-3">
                  {EDL_SUITABLE_FOR.map((s) => (
                    <li key={s} className="text-sm leading-relaxed text-muted-foreground">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-sm bg-background p-8 lg:p-10">
                <h3 className="mb-6 font-serif text-base font-semibold text-foreground">
                  It is not designed for
                </h3>
                <ul className="space-y-3">
                  {EDL_NOT_FOR.map((s) => (
                    <li key={s} className="text-sm leading-relaxed text-muted-foreground">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Dates */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <div className="max-w-[760px]">
              <motion.p className="kicker mb-6" {...fade}>
                Dates
              </motion.p>
              <motion.h2 className="heading-section mb-10" {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
                The complete schedule
              </motion.h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Executive Decision Leadership Intensive schedule. All times are UK time.
                  </caption>
                  <thead>
                    <tr className="border-b border-border">
                      <th scope="col" className="py-3 pr-6 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Session
                      </th>
                      <th scope="col" className="py-3 pr-6 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Date
                      </th>
                      <th scope="col" className="py-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {EDL_SCHEDULE.map((s) => (
                      <tr key={s.session} className="border-b border-border/60">
                        <th scope="row" className="py-4 pr-6 font-serif text-sm font-semibold text-foreground">
                          {s.session}
                        </th>
                        <td className="py-4 pr-6 text-muted-foreground">{s.when}</td>
                        <td className="py-4 text-muted-foreground">{s.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
                All times are UK time. The UK clocks change on 25 October 2026;
                calendar invitations are issued time-zone aware. Applications open{" "}
                {EDL.applicationsWindow} and close at {EDL.closingTime}.
              </p>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Facilitator and architecture */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Principal
              </motion.p>
              <motion.h2 className="heading-section mb-8" {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
                Principal-led by Bright Leadership Consulting
              </motion.h2>
              <div className="body-brief">
                <p>
                  The founding cohort is led by {EDL.lead}, drawing on senior
                  banking leadership, management consulting, business advisory and
                  executive-development experience. The programme brings Bright
                  Leadership Consulting’s decision-quality and executive-alignment
                  work into a concentrated applied format.
                </p>
              </div>

              <dl className="mt-12 space-y-6 border-l-2 border-border pl-6">
                {EDL_ARCHITECTURE.map((a) => (
                  <div key={a.name}>
                    <dt className="font-serif text-sm font-semibold text-foreground">{a.name}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{a.detail}</dd>
                  </div>
                ))}
              </dl>

              <div className="body-brief mt-12">
                <p className="text-sm">
                  The programme develops decision capability and supports
                  disciplined application to a real case. It does not guarantee
                  certainty, consensus or a favourable organisational or commercial
                  result. The executive and organisation retain responsibility for
                  authorisation, implementation and professional advice.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* FAQ */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Questions
              </motion.p>
              <motion.h2 className="heading-section mb-10" {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
                Before you apply
              </motion.h2>

              <dl className="space-y-8">
                {EDL_FAQ.map((f) => (
                  <div key={f.q} className="border-t border-border pt-6">
                    <dt className="mb-3 font-serif text-base font-semibold text-foreground">{f.q}</dt>
                    <dd className="text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Final CTA */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.h2 className="heading-section mb-8" {...fade}>
                Bring one consequential decision. Leave with a stronger decision and
                a discipline you can use again.
              </motion.h2>
              <div className="body-brief">
                <p>
                  Six founding-cohort places are available by application.
                  Applications close at {EDL.closingTime}. Suitable applications may
                  be assessed on a rolling basis.
                </p>
              </div>

              <div className="mt-10">
                <Link
                  to={EDL.applyRoute}
                  onClick={() =>
                    trackProgrammeApplyClick({ programme: EDL.title, pageSection: "final" })
                  }
                  className="btn-brief"
                >
                  {EDL_CTA.primary}
                </Link>
              </div>

              <p className="mt-8 text-sm text-muted-foreground">
                Employer funding or an invoice required?{" "}
                <Link to={EDL.employerRoute} className="link-quiet">
                  {EDL_CTA.secondary}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EdlIntensive;
