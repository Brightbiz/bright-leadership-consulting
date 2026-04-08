import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import AugmentedLeadershipDiagram from "@/components/diagrams/AugmentedLeadershipDiagram";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const maturityLevels = [
  { level: "1", name: "Awareness", desc: "AI is recognised but rarely used in practice. Leadership curiosity is emerging." },
  { level: "2", name: "Experimentation", desc: "Pilot projects underway. Isolated teams exploring AI applications." },
  { level: "3", name: "Operational Adoption", desc: "AI integrated into operational processes. Governance frameworks forming." },
  { level: "4", name: "Strategic Integration", desc: "AI supports strategic decision-making at executive level. Cross-functional coordination." },
  { level: "5", name: "Intelligent Enterprise", desc: "AI embedded across the entire organisation. Continuous learning and adaptation." },
];

const roadmapPhases = [
  { phase: "Discover", desc: "Identify opportunities, evaluate the strategic landscape, and assess organisational readiness." },
  { phase: "Design", desc: "Develop AI strategy, define use cases, and establish governance frameworks." },
  { phase: "Deploy", desc: "Launch pilot initiatives, validate assumptions, and build early momentum." },
  { phase: "Develop", desc: "Build organisational capability, refine processes, and scale successful pilots." },
  { phase: "Drive", desc: "Embed AI across the enterprise, sustain transformation, and measure strategic impact." },
];

const AugmentedLeadership = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Augmented Leadership™ | Bright Leadership Consulting"
        description="Augmented Leadership™ unifies Human, AI, and Organisational Intelligence into one strategic framework — helping executives lead AI transformation with structural clarity."
        path="/augmented-leadership"
      />
      <ScrollProgress />
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-36 pb-24 lg:pt-44 lg:pb-32 bg-background">
          <div className="container-brief">
            <div className="max-w-[720px]">
              <motion.p className="kicker mb-6" {...fade}>
                Proprietary Methodology
              </motion.p>
              <motion.h1
                className="heading-hero mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Augmented Leadership™
              </motion.h1>
              <motion.p
                className="text-lg leading-relaxed text-muted-foreground"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                The convergence of Human Intelligence, AI Intelligence, and
                Organisational Intelligence — integrated into a single strategic
                framework for leaders navigating AI transformation.
              </motion.p>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Three Pillars + Diagram */}
        <section className="section-brief section-pearl" aria-label="Three Intelligence Pillars">
          <div className="container-brief">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
              {/* Left column: Pillars */}
              <div className="lg:col-span-5">
                <motion.p className="kicker mb-6" {...fade}>
                  The Framework
                </motion.p>
                <motion.h2
                  className="heading-section mb-4"
                  {...fade}
                  transition={{ ...fade.transition, delay: 0.1 }}
                >
                  Three Intelligences. One Leadership Model.
                </motion.h2>
                <motion.p
                  className="body-brief mb-10"
                  {...fade}
                  transition={{ ...fade.transition, delay: 0.15 }}
                >
                  Augmented Leadership™ recognises that AI transformation is not a
                  technology problem — it is a leadership capability challenge that
                  requires three forms of intelligence working in concert.
                </motion.p>

                <div className="space-y-8">
                  {[
                    {
                      title: "Human Intelligence",
                      desc: "Strategic judgement, ethical reasoning, stakeholder empathy, and the capacity to lead through ambiguity. The capabilities AI cannot replicate.",
                    },
                    {
                      title: "AI Intelligence",
                      desc: "Understanding AI's strategic implications, governance requirements, and practical applications. Not technical expertise — strategic literacy.",
                    },
                    {
                      title: "Organisational Intelligence",
                      desc: "Alignment architecture, decision rights, cross-functional coordination, and the structural readiness to absorb and sustain AI transformation.",
                    },
                  ].map((pillar, i) => (
                    <motion.div
                      key={pillar.title}
                      className="border-l-2 border-border pl-5"
                      {...fade}
                      transition={{ ...fade.transition, delay: 0.2 + i * 0.08 }}
                    >
                      <h3 className="font-serif text-base font-semibold text-foreground mb-1.5">
                        {pillar.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {pillar.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right column: Diagram */}
              <div className="lg:col-span-7 flex items-center justify-center">
                <AugmentedLeadershipDiagram />
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Maturity Model */}
        <section className="section-brief bg-background" aria-label="AI Leadership Maturity Model">
          <div className="container-brief">
            <div className="max-w-[720px]">
              <motion.p className="kicker mb-6" {...fade}>
                Maturity Model
              </motion.p>
              <motion.h2
                className="heading-section mb-4"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Five Stages of AI Leadership Maturity
              </motion.h2>
              <motion.p
                className="body-brief mb-12"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                Organisations progress through five stages of AI maturity.
                Understanding where your organisation sits today is the first step
                toward a deliberate transformation strategy.
              </motion.p>

              <div className="space-y-0">
                {maturityLevels.map((ml, i) => (
                  <motion.div
                    key={ml.level}
                    className="flex gap-5 py-5 border-b border-border last:border-b-0"
                    {...fade}
                    transition={{ ...fade.transition, delay: 0.1 + i * 0.06 }}
                  >
                    <span className="font-serif text-2xl font-bold text-primary/30 shrink-0 w-8">
                      {ml.level}
                    </span>
                    <div>
                      <h3 className="font-serif text-base font-semibold text-foreground mb-1">
                        {ml.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {ml.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Transformation Roadmap */}
        <section className="section-brief section-pearl" aria-label="AI Transformation Leadership Roadmap">
          <div className="container-brief">
            <div className="max-w-[720px]">
              <motion.p className="kicker mb-6" {...fade}>
                Transformation Roadmap
              </motion.p>
              <motion.h2
                className="heading-section mb-4"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                From Awareness to Enterprise Integration
              </motion.h2>
              <motion.p
                className="body-brief mb-12"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                The Augmented Leadership™ Roadmap defines five phases of
                organisational AI transformation — each building on the previous to
                create a structured pathway from discovery to enterprise-wide
                integration.
              </motion.p>

              <div className="space-y-6">
                {roadmapPhases.map((rp, i) => (
                  <motion.div
                    key={rp.phase}
                    className="flex gap-5 items-start"
                    {...fade}
                    transition={{ ...fade.transition, delay: 0.1 + i * 0.06 }}
                  >
                    <div className="shrink-0 w-24 pt-0.5">
                      <span className="text-xs font-bold tracking-[0.15em] uppercase text-primary">
                        {rp.phase}
                      </span>
                    </div>
                    <div className="border-l border-border pl-5 pb-2">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {rp.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Blueprint + CTA */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[720px]">
              <motion.div className="space-y-6" {...fade}>
                <p className="kicker">The Output</p>
                <h2 className="heading-section">
                  AI Leadership Blueprint™
                </h2>
                <p className="body-brief">
                  Every participant completes the programme by producing an AI
                  Leadership Blueprint™ — a strategic action document integrating
                  organisational context, AI opportunities, leadership capabilities,
                  governance frameworks, and a transformation roadmap. The blueprint
                  is designed to be presented directly to a board or executive team.
                </p>
                <p className="body-brief text-muted-foreground">
                  Programme enquiries are handled confidentially.
                </p>
                <Link to="/contact" className="link-quiet">
                  Initiate a Confidential Conversation
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

export default AugmentedLeadership;
