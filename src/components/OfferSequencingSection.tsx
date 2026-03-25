import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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

const OfferSequencingSection = () => {
  return (
    <>
      <div className="section-divider" />

      <section aria-label="Advisory pathway" className="py-[90px] section-pearl">
        <div className="container-brief">
          <motion.p className="kicker mb-4" {...fade}>Advisory Pathway</motion.p>
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

          {/* Develop bridge to Executive Programmes */}
          <motion.div
            className="mt-16 pt-12 border-t border-border max-w-[620px] mx-auto text-center"
            {...fade}
            transition={{ ...fade.transition, delay: 0.3 }}
          >
            <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase mb-3">
              Beyond Alignment
            </p>
            <h3 className="font-serif text-lg font-medium text-foreground mb-3">
              Develop
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Once structural clarity is installed, our CPD-accredited executive programmes
              extend leadership capability across seven disciplines — from AI governance
              to peak performance.
            </p>
            <Link to="/courses" className="link-quiet text-sm">
              View Executive Programmes
              <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default OfferSequencingSection;
