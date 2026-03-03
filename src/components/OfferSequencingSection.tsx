import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const EAIInstrumentSection = () => {
  return (
    <>
      {/* Section 2 — The Instrument */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="container-narrow">
          <div className="max-w-3xl mx-auto">
            <motion.p
              className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              The Instrument
            </motion.p>

            <motion.h2
              className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-foreground leading-tight mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            >
              Executive Alignment Index™
            </motion.h2>

            <motion.div
              className="space-y-8 text-lg leading-relaxed text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
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
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-300 tracking-wide"
              >
                Learn More
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3 — The Structured Path */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container-narrow">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-foreground leading-tight mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              A Structured Path to Sustained Strategic Execution
            </motion.h2>

            <motion.div
              className="space-y-1.5 border-l-2 border-border pl-6 text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
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
