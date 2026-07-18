import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const engagements = [
  {
    sector: "Financial Services",
    context: "Post-acquisition executive alignment across two newly integrated leadership teams with overlapping mandates and undefined escalation authority.",
    scope: "Executive Alignment Index™ deployment, followed by a 12-week structural advisory engagement with the Group CEO and incoming Chair.",
    outcome: "Alignment clarity achieved across the combined executive committee. Decision rights and role mandates redefined. Board confidence in the leadership structure restored within one quarter.",
  },
  {
    sector: "Infrastructure & Engineering",
    context: "Rapid international expansion had outpaced executive structural coherence. Strategic decisions were being deferred or duplicated across regional leadership.",
    scope: "Diagnostic phase covering eight senior leaders across three geographies. Structural advisory engagement with the CEO and CPO on executive decision architecture.",
    outcome: "Decision-making authority was clarified regionally. Executive governance cadence restructured. Two latent succession risks were identified and addressed before they compounded.",
  },
  {
    sector: "Healthcare & Life Sciences",
    context: "A newly appointed CEO inherited an executive team with strong individual capability but material variance in strategic interpretation across the leadership group.",
    scope: "Executive Alignment Index™ followed by structured advisory sessions with the CEO. Parallel governance engagement with the Chair on the board-executive interface.",
    outcome: "Strategic priorities consolidated from twelve to four. Executive operating rhythm redesigned around decision rights. Chair reported measurable improvement in board-executive coherence.",
  },
  {
    sector: "Professional Services",
    context: "Partnership-led governance was creating structural ambiguity at the executive layer. Growth targets were being set without aligned leadership accountability or escalation clarity.",
    scope: "Alignment diagnostic across the senior partner group and executive leadership. Advisory engagement with the Managing Partner and incoming Senior Independent Director.",
    outcome: "Leadership mandates were formalised for the first time. A governance framework was installed between the partnership board and the executive team. Strategic planning cycles shortened by 40%.",
  },
  {
    sector: "Technology & Digital",
    context: "Series C organisation transitioning from founder-led to professionally managed governance. Executive hires from different institutional cultures were not integrating into a coherent leadership architecture.",
    scope: "Executive Alignment Index™ deployment across the C-suite. Structural advisory engagement with the CEO and lead investor on leadership architecture and decision rights.",
    outcome: "Cultural and structural fault lines were surfaced and addressed through governance redesign. Two executive roles were redefined. Investor confidence in the leadership team was formally documented at the next board review.",
  },
];

const narratives = [
  {
    sector: "Global Financial Services Group",
    challenge:
      "Eighteen months after a cross-border acquisition, the combined executive committee remained structurally unresolved. Two Group Executives held overlapping mandates. Escalation to the Chair had become inconsistent, and the integration programme was slipping against board-approved milestones. The Chair described the executive layer as 'busy but unaligned' — a phrase that, on structural interpretation, indicated variance in strategic priority, not effort.",
    intervention:
      "The engagement began with a full deployment of the Executive Alignment Index™ across the eleven-member executive committee. The diagnostic surfaced material variance in three areas: interpretation of the integration thesis, decision rights at the Group–Divisional interface, and the definition of 'material' escalation. A twelve-week structural advisory engagement followed, working directly with the Group CEO and Chair to redraw the executive operating model, formalise decision rights, and install a governance cadence at the board–executive interface.",
    outcome:
      "By the end of the engagement, the executive committee was operating against a single, documented alignment reference. Two role mandates were formally restructured. The Chair reported to the Nominations Committee that board confidence in the executive layer had been restored, and the integration programme returned to its original milestone trajectory within one quarter.",
  },
  {
    sector: "Infrastructure & Engineering Group",
    challenge:
      "A rapidly internationalising engineering group had grown from two operating geographies to five in under three years. Executive decisions were increasingly being deferred, duplicated, or quietly re-litigated at regional level. The CEO described the pattern as 'decisions that don't stay decided.' On diagnostic examination, this was not a behavioural issue — it was a structural absence of decision rights at the Group–Region interface, compounded by two latent succession exposures that had not been formally acknowledged at board level.",
    intervention:
      "The Executive Alignment Index™ was deployed across eight senior leaders spanning three geographies. Structural advisory work then focused on the CEO and Chief People Officer, redesigning the executive decision architecture, clarifying regional authority, and reconstructing the Group Executive operating rhythm. A parallel governance workstream surfaced and documented the two succession exposures for the Nominations Committee.",
    outcome:
      "Decision-making authority was formally clarified across all five geographies. The Group Executive operating rhythm was restructured around explicit decision rights rather than standing agenda items. Both succession exposures were addressed before they compounded, and the CEO reported a measurable reduction in decisions re-entering the executive agenda after resolution.",
  },
  {
    sector: "Healthcare & Life Sciences",
    challenge:
      "A newly appointed CEO inherited an executive team of individually capable leaders whose strategic interpretation of the organisation's mandate varied materially across the group. The board had approved twelve strategic priorities in the preceding cycle; in practice, no two members of the executive team ranked them in the same order. The Chair had begun to describe board–executive interaction as 'polite but unresolved.'",
    intervention:
      "The engagement opened with a full Executive Alignment Index™ deployment across the executive team, followed by structured advisory sessions with the CEO on strategic consolidation and executive operating design. A parallel governance engagement was conducted with the Chair, focused specifically on the board–executive interface: how strategy was received, interrogated, and confirmed between the two bodies.",
    outcome:
      "Strategic priorities were consolidated from twelve to four, each with a named executive owner and a documented decision right. The executive operating rhythm was redesigned around these four priorities. At the following board review, the Chair formally recorded a measurable improvement in board–executive coherence — the first such entry in the minute record for over two years.",
  },
];


