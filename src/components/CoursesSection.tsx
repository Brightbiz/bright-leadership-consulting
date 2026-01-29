import { BookOpen, Zap, TrendingUp, Users, Lightbulb, Briefcase, ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";

const courses = [
  {
    icon: Lightbulb,
    title: "Transformational Leadership",
    subtitle: "Ignite Change, Inspire Growth",
    description:
      "Go beyond managing to initiating meaningful change. Learn strategies that speak to the human soul and inspire your team to create courageously.",
    features: ["Change Management", "Team Inspiration", "Visionary Leadership"],
    link: "https://bright-leadership-consulting.thinkific.com/courses/transformational-leadership",
    accent: "secondary" as const,
  },
  {
    icon: Zap,
    title: "Peak Performance Accelerator",
    subtitle: "Master Time, Multiply Impact",
    description:
      "Develop time management strategies that unlock hidden hours. Learn to prioritize with precision and achieve results that resonate.",
    features: ["Time Management", "Productivity Systems", "Focus Strategies"],
    link: "https://bright-leadership-consulting.thinkific.com/courses/achieving-peak-performance",
    accent: "primary" as const,
  },
  {
    icon: TrendingUp,
    title: "Building Professional Value",
    subtitle: "Chart Your Course to Career Advancement",
    description:
      "Gain essential skills for both personal and professional growth. Improve work relationships, increase productivity, and optimize career opportunities.",
    features: ["Career Development", "Strategic Thinking", "Professional Growth"],
    link: "https://bright-leadership-consulting.thinkific.com/courses/building-professional-and-personal-value",
    accent: "secondary" as const,
  },
  {
    icon: Briefcase,
    title: "Future of Work Strategy",
    subtitle: "Innovate, Adapt, Thrive",
    description:
      "Navigate Remote Work, AI Integration, and International Cooperation. Develop strategic agility to thrive in the dynamic world of work.",
    features: ["Remote Leadership", "AI Integration", "Global Collaboration"],
    link: "https://bright-leadership-consulting.thinkific.com/courses/the-future-of-work",
    accent: "primary" as const,
  },
  {
    icon: Users,
    title: "Enhanced Employability Skills",
    subtitle: "Stand Out, Shine Bright",
    description:
      "Master the soft skills that are the currency of success. Develop emotional intelligence, adaptability, and effective communication.",
    features: ["Emotional Intelligence", "Adaptability", "Soft Skills"],
    link: "https://bright-leadership-consulting.thinkific.com/courses/employability-skills-for-employees",
    accent: "secondary" as const,
  },
];

const CoursesSection = () => {
  return (
    <section id="courses" className="section-padding relative overflow-hidden bg-muted/20">
      {/* Decorative elements */}
      <div className="absolute top-20 -right-32 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container-narrow relative">
        <AnimatedSection className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary/15 to-primary/15 px-5 py-2.5 border border-secondary/20">
            <Award className="h-4 w-4 text-secondary" />
            <span className="text-sm font-semibold text-secondary">
              CPD Accredited Courses
            </span>
          </div>
          <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Individual <span className="text-primary">Training Courses</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore our comprehensive range of self-paced courses designed to develop specific leadership competencies and accelerate your professional growth.
          </p>
        </AnimatedSection>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <AnimatedSection key={course.title} delay={index * 100}>
              <div className="group relative h-full overflow-hidden rounded-2xl bg-card border border-border/50 p-6 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 flex flex-col">
                {/* Icon */}
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${course.accent === 'secondary' ? 'from-secondary/20 to-secondary/5' : 'from-primary/15 to-primary/5'} transition-transform duration-300 group-hover:scale-110`}>
                  <course.icon className={`h-6 w-6 ${course.accent === 'secondary' ? 'text-secondary' : 'text-primary'}`} strokeWidth={1.5} />
                </div>
                
                {/* Content */}
                <h3 className="mb-1 font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className={`mb-3 text-sm font-medium ${course.accent === 'secondary' ? 'text-secondary' : 'text-primary'}`}>
                  {course.subtitle}
                </p>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed flex-grow">
                  {course.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {course.features.map((feature) => (
                    <span 
                      key={feature} 
                      className="inline-block px-2.5 py-1 rounded-md bg-muted/50 text-xs font-medium text-muted-foreground border border-border/50"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full group/btn mt-auto"
                  asChild
                >
                  <a href={course.link} target="_blank" rel="noopener noreferrer">
                    View Course
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </a>
                </Button>
                
                {/* Hover accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${course.accent === 'secondary' ? 'from-secondary via-primary to-secondary' : 'from-primary via-secondary to-primary'} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Bundle CTA */}
        <AnimatedSection delay={600} className="mt-16">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/90 p-8 lg:p-12 text-center">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }} />
            
            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2">
                <span className="text-sm font-bold text-white uppercase tracking-wider">
                  Best Value
                </span>
              </div>
              
              <h3 className="mb-4 font-serif text-2xl font-semibold text-primary-foreground lg:text-3xl">
                Get All 6 Courses in Our Executive Leadership Mastery Program
              </h3>
              <p className="mb-6 text-primary-foreground/80 max-w-2xl mx-auto">
                Save 25% when you bundle all courses together. Includes 33 comprehensive modules, 
                personalized coaching options, and CPD accreditation.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="hero" size="lg" className="group/btn">
                  View Complete Program
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CoursesSection;
