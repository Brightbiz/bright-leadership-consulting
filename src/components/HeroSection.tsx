import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section aria-label="Hero" className="bg-background pt-[140px] pb-[140px] border-y border-border">
      <div className="container-brief">
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
              Executive Alignment Determines Whether Strategy Accelerates or Stalls
            </h1>
          </div>

          <div className="mt-8 space-y-5 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <p className="body-brief">
              Clarity at executive level for organisations navigating growth, 
              leadership transition, and AI-driven transformation.
            </p>
            <p className="body-brief">
              Bright Leadership Consulting measures executive variance — ensuring 
              alignment is established before execution slows.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/contact" className="btn-brief">
              Enquire Confidentially
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
