import { ArrowRight, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import AnimatedGradient from "@/components/AnimatedGradient";
import TextReveal from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

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
        {/* Hero */}
        <section className="relative min-h-[70vh] overflow-hidden flex items-center">
          <AnimatedGradient />
          <div className="container-narrow relative z-10 py-24 lg:py-32">
            <div className="max-w-3xl">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-5 py-2.5 border border-white/20 shadow-lg animate-fade-up">
                <Shield className="h-4 w-4 text-secondary" />
                <span className="text-sm font-semibold text-primary-foreground tracking-wider uppercase">
                  Governance Instrument
                </span>
              </div>

              <h1 className="mb-6 font-serif text-3xl font-semibold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <TextReveal delay={0.2}>
                  Executive Alignment Must Be Measured — Not Assumed
                </TextReveal>
              </h1>

              <p className="mb-10 text-lg leading-relaxed text-primary-foreground/80 max-w-2xl sm:text-xl animate-fade-up" style={{ animationDelay: '0.4s' }}>
                The Executive Alignment Index provides governance-level visibility 
                into executive variance before strategic execution slows.
              </p>

              <div className="animate-fade-up" style={{ animationDelay: '0.6s' }}>
                <MagneticButton variant="hero" size="xl" className="group shadow-xl shadow-secondary/30" href="/contact">
                  Enquire Confidentially
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </MagneticButton>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 100" fill="none" className="w-full">
              <path d="M0 50C360 100 720 0 1080 50C1260 75 1380 75 1440 50V100H0V50Z" className="fill-background" />
            </svg>
          </div>
        </section>

        {/* Section 1 — Why Measurement Matters */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container-narrow">
            <div className="max-w-3xl mx-auto">
              <motion.p
                className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                Why Measurement Matters
              </motion.p>

              <motion.div
                className="space-y-8 text-lg leading-relaxed text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <p>Executive teams rarely lack intent.</p>

                <p>Misalignment emerges through variance in:</p>

                <div className="space-y-1.5 border-l-2 border-border pl-6">
                  <p>Strategic interpretation</p>
                  <p>Decision authority</p>
                  <p>Escalation logic</p>
                  <p>Risk ownership</p>
                </div>

                <p>Averages conceal dispersion.</p>

                <p className="font-serif text-foreground font-medium text-xl">
                  The Executive Alignment Index identifies structural variance before it compounds.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 2 — Methodology */}
        <section className="py-24 lg:py-32 bg-muted/30">
          <div className="container-narrow">
            <div className="max-w-3xl mx-auto">
              <motion.p
                className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                Methodology
              </motion.p>

              <motion.div
                className="space-y-8 text-lg leading-relaxed text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <p>
                  Executives are assessed across six structural alignment dimensions 
                  using calibrated 1–5 maturity scales.
                </p>

                <p>Results are aggregated into:</p>

                <div className="space-y-1.5 border-l-2 border-border pl-6">
                  <p>Composite Alignment Score</p>
                  <p>Dimension-Level Scores</p>
                  <p>Variance Indicators (Low / Moderate / Elevated)</p>
                </div>

                <p className="font-serif text-foreground font-medium text-xl">
                  The emphasis is not sentiment — but structural cohesion.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 3 — The Report */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container-narrow">
            <div className="max-w-3xl mx-auto">
              <motion.p
                className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                The Executive Alignment Index Report
              </motion.p>

              <motion.div
                className="space-y-8 text-lg leading-relaxed text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <p>Each engagement produces a concise, board-ready dashboard including:</p>

                <div className="space-y-1.5 border-l-2 border-border pl-6">
                  <p>Composite Alignment Score</p>
                  <p>Dimension-Level Variance Indicators</p>
                  <p>Executive Dispersion Mapping</p>
                  <p>Priority Action Matrix</p>
                  <p>Governance Risk & Escalation Commentary</p>
                </div>

                <p className="font-serif text-foreground font-medium text-xl">
                  The report anchors board discussion and strategic recalibration.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 4 — Engagement Structure */}
        <section className="py-24 lg:py-32 bg-muted/30">
          <div className="container-narrow">
            <div className="max-w-3xl mx-auto">
              <motion.p
                className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                Engagement Structure
              </motion.p>

              <motion.div
                className="space-y-8 text-lg leading-relaxed text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <p>Engagements typically include:</p>

                <div className="space-y-1.5 border-l-2 border-border pl-6">
                  <p>Executive assessment</p>
                  <p>Structured analysis</p>
                  <p>Board-level presentation</p>
                  <p>Advisory guidance on structural clarity</p>
                </div>

                <p>
                  Where variance requires intervention, ALIGN executive working sessions 
                  establish defined decision architecture.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 5 — Commissioning Context */}
        <section className="py-24 lg:py-32 bg-background">
          <div className="container-narrow">
            <div className="max-w-3xl mx-auto">
              <motion.p
                className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                Commissioning Context
              </motion.p>

              <motion.div
                className="space-y-8 text-lg leading-relaxed text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <p>The Executive Alignment Index is commissioned during:</p>

                <div className="space-y-1.5 border-l-2 border-border pl-6">
                  <p>Growth acceleration</p>
                  <p>Post-merger integration</p>
                  <p>Leadership transition</p>
                  <p>AI-driven transformation</p>
                  <p>Governance scrutiny escalation</p>
                </div>

                <p>
                  Engagements are delivered by arrangement and calibrated to organisational scale.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 lg:py-32 bg-muted/30">
          <div className="container-narrow">
            <div className="max-w-3xl mx-auto">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <p className="font-serif text-foreground font-medium text-xl">
                  Executive alignment determines execution velocity.
                </p>

                <p className="text-lg text-muted-foreground">
                  Enquiries are handled confidentially.
                </p>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
                >
                  Enquire Regarding Executive Alignment Index
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

export default ExecutiveAlignmentIndex;
