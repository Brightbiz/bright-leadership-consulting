import { Award, ArrowRight, Crown, BookOpen, Zap, Users, GraduationCap, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import TiltCard from "./TiltCard";

const featuredCourses = [
  {
    icon: Crown,
    title: "Executive Leadership Mastery",
    description: "The ultimate 7-in-1 bundle with 33 modules, 1:1 coaching, and CPD accreditation.",
    featured: true,
    accent: "secondary" as const,
  },
  {
    icon: BookOpen,
    title: "Advanced Leadership Development",
    description: "Master leadership fundamentals, communication, and strategic thinking.",
    featured: false,
    accent: "primary" as const,
  },
  {
    icon: Zap,
    title: "Peak Performance Accelerator",
    description: "Develop time management and productivity strategies for maximum impact.",
    featured: false,
    accent: "primary" as const,
  },
  {
    icon: Users,
    title: "Enhanced Employability Skills",
    description: "Build emotional intelligence, adaptability, and in-demand soft skills.",
    featured: false,
    accent: "primary" as const,
  },
];

interface CourseCardProps {
  course: typeof featuredCourses[0];
  index: number;
}

const CourseCard = ({ course, index }: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const accentColor = course.accent;

  return (
    <AnimatedSection delay={index * 100}>
      <TiltCard className="h-full" maxTilt={8}>
        <motion.div 
          className={`group relative h-full overflow-hidden rounded-2xl p-6 flex flex-col ${
            course.featured 
              ? 'bg-gradient-to-br from-secondary/10 to-primary/10' 
              : 'bg-card'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{
            borderWidth: course.featured ? 2 : 1,
            borderColor: isHovered 
              ? `hsl(var(--${accentColor}) / 0.6)` 
              : course.featured 
                ? `hsl(var(--${accentColor}) / 0.3)` 
                : 'hsl(var(--border) / 0.5)',
            boxShadow: isHovered 
              ? `0 20px 40px -12px hsl(var(--${accentColor}) / 0.25)` 
              : course.featured 
                ? '0 10px 30px -10px rgba(0,0,0,0.15)' 
                : '0 0 0 0 transparent',
            y: isHovered ? -4 : 0,
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

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: isHovered ? '100%' : '-100%' }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />

          {course.featured && (
            <motion.div 
              className="absolute top-3 right-3 z-30"
              animate={{
                scale: isHovered ? 1.1 : 1,
                y: isHovered ? -2 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold uppercase shadow-lg">
                <Star className="h-2.5 w-2.5 fill-current" />
                Flagship
              </span>
            </motion.div>
          )}
          
          {/* Icon with animation */}
          <motion.div 
            className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl relative z-30 ${
              course.featured 
                ? 'bg-gradient-to-br from-secondary/30 to-secondary/10' 
                : 'bg-gradient-to-br from-primary/15 to-primary/5'
            }`}
            animate={{
              scale: isHovered ? 1.15 : 1,
              rotate: isHovered ? [0, -5, 5, 0] : 0,
              boxShadow: isHovered 
                ? `0 12px 25px -5px hsl(var(--${accentColor}) / 0.4)` 
                : '0 0 0 0 transparent',
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.6 }}
            >
              <course.icon className={`h-6 w-6 ${course.featured ? 'text-secondary' : 'text-primary'}`} strokeWidth={1.5} />
            </motion.div>
          </motion.div>
          
          {/* Content */}
          <motion.h3 
            className="mb-2 font-serif text-lg font-semibold text-foreground relative z-30"
            animate={{
              color: isHovered 
                ? `hsl(var(--${accentColor}))` 
                : 'hsl(var(--foreground))',
              x: isHovered ? 4 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {course.title}
          </motion.h3>
          <motion.p 
            className="text-sm text-muted-foreground leading-relaxed flex-grow relative z-30"
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {course.description}
          </motion.p>
          
          {/* Learn more link with animation */}
          <motion.div 
            className="mt-4 relative z-30"
            animate={{
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10,
            }}
            transition={{ duration: 0.3 }}
          >
            <span className={`inline-flex items-center gap-1 text-sm font-medium text-${accentColor}`}>
              Learn more
              <motion.div
                animate={{ x: isHovered ? [0, 4, 0] : 0 }}
                transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }}
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </motion.div>
            </span>
          </motion.div>
          
          {/* Animated accent line */}
          <motion.div 
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
              course.featured 
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
    </AnimatedSection>
  );
};

const CoursesSection = () => {
  return (
    <section id="courses" className="section-padding relative overflow-hidden bg-gradient-to-b from-primary/[0.07] via-primary/[0.04] to-background">
      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      
      <div className="container-narrow relative">
        <AnimatedSection className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary/15 to-primary/15 px-5 py-2.5 border border-secondary/20">
            <Award className="h-4 w-4 text-secondary" />
            <span className="text-sm font-semibold text-secondary">
              CPD Accredited Programs
            </span>
          </div>
          <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Transform Your <span className="text-primary">Leadership</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore our comprehensive range of CPD-accredited courses designed to develop exceptional leaders. From our flagship Executive Mastery Program to specialized skill courses, find the perfect fit for your growth journey.
          </p>
        </AnimatedSection>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {featuredCourses.map((course, index) => (
            <CourseCard key={course.title} course={course} index={index} />
          ))}
        </div>

        {/* View All Courses CTA */}
        <AnimatedSection delay={400} className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Ready to explore all courses?</p>
                <p className="text-sm text-muted-foreground">6 individual courses + discounted bundles available</p>
              </div>
            </div>
            <Button variant="default" size="lg" className="group" asChild>
              <Link to="/courses">
                View All Courses
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CoursesSection;