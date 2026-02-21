import { Users, GraduationCap, Briefcase, Sparkles, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
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

interface ServiceCardProps {
  service: typeof services[0];
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TiltCard className="h-full" maxTilt={6}>
        <motion.div 
          className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 h-full flex flex-col"
          animate={{
            borderColor: isHovered 
              ? service.accent === 'secondary' ? 'hsl(var(--secondary) / 0.5)' : 'hsl(var(--primary) / 0.5)'
              : 'hsl(var(--border) / 0.5)',
            boxShadow: isHovered 
              ? service.accent === 'secondary' 
                ? '0 25px 50px -12px hsl(var(--secondary) / 0.25)' 
                : '0 25px 50px -12px hsl(var(--primary) / 0.25)'
              : '0 0 0 0 transparent',
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Animated gradient overlay on hover */}
          <motion.div 
            className={`absolute inset-0 pointer-events-none z-10 ${
              service.accent === 'secondary' 
                ? 'bg-gradient-to-br from-secondary/5 via-transparent to-secondary/10' 
                : 'bg-gradient-to-br from-primary/5 via-transparent to-primary/10'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Image with parallax zoom */}
          <div className="relative h-56 overflow-hidden">
            <motion.img 
              src={service.image} 
              alt={service.title}
              className="absolute inset-0 h-full w-full object-cover"
              animate={{
                scale: isHovered ? 1.1 : 1,
                y: isHovered ? -5 : 0,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            
            {/* Stats Badge with pulse animation */}
            <motion.div 
              className={`absolute top-4 right-4 ${service.accent === 'secondary' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'} px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm flex items-center gap-1.5`}
              animate={{
                scale: isHovered ? 1.05 : 1,
                y: isHovered ? -2 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.span 
                className="font-serif text-xl"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {service.stats.value}
              </motion.span>
              <span className="uppercase tracking-wider opacity-90">{service.stats.label}</span>
            </motion.div>
            
            {/* Icon with float and glow animation */}
            <motion.div 
              className={`absolute bottom-4 left-6 h-14 w-14 flex items-center justify-center rounded-2xl bg-card/90 backdrop-blur-sm border ${service.accent === 'secondary' ? 'border-secondary/30' : 'border-primary/30'} shadow-xl`}
              animate={{
                y: isHovered ? -8 : 0,
                scale: isHovered ? 1.1 : 1,
                boxShadow: isHovered 
                  ? service.accent === 'secondary'
                    ? '0 20px 40px -10px hsl(var(--secondary) / 0.4)'
                    : '0 20px 40px -10px hsl(var(--primary) / 0.4)'
                  : '0 10px 20px -5px rgba(0,0,0,0.1)',
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div
                animate={{ rotate: isHovered ? [0, -10, 10, 0] : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <service.icon 
                  className={`h-7 w-7 ${service.accent === 'secondary' ? 'text-secondary' : 'text-primary'}`} 
                  strokeWidth={1.5} 
                />
              </motion.div>
            </motion.div>
          </div>
          
          {/* Content */}
          <div className="p-6 flex flex-col flex-grow relative z-20">
            <motion.h3 
              className="font-serif text-2xl font-semibold text-foreground mb-3"
              animate={{
                color: isHovered 
                  ? service.accent === 'secondary' ? 'hsl(var(--secondary))' : 'hsl(var(--primary))'
                  : 'hsl(var(--foreground))',
                x: isHovered ? 4 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {service.title}
            </motion.h3>
            
            <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
              {service.description}
            </p>

            {/* Features with staggered animation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {service.features.map((feature, featureIndex) => (
                <motion.span 
                  key={feature} 
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                    service.accent === 'secondary' 
                      ? 'bg-secondary/10 text-secondary border border-secondary/20' 
                      : 'bg-primary/10 text-primary border border-primary/20'
                  }`}
                  animate={{
                    scale: isHovered ? 1.05 : 1,
                    y: isHovered ? -2 : 0,
                    backgroundColor: isHovered 
                      ? service.accent === 'secondary' ? 'hsl(var(--secondary) / 0.2)' : 'hsl(var(--primary) / 0.2)'
                      : service.accent === 'secondary' ? 'hsl(var(--secondary) / 0.1)' : 'hsl(var(--primary) / 0.1)',
                  }}
                  transition={{ 
                    duration: 0.3, 
                    delay: isHovered ? featureIndex * 0.05 : 0,
                    ease: "easeOut"
                  }}
                >
                  <motion.div
                    animate={{ rotate: isHovered ? 360 : 0 }}
                    transition={{ duration: 0.6, delay: featureIndex * 0.1 }}
                  >
                    <Star className="h-3 w-3 fill-current" />
                  </motion.div>
                  {feature}
                </motion.span>
              ))}
            </div>

            <MagneticButton 
              variant={service.accent === 'secondary' ? 'hero' : 'teal'}
              size="lg"
              className="w-full group/btn overflow-hidden"
              magneticStrength={0.15}
              href="/services"
            >
              <motion.span 
                className="flex items-center justify-center gap-2"
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <span>Learn More</span>
                <motion.div
                  animate={{ 
                    x: isHovered ? [0, 4, 0] : 0,
                  }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: isHovered ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              </motion.span>
            </MagneticButton>
          </div>
          
          {/* Animated accent line */}
          <motion.div 
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.accent === 'secondary' ? 'from-secondary via-primary to-secondary' : 'from-primary via-secondary to-primary'}`}
            initial={{ scaleX: 0 }}
            animate={{ 
              scaleX: isHovered ? 1 : 0,
              originX: 0,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* Shimmer effect on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: isHovered ? '100%' : '-100%' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </motion.div>
      </TiltCard>
    </motion.div>
  );
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

          {/* Services Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;