import { Users, GraduationCap, Briefcase, ArrowRight, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import heroCoaching from "@/assets/hero-coaching.jpg";
import teamCollaboration from "@/assets/team-collaboration.jpg";
import corporateRetreat from "@/assets/corporate-retreat.jpg";
import TiltCard from "./TiltCard";
import MagneticButton from "./MagneticButton";
import TextReveal from "./TextReveal";

const services = [
  {
    icon: Users,
    title: "Executive Coaching",
    description:
      "Personalized 1:1 coaching sessions to transform how you lead, inspire, and connect.",
    features: ["Tailored Guidance", "Flexible Sessions", "Ongoing Support"],
    stats: { value: "1:1", label: "Sessions" },
    image: heroCoaching,
    accent: "primary" as const,
    size: "large" as const,
  },
  {
    icon: GraduationCap,
    title: "Executive Training",
    description:
      "CPD-accredited digital courses designed to unlock your full leadership potential.",
    features: ["CPD Accredited", "Self-Paced", "Lifetime Access"],
    stats: { value: "7", label: "Programs" },
    image: teamCollaboration,
    accent: "secondary" as const,
    size: "medium" as const,
  },
  {
    icon: Briefcase,
    title: "Corporate Retreats",
    description:
      "Immersive training retreats for teams striving for excellence.",
    features: ["Team Building", "Strategic Planning", "Custom Workshops"],
    stats: { value: "3-5", label: "Days" },
    image: corporateRetreat,
    accent: "primary" as const,
    size: "medium" as const,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const ServicesSection = () => {
  return (
    <section id="services" className="relative overflow-hidden">
      {/* Top wave divider */}
      <div className="absolute top-0 left-0 right-0 -translate-y-px">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full" preserveAspectRatio="none">
          <path
            d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 36.7 768 43.3 864 45C960 46.7 1056 43.3 1152 38.3C1248 33.3 1344 26.7 1392 23.3L1440 20V0H1392C1344 0 1248 0 1152 0C1056 0 960 0 864 0C768 0 672 0 576 0C480 0 384 0 288 0C192 0 96 0 48 0H0V60Z"
            className="fill-muted/50"
          />
        </svg>
      </div>

      {/* Main content area */}
      <div className="bg-gradient-to-b from-primary/[0.08] via-primary/[0.05] to-primary/[0.02] pt-20 pb-24 relative">
        <div className="container-narrow relative">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-16 max-w-4xl text-center"
          >
            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/80 dark:bg-card/80 backdrop-blur-sm px-6 py-3 shadow-lg shadow-primary/5 border border-border/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-secondary/80">
                <Sparkles className="h-4 w-4 text-secondary-foreground" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-foreground">
                Our Services
              </span>
            </div>
            
            <h2 className="mb-8 font-serif text-4xl font-semibold text-foreground sm:text-5xl lg:text-6xl leading-tight">
              <TextReveal>Three Paths to Leadership Excellence</TextReveal>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Choose the approach that fits your unique leadership journey.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className={`${index === 0 ? 'lg:col-span-2' : ''}`}
              >
                <TiltCard className="h-full">
                  <div className={`group relative overflow-hidden rounded-2xl bg-card border border-border/50 transition-all duration-500 hover:border-primary/30 h-full flex flex-col ${index === 0 ? 'min-h-[420px]' : 'min-h-[420px]'}`}>
                    {/* Image */}
                    <div className={`relative overflow-hidden ${index === 0 ? 'h-72' : 'h-40'}`}>
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                      
                      {/* Stats Badge */}
                      <div className={`absolute top-4 right-4 ${service.accent === 'secondary' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'} px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm`}>
                        <span className="font-serif text-lg mr-1">{service.stats.value}</span>
                        <span className="uppercase tracking-wider">{service.stats.label}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${service.accent === 'secondary' ? 'from-secondary/20 to-secondary/5' : 'from-primary/15 to-primary/5'} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                          <service.icon className={`h-6 w-6 ${service.accent === 'secondary' ? 'text-secondary' : 'text-primary'}`} strokeWidth={1.5} />
                        </div>
                        <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                          {service.title}
                        </h3>
                      </div>
                      
                      <p className={`mb-5 text-muted-foreground leading-relaxed ${index === 0 ? 'text-base' : 'text-sm'} flex-grow`}>
                        {service.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {service.features.map((feature) => (
                          <span 
                            key={feature} 
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/50 text-xs font-medium text-foreground border border-border/50 transition-all duration-300 hover:bg-muted"
                          >
                            <Star className={`h-2.5 w-2.5 ${service.accent === 'secondary' ? 'text-secondary fill-secondary' : 'text-primary fill-primary'}`} />
                            {feature}
                          </span>
                        ))}
                      </div>

                      <MagneticButton 
                        variant={service.accent === 'secondary' ? 'hero' : 'teal'}
                        size="default"
                        className="w-full mt-auto"
                        magneticStrength={0.2}
                      >
                        Learn More
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </MagneticButton>
                    </div>
                    
                    {/* Hover accent line */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.accent === 'secondary' ? 'from-secondary via-primary to-secondary' : 'from-primary via-secondary to-primary'} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
