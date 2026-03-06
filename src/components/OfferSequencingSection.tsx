import { motion } from "framer-motion";
import EngagementModelDiagram from "@/components/diagrams/EngagementModelDiagram";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.15 + i * 0.15 },
  }),
};

const pathways = [
  {
    title: "Executive Alignment Index™",
    description: "Measure variance across strategic interpretation, decision rights, and escalation architecture.",
  },
  {
    title: "ALIGN™ Executive Intervention",
    description: "Install structural clarity through defined decision architecture and escalation protocols.",
  },
  {
    title: "Executive Oversight™",
    description: "Sustain alignment under growth, transformation, and governance complexity.",
  },
];

const AdvisoryPathwaySection = () => {
  return (
    <>
      <div className="section-divider" />

      <section aria-label="Advisory pathway" className="py-[90px] bg-background">
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
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
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

          {/* Engagement Model Diagram */}
          <div className="mt-20">
            <EngagementModelDiagram />
          </div>
        </div>
      </section>
    </>
  );
};

export default AdvisoryPathwaySection;
