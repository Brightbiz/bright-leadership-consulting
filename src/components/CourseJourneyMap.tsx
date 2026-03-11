import { motion } from "framer-motion";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const stages = [
  {
    stage: "Awareness",
    modules: ["1. Leadership in the Age of AI", "2. AI Opportunity Mapping"],
  },
  {
    stage: "Strategy",
    modules: ["3. AI Strategy Canvas", "4. AI Maturity Assessment"],
  },
  {
    stage: "Capability",
    modules: ["5. AI-Augmented Decision Making", "6. Executive Prompt Library"],
  },
  {
    stage: "Communication",
    modules: ["7A. Leadership Speech", "7B. Growth Opportunity Mapping"],
  },
  {
    stage: "Governance",
    modules: ["8. AI Transformation Taskforce", "9. Responsible AI Governance"],
  },
  {
    stage: "Integration",
    modules: ["10. AI Leadership Blueprint™ Canvas", "Capstone Project"],
  },
];

const CourseJourneyMap = () => {
  return (
    <motion.div {...fade} className="w-full">
      <div className="flex items-start gap-0 overflow-x-auto pb-4">
        {stages.map((s, i) => (
          <div key={s.stage} className="flex items-start shrink-0">
            <div className="flex flex-col items-center min-w-[140px] lg:min-w-[160px]">
              {/* Stage number + name */}
              <div className="flex flex-col items-center mb-3">
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-accent-foreground/60 mb-1">
                  Stage {i + 1}
                </span>
                <span className="text-xs font-semibold text-foreground tracking-wide">
                  {s.stage}
                </span>
              </div>

              {/* Dot on timeline */}
              <div className="w-3 h-3 rounded-full bg-primary border-2 border-background shadow-sm z-10" />

              {/* Module list */}
              <div className="mt-3 space-y-1.5 text-center">
                {s.modules.map((m) => (
                  <p
                    key={m}
                    className="text-[10px] leading-tight text-muted-foreground max-w-[130px]"
                  >
                    {m}
                  </p>
                ))}
              </div>
            </div>

            {/* Connector line */}
            {i < stages.length - 1 && (
              <div className="flex items-center mt-[52px] -mx-1">
                <div className="w-8 lg:w-12 h-px bg-border" />
                <div className="w-0 h-0 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent border-l-[5px] border-l-border -ml-px" />
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CourseJourneyMap;
