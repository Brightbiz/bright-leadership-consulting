import { ArrowRight } from "lucide-react";
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

const phases = [
  {
    number: "01",
    label: "Measure",
    instrument: "Executive Alignment Index™",
    category: "Diagnostic",
    headline: "Before Intervention, Measure",
    paragraphs: [
      "Executive alignment rarely breaks — it drifts. The Executive Alignment Index™ quantifies that drift across six structural dimensions: Strategic Interpretation, Decision Rights Clarity, Cross-Functional Coordination, Escalation Pathways, Accountability Architecture, and Risk Ownership.",
      "The output is a board-ready Executive Alignment Report™ — not a sentiment survey, but a governance instrument that reveals variance between executives. This diagnostic establishes the factual foundation for every subsequent decision.",
    ],
    outputs: [
      "Executive Alignment Report™ with dispersion analysis",
      "Six-dimension diagnostic dashboard",
      "Board-ready strategic briefing",
    ],
    link: "/executive-alignment-index",
    linkLabel: "Explore the Executive Alignment Index™",
  },
  {
    number: "02",
    label: "Install",
    instrument: "ALIGN™ Intervention",
    category: "Advisory",
    headline: "Establish Structural Clarity",
    paragraphs: [
      "Measurement without action is observation. The ALIGN™ Intervention translates diagnostic findings into defined decision architecture — clarifying who decides what, how escalation flows, and where accountability sits.",
      "This is not a workshop series or a coaching programme. It is a structured intervention that installs the governance architecture required for coherent strategic execution. The engagement is designed for leadership teams navigating growth, transition, or AI-driven transformation.",
    ],
    outputs: [
      "Decision rights architecture",
      "Escalation protocol design",
      "Accountability framework installation",
    ],
    link: "/contact",
    linkLabel: "Discuss Advisory Engagement",
  },
  {
    number: "03",
    label: "Sustain",
    instrument: "Executive Oversight™",
    category: "Advisory",
    headline: "Maintain Alignment Under Pressure",
    paragraphs: [
      "Alignment is not a fixed state — it requires ongoing structural attention, particularly during periods of growth, leadership transition, or strategic pivots. Executive Oversight™ provides the governance continuity that prevents drift from returning.",
      "Through periodic re-measurement, structured executive reviews, and governance recalibration, this engagement ensures that the clarity installed through ALIGN™ remains intact as organisational complexity evolves.",
    ],
    outputs: [
      "Periodic alignment re-measurement",
      "Governance recalibration protocols",
      "Executive review cadence",
    ],
    link: "/contact",
    linkLabel: "Discuss Ongoing Advisory",
  },
  {
    number: "04",
    label: "Develop",
    instrument: "Executive Programmes",
    category: "Development",
    headline: "Extend Leadership Capability",
    paragraphs: [
      "Once structural alignment is installed, capability development becomes meaningful. Our CPD-accredited executive programmes extend leadership capability across seven disciplines — from AI governance and strategic productivity to workforce transformation.",
      "Programmes are delivered through our dedicated learning platform and include the flagship 33-module Executive Leadership Mastery pathway, Strategic Leadership in the Age of AI, and facilitated Corporate Retreats for boards and leadership teams.",
    ],
    outputs: [
      "CPD-accredited executive programmes",
      "AI Leadership Blueprint™ creation",
      "Facilitated corporate retreats",
    ],
    link: "/courses",
    linkLabel: "View Executive Programmes",
  },
];

