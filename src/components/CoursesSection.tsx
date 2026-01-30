import { Award, ArrowRight, Crown, BookOpen, Zap, Users, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";

const featuredCourses = [
  {
    icon: Crown,
    title: "Executive Leadership Mastery",
    description: "The ultimate 7-in-1 bundle with 33 modules, 1:1 coaching, and CPD accreditation.",
    featured: true,
  },
  {
    icon: BookOpen,
    title: "Advanced Leadership Development",
    description: "Master leadership fundamentals, communication, and strategic thinking.",
    featured: false,
  },
  {
    icon: Zap,
    title: "Peak Performance Accelerator",
    description: "Develop time management and productivity strategies for maximum impact.",
    featured: false,
  },
  {
    icon: Users,
    title: "Enhanced Employability Skills",
    description: "Build emotional intelligence, adaptability, and in-demand soft skills.",
    featured: false,
  },
];

const CoursesSection = () => {
  return (
    <section id="courses" className="section-padding relative overflow-hidden bg-gradient-to-b from-primary/[0.10] via-primary/[0.06] to-primary/[0.02]">
      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
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
            <AnimatedSection key={course.title} delay={index * 100}>
              <div className={`group relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 flex flex-col ${
                course.featured 
                  ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 shadow-lg hover:shadow-xl' 
                  : 'bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10'
              }`}>
                {course.featured && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold uppercase">
                      Flagship
                    </span>
                  </div>
                )}
                
                {/* Icon */}
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                  course.featured 
                    ? 'bg-gradient-to-br from-secondary/30 to-secondary/10' 
                    : 'bg-gradient-to-br from-primary/15 to-primary/5'
                }`}>
                  <course.icon className={`h-6 w-6 ${course.featured ? 'text-secondary' : 'text-primary'}`} strokeWidth={1.5} />
                </div>
                
                {/* Content */}
                <h3 className="mb-2 font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                  {course.description}
                </p>
                
                {/* Hover accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${
                  course.featured 
                    ? 'from-secondary via-primary to-secondary' 
                    : 'from-primary via-secondary to-primary'
                } scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </div>
            </AnimatedSection>
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
