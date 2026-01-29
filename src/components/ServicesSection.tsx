import { GraduationCap, Users, Building2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";

const services = [
  {
    icon: GraduationCap,
    title: "Leadership Mastery Program",
    description:
      "A comprehensive 7-in-1 digital course bundle designed to unlock your full leadership potential with practical tools and powerful insights.",
    features: ["33 Comprehensive Modules", "Self-Paced Learning", "CPD Accredited"],
    link: "#",
    gradient: "from-primary/20 via-primary/10 to-transparent",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    accent: "bg-primary",
  },
  {
    icon: Users,
    title: "Executive Coaching",
    description:
      "Personalized 1:1 coaching sessions to transform how you lead, inspire, and connect with your team and stakeholders.",
    features: ["Tailored Guidance", "Flexible Sessions", "Ongoing Support"],
    link: "#",
    gradient: "from-secondary/20 via-secondary/10 to-transparent",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
    accent: "bg-secondary",
  },
  {
    icon: Building2,
    title: "Corporate Retreats",
    description:
      "Immersive training retreats designed for leaders and organizations striving for excellence and sustainable growth.",
    features: ["Team Building", "Strategic Planning", "Custom Workshops"],
    link: "#",
    gradient: "from-accent/40 via-accent/20 to-transparent",
    iconBg: "bg-accent",
    iconColor: "text-primary",
    accent: "bg-primary",
  },
];

const ServicesSection = () => {
  return (
    <section id="programs" className="section-padding bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container-narrow relative">
        {/* Section Header */}
        <AnimatedSection className="mx-auto mb-20 max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-sm font-semibold text-secondary">
              What We Offer
            </span>
          </div>
          <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Tailored Path to{" "}
            <span className="relative">
              Excellence
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 8C50 4 150 4 198 8"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the program that fits your unique leadership journey. 
            We meet you where you are and guide you to where you want to be.
          </p>
        </AnimatedSection>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <AnimatedSection key={service.title} delay={index * 150}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-border/50 bg-card p-8 transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:-translate-y-2">
                {/* Gradient background overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Floating accent shape */}
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="relative">
                  {/* Icon with animated ring */}
                  <div className="relative mb-8">
                    <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${service.iconBg} ${service.iconColor} transition-transform duration-500 group-hover:scale-110`}>
                      <service.icon className="h-8 w-8" strokeWidth={1.5} />
                    </div>
                    <div className={`absolute -inset-2 rounded-2xl border-2 border-dashed ${service.iconColor} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                  </div>

                  <h3 className="mb-4 font-serif text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="mb-8 text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features with animated bullets */}
                  <ul className="mb-8 space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                        <span 
                          className={`h-2 w-2 rounded-full ${service.accent} transition-transform duration-300 group-hover:scale-125`}
                          style={{ transitionDelay: `${i * 50}ms` }}
                        />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant="ghost" 
                    className="group/btn p-0 h-auto text-primary font-semibold hover:bg-transparent"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
