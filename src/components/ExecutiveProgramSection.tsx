import { Award, ArrowRight, Sparkles, User, Building2, Star, CheckCircle, ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import TiltCard from "./TiltCard";
import MagneticButton from "./MagneticButton";
import TextReveal from "./TextReveal";
import PricingTiers from "./PricingTiers";
import executiveLeadershipImage from "@/assets/executive-leadership-diverse.jpg";

const individualProgram = {
  title: "For Individual Executives",
  subtitle: "Executive Leadership Mastery Program",
  tagline: "Step into the C-Suite with Confidence and Authority",
  description: "This 8–12 week CPD-accredited program is designed to help senior executives and high-potential leaders master the skills they need to lead with impact.",
  audience: "Senior executives, directors, and high-potential leaders preparing for C-suite roles.",
  highlights: [
    "33 comprehensive modules covering leadership essentials",
    "Emotional intelligence and strategic decision-making",
    "Personalized one-on-one coaching (if selected)",
    "Real-world capstone project",
    "Flexible self-paced learning with virtual sessions",
  ],
  bonus: "With further discounts off all training courses!",
  link: "https://bright-leadership-consulting.thinkific.com/courses/new-executive-leadership-mastery-program",
};

const organizationProgram = {
  title: "For Organisations",
  subtitle: "Organisational Leadership Transformation",
  tagline: "Build a Leadership Culture That Drives Results",
  description: "This 3–6 month customisable program is designed to align leadership development with your business goals and create a sustainable leadership pipeline.",
  audience: "Medium to large enterprises looking to develop leadership capabilities across teams or departments.",
  highlights: [
    "Organisational Leadership Audit: Identify strengths, gaps, and opportunities",
    "Custom Training Modules: Tailored to your industry and challenges",
    "Team Coaching: Enhance collaboration and break down silos",
    "Leadership Metrics Dashboard: Track progress and measure ROI",
    "Sustainable growth and leadership pipeline development",
  ],
  bonus: "Customized implementation and ongoing support included!",
  link: "https://calendly.com/bbs-consulting/30min",
};

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
  hidden: { opacity: 0, y: 20 },
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

interface ProgramCardProps {
  program: typeof individualProgram;
  accent: 'primary' | 'secondary';
  icon: typeof User;
  badge: string;
  buttonVariant: 'hero' | 'teal';
  buttonText: string;
}

const ProgramCard = ({ program, accent, icon: Icon, badge, buttonVariant, buttonText }: ProgramCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const accentColor = accent === 'secondary' ? 'secondary' : 'primary';

  return (
    <TiltCard className="h-full" maxTilt={5}>
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-card h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          borderWidth: 2,
          borderColor: isHovered 
            ? `hsl(var(--${accentColor}) / 0.6)` 
            : `hsl(var(--${accentColor}) / 0.3)`,
          boxShadow: isHovered 
            ? `0 25px 50px -12px hsl(var(--${accentColor}) / 0.25)` 
            : '0 10px 30px -10px rgba(0,0,0,0.1)',
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ borderStyle: 'solid' }}
      >
        {/* Animated gradient overlay */}
        <motion.div 
          className={`absolute inset-0 pointer-events-none z-10 bg-gradient-to-br from-${accentColor}/5 via-transparent to-${accentColor}/10`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Header */}
        <div className={`bg-gradient-to-r from-${accentColor}/20 to-${accentColor}/10 p-6 border-b border-${accentColor}/20 relative overflow-hidden`}>
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: isHovered ? '100%' : '-100%' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          
          <div className="flex items-center gap-3 mb-3 relative z-20">
            <motion.div 
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${accentColor}/20`}
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? [0, -5, 5, 0] : 0,
                boxShadow: isHovered 
                  ? `0 10px 25px -5px hsl(var(--${accentColor}) / 0.4)` 
                  : '0 0 0 0 transparent',
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Icon className={`h-6 w-6 text-${accentColor}`} />
            </motion.div>
            <div>
              <motion.span 
                className={`text-xs font-bold uppercase tracking-wider text-${accentColor}`}
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {program.title}
              </motion.span>
              <motion.h3 
                className="font-serif text-xl font-semibold text-foreground"
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                {program.subtitle}
              </motion.h3>
            </div>
          </div>
          <motion.p 
            className={`text-${accentColor} font-medium italic relative z-20`}
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {program.tagline}
          </motion.p>
        </div>
        
        {/* Content */}
        <div className="p-6 flex-grow flex flex-col relative z-20">
          <p className="mb-4 text-muted-foreground leading-relaxed">
            {program.description}
          </p>
          
          <motion.div 
            className="mb-4 p-3 rounded-lg bg-muted/50 border border-border/50"
            animate={{
              backgroundColor: isHovered ? 'hsl(var(--muted) / 0.7)' : 'hsl(var(--muted) / 0.5)',
              scale: isHovered ? 1.02 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-foreground">
              <span className="font-semibold">Who It's For:</span> {program.audience}
            </p>
          </motion.div>
          
          {/* Highlights with staggered animation */}
          <ul className="space-y-3 mb-6 flex-grow">
            {program.highlights.map((highlight, index) => (
              <motion.li 
                key={index} 
                className="flex items-start gap-3"
                animate={{
                  x: isHovered ? 6 : 0,
                  opacity: 1,
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: isHovered ? index * 0.05 : 0,
                  ease: "easeOut"
                }}
              >
                <motion.div
                  animate={{ 
                    rotate: isHovered ? 360 : 0,
                    scale: isHovered ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Star className={`h-4 w-4 text-${accentColor} flex-shrink-0 mt-0.5 fill-${accentColor}`} />
                </motion.div>
                <span className="text-sm text-foreground">{highlight}</span>
              </motion.li>
            ))}
          </ul>
          
          {/* Bonus with pulse animation */}
          <motion.div 
            className={`bg-${accentColor}/10 rounded-xl p-4 mb-6 border border-${accentColor}/20`}
            animate={{
              scale: isHovered ? 1.02 : 1,
              backgroundColor: isHovered 
                ? `hsl(var(--${accentColor}) / 0.15)` 
                : `hsl(var(--${accentColor}) / 0.1)`,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <motion.div
                animate={{ 
                  scale: isHovered ? [1, 1.2, 1] : 1,
                }}
                transition={{ 
                  duration: 0.6, 
                  repeat: isHovered ? Infinity : 0,
                  repeatDelay: 0.5
                }}
              >
                <CheckCircle className={`h-5 w-5 text-${accentColor}`} />
              </motion.div>
              <span className={`font-bold text-${accentColor}`}>
                {accent === 'secondary' ? 'Exclusive Bonus' : 'Included'}
              </span>
            </div>
            <p className="text-sm text-foreground">{program.bonus}</p>
          </motion.div>
          
          <div className="space-y-2">
          <MagneticButton 
            variant={buttonVariant} 
            size="lg" 
            className="w-full group overflow-hidden"
            href={program.link}
            target={program.link.startsWith('http') ? '_blank' : undefined}
            rel={program.link.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            <motion.span 
              className="flex items-center justify-center gap-2"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {buttonText}
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
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </motion.span>
          </MagneticButton>
          {program.link.includes("calendly") && (
            <a
              href="/contact"
              className="flex items-center justify-center gap-1.5 w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Or just ask a question
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          )}
          </div>
        </div>
        
        {/* Badge with hover animation */}
        <motion.div 
          className={`absolute top-4 right-4 bg-${accentColor} text-${accentColor}-foreground rounded-full px-3 py-1 shadow-lg`}
          animate={{
            scale: isHovered ? 1.1 : 1,
            y: isHovered ? -2 : 0,
            boxShadow: isHovered 
              ? `0 10px 25px -5px hsl(var(--${accentColor}) / 0.5)` 
              : '0 4px 6px -1px rgba(0,0,0,0.1)',
          }}
          transition={{ duration: 0.3 }}
        >
          <span className="font-bold text-xs uppercase">{badge}</span>
        </motion.div>

        {/* Animated accent line */}
        <motion.div 
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${accentColor} via-${accent === 'secondary' ? 'primary' : 'secondary'} to-${accentColor}`}
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: isHovered ? 1 : 0,
            originX: 0,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </motion.div>
    </TiltCard>
  );
};

