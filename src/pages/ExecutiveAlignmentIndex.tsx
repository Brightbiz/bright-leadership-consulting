import { Shield, ArrowRight, ChevronRight, Target, GitBranch, Users, AlertTriangle, Layers, Lock, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollProgress from "@/components/ScrollProgress";
import AnimatedGradient from "@/components/AnimatedGradient";
import TextReveal from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";

const dimensions = [
  { icon: Target, title: "Strategic Interpretation", description: "Consistency in how executives interpret strategic direction" },
  { icon: GitBranch, title: "Decision Rights Clarity", description: "Defined ownership of decision authority across functions" },
  { icon: Users, title: "Cross-Functional Coordination", description: "Alignment of processes and priorities between divisions" },
  { icon: AlertTriangle, title: "Escalation Pathways", description: "Structured routes for issue resolution and governance" },
  { icon: Layers, title: "Accountability Architecture", description: "Clarity of ownership, reporting lines, and outcomes" },
  { icon: Lock, title: "Risk Ownership", description: "Distribution and acceptance of risk at executive level" },
];

const deliverables = [
  "Composite Alignment Score",
  "Dimension-Level Variance Indicators",
  "Executive Dispersion Mapping",
  "Priority Action Matrix",
  "Governance Risk & Escalation Commentary",
];

const triggers = [
  "Strategic planning cycles",
  "Post-merger integration",
  "Leadership transition",
  "AI transformation programmes",
  "Rapid growth phases",
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const ExecutiveAlignmentIndex = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        path="/executive-alignment-index"
        title="Executive Alignment Index | Bright Leadership Consulting"
        description="A structured governance instrument measuring executive variance across decision rights, strategic interpretation, and escalation architecture. Board-ready reporting for CEOs, Chairs, and CPOs."
      />
      <ScrollProgress />
      <Header />

      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] overflow-hidden flex items-center">
          <AnimatedGradient />
          <div className="container-narrow relative z-10 py-24 lg:py-32">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-3xl"
            >
              <motion.div variants={fadeUp} className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-5 py-2.5 border border-white/20 shadow-lg">
                <Shield className="h-4 w-4 text-secondary" />
                <span className="text-sm font-semibold text-primary-foreground tracking-wider uppercase">
                  Governance Instrument
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="mb-6 font-serif text-4xl font-semibold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                <TextReveal delay={0.2}>
                  {"Executive "}
                </TextReveal>
                <span className="text-secondary">
                  <TextReveal delay={0.4}>Alignment Index</TextReveal>
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} className="mb-10 text-lg leading-relaxed text-primary-foreground/80 max-w-2xl sm:text-xl">
                Structural Clarity for Executive Teams Operating Under Complexity
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <MagneticButton variant="hero" size="xl" className="group shadow-xl shadow-secondary/30" href="/contact">
                  Enquire Confidentially
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </MagneticButton>
                <MagneticButton
                  variant="ghost"
                  size="lg"
                  className="border-2 border-white/30 bg-white/5 text-primary-foreground/80 hover:bg-white/10 hover:border-white/50 hover:text-primary-foreground backdrop-blur-sm"
                  href="/brochures"
                >
                  View Brochure
                </MagneticButton>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 100" fill="none" className="w-full">
              <path d="M0 50C360 100 720 0 1080 50C1260 75 1380 75 1440 50V100H0V50Z" className="fill-background" />
            </svg>
          </div>
        </section>

        {/* The Structural Problem */}
        <section className="py-20 lg:py-28 bg-muted/30">
          <div className="container-narrow">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 border border-primary/20">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">The Problem</span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl mb-6">
                <TextReveal>{"Alignment Is Assumed. Rarely Measured."}</TextReveal>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed mb-6">
                As organisations integrate AI, scale operations, and operate under increasing governance scrutiny, executive alignment becomes a measurable structural necessity — not a cultural aspiration.
              </motion.p>
              <motion.p variants={fadeUp} className="text-xl text-foreground font-serif font-semibold">
                Most executive teams assume alignment. Few measure it.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* The Instrument — Six Dimensions */}
        <section className="py-20 lg:py-28">
          <div className="container-narrow">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="text-center mb-16">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-5 py-2.5 border border-secondary/20">
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">The Instrument</span>
                </div>
                <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl mb-4">
                  <TextReveal>{"Six Dimensions of Executive Variance"}</TextReveal>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  The Executive Alignment Index measures structural cohesion — not sentiment — across six critical governance dimensions.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {dimensions.map((dim, i) => (
                  <motion.div
                    key={dim.title}
                    variants={fadeUp}
                    className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary transition-transform duration-300 group-hover:scale-110">
                        <dim.icon className="h-5 w-5" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1 text-sm">{dim.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{dim.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Methodology */}
        <section className="py-20 lg:py-28 bg-muted/30">
          <div className="container-narrow">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="max-w-3xl mx-auto"
            >
              <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 border border-primary/20">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Methodology</span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="font-serif text-3xl font-semibold text-foreground sm:text-4xl mb-6">
                Calibrated Assessment. <span className="text-primary">Structural Clarity.</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed mb-8">
                Executives are assessed across defined alignment dimensions using a calibrated 1–5 maturity scale. Results are aggregated into a composite alignment score, with variance indicators identifying divergence between executives.
              </motion.p>
              <motion.div
                variants={fadeUp}
                className="p-6 rounded-2xl bg-gradient-to-br from-primary/[0.08] to-primary/[0.02] border-l-4 border-primary"
              >
                <p className="text-foreground font-medium text-lg leading-relaxed">
                  The emphasis is not average agreement — but dispersion and structural misalignment risk.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* The Deliverable */}
        <section className="py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary/60" />
          <motion.div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          <div className="container-narrow relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 border border-white/15 backdrop-blur-sm">
                <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Deliverable</span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="font-serif text-3xl font-semibold text-primary-foreground sm:text-4xl lg:text-5xl mb-4">
                The Executive Alignment <span className="text-secondary">Index Report</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-primary-foreground/70 mb-10 max-w-2xl">
                A concise, board-ready executive dashboard. The primary deliverable of every engagement.
              </motion.p>

              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {deliverables.map((item, i) => (
                  <motion.div
                    key={item}
                    variants={fadeUp}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.07] border border-white/10 backdrop-blur-sm"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground font-bold text-sm">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <span className="text-primary-foreground/90 font-medium text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.p variants={fadeUp} className="text-primary-foreground/90 font-medium">
                The report becomes the anchor artefact for strategic recalibration, integration alignment, and executive oversight.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* When It Is Commissioned */}
        <section className="py-20 lg:py-28 bg-muted/30">
          <div className="container-narrow">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="max-w-3xl"
            >
              <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 border border-primary/20">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Commissioning</span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="font-serif text-3xl font-semibold text-foreground sm:text-4xl mb-4">
                Commissioned by <span className="text-primary">CEOs, Chairs & CPOs</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-8">
                The Executive Alignment Index is typically commissioned ahead of:
              </motion.p>

              <div className="grid sm:grid-cols-2 gap-3">
                {triggers.map((trigger) => (
                  <motion.div
                    key={trigger}
                    variants={fadeUp}
                    className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50 transition-all duration-300 hover:border-primary/30"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-foreground font-medium text-sm">{trigger}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why It Matters Now */}
        <section className="py-20 lg:py-28">
          <div className="container-narrow">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.h2 variants={fadeUp} className="font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl mb-6">
                The Executive Alignment Index replaces assumption with <span className="text-primary">objective visibility</span>.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed mb-4">
                Engagement surveys measure sentiment. Executive meetings assume cohesion.
              </motion.p>
              <motion.p variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed">
                The Index measures structural variance in decision architecture. In complex organisations, alignment rarely fails loudly — it drifts quietly.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-foreground via-primary/90 to-primary" />
          <motion.div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
          <div className="container-narrow relative z-10 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="font-serif text-3xl font-semibold text-primary-foreground sm:text-4xl lg:text-5xl mb-6">
                Enquire Confidentially
              </motion.h2>
              <motion.p variants={fadeUp} className="text-lg text-primary-foreground/60 max-w-lg mx-auto mb-10 leading-relaxed">
                Executive Alignment Index engagements are delivered by arrangement and calibrated to organisational complexity. Enquiries are handled confidentially.
              </motion.p>
              <motion.div variants={fadeUp}>
                <MagneticButton variant="hero" size="xl" className="group shadow-xl shadow-secondary/30" href="/contact">
                  Enquire About the EAI
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </MagneticButton>
              </motion.div>
              <motion.p variants={fadeUp} className="mt-8 text-sm text-primary-foreground/40 tracking-wide">
                Commissioned by executive referral or direct enquiry.
              </motion.p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default ExecutiveAlignmentIndex;
