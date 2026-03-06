import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import EAIDashboardPreview from "@/components/EAIDashboardPreview";
import AlignmentFrameworkDiagram from "@/components/diagrams/AlignmentFrameworkDiagram";
import DispersionModelDiagram from "@/components/diagrams/DispersionModelDiagram";
import AlignmentDriftDiagram from "@/components/diagrams/AlignmentDriftDiagram";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const dimensions = [
  {
    title: "Strategic Interpretation",
    description: "The degree to which executives share a consistent interpretation of the organisation's strategic direction and growth priorities.",
  },
  {
    title: "Decision Rights Clarity",
    description: "Whether authority boundaries are formally defined — or informally contested — across executive roles.",
  },
  {
    title: "Cross-Functional Coordination",
    description: "How effectively executive functions collaborate at interface points without requiring escalation.",
  },
  {
    title: "Escalation Pathways",
    description: "The clarity and consistency of escalation logic when decisions exceed individual authority.",
  },
  {
    title: "Accountability Architecture",
    description: "Whether accountability for outcomes is structurally assigned or ambiguously distributed.",
  },
  {
    title: "Risk Ownership",
    description: "The extent to which risk is formally owned at executive level rather than deferred or diffused.",
  },
];

const maturityLevels = [
  { score: 1, label: "Fragmented" },
  { score: 2, label: "Emerging" },
  { score: 3, label: "Structured" },
  { score: 4, label: "Cohesive" },
  { score: 5, label: "Integrated" },
];

