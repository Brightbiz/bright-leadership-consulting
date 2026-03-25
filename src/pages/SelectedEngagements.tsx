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

const SelectedEngagements = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Selected Engagements | Bright Leadership Consulting"
        description="Anonymised case abstracts from governance-level advisory engagements across financial services, infrastructure, healthcare, and technology."
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
                  to preserve client confidentiality.
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
