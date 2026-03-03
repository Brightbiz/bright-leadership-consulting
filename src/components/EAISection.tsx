import { Shield, ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import TextReveal from "./TextReveal";
import MagneticButton from "./MagneticButton";

const EAISection = () => {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-background to-muted/30" />
      
      {/* Decorative elements */}
      <motion.div
        className="absolute top-1/3 right-0 w-80 h-80 bg-primary/[0.04] rounded-full blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-narrow relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-5 py-2.5 border border-primary/20 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Governance Instrument
              </span>
            </div>
          </div>

          {/* Content Card */}
          <div className="relative rounded-2xl border border-border/50 bg-card p-8 lg:p-12 overflow-hidden group hover:border-primary/30 transition-all duration-500">
            {/* Shimmer on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/[0.03] to-transparent"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
            
            <div className="relative z-10 grid lg:grid-cols-[1fr,auto] gap-8 items-center">
              <div>
                <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl mb-4">
                  <TextReveal>Executive Alignment Index</TextReveal>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  A structured governance instrument measuring executive variance across decision rights, strategic interpretation, and escalation architecture. Board-ready reporting for CEOs, Chairs, and CPOs.
                </p>
                <p className="text-foreground font-medium font-serif italic">
                  Most executive teams assume alignment. Few measure it.
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:items-end">
                <Link to="/executive-alignment-index">
                  <MagneticButton variant="teal" size="lg" className="group/btn w-full lg:w-auto whitespace-nowrap">
                    <span className="flex items-center gap-2">
                      Learn More
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                  </MagneticButton>
                </Link>
                <Link 
                  to="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  Enquire confidentially
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EAISection;
