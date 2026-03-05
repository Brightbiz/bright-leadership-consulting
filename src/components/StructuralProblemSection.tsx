import { motion } from "framer-motion";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const stagger = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" as const, staggerChildren: 0.12 },
};

const child = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const StructuralProblemSection = () => {
  return (
    <>
      <div className="section-divider" />

      <section aria-label="Strategic insight" className="section-brief bg-background">
        <div className="container-brief">
          <div className="prose-narrow mx-auto">
            <motion.h2 className="heading-section mb-8" {...fade}>
              Strategy Slows Before It Fails
            </motion.h2>

            <motion.div
              className="space-y-6 body-brief"
              variants={{ whileInView: { transition: { staggerChildren: 0.1 } } }}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
            >
              <motion.p variants={child}>
                As organisations scale or transform, complexity increases faster 
                than executive coordination.
              </motion.p>

              <motion.div className="scan-list" variants={child}>
                <p>Strategic interpretation diverges.</p>
                <p>Decision rights overlap.</p>
                <p>Escalation becomes inconsistent.</p>
              </motion.div>

              <motion.p variants={child}>Performance rarely collapses overnight.</motion.p>

              <motion.p className="emphasis-line" variants={child}>It drifts.</motion.p>

              <motion.p className="emphasis-line" variants={child}>
                Structural alignment must be measured — not assumed.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StructuralProblemSection;
