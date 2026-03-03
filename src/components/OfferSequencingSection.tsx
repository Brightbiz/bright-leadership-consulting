import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const blocks = [
  {
    label: "Executive Alignment Index™",
    headline: "Measure Before You Move",
    description:
      "A governance-level assessment of executive variance across strategic interpretation, decision rights clarity, and escalation architecture.",
    details: [
      "Board-ready dashboard",
      "Composite alignment score",
      "Variance indicators",
      "Priority action matrix",
    ],
    link: "/executive-alignment-index",
    linkLabel: "Learn More",
  },
  {
    label: "ALIGN™ Executive Intervention",
    headline: "Install Structural Clarity",
    description:
      "Where variance is identified, structured intervention establishes:",
    details: [
      "Clear decision rights",
      "Defined escalation pathways",
      "Aligned strategic interpretation",
      "Executive accountability architecture",
    ],
    footer: "Architected over focused executive working sessions.",
  },
  {
    label: "Executive Oversight™",
    headline: "Sustain Alignment Under Complexity",
    description:
      "Ongoing executive alignment reviews during:",
    details: [
      "Growth",
      "Leadership transition",
      "AI transformation",
      "Strategic recalibration",
    ],
    footer: "Ensuring alignment remains measured — not assumed.",
  },
];

const OfferSequencingSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="container-narrow">
        {/* Section heading */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-foreground leading-tight">
            A Structured Path to Executive Cohesion
          </h2>
        </motion.div>

        {/* Three blocks */}
        <div className="grid gap-px lg:grid-cols-3 max-w-6xl mx-auto">
          {blocks.map((block, index) => (
            <motion.div
              key={block.label}
              className="bg-background p-10 lg:p-12 flex flex-col"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
            >
              {/* Step indicator */}
              <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-6">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Label */}
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                {block.label}
              </h3>

              {/* Headline */}
              <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase mb-6">
                {block.headline}
              </p>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                {block.description}
              </p>

              {/* Details */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {block.details.map((detail) => (
                  <li
                    key={detail}
                    className="text-foreground text-sm leading-relaxed pl-4 border-l border-border"
                  >
                    {detail}
                  </li>
                ))}
              </ul>

              {/* Footer text */}
              {block.footer && (
                <p className="text-sm text-muted-foreground italic">
                  {block.footer}
                </p>
              )}

              {/* Link */}
              {block.link && (
                <Link
                  to={block.link}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors mt-auto pt-4"
                >
                  {block.linkLabel}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferSequencingSection;
