import { Check, X, ArrowRight, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const ProgramComparison = () => {
  return (
    <section id="compare" className="section-padding bg-background relative overflow-hidden">
      <div className="container-narrow relative">
        <AnimatedSection className="text-center">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 px-5 py-2.5 border border-primary/20">
              <LayoutGrid className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Compare Programs
              </span>
            </div>
            <h2 className="mb-4 font-serif text-2xl font-semibold text-foreground sm:text-3xl">
              Not Sure Which Path is Right for You?
            </h2>
            <p className="text-muted-foreground mb-8">
              View our detailed comparison to find the perfect program for your needs.
            </p>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="group">
                  <LayoutGrid className="h-4 w-4" />
                  View Program Comparison
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl text-center pb-4">
                    Find Your <span className="text-primary">Perfect Fit</span>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="overflow-hidden rounded-xl border border-border/50 bg-card">
                  {/* Table Header */}
                  <div className="grid grid-cols-3 border-b border-border/50">
                    <div className="p-4 bg-muted/50">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Features
                      </span>
                    </div>
                    <div className="p-4 bg-secondary/10 border-x border-border/50 text-center">
                      <span className="font-serif text-sm font-semibold text-secondary">
                        For Leaders
                      </span>
                    </div>
                    <div className="p-4 bg-primary/10 text-center">
                      <span className="font-serif text-sm font-semibold text-primary">
                        For Organizations
                      </span>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-border/50">
                    {comparisonData.map((row, index) => (
                      <div 
                        key={row.feature} 
                        className={`grid grid-cols-3 transition-colors hover:bg-muted/30 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                      >
                        <div className="p-3 flex items-center">
                          <span className="text-xs font-medium text-foreground">
                            {row.feature}
                          </span>
                        </div>
                        <div className="p-3 border-x border-border/50 flex items-center justify-center">
                          {renderValue(row.leaders)}
                        </div>
                        <div className="p-3 flex items-center justify-center">
                          {renderValue(row.organizations)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Table Footer with CTAs */}
                  <div className="grid grid-cols-3 border-t border-border/50 bg-muted/30">
                    <div className="p-4" />
                    <div className="p-4 border-x border-border/50 flex justify-center">
                      <Button variant="hero" size="sm" className="group/btn text-xs">
                        Get Started
                        <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                    <div className="p-4 flex justify-center">
                      <Button variant="teal" size="sm" className="group/btn text-xs">
                        Request Proposal
                        <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Still not sure?{" "}
                  <a href="#contact" className="text-primary font-medium hover:underline">
                    Book a free consultation
                  </a>
                </p>
              </DialogContent>
            </Dialog>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ProgramComparison;
