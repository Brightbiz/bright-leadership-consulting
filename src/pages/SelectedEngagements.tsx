import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const engagements = [
  {
    sector: "Financial Services",
    context: "Post-merger integration across two legacy executive teams with overlapping mandates and undefined reporting lines.",
    scope: "Executive Alignment Index deployment, followed by a 12-week structural advisory engagement with the Group CEO and incoming Chair.",
    outcome: "Alignment clarity achieved across the combined executive committee. Role mandates redefined. Board confidence in leadership structure restored within one quarter.",
  },
  {
    sector: "Infrastructure & Engineering",
    context: "Rapid international expansion had outpaced the executive team's structural coherence. Strategic decisions were being deferred or duplicated across regions.",
    scope: "Diagnostic phase covering eight senior leaders across three geographies. Advisory engagement with the CEO and CPO on executive architecture.",
    outcome: "Decision-making authority was clarified regionally. Executive meeting cadence restructured. Two latent succession risks were identified and addressed proactively.",
  },
  {
    sector: "Healthcare & Life Sciences",
    context: "A newly appointed CEO inherited an executive team with strong individual capability but limited collective alignment on strategic priorities.",
    scope: "Executive Alignment Index followed by a series of structured advisory sessions with the CEO. Parallel engagement with the Chair on board-executive interface.",
    outcome: "Strategic priorities were consolidated from twelve to four. Executive team operating rhythm was redesigned. Chair reported measurable improvement in board-executive coherence.",
  },
  {
    sector: "Professional Services",
    context: "Partnership-led governance model was creating structural ambiguity at the executive layer. Growth targets were being set without aligned leadership capacity.",
    scope: "Alignment diagnostic across the senior partner group and executive leadership. Advisory engagement with the Managing Partner and incoming Senior Independent Director.",
    outcome: "Leadership mandates were formalised for the first time. A governance framework was introduced between the partnership board and the executive team. Strategic planning cycles were shortened by 40%.",
  },
  {
    sector: "Technology & Digital",
    context: "Series C scale-up transitioning from founder-led to professionally managed. Executive hires from different organisational cultures were not integrating effectively.",
    scope: "Executive Alignment Index deployment across the C-suite. Advisory engagement with the CEO and lead investor on leadership architecture.",
    outcome: "Cultural fault lines were surfaced and addressed structurally. Two executive roles were redefined. Investor confidence in the leadership team was formally documented at the next board review.",
  },
];

const SelectedEngagements = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Selected Engagements"
        description="Anonymised case abstracts from governance-level advisory engagements across financial services, infrastructure, healthcare, professional services, and technology sectors."
        path="/selected-engagements"
      />
      <Header />

      <main className="pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container-narrow">
          {/* Header */}
          <motion.div
            className="max-w-3xl mb-20 lg:mb-28"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-6">
              Selected Engagements
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-foreground leading-tight mb-6">
              Anonymised Case Abstracts
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
              The following abstracts represent a selection of governance-level advisory engagements. 
              All identifying details have been removed to preserve client confidentiality.
            </p>
          </motion.div>

          {/* Engagements */}
          <div className="space-y-0 border-t border-border">
            {engagements.map((engagement, index) => (
              <motion.article
                key={engagement.sector}
                className="border-b border-border py-12 lg:py-16"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
              >
                <div className="grid lg:grid-cols-[200px_1fr] gap-6 lg:gap-12">
                  <div>
                    <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                      {engagement.sector}
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase mb-2">Context</p>
                      <p className="text-foreground text-sm leading-relaxed">{engagement.context}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase mb-2">Scope</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{engagement.scope}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-wider text-muted-foreground/70 uppercase mb-2">Outcome</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{engagement.outcome}</p>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Closing note */}
          <motion.div
            className="mt-16 lg:mt-20 max-w-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-muted-foreground text-sm leading-relaxed italic">
              All engagements are conducted under strict confidentiality. 
              Further detail is available on request to qualified commissioning parties.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SelectedEngagements;
