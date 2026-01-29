import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";

const CTASection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-10 lg:p-16">
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary/10 blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
            
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.5) 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }} />

            <div className="relative mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-5 py-2.5 border border-white/20">
                <Sparkles className="h-4 w-4 text-secondary" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">
                  Take Action Today
                </span>
              </div>
              
              <h2 className="mb-6 font-serif text-3xl font-semibold text-primary-foreground sm:text-4xl lg:text-5xl text-balance">
                Unlock Your Leadership Potential
              </h2>
              <p className="mb-10 text-lg text-primary-foreground/80 lg:text-xl leading-relaxed">
                Don't hesitate! Transform your leadership abilities with Bright Leadership 
                Consulting. Schedule your free consultation today and take the first step 
                towards extraordinary results.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="hero" size="xl" className="group shadow-xl shadow-secondary/30">
                  Request Free Consultation
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="heroOutline" size="xl">
                  View Programs
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CTASection;
