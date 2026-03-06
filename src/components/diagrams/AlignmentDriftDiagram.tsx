import { motion } from "framer-motion";

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.8, ease: "easeOut" as const },
};

const AlignmentDriftDiagram = () => {
  return (
    <motion.div className="w-full max-w-2xl mx-auto" {...fade}>
      <div className="relative" style={{ paddingBottom: "50%" }}>
        <svg
          viewBox="0 0 500 250"
          className="absolute inset-0 w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Y axis */}
          <line x1="50" y1="20" x2="50" y2="210" stroke="hsl(0 0% 90%)" strokeWidth="1" />
          {/* X axis */}
          <line x1="50" y1="210" x2="470" y2="210" stroke="hsl(0 0% 90%)" strokeWidth="1" />

          {/* Y label */}
          <text x="14" y="120" fill="hsl(0 0% 40%)" fontSize="9" fontFamily="Inter, sans-serif" transform="rotate(-90 14 120)" textAnchor="middle">
            Executive Alignment
          </text>

          {/* X label */}
          <text x="260" y="240" fill="hsl(0 0% 40%)" fontSize="9" fontFamily="Inter, sans-serif" textAnchor="middle">
            Organisational Complexity
          </text>

          {/* Ideal line (dashed) */}
          <line x1="60" y1="40" x2="460" y2="40" stroke="hsl(186 52% 25%)" strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />
          <text x="462" y="44" fill="hsl(186 52% 25%)" fontSize="8" fontFamily="Inter, sans-serif" opacity="0.5">
            Ideal
          </text>

          {/* Drift curve — gradual decline */}
          <motion.path
            d="M 60 45 C 140 48, 220 65, 300 100 S 400 160, 460 195"
            stroke="hsl(186 52% 25%)"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          />

          {/* Drift zone — subtle fill */}
          <path
            d="M 60 40 L 460 40 L 460 195 C 400 160, 300 100, 220 65 C 140 48, 60 45, 60 45 Z"
            fill="hsl(186 52% 25%)"
            opacity="0.04"
          />

          {/* Annotation */}
          <text x="340" y="155" fill="hsl(0 0% 40%)" fontSize="8" fontFamily="Inter, sans-serif" fontStyle="italic">
            Alignment drift zone
          </text>
        </svg>
      </div>
    </motion.div>
  );
};

export default AlignmentDriftDiagram;
