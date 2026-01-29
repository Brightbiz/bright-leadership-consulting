import { GraduationCap, Users, Building2, ArrowRight, Sparkles, Star, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import heroCoaching from "@/assets/hero-coaching.jpg";
import teamCollaboration from "@/assets/team-collaboration.jpg";
import corporateRetreat from "@/assets/corporate-retreat.jpg";

const services = [
  {
    icon: GraduationCap,
    title: "Leadership Mastery Program",
    description:
      "A comprehensive 7-in-1 digital course bundle designed to unlock your full leadership potential with practical tools and powerful insights.",
    features: ["33 Comprehensive Modules", "Self-Paced Learning", "CPD Accredited"],
    stats: { value: "33", label: "Modules" },
    image: teamCollaboration,
    badge: "Most Popular",
    badgeColor: "bg-secondary text-secondary-foreground",
  },
  {
    icon: Users,
    title: "Executive Coaching",
    description:
      "Personalized 1:1 coaching sessions to transform how you lead, inspire, and connect with your team and stakeholders.",
    features: ["Tailored Guidance", "Flexible Sessions", "Ongoing Support"],
    stats: { value: "1:1", label: "Sessions" },
    image: heroCoaching,
    badge: "Personalized",
    badgeColor: "bg-primary text-primary-foreground",
  },
  {
    icon: Building2,
    title: "Corporate Retreats",
    description:
      "Immersive training retreats designed for leaders and organizations striving for excellence and sustainable growth.",
    features: ["Team Building", "Strategic Planning", "Custom Workshops"],
    stats: { value: "3-5", label: "Days" },
    image: corporateRetreat,
    badge: "Immersive",
    badgeColor: "bg-primary text-primary-foreground",
  },
];

const ServicesSection = () => {
  return (
    <section id="programs" className="section-padding bg-background relative overflow-hidden">
      {/* Subtle pattern background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-secondary/8 to-transparent rounded-full blur-3xl" />
      
      <div className="container-narrow relative">
        {/* Section Header */}
        <AnimatedSection className="mx-auto mb-20 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary/20 to-secondary/10 px-5 py-2.5 border border-secondary/20">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-sm font-semibold text-secondary">
              What We Offer
            </span>
          </div>
          <h2 className="mb-6 font-serif text-4xl font-semibold text-foreground sm:text-5xl lg:text-6xl">
            Tailored Path to{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">Excellence</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-secondary/30 -z-0 -rotate-1" />
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the program that fits your unique leadership journey. 
            We meet you where you are and guide you to where you want to be.
          </p>
        </AnimatedSection>

        {/* Services Grid - Staggered layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {services.map((service, index) => (
            <AnimatedSection 
              key={service.title} 
              delay={index * 150}
              className={index === 1 ? "lg:-mt-8" : ""}
            >
              <div className="group relative h-full overflow-hidden rounded-3xl bg-card border border-border/50 transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-3">
                {/* Image header */}
                <div className="relative h-52 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  
                  {/* Badge */}
                  <div className={`absolute top-4 left-4 ${service.badgeColor} px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg`}>
                    {service.badge}
                  </div>
                  
                  {/* Stats overlay */}
                  <div className="absolute bottom-4 right-4 glass-card rounded-2xl px-4 py-3 text-center min-w-[70px]">
                    <div className="font-serif text-2xl font-bold text-primary">{service.stats.value}</div>
                    <div className="text-xs text-muted-foreground font-medium">{service.stats.label}</div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8">
                  {/* Icon */}
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
                    <service.icon className="h-7 w-7" strokeWidth={1.5} />
                  </div>

                  <h3 className="mb-3 font-serif text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="mb-6 text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="mb-6 space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary/10">
                          <Star className="h-2.5 w-2.5 text-secondary fill-secondary" />
                        </div>
                        <span className="font-medium text-foreground">{feature}</span>
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
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Trust indicators */}
        <AnimatedSection delay={500} className="mt-20">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {[
              { icon: Award, text: "CPD Accredited" },
              { icon: Clock, text: "Flexible Scheduling" },
              { icon: Users, text: "500+ Leaders Trained" },
              { icon: Star, text: "4.9/5 Rating" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-muted-foreground">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ServicesSection;
