import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";

const comparisonData = [
  {
    feature: "Target Audience",
    leaders: "Individual executives & high-potential leaders",
    organizations: "Teams, departments & entire organizations",
  },
  {
    feature: "Program Duration",
    leaders: "8-12 weeks (self-paced options available)",
    organizations: "3-6 months (customizable timeline)",
  },
  {
    feature: "Delivery Format",
    leaders: "Digital modules + 1:1 coaching sessions",
    organizations: "On-site workshops + team coaching + retreats",
  },
  {
    feature: "Customization",
    leaders: "Personalized coaching focus areas",
    organizations: "Fully tailored to business goals & culture",
  },
  {
    feature: "CPD Accredited",
    leaders: true,
    organizations: true,
  },
  {
    feature: "Leadership Assessment",
    leaders: true,
    organizations: true,
  },
  {
    feature: "Team Workshops",
    leaders: false,
    organizations: true,
  },
  {
    feature: "Organizational Audit",
    leaders: false,
    organizations: true,
  },
  {
    feature: "ROI Metrics Dashboard",
    leaders: false,
    organizations: true,
  },
  {
    feature: "Immersive Retreats",
    leaders: "Optional add-on",
    organizations: true,
  },
  {
    feature: "Ongoing Support",
    leaders: "Email & scheduled sessions",
    organizations: "Dedicated account manager",
  },
  {
    feature: "Investment",
    leaders: "From £2,500",
    organizations: "Custom proposal",
  },
];

const ProgramComparison = () => {
  return (
    <section id="compare" className="section-padding bg-muted/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container-narrow relative">
        <AnimatedSection className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/15 to-secondary/15 px-5 py-2.5 border border-primary/20">
            <span className="text-sm font-semibold text-primary">
              Compare Programs
            </span>
          </div>
          <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Find Your{" "}
            <span className="text-primary">Perfect Fit</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Not sure which program is right for you? Compare our offerings side by side.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl">
            {/* Table Header */}
            <div className="grid grid-cols-3 border-b border-border/50">
              <div className="p-6 bg-muted/50">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Features
                </span>
              </div>
              <div className="p-6 bg-secondary/10 border-x border-border/50 text-center">
                <span className="font-serif text-lg font-semibold text-secondary">
                  For Leaders
                </span>
                <p className="text-xs text-muted-foreground mt-1">Individual Programs</p>
              </div>
              <div className="p-6 bg-primary/10 text-center">
                <span className="font-serif text-lg font-semibold text-primary">
                  For Organizations
                </span>
                <p className="text-xs text-muted-foreground mt-1">Enterprise Solutions</p>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border/50">
              {comparisonData.map((row, index) => (
                <div 
                  key={row.feature} 
                  className={`grid grid-cols-3 transition-colors hover:bg-muted/30 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                >
                  <div className="p-4 sm:p-5 flex items-center">
                    <span className="text-sm font-medium text-foreground">
                      {row.feature}
                    </span>
                  </div>
                  <div className="p-4 sm:p-5 border-x border-border/50 flex items-center justify-center">
                    {renderValue(row.leaders)}
                  </div>
                  <div className="p-4 sm:p-5 flex items-center justify-center">
                    {renderValue(row.organizations)}
                  </div>
                </div>
              ))}
            </div>

            {/* Table Footer with CTAs */}
            <div className="grid grid-cols-3 border-t border-border/50 bg-muted/30">
              <div className="p-6" />
              <div className="p-6 border-x border-border/50 flex justify-center">
                <Button variant="hero" size="default" className="group/btn">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
              <div className="p-6 flex justify-center">
                <Button variant="teal" size="default" className="group/btn">
                  Request Proposal
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Help text */}
        <AnimatedSection delay={200} className="mt-10 text-center">
          <p className="text-muted-foreground">
            Still not sure?{" "}
            <a href="#contact" className="text-primary font-medium hover:underline">
              Book a free consultation
            </a>{" "}
            and we'll help you choose the right path.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
};

const renderValue = (value: boolean | string) => {
  if (value === true) {
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15">
        <Check className="h-4 w-4 text-primary" strokeWidth={3} />
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
        <X className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
      </div>
    );
  }
  return (
    <span className="text-sm text-center text-muted-foreground">
      {value}
    </span>
  );
};

export default ProgramComparison;
