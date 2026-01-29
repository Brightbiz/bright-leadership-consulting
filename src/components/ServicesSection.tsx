import { GraduationCap, Users, Building2, ArrowRight, Sparkles, Star, Clock, Award, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import heroCoaching from "@/assets/hero-coaching.jpg";
import teamCollaboration from "@/assets/team-collaboration.jpg";
import corporateRetreat from "@/assets/corporate-retreat.jpg";

const forLeaders = [
  {
    icon: GraduationCap,
    title: "Executive Leadership Mastery Program",
    description:
      "A comprehensive CPD-accredited digital course designed to unlock your full leadership potential with 33 modules of practical tools and powerful insights.",
    features: ["33 Comprehensive Modules", "Self-Paced Learning", "CPD Accredited"],
    stats: { value: "33", label: "Modules" },
    image: teamCollaboration,
    badge: "Most Popular",
    accent: "secondary" as const,
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
    accent: "primary" as const,
  },
];

const forOrganizations = [
  {
    icon: Building2,
    title: "Organizational Transformation",
    description:
      "A customizable program designed to align leadership development with your business goals and create a sustainable leadership pipeline.",
    features: ["Leadership Audit", "Custom Training", "ROI Focused"],
    stats: { value: "3-6", label: "Months" },
    image: corporateRetreat,
    badge: "Enterprise",
    accent: "primary" as const,
  },
  {
    icon: Briefcase,
    title: "Corporate Training Retreats",
    description:
      "Immersive retreats designed for leaders and teams striving for excellence through tailored workshops and strategic planning.",
    features: ["Team Building", "Strategic Planning", "Custom Workshops"],
    stats: { value: "3-5", label: "Days" },
    image: corporateRetreat,
    badge: "Immersive",
    accent: "secondary" as const,
  },
];

interface ServiceCardProps {
  service: {
    icon: React.ElementType;
    title: string;
    description: string;
    features: string[];
    stats: { value: string; label: string };
    image: string;
    badge: string;
    accent: "primary" | "secondary";
  };
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => (
  <div className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 h-full">
    {/* Image */}
    <div className="relative h-48 overflow-hidden">
      <img 
        src={service.image} 
        alt={service.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
      
      {/* Badge */}
      <div className={`absolute top-4 right-4 ${service.accent === 'secondary' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'} px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg`}>
        {service.badge}
      </div>
    </div>
    
    {/* Content */}
    <div className="p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className={`shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${service.accent === 'secondary' ? 'from-secondary/20 to-secondary/5' : 'from-primary/15 to-primary/5'} transition-transform duration-300 group-hover:scale-110`}>
          <service.icon className={`h-6 w-6 ${service.accent === 'secondary' ? 'text-secondary' : 'text-primary'}`} strokeWidth={1.5} />
        </div>
        
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${service.accent === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
          <span className="font-serif text-lg font-bold">{service.stats.value}</span>
          <span className="text-xs font-semibold uppercase tracking-wider opacity-70">{service.stats.label}</span>
        </div>
      </div>
      
      <h3 className="mb-3 font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
        {service.title}
      </h3>
      
      <p className="mb-5 text-muted-foreground leading-relaxed text-sm">
        {service.description}
      </p>

      {/* Features */}
      <div className="flex flex-wrap gap-2 mb-6">
        {service.features.map((feature) => (
          <span 
            key={feature} 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-xs font-medium text-foreground border border-border/50"
          >
            <Star className={`h-2.5 w-2.5 ${service.accent === 'secondary' ? 'text-secondary fill-secondary' : 'text-primary fill-primary'}`} />
            {feature}
          </span>
        ))}
      </div>

      <Button 
        variant={service.accent === 'secondary' ? 'hero' : 'teal'}
        size="default"
        className="w-full group/btn"
      >
        Learn More
        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
      </Button>
    </div>
    
    {/* Hover accent line */}
    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.accent === 'secondary' ? 'from-secondary via-primary to-secondary' : 'from-primary via-secondary to-primary'} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
  </div>
);

interface OfferingSectionProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  services: typeof forLeaders;
  delay?: number;
}

const OfferingSection = ({ title, subtitle, icon: Icon, iconColor, services, delay = 0 }: OfferingSectionProps) => (
  <AnimatedSection delay={delay}>
    <div className="mb-10">
      <div className={`inline-flex items-center gap-3 mb-4 px-5 py-2.5 rounded-full bg-gradient-to-r ${iconColor === 'secondary' ? 'from-secondary/15 to-secondary/5 border-secondary/20' : 'from-primary/15 to-primary/5 border-primary/20'} border`}>
        <Icon className={`h-5 w-5 ${iconColor === 'secondary' ? 'text-secondary' : 'text-primary'}`} />
        <span className={`text-sm font-bold uppercase tracking-wider ${iconColor === 'secondary' ? 'text-secondary' : 'text-primary'}`}>
          {title}
        </span>
      </div>
      <p className="text-lg text-muted-foreground max-w-xl">
        {subtitle}
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6">
      {services.map((service, index) => (
        <ServiceCard key={service.title} service={service} index={index} />
      ))}
    </div>
  </AnimatedSection>
);

const ServicesSection = () => {
  return (
    <section id="programs" className="relative overflow-hidden">
      {/* Top wave divider */}
      <div className="absolute top-0 left-0 right-0 -translate-y-px">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
          <path
            d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 36.7 768 43.3 864 45C960 46.7 1056 43.3 1152 38.3C1248 33.3 1344 26.7 1392 23.3L1440 20V0H1392C1344 0 1248 0 1152 0C1056 0 960 0 864 0C768 0 672 0 576 0C480 0 384 0 288 0C192 0 96 0 48 0H0V60Z"
            className="fill-muted/50"
          />
        </svg>
      </div>

      {/* Main content area with gradient bg */}
      <div className="bg-gradient-to-b from-muted/50 via-muted/30 to-background pt-20 pb-32">
        {/* Decorative elements */}
        <div className="absolute top-40 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-60 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        
        <div className="container-narrow relative">
          {/* Section Header */}
          <AnimatedSection className="mx-auto mb-20 max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/80 dark:bg-card/80 backdrop-blur-sm px-6 py-3 shadow-lg shadow-primary/5 border border-border/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-secondary/80">
                <Sparkles className="h-4 w-4 text-secondary-foreground" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-foreground">
                What We Offer
              </span>
            </div>
            
            <h2 className="mb-8 font-serif text-4xl font-semibold text-foreground sm:text-5xl lg:text-6xl leading-tight">
              Tailored Path to{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                  Excellence
                </span>
                <svg
                  className="absolute -bottom-3 left-0 w-full"
                  viewBox="0 0 200 15"
                  fill="none"
                >
                  <path
                    d="M2 12C30 6 60 4 100 6C140 8 170 5 198 10"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="animate-[dash_2s_ease-in-out_infinite]"
                  />
                </svg>
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Choose the program that fits your unique leadership journey. 
              We meet you where you are and guide you to where you want to be.
            </p>
          </AnimatedSection>

          {/* For Leaders Section */}
          <div id="for-leaders" className="mb-20 scroll-mt-24">
            <OfferingSection
              title="For Leaders"
              subtitle="Elevate your personal leadership with tailored programs designed for executives ready to make an impact."
              icon={User}
              iconColor="secondary"
              services={forLeaders}
              delay={0}
            />
          </div>

          {/* For Organizations Section */}
          <div id="for-organizations" className="mb-20 scroll-mt-24">
            <OfferingSection
              title="For Organizations"
              subtitle="Transform your organization's leadership culture with enterprise-grade programs and immersive experiences."
              icon={Building2}
              iconColor="primary"
              services={forOrganizations}
              delay={200}
            />
          </div>

          {/* Trust indicators */}
          <AnimatedSection delay={400} className="mt-24">
            <div className="relative rounded-3xl bg-gradient-to-r from-primary/5 via-card to-secondary/5 border border-border/50 p-8 lg:p-12">
              <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent opacity-50" />
              
              <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: Award, value: "CPD", label: "Accredited", color: "text-primary" },
                  { icon: Clock, value: "Flexible", label: "Scheduling", color: "text-secondary" },
                  { icon: Users, value: "500+", label: "Leaders Trained", color: "text-primary" },
                  { icon: Star, value: "4.9/5", label: "Rating", color: "text-secondary" },
                ].map((item, i) => (
                  <div key={i} className="text-center group cursor-default">
                    <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-muted shadow-lg shadow-primary/5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div className={`font-serif text-2xl font-bold ${item.color}`}>{item.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
