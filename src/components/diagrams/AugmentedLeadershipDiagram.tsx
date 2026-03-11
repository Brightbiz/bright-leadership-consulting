import { motion } from "framer-motion";

const fade = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true } as const,
  transition: { duration: 0.8, ease: "easeOut" as const },
};

const AugmentedLeadershipDiagram = () => {
  const r = 90; // circle radius
  const cx = 200; // center x
  const cy = 180; // center y
  const offset = 58; // distance from center

  // Three circle positions (equilateral triangle)
  const circles = [
    { x: cx, y: cy - offset, label: "Human", sublabel: "Intelligence", color: "hsl(186, 52%, 25%)" },
    { x: cx - offset * 0.866, y: cy + offset * 0.5, label: "AI", sublabel: "Intelligence", color: "hsl(38, 92%, 55%)" },
    { x: cx + offset * 0.866, y: cy + offset * 0.5, label: "Organisational", sublabel: "Intelligence", color: "hsl(186, 45%, 35%)" },
  ];

  return (
    <motion.div {...fade} className="w-full flex justify-center">
      <svg viewBox="0 0 400 340" className="w-full max-w-[420px]" aria-label="Augmented Leadership™ Model — Three intelligences converging">
        <defs>
          {circles.map((c, i) => (
            <radialGradient key={i} id={`grad-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={c.color} stopOpacity="0.12" />
              <stop offset="100%" stopColor={c.color} stopOpacity="0.04" />
            </radialGradient>
          ))}
        </defs>

        {/* Circles */}
        {circles.map((c, i) => (
          <g key={i}>
            <circle
              cx={c.x}
              cy={c.y}
              r={r}
              fill={`url(#grad-${i})`}
              stroke={c.color}
              strokeWidth="1.5"
              opacity="0.85"
            />
            <text
              x={c.x}
              y={i === 0 ? c.y - offset * 0.35 : c.y + (i === 1 ? offset * 0.5 : offset * 0.5)}
              textAnchor="middle"
              fill={c.color}
              fontSize="11"
              fontWeight="600"
              fontFamily="Inter, sans-serif"
              letterSpacing="0.05em"
            >
              {c.label}
            </text>
            <text
              x={c.x}
              y={i === 0 ? c.y - offset * 0.35 + 14 : c.y + (i === 1 ? offset * 0.5 : offset * 0.5) + 14}
              textAnchor="middle"
              fill={c.color}
              fontSize="9"
              fontFamily="Inter, sans-serif"
              opacity="0.7"
            >
              {c.sublabel}
            </text>
          </g>
        ))}

        {/* Center label */}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fill="hsl(186, 52%, 25%)"
          fontSize="9"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
          letterSpacing="0.12em"
        >
          AUGMENTED
        </text>
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          fill="hsl(186, 52%, 25%)"
          fontSize="9"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
          letterSpacing="0.12em"
        >
          LEADERSHIP™
        </text>
      </svg>
    </motion.div>
  );
};

export default AugmentedLeadershipDiagram;
