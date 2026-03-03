import { ArrowRight, Shield } from "lucide-react";
import AnimatedGradient from "./AnimatedGradient";
import TextReveal from "./TextReveal";
import MagneticButton from "./MagneticButton";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <AnimatedGradient />

      <div className="container-narrow relative flex min-h-screen items-center pt-20 overflow-hidden">
        <div className="max-w-3xl py-24 lg:py-32">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-5 py-2.5 border border-white/20 shadow-lg animate-fade-up">
            <Shield className="h-4 w-4 text-secondary" />
            <span className="text-sm font-semibold text-primary-foreground">
              Executive Alignment Architecture
            </span>
          </div>

          <h1 className="mb-6 font-serif text-3xl font-semibold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            <TextReveal delay={0.3}>
              Executive Alignment Determines Whether Strategy Accelerates or Stalls
            </TextReveal>
          </h1>

          <p className="mb-4 text-lg leading-relaxed text-primary-foreground/85 sm:text-xl animate-fade-up" style={{ animationDelay: '0.5s' }}>
            Clarity at executive level for organisations navigating growth, 
            transition, and AI-driven transformation.
          </p>

          <p className="mb-10 text-base leading-relaxed text-primary-foreground/70 sm:text-lg animate-fade-up" style={{ animationDelay: '0.6s' }}>
            Bright Leadership Consulting measures executive variance — ensuring 
            alignment is established before execution slows.
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.7s' }}>
            <MagneticButton variant="hero" size="xl" className="group shadow-xl shadow-secondary/30" href="/contact">
              Enquire Confidentially
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              size="lg"
              className="border-2 border-white/30 bg-white/5 text-primary-foreground/80 hover:bg-white/10 hover:border-white/50 hover:text-primary-foreground font-semibold group backdrop-blur-sm"
              href="/executive-alignment-index"
            >
              <Shield className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="truncate">Executive Alignment Index</span>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" className="w-full">
          <path
            d="M0 50C360 100 720 0 1080 50C1260 75 1380 75 1440 50V100H0V50Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