const ExecutiveProgramSection = () => {
  return (
    <section id="executive-program" className="section-padding relative overflow-hidden bg-gradient-to-br from-primary/[0.04] via-background to-secondary/[0.04]">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/4 left-0 w-72 h-72 bg-primary/[0.06] rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-0 w-64 h-64 bg-secondary/[0.06] rounded-full blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="container-narrow relative">
        {/* Hero Image + Header */}
        <div
          className="mb-10 animate-fade-in"
        >
          {/* Featured Image */}
          <TiltCard className="mb-8" maxTilt={3}>
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src={executiveLeadershipImage} 
                alt="Diverse executive leadership team in boardroom discussion" 
                className="w-full h-64 sm:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-background/90 backdrop-blur-sm px-4 py-2 border border-primary/20">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-primary uppercase tracking-wider">
                    Flagship Programs
                  </span>
                </div>
              </div>
            </div>
          </TiltCard>
          
          {/* Text Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
              <TextReveal>Executive Leadership Mastery</TextReveal>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Choose the path that fits your journey—whether you're an individual leader ready to excel or an organization building a culture of leadership excellence.
            </p>
          </div>
        </div>

        {/* Two Column Programs */}
        <div
          className="grid lg:grid-cols-2 gap-6 animate-fade-in"
          style={{ animationDelay: "200ms", animationFillMode: "both" }}
        >
          {/* Individual Program */}
          <div>
            <ProgramCard
              program={individualProgram}
              accent="secondary"
              icon={User}
              badge="Most Popular"
              buttonVariant="hero"
              buttonText="Enroll Now"
            />
          </div>
          
          {/* Organization Program */}
          <div>
            <ProgramCard
              program={organizationProgram}
              accent="primary"
              icon={Building2}
              badge="Enterprise"
              buttonVariant="teal"
              buttonText="Request Consultation"
            />
          </div>
        </div>

        {/* Pricing Tiers */}
        <PricingTiers />

        {/* CPD Accreditation Note */}
        <div
          className="mt-8 space-y-4 animate-fade-in"
          style={{ animationDelay: "300ms", animationFillMode: "both" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/5 via-card to-secondary/5 border border-border/50 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold text-foreground text-sm">CPD Accredited Programs</p>
              <p className="text-xs text-muted-foreground">Internationally recognized certification</p>
            </div>
          </div>

          {/* Warm visitor funnel link */}
          <div className="text-center">
            <a
              href="/masterclass"
              className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors group"
            >
              <Sparkles className="h-4 w-4" />
              <span>Watch Our Free Masterclass: The 5 Leadership Shifts That Separate Executives From Managers</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Assessment Links */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 rounded-xl bg-card border border-border/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-secondary/20 to-primary/20">
              <ClipboardCheck className="h-5 w-5 text-secondary" />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold text-foreground text-sm">Leadership Assessments</p>
              <p className="text-xs text-muted-foreground">Measure your growth before and after the programme</p>
            </div>
            <div className="flex gap-2 ml-auto">
              <Link
                to="/pre-assessment"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors border border-primary/20"
              >
                Pre-Course
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/post-assessment"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary/10 text-secondary text-sm font-medium hover:bg-secondary/20 transition-colors border border-secondary/20"
              >
                Post-Course
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExecutiveProgramSection;