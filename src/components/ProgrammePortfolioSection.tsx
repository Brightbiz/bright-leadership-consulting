import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { programmes } from "@/data/programmes";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const ProgrammePortfolioSection = () => {
  return (
    <>
      <div className="section-divider" />
      <section className="section-brief bg-background">
        <div className="container-brief">
          <motion.p className="kicker mb-6" {...fade}>
            Executive Programmes
          </motion.p>

          <motion.h2
            className="heading-section mb-4 max-w-[680px]"
            {...fade}
            transition={{ ...fade.transition, delay: 0.1 }}
          >
            CPD-Accredited Development for Individual Executives and Leadership Teams
          </motion.h2>

          <motion.p
            className="body-brief max-w-[680px] mb-6"
            {...fade}
            transition={{ ...fade.transition, delay: 0.15 }}
          >
            Four accredited programmes. Individual executives enrol directly.
            Organisations commissioning development for a leadership team begin
            with structural measurement.
          </motion.p>

          <motion.p
            className="text-sm text-muted-foreground leading-relaxed max-w-[680px] mb-14 border-l-2 border-border pl-5"
            {...fade}
            transition={{ ...fade.transition, delay: 0.17 }}
          >
            {CPD_PROVIDER_STATEMENT}
          </motion.p>

          <div className="grid gap-px bg-border sm:grid-cols-2 max-w-[1100px]">
            {programmes.map((programme, i) => (
              <motion.div
                key={programme.title}
                className="bg-background p-8 lg:p-9 flex flex-col rounded-sm"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 + i * 0.07 }}
              >
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  {programme.title}
                </h3>
                <p className="text-sm font-medium text-accent mb-3">
                  {programme.subtitle}
                </p>
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-3">
                  {programme.cpdHours} accredited CPD hours
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">
                  {programme.description}
                </p>

                <Link
                  to={programme.detailPage ?? "/courses"}
                  className="link-quiet text-sm"
                >
                  {programme.detailPage ? "Programme Details" : "View Programme"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="flex flex-wrap items-center gap-4 mt-12"
            {...fade}
            transition={{ ...fade.transition, delay: 0.2 }}
          >
            <Link to="/courses" className="btn-brief text-sm py-2.5 px-6">
              Explore All Programmes
            </Link>
            <Link to="/contact" className="link-quiet text-sm">
              Discuss Organisational Development
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ProgrammePortfolioSection;
