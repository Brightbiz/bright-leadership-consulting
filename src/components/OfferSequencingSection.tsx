import { motion } from "framer-motion";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const pathways = [
  {
    title: "Executive Alignment Index",
    description: "Measure variance across strategic interpretation, decision rights, and escalation architecture.",
  },
  {
    title: "ALIGN Executive Intervention",
    description: "Install structural clarity through defined decision architecture and escalation protocols.",
  },
  {
    title: "Executive Oversight",
    description: "Sustain alignment under growth, transformation, and governance complexity.",
  },
];

const AdvisoryPathwaySection = () => {
  return (
    <>
      <div className="section-divider" />

      <section aria-label="Advisory pathway" className="section-brief bg-background">
        <div className="container-brief">
          <motion.h2
            className="heading-section mb-16 prose-narrow mx-auto"
            {...fade}
          >
            A Structured Path to Sustained Strategic Execution
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {pathways.map((pathway, i) => (
              <motion.div
                key={pathway.title}
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 * (i + 1) }}
              >
                <h3 className="font-serif text-lg font-medium text-foreground mb-4 leading-snug">
                  {pathway.title}
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {pathway.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AdvisoryPathwaySection;
