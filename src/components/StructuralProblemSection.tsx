import { motion } from "framer-motion";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const StructuralProblemSection = () => {
  return (
    <section className="section-brief bg-background">
      <div className="container-brief">
        <div className="prose-narrow mx-auto">
          <motion.p className="kicker mb-6" {...fade}>
            The Execution Reality
          </motion.p>

          <motion.h2
            className="heading-section mb-8"
            {...fade}
            transition={{ ...fade.transition, delay: 0.1 }}
          >
            Strategy Slows Before It Fails
          </motion.h2>

          <motion.div
            className="space-y-6 body-brief"
            {...fade}
            transition={{ ...fade.transition, delay: 0.15 }}
          >
            <p>
              As organisations scale or transform, complexity increases faster 
              than executive coordination.
            </p>

            <div className="scan-list">
              <p>Strategic interpretation diverges.</p>
              <p>Decision rights overlap.</p>
              <p>Escalation becomes inconsistent.</p>
            </div>

            <p>Performance rarely collapses overnight.</p>

            <p className="emphasis-line">It drifts.</p>

            <p className="emphasis-line">
              Structural alignment must be measured — not assumed.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StructuralProblemSection;
