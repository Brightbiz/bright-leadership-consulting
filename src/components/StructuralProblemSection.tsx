import { motion } from "framer-motion";

const StructuralProblemSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container-narrow">
        <div className="max-w-3xl mx-auto">
          <motion.p
            className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            The Execution Reality
          </motion.p>

          <motion.h2
            className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-foreground leading-tight mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            Strategy Slows Before It Fails
          </motion.h2>

          <motion.div
            className="space-y-8 text-lg leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            <p>
              As organisations scale or transform, complexity increases faster 
              than executive coordination.
            </p>

            <div className="space-y-1.5 border-l-2 border-border pl-6">
              <p>Strategic interpretation diverges.</p>
              <p>Decision rights overlap.</p>
              <p>Escalation becomes inconsistent.</p>
            </div>

            <p>Performance rarely collapses overnight.</p>

            <p className="font-serif text-foreground font-medium text-xl">
              It drifts.
            </p>

            <p className="font-serif text-foreground font-medium text-xl pt-2">
              Structural alignment must be measured — not assumed.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StructuralProblemSection;
