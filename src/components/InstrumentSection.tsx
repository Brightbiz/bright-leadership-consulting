import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import EAIDashboardPreview from "./EAIDashboardPreview";
import AlignmentFrameworkDiagram from "./diagrams/AlignmentFrameworkDiagram";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const InstrumentSection = () => {
  return (
    <>
      <div className="section-divider" />

      <section aria-label="The instrument" className="section-brief bg-background">
        <div className="container-brief">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left — explanation */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <motion.p className="kicker mb-6" {...fade}>
                The Instrument
              </motion.p>

              <motion.h2
                className="heading-section mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Executive Alignment Index™
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

                <div className="scan-list mt-10">
                  <p>Strategic Interpretation</p>
                  <p>Decision Rights Clarity</p>
                  <p>Cross-Functional Coordination</p>
                  <p>Escalation Pathways</p>
                  <p>Accountability Architecture</p>
                  <p>Risk Ownership</p>
                </div>

                <Link
                  to="/executive-alignment-index"
                  className="link-quiet mt-8"
                >
                  Executive Alignment Index™
                </Link>
              </motion.div>
            </div>

            {/* Right — dashboard + framework */}
            <motion.div
              className="space-y-16"
              {...fade}
              transition={{ ...fade.transition, delay: 0.25 }}
            >
              <div>
                <EAIDashboardPreview />
                <p className="mt-3 text-xs text-muted-foreground italic tracking-wide">
                  Illustrative Executive Alignment Index™ dashboard.
                </p>
              </div>
              <div>
                <AlignmentFrameworkDiagram />
                <p className="mt-3 text-xs text-muted-foreground italic tracking-wide text-center">
                  Executive Alignment Architecture — six structural dimensions.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InstrumentSection;
