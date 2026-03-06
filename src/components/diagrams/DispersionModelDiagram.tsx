import { motion } from "framer-motion";

const executives = [
  { label: "CFO", score: 2.1 },
  { label: "COO", score: 2.8 },
  { label: "CHRO", score: 3.2 },
  { label: "CTO", score: 3.6 },
  { label: "CMO", score: 4.1 },
];

const median = 3.2;
const min = 1;
const max = 5;

const toPercent = (v: number) => ((v - min) / (max - min)) * 100;

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.8, ease: "easeOut" as const },
};

const DispersionModelDiagram = () => {
  return (
    <motion.div className="w-full max-w-2xl mx-auto" {...fade}>
      {/* Axis labels */}
      <div className="flex justify-between mb-2 px-1">
        <span className="text-xs text-muted-foreground">Low Alignment</span>
        <span className="text-xs text-muted-foreground">High Alignment</span>
      </div>

      {/* Scale bar */}
      <div className="relative h-[2px] bg-border mb-10">
        {/* Median marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-px h-4 bg-primary"
          style={{ left: `${toPercent(median)}%` }}
        />
        <span
          className="absolute top-5 -translate-x-1/2 text-[10px] text-primary font-medium"
          style={{ left: `${toPercent(median)}%` }}
        >
          Median
        </span>
      </div>

      {/* Executive dots */}
      <div className="relative h-16 mt-2">
        {executives.map((exec, i) => (
          <motion.div
            key={exec.label}
            className="absolute -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${toPercent(exec.score)}%` }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
          >
            <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background" />
            <span className="mt-1.5 text-[10px] text-muted-foreground font-medium">
              {exec.label}
            </span>
            <span className="text-[9px] text-muted-foreground/60">
              {exec.score.toFixed(1)}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Dispersion bracket */}
      <div className="relative mt-6 mx-auto" style={{ width: `${toPercent(executives[executives.length - 1].score) - toPercent(executives[0].score)}%`, marginLeft: `${toPercent(executives[0].score)}%` }}>
        <div className="h-px bg-primary/30 w-full" />
        <div className="absolute left-0 top-0 w-px h-2 bg-primary/30" />
        <div className="absolute right-0 top-0 w-px h-2 bg-primary/30" />
        <p className="text-center text-[10px] text-primary/60 mt-1.5">
          Executive Dispersion Range
        </p>
      </div>
    </motion.div>
  );
};

export default DispersionModelDiagram;
