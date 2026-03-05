import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import EAIDashboardPreview from "./EAIDashboardPreview";

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
            <div>
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
                  Executive Alignment Index
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            </div>

            {/* Right — dashboard */}
            <motion.div
              {...fade}
              transition={{ ...fade.transition, delay: 0.25 }}
            >
              <EAIDashboardPreview />
              <p className="mt-3 text-xs text-muted-foreground italic tracking-wide">
                Illustrative Executive Alignment Index dashboard.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InstrumentSection;
