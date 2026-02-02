import { Users, GraduationCap, Briefcase, ArrowRight, Sparkles, Star, ChevronRight } from "lucide-react";
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
      "Personalized 1:1 coaching sessions to transform how you lead, inspire, and connect with your team.",
    features: ["Tailored Guidance", "Flexible Sessions", "Ongoing Support"],
    stats: { value: "1:1", label: "Sessions" },
    image: heroCoaching,
    accent: "primary" as const,
  },
  {
    icon: GraduationCap,
    title: "Executive Training",
    description:
      "CPD-accredited digital courses designed to unlock your full leadership potential at your own pace.",
    features: ["CPD Accredited", "Self-Paced", "Lifetime Access"],
    stats: { value: "7", label: "Programs" },
    image: teamCollaboration,
    accent: "secondary" as const,
  },
  {
    icon: Briefcase,
    title: "Corporate Retreats",
    description:
      "Immersive training retreats for teams striving for excellence and breakthrough results.",
    features: ["Team Building", "Strategic Planning", "Custom Workshops"],
    stats: { value: "3-5", label: "Days" },
    image: corporateRetreat,
    accent: "primary" as const,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 20,
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

          {/* Services Grid - Clean 3-column layout */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={itemVariants}
              >
                <TiltCard className="h-full" maxTilt={6}>
                  <div className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 h-full flex flex-col">
                    {/* Image with overlay */}
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                      
                      {/* Stats Badge */}
                      <div className={`absolute top-4 right-4 ${service.accent === 'secondary' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'} px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm flex items-center gap-1.5`}>
                        <span className="font-serif text-xl">{service.stats.value}</span>
                        <span className="uppercase tracking-wider opacity-90">{service.stats.label}</span>
                      </div>
                      
                      {/* Icon floating on image */}
                      <div className={`absolute bottom-4 left-6 h-14 w-14 flex items-center justify-center rounded-2xl bg-card/90 backdrop-blur-sm border ${service.accent === 'secondary' ? 'border-secondary/30' : 'border-primary/30'} shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1`}>
                        <service.icon className={`h-7 w-7 ${service.accent === 'secondary' ? 'text-secondary' : 'text-primary'}`} strokeWidth={1.5} />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-serif text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                        {service.description}
                      </p>

                      {/* Features as inline list */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {service.features.map((feature) => (
                          <span 
                            key={feature} 
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                              service.accent === 'secondary' 
                                ? 'bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20' 
                                : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                            }`}
                          >
                            <Star className="h-3 w-3 fill-current" />
                            {feature}
                          </span>
                        ))}
                      </div>

                      <MagneticButton 
                        variant={service.accent === 'secondary' ? 'hero' : 'teal'}
                        size="lg"
                        className="w-full group/btn"
                        magneticStrength={0.15}
                      >
                        <span>Learn More</span>
                        <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
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