const SelectedEngagements = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Selected Engagements | Bright Leadership Consulting"
        description="Anonymised board-level advisory case narratives — executive alignment diagnostics, governance interventions, and documented outcomes across financial services, infrastructure, healthcare, professional services, and technology."
        path="/selected-engagements"
      />
      <ScrollProgress />
      <Header />

      <main>
        {/* Section 1 — Introduction */}
        <section className="pt-36 pb-24 lg:pt-44 lg:pb-32 bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Selected Engagements
              </motion.p>

              <motion.h1
                className="heading-hero mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Anonymised Case Abstracts
              </motion.h1>

              <motion.div
                className="space-y-6 body-brief"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                <p className="text-lg leading-relaxed text-muted-foreground">
                  The following abstracts represent a selection of governance-level
                  advisory engagements. All identifying details have been removed
                  to preserve client confidentiality. Three engagements are
                  recorded in{" "}
                  <a href="#narratives" className="underline underline-offset-4 decoration-border hover:decoration-foreground text-foreground transition-colors">
                    longer narrative form below
                  </a>
                  .
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 2 — Engagement Abstracts */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <div className="space-y-0">
              {engagements.map((engagement, index) => (
                <motion.article
                  key={engagement.sector}
                  className="border-b border-border py-14 lg:py-18 first:pt-0"
                  {...fade}
                  transition={{ ...fade.transition, delay: 0.05 + index * 0.06 }}
                >
                  <div className="grid lg:grid-cols-[200px_1fr] gap-6 lg:gap-16">
                    {/* Sector label */}
                    <div>
                      <p className="kicker !mb-0">
                        {engagement.sector}
                      </p>
                    </div>

                    {/* Detail columns */}
                    <div className="max-w-[680px] space-y-8">
                      <div>
                        <p className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase mb-2.5">
                          Context
                        </p>
                        <p className="text-foreground text-[15px] leading-relaxed">
                          {engagement.context}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase mb-2.5">
                          Scope
                        </p>
                        <p className="text-muted-foreground text-[15px] leading-relaxed">
                          {engagement.scope}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase mb-2.5">
                          Outcome
                        </p>
                        <p className="text-muted-foreground text-[15px] leading-relaxed">
                          {engagement.outcome}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 2b — Extended Case Narratives */}
        <section id="narratives" className="section-brief bg-background scroll-mt-24">
          <div className="container-brief">
            <div className="max-w-[680px] mb-16">
              <motion.p className="kicker mb-6" {...fade}>
                Extended Case Narratives
              </motion.p>
              <motion.h2 className="heading-section mb-6" {...fade}>
                Challenge, Intervention, Outcome
              </motion.h2>
              <motion.p className="body-brief" {...fade}>
                A small number of engagements are recorded here in longer form —
                still fully anonymised — to illustrate how structural misalignment
                presents, how the diagnostic is deployed, and how governance-level
                outcomes are documented at board level.
              </motion.p>
            </div>

            <div className="space-y-0">
              {narratives.map((n, index) => (
                <motion.article
                  key={n.sector}
                  className="border-t border-border py-16 lg:py-20 first:border-t-0 first:pt-0"
                  {...fade}
                  transition={{ ...fade.transition, delay: 0.05 + index * 0.06 }}
                >
                  <div className="max-w-[680px]">
                    <p className="kicker mb-6">{n.sector}</p>

                    <div className="space-y-10">
                      <div>
                        <p className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase mb-3">
                          Challenge
                        </p>
                        <p className="text-foreground text-[17px] leading-[1.7]">
                          {n.challenge}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase mb-3">
                          Intervention
                        </p>
                        <p className="text-muted-foreground text-[17px] leading-[1.7]">
                          {n.intervention}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase mb-3">
                          Outcome
                        </p>
                        <p className="text-muted-foreground text-[17px] leading-[1.7]">
                          {n.outcome}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />


        {/* Section 3 — Closing + CTA */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.div
                className="space-y-6"
                {...fade}
              >
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                  All engagements are conducted under strict confidentiality.
                  Further detail is available on request to qualified commissioning parties.
                </p>

                <div className="pt-4">
                   <Link
                    to="/contact"
                    className="link-quiet"
                  >
                    Discuss Executive Alignment
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SelectedEngagements;