const ExecutiveAlignmentIndex = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        path="/executive-alignment-index"
        title="Executive Alignment Index | Bright Leadership Consulting"
        description="A governance-level instrument measuring executive variance across decision rights, strategic interpretation, and escalation architecture."
      />
      <ScrollProgress />
      <Header />

      <main>
        {/* Section 1 — Introduction */}
        <section className="pt-36 pb-24 lg:pt-44 lg:pb-32 bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Governance Instrument
              </motion.p>

              <motion.h1
                className="heading-hero mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Executive Alignment Index
              </motion.h1>

              <motion.div
                className="space-y-6 body-brief"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                <p className="text-lg leading-relaxed text-muted-foreground">
                  The Executive Alignment Index is a governance-level diagnostic
                  that measures how consistently an executive team is aligned on
                  the structures that determine strategic execution.
                </p>

                <p className="text-lg leading-relaxed text-muted-foreground">
                  It quantifies variance across decision rights, strategic
                  interpretation, and escalation architecture — providing
                  boards and CEOs with objective clarity before intervention.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 2 — Alignment Drift */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                The Problem
              </motion.p>

              <motion.h2
                className="heading-section mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Executive Alignment Rarely Breaks. It Drifts.
              </motion.h2>

              <motion.div
                className="space-y-6 body-brief"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                <p>
                  In complex organisations, misalignment does not announce
                  itself. It accumulates through small interpretive differences
                  — each individually reasonable, collectively corrosive.
                </p>

                <p>
                  Executives may share intent while diverging on execution
                  logic: who decides, who escalates, who owns the consequence.
                </p>

                <p>
                  The result is not conflict. It is friction — slow enough to
                  be normalised, material enough to erode strategic velocity.
                </p>

                <p className="font-serif text-foreground font-medium text-xl leading-relaxed">
                  Averages conceal dispersion. Consensus meetings mask
                  structural variance.
                </p>

                <p>
                  The Executive Alignment Index replaces assumption with
                  measurement.
                </p>
              </motion.div>

              {/* Alignment Drift Diagram */}
              <motion.div
                className="mt-16"
                {...fade}
                transition={{ ...fade.transition, delay: 0.25 }}
              >
                <AlignmentDriftDiagram />
                <p className="mt-4 text-xs text-muted-foreground italic tracking-wide text-center">
                  Illustrative alignment drift as organisational complexity increases.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 3 — Six Structural Dimensions */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Alignment Dimensions
            </motion.p>

            <motion.h2
              className="heading-section mb-4 max-w-[680px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              Six Structural Dimensions
            </motion.h2>

            <motion.p
              className="body-brief max-w-[680px] mb-16"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              Executives are assessed across six dimensions that collectively
              determine whether strategic intent translates into coordinated
              execution.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14">
              {dimensions.map((dim, i) => (
                <motion.div
                  key={dim.title}
                  {...fade}
                  transition={{ ...fade.transition, delay: 0.1 + i * 0.06 }}
                >
                  <div className="border-l-2 border-primary pl-5">
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-3">
                      {dim.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {dim.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Alignment Framework Diagram */}
            <motion.div
              className="mt-20"
              {...fade}
              transition={{ ...fade.transition, delay: 0.4 }}
            >
              <AlignmentFrameworkDiagram />
              <p className="mt-4 text-xs text-muted-foreground italic tracking-wide text-center">
                Executive Alignment Architecture — six structural dimensions.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 4 — Alignment Maturity Scale */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Maturity Scale
              </motion.p>

              <motion.h2
                className="heading-section mb-4"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Alignment Maturity
              </motion.h2>

              <motion.p
                className="body-brief mb-16"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                Each dimension is scored on a calibrated 1–5 maturity scale,
                providing granular visibility into structural readiness.
              </motion.p>
            </div>

            {/* Scale visual */}
            <motion.div
              className="max-w-3xl"
              {...fade}
              transition={{ ...fade.transition, delay: 0.2 }}
            >
              {/* Horizontal bar */}
              <div className="relative mb-8">
                <div className="h-[2px] bg-border w-full" />
                <div className="flex justify-between -mt-[7px]">
                  {maturityLevels.map((level) => (
                    <div key={level.score} className="flex flex-col items-center" style={{ width: '20%' }}>
                      <div className="w-3 h-3 rounded-full border-2 border-primary bg-background" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Labels */}
              <div className="flex justify-between">
                {maturityLevels.map((level) => (
                  <div key={level.score} className="text-center" style={{ width: '20%' }}>
                    <span className="block font-serif text-lg font-semibold text-foreground">
                      {level.score}
                    </span>
                    <span className="block text-xs text-muted-foreground tracking-wide mt-1">
                      {level.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 5 — Index Output */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px] mb-16">
              <motion.p className="kicker mb-6" {...fade}>
                The Report
              </motion.p>

              <motion.h2
                className="heading-section mb-4"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Executive Alignment Index Report
              </motion.h2>

              <motion.div
                className="space-y-6 body-brief"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                <p>
                  Each engagement produces a concise, board-ready dashboard
                  providing objective clarity across five output areas:
                </p>

                <div className="space-y-1.5 border-l-2 border-border pl-6">
                  <p>Composite Alignment Score</p>
                  <p>Dimension-Level Variance Indicators</p>
                  <p>Executive Dispersion Mapping</p>
                  <p>Priority Action Matrix</p>
                  <p>Governance Risk and Escalation Commentary</p>
                </div>

                <p className="font-serif text-foreground font-medium text-xl leading-relaxed">
                  The report anchors board discussion and strategic
                  recalibration.
                </p>
              </motion.div>
            </div>

            {/* Dashboard */}
            <motion.div
              className="max-w-4xl"
              {...fade}
              transition={{ ...fade.transition, delay: 0.25 }}
            >
              <EAIDashboardPreview />
              <p className="mt-4 text-xs text-muted-foreground italic tracking-wide">
                Illustrative Executive Alignment Index dashboard.
              </p>
            </motion.div>

            {/* Dispersion Model */}
            <motion.div
              className="max-w-4xl mt-20"
              {...fade}
              transition={{ ...fade.transition, delay: 0.35 }}
            >
              <p className="font-serif text-lg font-semibold text-foreground mb-6">
                Executive Dispersion
              </p>
              <DispersionModelDiagram />
              <p className="mt-4 text-xs text-muted-foreground italic tracking-wide text-center">
                Illustrative variance in executive alignment scores.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 6 — Commissioning Context */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Commissioning Context
              </motion.p>

              <motion.h2
                className="heading-section mb-4"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                When Executive Alignment Becomes a Strategic Priority
              </motion.h2>

              <motion.div
                className="space-y-6 body-brief"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                <p>
                  The Executive Alignment Index is typically commissioned
                  during periods of structural change:
                </p>

                <div className="space-y-1.5 border-l-2 border-border pl-6">
                  <p>Strategic planning cycles</p>
                  <p>Leadership transitions</p>
                  <p>AI transformation initiatives</p>
                  <p>Post-acquisition integration</p>
                  <p>Rapid organisational growth</p>
                  <p>Governance scrutiny escalation</p>
                </div>

                <p>
                  Engagements are delivered by arrangement and calibrated to
                  organisational scale.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 7 — CTA */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.div
                className="space-y-6"
                {...fade}
              >
                <p className="font-serif text-foreground font-medium text-xl leading-relaxed">
                  Executive alignment determines execution velocity.
                </p>

                <p className="body-brief">
                  Enquiries are handled confidentially.
                </p>

                <Link
                  to="/contact"
                  className="link-quiet"
                >
                  Enquire Regarding Executive Alignment
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ExecutiveAlignmentIndex;
