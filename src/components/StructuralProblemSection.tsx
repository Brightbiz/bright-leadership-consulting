import { motion } from "framer-motion";

const StructuralProblemSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container-narrow">
        <div className="max-w-3xl mx-auto">
          {/* Section heading */}
          <motion.h2
            className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-foreground leading-tight mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Executive Alignment Rarely Fails Loudly.
            <br />
            <span className="text-muted-foreground">It Drifts Quietly.</span>
          </motion.h2>

          <motion.div
            className="space-y-8 text-lg leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            <p>
              As organisations scale, integrate AI, expand geographically, or undergo 
              leadership transition, complexity increases faster than executive coordination.
            </p>

            <div className="space-y-1.5 pl-0.5 border-l-2 border-border pl-6">
              <p>Decision rights blur.</p>
              <p>Strategic interpretation diverges.</p>
              <p>Escalation pathways become inconsistent.</p>
            </div>

            <p className="font-serif text-foreground font-medium text-xl">
              Alignment is assumed — but rarely measured.
            </p>

            <p>Over time, variance compounds.</p>

            <div className="space-y-1.5 pl-0.5 border-l-2 border-border pl-6">
              <p>Execution slows.</p>
              <p>Governance pressure increases.</p>
              <p>Strategic cohesion weakens.</p>
            </div>

            <p>
              Most organisations attempt to address this through communication or 
              development initiatives.
            </p>

            <p className="font-serif text-foreground font-medium text-xl pt-2">
              Structural alignment requires measurement before intervention.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StructuralProblemSection;
