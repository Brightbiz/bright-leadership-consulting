import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, ExternalLink, Clock, Volume2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import EAIDashboardPreview from "@/components/EAIDashboardPreview";
import AlignmentFrameworkDiagram from "@/components/diagrams/AlignmentFrameworkDiagram";
import DispersionModelDiagram from "@/components/diagrams/DispersionModelDiagram";
import AlignmentDriftDiagram from "@/components/diagrams/AlignmentDriftDiagram";

const videoScripts = [
  {
    id: "about-us",
    tab: "About Us — Website",
    title: "About Us Intro Video Script",
    subtitle: "Primary Website Positioning — Leadership Authority Narrative",
    format: "90–120 Seconds | Institutional Voice-Over",
    tone: "Authoritative, Confident, Evidence-Led",
    positioning: "Executive Programme Provider & Strategic Advisory Partner",
    destination: "Primary Website — About Us Page",
    href: "/downloads/about-us-intro-video-script.html",
    sections: [
      {
        label: "Opening — The Context",
        timing: "0:00–0:25",
        content: "In 2025, LinkedIn published its annual Skills on the Rise report — identifying the capabilities most in demand across global industries. Every year, the list shifts. Technologies emerge. Platforms evolve. Methodologies are replaced.\n\nBut one pattern has remained constant, across every edition, every market, every sector:\n\nLeadership capability remains the scarcest, most consequential resource in professional life."
      },
      {
        label: "Our Positioning — What We Are",
        timing: "0:25–0:45",
        content: "Bright Leadership Consulting was established to address this structural reality.\n\nWe are an executive programme provider and strategic advisory partner to senior leaders, boards, and Chief People Officers who require more than content — they require transformation with accountability."
      },
      {
        label: "Our Portfolio — Three Pathways",
        timing: "0:45–1:10",
        content: "Executive Leadership Mastery — our flagship thirty-three module pathway. Seven leadership disciplines. Eighty-plus hours. Sixty-six CPD points.\n\nStrategic Leadership in the Age of AI — governance and leadership implications of AI adoption. Participants develop a practical AI Leadership Blueprint™.\n\nCorporate Retreats — two to three day facilitated engagements. Diagnostic-led. Outcome-focused. Confidential."
      },
      {
        label: "Closing — The Invitation",
        timing: "1:10–1:30",
        content: "Every programme is grounded in the Executive Alignment Index™ — our proprietary diagnostic instrument that measures the structural health of leadership capability before intervention begins.\n\nBright Leadership Consulting. Structural clarity for consequential leadership."
      },
    ],
  },
  {
    id: "thinkific",
    tab: "About Us — Thinkific",
    title: "Thinkific About Us Video Script",
    subtitle: "Executive Programme Provider Positioning — Institutional Narrative",
    format: "90–120 Seconds | Institutional Voice-Over",
    tone: "Authoritative, Confident, Understated Precision",
    positioning: "Executive Programme Provider & Strategic Facilitator",
    destination: "Thinkific — About Bright Leadership Page",
    href: "/downloads/thinkific-about-us-video-script.html",
    sections: [
      {
        label: "Opening — The Context",
        timing: "0:00–0:20",
        content: "Most senior leaders do not lack capability.\n\nThey lack structural clarity.\n\nIn an environment where artificial intelligence is reshaping industries, redefining competitive advantage, and disrupting governance models, the challenge is no longer acquiring skills — it is maintaining alignment between strategy, capability, and execution at pace."
      },
      {
        label: "Our Positioning — What We Are",
        timing: "0:20–0:40",
        content: "We are not a training provider.\n\nWe are an executive programme facilitator and strategic advisory partner to senior leaders, boards, and Chief People Officers who require more than content — they require transformation with accountability."
      },
      {
        label: "Our Portfolio — Three Pathways",
        timing: "0:40–1:10",
        content: "Executive Leadership Mastery — our flagship thirty-three module pathway combining seven leadership disciplines into a single accredited development architecture.\n\nStrategic Leadership in the Age of AI — governance and leadership implications of artificial intelligence adoption. Participants develop a practical AI Leadership Blueprint™.\n\nCorporate Retreats — two to three day facilitated engagements. Diagnostic-led. Outcome-focused. Confidential."
      },
      {
        label: "Closing — The Invitation",
        timing: "1:10–1:30",
        content: "Every programme we deliver is grounded in the Executive Alignment Index™ — our proprietary diagnostic instrument that measures the structural health of leadership capability before intervention begins.\n\nBright Leadership Consulting. Structural clarity for consequential leadership."
      },
    ],
  },
];