const AdvisoryProcess = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Advisory Process | Bright Leadership Consulting"
        description="From diagnostic measurement to executive development — how we deliver structured advisory engagements for senior leadership teams."
        path="/advisory-process"
      />
      <ScrollProgress />
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-36 pb-24 lg:pt-44 lg:pb-32 bg-background">
          <div className="container-brief">
            <div className="max-w-[720px]">
              <motion.p className="kicker mb-6" {...fade}>
                Advisory Architecture
              </motion.p>
              <motion.h1
                className="heading-hero mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                How We Work
              </motion.h1>
              <motion.p
                className="text-lg leading-relaxed text-muted-foreground"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                Every engagement follows a deliberate four-phase architecture —
                from diagnostic measurement to sustained development. Each phase
                builds on the previous, ensuring that intervention is grounded in
                evidence and that capability investment targets verified gaps.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Sequence bar */}
        <div className="border-y border-border bg-muted/30">
          <div className="container-brief">
            <motion.div
              className="flex items-center justify-center gap-3 md:gap-6 py-5 overflow-x-auto"
              {...fade}
            >
              {phases.map((phase, i) => (
                <div key={phase.label} className="flex items-center gap-3 md:gap-6 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary">
                      {phase.number}
                    </span>
                    <span className="text-sm font-serif font-semibold text-foreground">
                      {phase.label}
                    </span>
                  </div>
                  {i < phases.length - 1 && (
                    <div className="flex items-center">
                      <div className="w-6 md:w-10 h-px bg-border" />
                      <div className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-border" />
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Phase sections */}
        {phases.map((phase, i) => (
          <div key={phase.label}>
            <section
              className={`section-brief ${i % 2 === 1 ? "section-pearl" : "bg-background"}`}
              aria-label={`Phase ${phase.number}: ${phase.label}`}
            >
              <div className="container-brief">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                  {/* Left column */}
                  <div className="lg:col-span-7">
                    <motion.div className="flex items-baseline gap-4 mb-6" {...fade}>
                      <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
                        Phase {phase.number}
                      </span>
                      <span className="text-[9px] font-medium tracking-[0.12em] text-primary/50 uppercase">
                        {phase.category}
                      </span>
                    </motion.div>

                    <motion.h2
                      className="heading-section mb-2"
                      {...fade}
                      transition={{ ...fade.transition, delay: 0.1 }}
                    >
                      {phase.headline}
                    </motion.h2>

                    <motion.p
                      className="text-xs font-medium text-primary mb-8"
                      {...fade}
                      transition={{ ...fade.transition, delay: 0.15 }}
                    >
                      {phase.instrument}
                    </motion.p>

                    {phase.paragraphs.map((p, pi) => (
                      <motion.p
                        key={pi}
                        className="body-brief mb-4 last:mb-0"
                        {...fade}
                        transition={{ ...fade.transition, delay: 0.2 + pi * 0.05 }}
                      >
                        {p}
                      </motion.p>
                    ))}
                  </div>

                  {/* Right column — outputs */}
                  <div className="lg:col-span-5 flex flex-col justify-center">
                    <motion.div
                      className="border border-border p-6 lg:p-8"
                      {...fade}
                      transition={{ ...fade.transition, delay: 0.25 }}
                    >
                      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-5">
                        Key Outputs
                      </p>
                      <ul className="space-y-3 mb-6">
                        {phase.outputs.map((output) => (
                          <li
                            key={output}
                            className="text-sm text-foreground flex items-start gap-2.5"
                          >
                            <span className="mt-2 w-1 h-1 rounded-full bg-primary shrink-0" />
                            {output}
                          </li>
                        ))}
                      </ul>
                      <Link to={phase.link} className="link-quiet text-sm">
                        {phase.linkLabel}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </section>

            {i < phases.length - 1 && <div className="section-divider" />}
          </div>
        ))}

        <div className="section-divider" />

        {/* Closing CTA */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <div className="max-w-[620px] mx-auto text-center">
              <motion.div className="space-y-6" {...fade}>
                <p className="kicker">Begin With Measurement</p>
                <h2 className="heading-section">
                  Every Engagement Starts With the Diagnostic
                </h2>
                <p className="body-brief">
                  The Executive Alignment Index™ provides the evidence base for
                  every advisory decision that follows. Whether you are navigating
                  growth, transition, or AI transformation — measurement comes first.
                </p>
                <p className="body-brief text-muted-foreground">
                  Advisory enquiries are handled confidentially.
                </p>
                <Link to="/contact" className="link-quiet">
                  Discuss Executive Alignment
                  <ArrowRight className="h-3.5 w-3.5" />
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

export default AdvisoryProcess;
