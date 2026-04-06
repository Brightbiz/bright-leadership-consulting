import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import EAIDashboardPreview from "./EAIDashboardPreview";
import AlignmentFrameworkDiagram from "./diagrams/AlignmentFrameworkDiagram";
import instrumentStructural from "@/assets/instrument-structural.jpg";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const InstrumentSection = () => {
  return (
    <>
      <div className="section-divider" />

      <section aria-label="The instrument" className="py-[160px] bg-background relative overflow-hidden">
        {/* Structural anchor image — left side, faint */}
        <div
          className="hidden lg:block absolute left-0 top-0 bottom-0 w-1/3 pointer-events-none"
          style={{
            backgroundImage: `url(${instrumentStructural})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.04,
            maskImage: "linear-gradient(to right, black 40%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, black 40%, transparent 100%)",
          }}
        />
        <div className="max-w-[1240px] mx-auto px-8 md:px-16 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left — explanation */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
              <motion.p className="kicker mb-6" {...fade}>
                The Instrument
              </motion.p>

              <motion.h2
                className="heading-section mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Executive Alignment Index™
              </motion.h2>

              <motion.div
                className="space-y-6 body-brief"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                <p>
                  A governance-level diagnostic identifying executive variance across 
                  strategic interpretation, decision rights, and escalation architecture.
                </p>

                <p>
                  The Index is designed to support executive discussion and decision-making, 
                  not simply to assess alignment.
                </p>

                <p>
                  The output is delivered as a concise Executive Alignment Report, typically 
                  used to inform leadership discussion, strategic planning, and governance review.
                </p>

                <div className="scan-list mt-10">
                  <p>Strategic Interpretation</p>
                  <p>Decision Rights Clarity</p>
                  <p>Cross-Functional Coordination</p>
                  <p>Escalation Pathways</p>
                  <p>Accountability Architecture</p>
                  <p>Risk Ownership</p>
                </div>

                <Link
                  to="/executive-alignment-index"
                  className="link-quiet mt-8"
                >
                  Executive Alignment Index™
                </Link>

                <p className="mt-8 text-muted-foreground text-[15px] leading-relaxed italic">
                  Engagements typically begin here. What follows is shaped 
                  entirely by the outcomes of the diagnostic.
                </p>
              </motion.div>
            </div>

            {/* Right — dashboard + framework */}
            <motion.div
              className="lg:col-span-7 space-y-20"
              {...fade}
              transition={{ ...fade.transition, delay: 0.25 }}
            >
              <div>
                <EAIDashboardPreview />
                <p className="mt-3 text-xs text-muted-foreground italic tracking-wide">
                  Illustrative Executive Alignment Index™ dashboard.
                </p>
              </div>
              <div>
                <AlignmentFrameworkDiagram />
                <p className="mt-3 text-xs text-muted-foreground italic tracking-wide text-center">
                  Executive Alignment Architecture — six structural dimensions.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InstrumentSection;
