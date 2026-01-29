import { GraduationCap, Users, Building2, ArrowRight } from "lucide-react";
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
  },
  {
    icon: Users,
    title: "Executive Coaching",
    description:
      "Personalized 1:1 coaching sessions to transform how you lead, inspire, and connect with your team and stakeholders.",
    features: ["Tailored Guidance", "Flexible Sessions", "Ongoing Support"],
    link: "#",
  },
  {
    icon: Building2,
    title: "Corporate Retreats",
    description:
      "Immersive training retreats designed for leaders and organizations striving for excellence and sustainable growth.",
    features: ["Team Building", "Strategic Planning", "Custom Workshops"],
    link: "#",
  },
];

const ServicesSection = () => {
  return (
    <section id="programs" className="section-padding bg-background">
      <div className="container-narrow">
        {/* Section Header */}
        <AnimatedSection className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-secondary">
            What We Offer
          </span>
          <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Tailored Path to{" "}
            <span className="text-primary">Excellence</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the program that fits your unique leadership journey. 
            We meet you where you are and guide you to where you want to be.
          </p>
        </AnimatedSection>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <AnimatedSection key={service.title} delay={index * 100}>
              <div className="group relative h-full rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
                {/* Icon */}
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-primary">
                  <service.icon className="h-7 w-7" />
                </div>

                <h3 className="mb-3 font-serif text-xl font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mb-6 text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="mb-6 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button variant="ghost" className="group/btn p-0 h-auto text-primary font-semibold">
                  Learn More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>

                {/* Decorative gradient on hover */}
                <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;