const VideoScriptsTabs = () => {
  const [activeTab, setActiveTab] = useState("about-us");
  const script = videoScripts.find((s) => s.id === activeTab)!;

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex border-b border-border mb-0">
        {videoScripts.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveTab(s.id)}
            className={`px-5 py-3 text-sm font-medium tracking-wide transition-colors duration-200 border-b-2 -mb-px ${
              activeTab === s.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.tab}
          </button>
        ))}
      </div>

      {/* Script content */}
      <div className="border border-t-0 border-border rounded-b-md">
        {/* Meta header */}
        <div className="bg-muted/50 px-6 py-5 border-b border-border">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
            {script.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{script.subtitle}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-xs text-muted-foreground">{script.format}</span>
            </div>
            <div className="flex items-start gap-2">
              <Volume2 className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-xs text-muted-foreground">{script.tone}</span>
            </div>
          </div>
        </div>

        {/* Script sections */}
        <div className="divide-y divide-border">
          {script.sections.map((section, i) => (
            <div key={i} className="px-6 py-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium tracking-[0.15em] uppercase text-primary">
                  {section.label}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {section.timing}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer link */}
        <div className="px-6 py-4 bg-muted/30 border-t border-border">
          <a
            href={script.href}
            target="_blank"
            rel="noopener noreferrer"
            className="link-quiet text-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            View Full Production Document
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

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
                Executive Alignment Index™
              </motion.h1>

              <motion.div
                className="space-y-6 body-brief"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                <p className="text-lg leading-relaxed text-muted-foreground">
                  The Executive Alignment Index™ is a governance-level diagnostic
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
        <section className="section-brief section-pearl">
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
                  The Executive Alignment Index™ replaces assumption with
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
        <section className="section-brief section-pearl">
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

        {/* Section 5 — Diagnostic Output */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px] mb-16">
              <motion.p className="kicker mb-6" {...fade}>
                Diagnostic Output
              </motion.p>

              <motion.h2
                className="heading-section mb-4"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Executive Alignment Report
              </motion.h2>

              <motion.div
                className="space-y-6 body-brief"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                <p>
                  The Executive Alignment Index™ produces a concise Executive
                  Alignment Report summarising the composite alignment score,
                  dimension-level results, leadership variance indicators, and
                  priority areas for executive discussion.
                </p>

                <p>
                  Each engagement produces a board-ready dashboard providing
                  objective clarity across six output areas:
                </p>

                <div className="space-y-1.5 border-l-2 border-border pl-6">
                  <p>Composite Alignment Score</p>
                  <p>Dimension-Level Variance Indicators</p>
                  <p>Alignment Variance &amp; Confidence Level</p>
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
                Illustrative Executive Alignment Index™ dashboard.
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
        <section className="section-brief section-pearl">
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
                  The Executive Alignment Index™ is typically commissioned
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

        {/* Executive Alignment Brief Download */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.div
                className="border-l-2 border-primary pl-6"
                {...fade}
              >
                <p className="body-brief">
                  For a concise overview of the Executive Alignment Index™,
                  download the{" "}
                  <Link
                    to="/executive-alignment-brief"
                    className="link-quiet inline"
                  >
                    Executive Alignment Brief
                  </Link>
                  .
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 7 — Video Scripts */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px] mb-16">
              <motion.p className="kicker mb-6" {...fade}>
                Production Assets
              </motion.p>

              <motion.h2
                className="heading-section mb-4"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Institutional Video Scripts
              </motion.h2>

              <motion.p
                className="body-brief"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                Two authoritative video scripts — each 90–120 seconds — position the firm
                as an institutional executive programme provider. One anchors the
                primary website, the other frames the Thinkific learning platform.
              </motion.p>
            </div>

            <motion.div
              className="max-w-4xl"
              {...fade}
              transition={{ ...fade.transition, delay: 0.2 }}
            >
              <VideoScriptsTabs />
            </motion.div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 8 — CTA */}
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
