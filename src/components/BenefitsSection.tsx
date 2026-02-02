import { motion } from "framer-motion";
import {
  TrendingUp,
  Heart,
  Award,
  Zap,
  Scale,
  Sparkles,
  Target,
  Building,
} from "lucide-react";
import TiltCard from "./TiltCard";
import TextReveal from "./TextReveal";

const benefits = [
  { icon: TrendingUp, title: "Enhanced Leadership Skills", description: "Master the art of inspiring and guiding teams", size: "large" },
  { icon: Heart, title: "Job Satisfaction Boost", description: "Find deeper meaning and fulfillment in your role", size: "small" },
  { icon: Award, title: "Financial Rewards", description: "Unlock career advancement and growth opportunities", size: "small" },
  { icon: Zap, title: "Productivity Surge", description: "Achieve more with focused, effective leadership", size: "medium" },
  { icon: Scale, title: "Work-Life Harmony", description: "Balance professional success with personal wellbeing", size: "medium" },
  { icon: Sparkles, title: "Holistic Growth", description: "Develop as a complete leader and person", size: "small" },
  { icon: Target, title: "Career Acceleration", description: "Fast-track your path to executive positions", size: "small" },
  { icon: Building, title: "Organisational Flourishing", description: "Create lasting positive impact on your organization", size: "large" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const BenefitsSection = () => {
  return (
    <section id="coaching" className="section-padding relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
      
      {/* Animated floating orbs */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-secondary/25 rounded-full blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      <div className="container-narrow relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-5 py-2.5 border border-white/20">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              Why Choose Us
            </span>
          </div>
          <h2 className="mb-6 font-serif text-3xl font-semibold text-primary-foreground sm:text-4xl lg:text-5xl">
            <TextReveal delay={0.2}>
              Benefits of Executive Coaching
            </TextReveal>
          </h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            Unlock your leadership potential and experience transformative growth 
            across all areas of your professional and personal life.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {benefits.map((benefit, index) => {
            const isLarge = benefit.size === "large";
            const isMedium = benefit.size === "medium";
            
            return (
              <motion.div
                key={benefit.title}
                variants={itemVariants}
                className={`${isLarge ? 'col-span-2 row-span-2' : isMedium ? 'col-span-2 lg:col-span-1' : ''}`}
              >
                <TiltCard className="h-full" maxTilt={6} glareEnabled>
                  <div className={`group h-full rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/10 transition-all duration-500 hover:bg-white/[0.12] hover:border-white/20 ${isLarge ? 'p-8' : 'p-6'}`}>
                    {/* Icon */}
                    <div className={`mb-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-lg shadow-secondary/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl group-hover:shadow-secondary/40 ${isLarge ? 'h-16 w-16' : 'h-14 w-14'}`}>
                      <benefit.icon className={`${isLarge ? 'h-8 w-8' : 'h-7 w-7'}`} strokeWidth={1.5} />
                    </div>
                    
                    {/* Content */}
                    <h3 className={`mb-2 font-serif font-semibold text-primary-foreground ${isLarge ? 'text-2xl' : 'text-lg'}`}>
                      {benefit.title}
                    </h3>
                    <p className={`text-primary-foreground/70 leading-relaxed ${isLarge ? 'text-base' : 'text-sm'}`}>
                      {benefit.description}
                    </p>
                    
                    {/* Decorative gradient line */}
                    <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-secondary to-secondary/50 transition-all duration-500 group-hover:w-full" />
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
