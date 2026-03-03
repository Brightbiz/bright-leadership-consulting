import { motion } from "framer-motion";
import {
  TrendingUp,
  Shield,
  Award,
  Zap,
  Scale,
  Target,
  Building,
  GitBranch,
} from "lucide-react";
import TiltCard from "./TiltCard";
import TextReveal from "./TextReveal";

const benefits = [
  { icon: TrendingUp, title: "Strategic Execution Velocity", description: "Accelerate the speed from decision to outcome across the executive team", size: "large" },
  { icon: Shield, title: "Governance Clarity", description: "Define decision rights, escalation pathways, and accountability architecture", size: "small" },
  { icon: GitBranch, title: "Executive Alignment", description: "Reduce structural variance where it creates the highest governance risk", size: "small" },
  { icon: Zap, title: "Operational Confidence", description: "Build the leadership capability to scale without losing coherence", size: "medium" },
  { icon: Scale, title: "Board-Ready Reporting", description: "Provide boards with objective visibility into executive cohesion", size: "medium" },
  { icon: Award, title: "CPD-Accredited Development", description: "Recognised programs that build lasting leadership capability", size: "small" },
  { icon: Target, title: "Post-Merger Integration", description: "Align newly combined leadership teams around shared governance structures", size: "small" },
  { icon: Building, title: "Organisational Resilience", description: "Strengthen the structural foundations that sustain performance under pressure", size: "large" },
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
            <Shield className="h-4 w-4 text-secondary" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              Organisational Outcomes
            </span>
          </div>
          <h2 className="mb-6 font-serif text-3xl font-semibold text-primary-foreground sm:text-4xl lg:text-5xl">
            <TextReveal delay={0.2}>
              What Changes When Executive Teams Align
            </TextReveal>
          </h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            The measurable impact of structural clarity across governance, 
            decision-making, and leadership capability.
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
          {benefits.map((benefit) => {
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