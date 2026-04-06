import { motion } from "framer-motion";
import AdvisoryArchitectureDiagram from "@/components/diagrams/AdvisoryArchitectureDiagram";

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

const stages = [
  {
    step: "01",
    title: "Measure",
    instrument: "Executive Alignment Index™",
    description: "Quantify executive variance across six structural dimensions. Every engagement begins here.",
  },
  {
    step: "02",
    title: "Install",
    instrument: "ALIGN™ Intervention",
    description: "Where the diagnostic reveals structural variance, we establish decision architecture and escalation clarity.",
  },
  {
    step: "03",
    title: "Sustain",
    instrument: "Executive Oversight™",
    description: "In some engagements, we remain involved to support ongoing executive coordination as complexity evolves.",
  },
];

const OfferSequencingSection = () => {
  return (
    <>
      <div className="section-divider" />

      <section aria-label="Advisory pathway" className="py-[90px] section-pearl">
        <div className="container-brief">
          <motion.p className="kicker mb-4" {...fade}>Advisory Architecture</motion.p>
          <motion.h2
            className="heading-section mb-6 prose-narrow mx-auto"
            {...fade}
          >
            One Process. Not Multiple Services.
          </motion.h2>

          <motion.p
            className="body-brief text-center prose-narrow mx-auto mb-16"
            {...fade}
            transition={{ ...fade.transition, delay: 0.1 }}
          >
            Engagements typically begin with the Executive Alignment Index™, with further work shaped by the outcomes of the diagnostic.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {stages.map((stage, i) => (
              <motion.div
                key={stage.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary/50 mb-3 block">
                  {stage.step}
                </span>
                <h3 className="font-serif text-lg font-medium text-foreground mb-1 leading-snug">
                  {stage.title}
                </h3>
                <p className="text-xs font-medium text-primary mb-3">
                  {stage.instrument}
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {stage.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Advisory Architecture Diagram — full 4-stage sequence */}
          <div className="mt-20">
            <AdvisoryArchitectureDiagram />
          </div>
        </div>
      </section>
    </>
  );
};

export default OfferSequencingSection;
