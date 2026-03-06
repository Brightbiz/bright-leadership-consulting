import { motion } from "framer-motion";

const dimensions = [
  "Strategic Interpretation",
  "Decision Rights Clarity",
  "Cross-Functional Coordination",
  "Escalation Pathways",
  "Accountability Architecture",
  "Risk Ownership",
];

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.8, ease: "easeOut" as const },
};

const AlignmentFrameworkDiagram = () => {
  return (
    <motion.div className="w-full max-w-3xl mx-auto" {...fade}>
      {/* Strategy layer */}
      <div className="border border-border px-6 py-4 text-center">
        <span className="font-serif text-lg font-semibold text-foreground tracking-wide">
          Strategy
        </span>
      </div>

      {/* Connector */}
      <div className="flex justify-center">
        <div className="w-px h-8 bg-primary/40" />
      </div>

      {/* Executive Alignment Architecture — middle layer */}
      <div className="border border-primary/30 bg-accent/30 px-6 py-6">
        <p className="text-center font-serif text-sm font-semibold text-primary mb-5 tracking-wide">
          Executive Alignment Architecture
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {dimensions.map((dim) => (
            <div
              key={dim}
              className="border border-border bg-background px-3 py-2.5 text-center"
            >
              <span className="text-xs text-muted-foreground leading-tight">
                {dim}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Connector */}
      <div className="flex justify-center">
        <div className="w-px h-8 bg-primary/40" />
      </div>

      {/* Execution layer */}
      <div className="border border-border px-6 py-4 text-center">
        <span className="font-serif text-lg font-semibold text-foreground tracking-wide">
          Execution
        </span>
      </div>
    </motion.div>
  );
};

export default AlignmentFrameworkDiagram;
