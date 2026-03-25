import { motion } from "framer-motion";

const phases = [
  {
    label: "Measure",
    instrument: "Executive Alignment Index™",
    description: "Quantify variance across six dimensions of executive alignment",
  },
  {
    label: "Install",
    instrument: "ALIGN™ Intervention",
    description: "Establish decision architecture, escalation protocols, and accountability structures",
  },
  {
    label: "Sustain",
    instrument: "Executive Oversight™",
    description: "Maintain alignment under growth, transformation, and governance complexity",
  },
];

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.8, ease: "easeOut" as const },
};

const EngagementModelDiagram = () => {
  return (
    <motion.div className="w-full max-w-3xl mx-auto" {...fade}>
      <div className="flex flex-col md:flex-row items-stretch">
        {phases.map((phase, i) => (
          <div key={phase.label} className="flex-1 flex flex-col md:flex-row items-stretch">
            {/* Phase card */}
            <div className="flex-1 border border-border px-6 py-6 flex flex-col">
              {/* Phase number + label */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
                  Phase {i + 1}
                </span>
              </div>
              <h4 className="font-serif text-lg font-semibold text-foreground mb-1">
                {phase.label}
              </h4>
              <p className="text-xs font-medium text-primary mb-3">
                {phase.instrument}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-auto">
                {phase.description}
              </p>
            </div>

            {/* Connector arrow (between phases) */}
            {i < phases.length - 1 && (
              <>
                {/* Horizontal connector — desktop */}
                <div className="hidden md:flex items-center px-2">
                  <div className="w-6 h-px bg-primary/30" />
                  <div className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-primary/30" />
                </div>
                {/* Vertical connector — mobile */}
                <div className="flex md:hidden justify-center py-2">
                  <div className="flex flex-col items-center">
                    <div className="h-4 w-px bg-primary/30" />
                    <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[5px] border-t-primary/30" />
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Underlying continuity line */}
      <div className="hidden md:block mt-4">
        <div className="h-px bg-primary/15 w-full" />
        <p className="text-center text-[10px] text-primary/50 mt-2 tracking-wide">
          Continuous engagement model — Measure · Install · Sustain · Develop
        </p>
      </div>
    </motion.div>
  );
};

export default EngagementModelDiagram;
