import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-background pt-[140px] pb-[140px]">
      <div className="container-brief">
        <div className="prose-narrow">
          {/* Headline with teal accent rule */}
          <div className="flex gap-5">
            <div className="w-[2px] bg-primary flex-shrink-0 mt-2" />
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
              Executive Alignment Index
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
