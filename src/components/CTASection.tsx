import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-10 lg:p-16">
          {/* Decorative elements */}
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary/10 blur-2xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-serif text-3xl font-semibold text-primary-foreground sm:text-4xl lg:text-5xl text-balance">
              Unlock Your Leadership Potential
            </h2>
            <p className="mb-10 text-lg text-primary-foreground/80 lg:text-xl">
              Don't hesitate! Transform your leadership abilities with Bright Leadership 
              Consulting. Schedule your free consultation today and take the first step 
              towards extraordinary results.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="xl" className="group">
                Request Free Consultation
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="heroOutline" size="xl">
                View Programs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;