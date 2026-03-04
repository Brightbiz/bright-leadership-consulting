import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const EAIInstrumentSection = () => {
  return (
    <>
      {/* Section divider */}
      <div className="section-divider" />

      {/* Section 2 — The Instrument */}
      <section className="section-brief bg-background">
        <div className="container-brief">
          <div className="prose-narrow mx-auto">
            <motion.p className="kicker mb-6" {...fade}>
              The Instrument
            </motion.p>

            <motion.h2
              className="heading-section mb-8"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              Executive Alignment Index
            </motion.h2>

            <motion.div
              className="space-y-6 body-brief"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              <p>
                A governance-level assessment identifying executive variance across 
                strategic interpretation, decision rights, and escalation architecture.
              </p>

              <p>
                The outcome is a concise, board-ready dashboard providing objective 
                clarity before intervention.
              </p>

              <Link
                to="/executive-alignment-index"
                className="link-quiet"
              >
                Learn More
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="section-divider" />

      {/* Section 3 — The Structured Path */}
      <section className="section-brief bg-background">
        <div className="container-brief">
          <div className="prose-narrow mx-auto">
            <motion.h2
              className="heading-section mb-8"
              {...fade}
            >
              A Structured Path to Sustained Strategic Execution
            </motion.h2>

            <motion.div
              className="scan-list"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              <p>Measure variance.</p>
              <p>Install structural clarity.</p>
              <p>Sustain alignment under growth and transformation.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EAIInstrumentSection;
