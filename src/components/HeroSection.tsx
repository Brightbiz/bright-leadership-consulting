import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroStructural from "@/assets/hero-structural.jpg";

const HeroSection = () => {
  return (
    <section aria-label="Hero" className="bg-background border-y border-border relative overflow-hidden">
      {/* Structural image — subtle right-side anchor */}
      <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
        >
          <img
            src={heroStructural}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            style={{ opacity: 0.06 }}
          />
        </motion.div>
        {/* Fade-out gradient from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      <div className="container-brief relative z-10 pt-[160px] pb-[160px]">
        <div className="prose-narrow">
          {/* Headline with animated teal accent rule */}
          <div className="flex gap-5">
            <motion.div
              className="w-[2px] bg-primary flex-shrink-0 mt-2 origin-top"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <h1 className="heading-hero animate-fade-up">
              Executive Alignment Rarely Breaks. It Drifts.
            </h1>
          </div>

          <div className="mt-12 space-y-6 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <p className="body-brief">
              As organisations scale, differences in strategic interpretation, decision 
              authority, and accountability structures quietly emerge across the executive team.
            </p>
            <p className="body-brief">
              The Executive Alignment Index™ measures that variance — giving leadership 
              teams the structural clarity required for strategy to execute.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/contact" className="btn-brief">
              Discuss Executive Alignment
            </Link>
            <Link to="/executive-alignment-index" className="btn-brief">
              Executive Alignment Index™
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
