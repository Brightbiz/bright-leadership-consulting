import { motion } from "framer-motion";
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

const ExecutiveAlignmentBrief = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Executive Alignment Brief™ | Bright Leadership Consulting"
        description="Download the Executive Alignment Brief™ — a board-level white paper on how executive misalignment is measured, diagnosed, and structurally resolved."
        path="/executive-alignment-brief"
      />
      <ScrollProgress />
      <Header />

      <main>
        {/* Section 1 — Hero */}
        <section className="pt-36 pb-24 lg:pt-44 lg:pb-32 bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Advisory Document
              </motion.p>

              <motion.h1
                className="heading-hero mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Executive Alignment Brief™
              </motion.h1>

              <motion.p
                className="text-lg leading-relaxed text-muted-foreground"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                A concise overview of the Executive Alignment Index™ and its commissioning context.
              </motion.p>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 2 — Contents */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Contents
              </motion.p>

              <motion.div
                className="space-y-4"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                {[
                  "The structural alignment problem in executive teams",
                  "The Executive Alignment Index™ — six diagnostic dimensions",
                  "Sample composite alignment dashboard",
                  "How engagements are structured — diagnostic, reporting, advisory",
                  "When organisations commission this work",
                ].map((item, i) => (
                  <p key={i} className="text-sm text-foreground leading-relaxed pl-5 relative">
                    <span className="absolute left-0 text-muted-foreground">—</span>
                    {item}
                  </p>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 3 — Download */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.div {...fade}>
                <a
                  href="/downloads/executive-alignment-brief.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-quiet text-sm"
                >
                  Download PDF
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ExecutiveAlignmentBrief;
