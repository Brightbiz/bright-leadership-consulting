import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { programmes } from "@/data/programmes";
import ProgrammeCta from "@/components/ProgrammeCta";


type Route = {
  condition: string;
  programme: (typeof programmes)[number];
  rationale: string;
};

const routes: Route[] = [
  {
    condition:
      "You are accountable for the organisation's response to artificial intelligence.",
    programme: programmes[1],
    rationale:
      "Governance frameworks and a board-ready AI Leadership Blueprint™ rather than tooling familiarity.",
  },
  {
    condition:
      "You are being prepared for, or have recently entered, a whole-organisation leadership role.",
    programme: programmes[0],
    rationale:
      "The full 33-module architecture across seven disciplines, taken self-directed, in cohort or 1:1.",
  },
  {
    condition:
      "Your operating model, workforce structure or hybrid arrangements are the constraint.",
    programme: programmes[2],
    rationale:
      "Workforce strategy and organisational design, addressed structurally rather than as policy.",
  },
  {
    condition:
      "Your judgement is sound but your capacity, focus and team throughput are not.",
    programme: programmes[3],
    rationale:
      "Executive performance diagnostics and system design for personal and team output.",
  },
];

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const ProgrammeSelector = () => {
  return (
    <div className="max-w-[860px] divide-y divide-border border-t border-border">
      {routes.map((route, i) => (
        <motion.div
          key={route.programme.title}
          className="grid gap-4 py-8 md:grid-cols-[1fr_1fr] md:gap-10"
          {...fade}
          transition={{ ...fade.transition, delay: 0.08 + i * 0.07 }}
        >
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
              If
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              {route.condition}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Then
            </p>
            <h3 className="font-serif text-base font-semibold text-foreground mb-2">
              {route.programme.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              {route.rationale}
            </p>
            <ProgrammeCta
              programme={route.programme}
              surface="/courses#which-programme"
            />
          </div>
        </motion.div>
      ))}

      <motion.div className="py-8" {...fade}>
        <p className="text-sm leading-relaxed text-muted-foreground mb-4">
          Where development is being commissioned for a leadership team rather
          than an individual, the appropriate programme is determined by
          structural measurement rather than preference.
        </p>
        <Link to="/executive-alignment-index" className="link-quiet text-sm">
          Explore the Executive Alignment Index™
          <ArrowRight className="h-3 w-3" />
        </Link>
      </motion.div>
    </div>
  );
};

export default ProgrammeSelector;
