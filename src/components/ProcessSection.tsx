import { Footprints } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import teamImage from "@/assets/team-collaboration.jpg";

const steps = [
  {
    number: "01",
    title: "Initial Assessment",
    description: "We begin by understanding your unique needs, aspirations, and challenges.",
  },
  {
    number: "02",
    title: "Personalized Plan",
    description: "A coaching plan crafted just for you, aligned with your goals and growth areas.",
  },
  {
    number: "03",
    title: "Coaching Sessions",
    description: "Dive into dynamic one-on-one sessions with our seasoned coaches.",
  },
  {
    number: "04",
    title: "Ongoing Support",
    description: "Continued support and resources beyond the sessions for lasting transformation.",
  },
];

const ProcessSection = () => {
  return (
    <section id="about" className="section-padding relative overflow-hidden bg-gradient-to-br from-muted/50 via-background to-muted/30">
      {/* Decorative elements */}
      <div className="absolute top-20 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-32 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container-narrow relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Image */}
          <AnimatedSection animation="slide-left" className="relative order-2 lg:order-1">
            <div className="relative">
              {/* Main image container */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-primary/10">
                <img
                  src={teamImage}
                  alt="Leadership team collaboration"
                  className="h-full w-full object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
              </div>
              
              {/* Floating accent card */}
              <div className="absolute -bottom-6 -right-6 lg:-right-10 rounded-2xl bg-gradient-to-br from-secondary to-secondary/90 p-6 shadow-xl shadow-secondary/30">
                <div className="font-serif text-3xl font-bold text-secondary-foreground">15+</div>
                <div className="text-sm font-medium text-secondary-foreground/80">Years of Excellence</div>
              </div>
              
              {/* Additional floating element */}
              <div className="absolute -top-4 -left-4 lg:-left-8 rounded-xl bg-white dark:bg-card p-4 shadow-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Footprints className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">500+</div>
                    <div className="text-xs text-muted-foreground">Leaders Transformed</div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Content */}
          <AnimatedSection animation="slide-right" delay={100} className="order-1 lg:order-2">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary/15 to-primary/15 px-5 py-2.5 border border-secondary/20">
              <Footprints className="h-4 w-4 text-secondary" />
              <span className="text-sm font-bold text-secondary uppercase tracking-wider">
                Our Process
              </span>
            </div>
            
            <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
              Your Coaching <span className="text-primary">Journey</span>
            </h2>
            <p className="mb-10 text-lg text-muted-foreground leading-relaxed">
              Our structured yet flexible approach ensures you receive the personalized 
              guidance needed to unlock your full leadership potential.
            </p>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={step.number} className="flex gap-5 group">
                  <div className="relative flex flex-col items-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 font-serif text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/30">
                      {step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="mt-3 h-full w-0.5 bg-gradient-to-b from-primary/50 to-border" />
                    )}
                  </div>
                  <div className="pb-6">
                    <h3 className="mb-2 font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
