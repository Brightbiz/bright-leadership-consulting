import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const stages = [
  {
    phase: 1,
    label: "Measure",
    instrument: "Executive Alignment Index™",
    description: "Quantify executive variance across six structural dimensions before intervention begins.",
    link: "/executive-alignment-index",
    linkLabel: "Explore the EAI™",
    category: "Diagnostic",
  },
  {
    phase: 2,
    label: "Install",
    instrument: "ALIGN™ Intervention",
    description: "Establish decision architecture, escalation protocols, and accountability structures.",
    link: "/contact",
    linkLabel: "Discuss Advisory",
    category: "Advisory",
  },
  {
    phase: 3,
    label: "Sustain",
    instrument: "Executive Oversight™",
    description: "Maintain alignment under growth, transformation, and governance complexity.",
    link: "/contact",
    linkLabel: "Discuss Advisory",
    category: "Advisory",
  },
  {
    phase: 4,
    label: "Develop",
    instrument: "Executive Programmes",
    description: "Extend leadership capability through CPD-accredited programmes — from AI governance to peak performance.",
    link: "/courses",
    linkLabel: "View Programmes",
    category: "Development",
  },
];

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.8, ease: "easeOut" as const },
};

const AdvisoryArchitectureDiagram = () => {
  return (
    <motion.div className="w-full" {...fade}>
      {/* Desktop: horizontal 4-column */}
      <div className="hidden md:flex items-stretch">
        {stages.map((stage, i) => (
          <div key={stage.label} className="flex-1 flex items-stretch">
            <div className="flex-1 border border-border px-5 py-6 flex flex-col">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
                  Phase {stage.phase}
                </span>
                <span className="text-[9px] font-medium tracking-[0.12em] text-primary/50 uppercase">
                  {stage.category}
                </span>
              </div>
              <h4 className="font-serif text-lg font-semibold text-foreground mb-1">
                {stage.label}
              </h4>
              <p className="text-xs font-medium text-primary mb-3">
                {stage.instrument}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                {stage.description}
              </p>
              <Link
                to={stage.link}
                className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
              >
                {stage.linkLabel}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="mt-px">
                  <path d="M3 2L7 5L3 8" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </Link>
            </div>

            {/* Connector arrow */}
            {i < stages.length - 1 && (
              <div className="flex items-center px-1.5">
                <div className="w-4 h-px bg-primary/25" />
                <div className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[4px] border-l-primary/25" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical stack */}
      <div className="flex md:hidden flex-col">
        {stages.map((stage, i) => (
          <div key={stage.label} className="flex flex-col">
            <div className="border border-border px-5 py-5 flex flex-col">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
                  Phase {stage.phase}
                </span>
                <span className="text-[9px] font-medium tracking-[0.12em] text-primary/50 uppercase">
                  {stage.category}
                </span>
              </div>
              <h4 className="font-serif text-base font-semibold text-foreground mb-1">
                {stage.label}
              </h4>
              <p className="text-xs font-medium text-primary mb-2">
                {stage.instrument}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {stage.description}
              </p>
              <Link
                to={stage.link}
                className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
              >
                {stage.linkLabel}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="mt-px">
                  <path d="M3 2L7 5L3 8" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </Link>
            </div>

            {/* Vertical connector */}
            {i < stages.length - 1 && (
              <div className="flex justify-center py-1.5">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-px bg-primary/25" />
                  <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-primary/25" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Continuity baseline */}
      <div className="mt-5">
        <div className="h-px bg-primary/12 w-full" />
        <p className="text-center text-[10px] text-primary/40 mt-2 tracking-[0.1em]">
          Measure · Install · Sustain · Develop — a continuous advisory architecture
        </p>
      </div>
    </motion.div>
  );
};

export default AdvisoryArchitectureDiagram;
