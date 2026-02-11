import { Award, ArrowRight, Crown, BookOpen, Zap, Users, GraduationCap, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import TiltCard from "./TiltCard";
import TextReveal from "./TextReveal";

const featuredCourses = [
  {
    icon: Crown,
    title: "Executive Leadership Mastery",
    description: "The ultimate 7-in-1 bundle with 33 modules, 1:1 coaching, and CPD accreditation.",
    featured: true,
    accent: "secondary" as const,
    stats: "33 Modules",
  },
  {
    icon: BookOpen,
    title: "Future of Work Strategy",
    description: "Master leadership fundamentals, communication, and strategic thinking for the modern workplace.",
    featured: false,
    accent: "primary" as const,
    stats: "12 Modules",
  },
  {
    icon: Zap,
    title: "Peak Performance Accelerator",
    description: "Develop time management and productivity strategies for maximum impact.",
    featured: false,
    accent: "primary" as const,
    stats: "8 Modules",
  },
  {
    icon: Users,
    title: "Enhanced Employability Skills",
    description: "Build emotional intelligence, adaptability, and in-demand soft skills.",
    featured: false,
    accent: "primary" as const,
    stats: "10 Modules",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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

interface CourseCardProps {
  course: typeof featuredCourses[0];
  index: number;
}

const CourseCard = ({ course, index }: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isFeatured = course.featured;

  return (
    <motion.div variants={itemVariants} className={isFeatured ? 'sm:col-span-2 lg:col-span-1' : ''}>
      <TiltCard className="h-full" maxTilt={8}>
        <motion.div 
          className={`group relative h-full overflow-hidden rounded-2xl flex flex-col ${
            isFeatured 
              ? 'bg-gradient-to-br from-secondary/15 via-secondary/5 to-primary/10' 
              : 'bg-card'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{
            borderWidth: isFeatured ? 2 : 1,
            borderColor: isHovered 
              ? isFeatured ? 'hsl(var(--secondary) / 0.7)' : 'hsl(var(--primary) / 0.5)'
              : isFeatured ? 'hsl(var(--secondary) / 0.4)' : 'hsl(var(--border) / 0.5)',
            boxShadow: isHovered 
              ? isFeatured 
                ? '0 25px 50px -12px hsl(var(--secondary) / 0.35)' 
                : '0 20px 40px -12px hsl(var(--primary) / 0.2)'
              : isFeatured 
                ? '0 10px 30px -10px hsl(var(--secondary) / 0.2)' 
                : '0 4px 12px -4px rgba(0,0,0,0.1)',
            y: isHovered ? -6 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ borderStyle: 'solid' }}
        >
          {/* Decorative corner accent for featured */}
          {isFeatured && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-secondary/20 to-transparent rounded-bl-full" />
          )}

          {/* Animated gradient overlay */}
          <motion.div 
            className={`absolute inset-0 pointer-events-none ${
              isFeatured 
                ? 'bg-gradient-to-br from-secondary/10 via-transparent to-primary/10' 
                : 'bg-gradient-to-br from-primary/5 via-transparent to-primary/10'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: isHovered ? '100%' : '-100%' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Content wrapper */}
          <div className="relative z-10 p-6 flex flex-col h-full">
            {/* Header row with icon and badge */}
            <div className="flex items-start justify-between mb-4">
              <motion.div 
                className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${
                  isFeatured 
                    ? 'bg-gradient-to-br from-secondary to-secondary/70 shadow-lg shadow-secondary/30' 
                    : 'bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20'
                }`}
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? [0, -5, 5, 0] : 0,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <course.icon className={`h-7 w-7 ${isFeatured ? 'text-secondary-foreground' : 'text-primary'}`} strokeWidth={1.5} />
              </motion.div>
              
              {isFeatured ? (
                <motion.div 
                  animate={{
                    scale: isHovered ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase shadow-lg">
                    <Star className="h-3 w-3 fill-current" />
                    Flagship
                  </span>
                </motion.div>
              ) : (
                <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full border border-border/50">
                  {course.stats}
                </span>
              )}
            </div>
            
            {/* Title */}
            <motion.h3 
              className={`mb-3 font-serif text-xl font-semibold ${isFeatured ? 'text-foreground' : 'text-foreground'}`}
              animate={{
                color: isHovered 
                  ? isFeatured ? 'hsl(var(--secondary))' : 'hsl(var(--primary))'
                  : 'hsl(var(--foreground))',
              }}
              transition={{ duration: 0.3 }}
            >
              {course.title}
            </motion.h3>
            
            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed flex-grow mb-5">
              {course.description}
            </p>
            
            {/* Featured stats row */}
            {isFeatured && (
              <div className="flex items-center gap-4 mb-5 py-3 px-4 rounded-xl bg-background/50 border border-secondary/20">
                <div className="text-center">
                  <div className="text-lg font-bold text-secondary">33</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Modules</div>
                </div>
                <div className="w-px h-8 bg-border/50" />
                <div className="text-center">
                  <div className="text-lg font-bold text-secondary">1:1</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Coaching</div>
                </div>
                <div className="w-px h-8 bg-border/50" />
                <div className="text-center">
                  <div className="text-lg font-bold text-secondary">CPD</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Certified</div>
                </div>
              </div>
            )}
            
            {/* CTA Button */}
            <motion.div
              animate={{
                y: isHovered ? -2 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <Link 
                to="/courses"
                className={`inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                  isFeatured 
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md hover:shadow-lg' 
                    : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'
                }`}
              >
                {isFeatured ? 'Explore Flagship Program' : 'Learn More'}
                <motion.div
                  animate={{ x: isHovered ? [0, 4, 0] : 0 }}
                  transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
          
          {/* Animated accent line */}
          <motion.div 
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
              isFeatured 
                ? 'from-secondary via-primary to-secondary' 
                : 'from-primary via-secondary to-primary'
            }`}
            initial={{ scaleX: 0 }}
            animate={{ 
              scaleX: isHovered ? 1 : 0,
              originX: 0,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>
      </TiltCard>
    </motion.div>
  );
};

const CoursesSection = () => {
  return (
    <section id="courses" className="section-padding relative overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] via-primary/[0.04] to-background" />
      
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/[0.08] rounded-full blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-72 h-72 bg-secondary/[0.08] rounded-full blur-3xl"
        animate={{
          x: [0, -25, 0],
          y: [0, 25, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container-narrow relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/80 dark:bg-card/80 backdrop-blur-sm px-6 py-3 shadow-lg shadow-primary/5 border border-border/50">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-secondary/80">
              <Award className="h-4 w-4 text-secondary-foreground" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-foreground">
              CPD Accredited Programs
            </span>
          </div>
          
          <h2 className="mb-6 font-serif text-4xl font-semibold text-foreground sm:text-5xl lg:text-6xl leading-tight">
            <TextReveal>Transform Your Leadership</TextReveal>
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            From our flagship Executive Mastery Program to specialized skill courses, 
            find the perfect path for your growth journey.
          </p>
        </motion.div>

        {/* Courses Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12"
        >
          {featuredCourses.map((course, index) => (
            <CourseCard key={course.title} course={course} index={index} />
          ))}
        </motion.div>

        {/* View All Courses CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <TiltCard maxTilt={3}>
            <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-card via-card to-card border border-border/50 shadow-xl">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <GraduationCap className="h-7 w-7 text-primary-foreground" />
                </motion.div>
                <div className="text-left">
                  <p className="font-serif text-lg font-semibold text-foreground">Ready to explore all courses?</p>
                  <p className="text-sm text-muted-foreground">6 individual courses + discounted bundles available</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button variant="default" size="lg" className="group shadow-lg" asChild>
                  <Link to="/courses">
                    <Sparkles className="h-4 w-4 mr-2" />
                    View All Courses
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="group" asChild>
                  <Link to="/brochures">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Download Brochures
                  </Link>
                </Button>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
};

export default CoursesSection;