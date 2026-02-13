import { useState } from "react";
import { Zap, TrendingUp, Users, Lightbulb, Briefcase, ArrowRight, Star, Sparkles, Crown, GraduationCap, Package, Target, Play, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CoursesHero from "@/components/heroes/CoursesHero";
import CourseOverviewLeadCapture from "@/components/CourseOverviewLeadCapture";

const flagshipProgram = {
  icon: Crown,
  title: "Executive Leadership Mastery Program",
  subtitle: "The Ultimate 7-in-1 Leadership Bundle",
  description:
    "Step into the C-Suite with Confidence and Authority. This 8–12 week CPD-accredited program is designed to help senior executives and high-potential leaders master the skills they need to lead with impact.",
  highlights: [
    "33 comprehensive modules covering leadership essentials",
    "Emotional intelligence and strategic decision-making",
    "Personalised one-on-one coaching (if selected)",
    "Real-world capstone project",
    "Flexible self-paced learning with virtual sessions",
    "CPD Accredited certification",
    "50% discount on individual courses as a bonus",
  ],
  link: "https://bright-leadership-consulting.thinkific.com/courses/copy-of-executive-leadership-mastery-program",
};

const individualCourses = [
  {
    icon: Lightbulb,
    title: "Transformational Leadership Skills",
    subtitle: "Lead with Purpose, Propel with Passion",
    description:
      "Go beyond the obvious with strategies that speak to the human soul. Discover how to encourage, inspire, and motivate your team to create courageously.",
    features: ["Change Management", "Team Inspiration", "Vision Building"],
    link: "https://bright-leadership-consulting.thinkific.com/courses/transformational-leadership",
  },
  {
    icon: Zap,
    title: "Peak Performance Accelerator",
    subtitle: "Master Time, Multiply Impact",
    description:
      "Develop time management strategies that unlock hidden hours. Learn to prioritize with precision and achieve results that resonate.",
    features: ["Time Management", "Productivity Systems", "Focus Strategies"],
    link: "https://bright-leadership-consulting.thinkific.com/courses/achieving-peak-performance",
  },
  {
    icon: TrendingUp,
    title: "Building Professional & Personal Value",
    subtitle: "Chart Your Course to Career Advancement",
    description:
      "Discover the secrets of outstanding professionals. Improve work relationships, increase productivity, and optimize your career opportunities.",
    features: ["Career Growth", "Professional Development", "Strategic Networking"],
    link: "https://bright-leadership-consulting.thinkific.com/courses/building-professional-and-personal-value",
  },
  {
    icon: Briefcase,
    title: "Future of Work Strategy",
    subtitle: "Innovate, Adapt, Thrive",
    description:
      "Navigate Remote Work, AI Integration, and International Cooperation. Develop strategic agility to thrive in the dynamic world of work.",
    features: ["Remote Leadership", "AI Integration", "Global Collaboration"],
    link: "https://bright-leadership-consulting.thinkific.com/courses/the-future-of-work",
  },
  {
    icon: Users,
    title: "Enhanced Employability Skills",
    subtitle: "Stand Out, Shine Bright",
    description:
      "Master the soft skills that are the currency of success. Develop emotional intelligence, adaptability, and effective communication.",
    features: ["Emotional Intelligence", "Adaptability", "Soft Skills Mastery"],
    link: "https://bright-leadership-consulting.thinkific.com/courses/employability-skills-for-employees",
  },
];

const bundles = [
  {
    title: "Leadership + Transformational Bundle",
    courses: ["Advanced Leadership Development", "Transformational Leadership"],
    discount: "15% OFF",
    link: "https://bright-leadership-consulting.thinkific.com/bundles/complete-leadership-bundle",
  },
  {
    title: "Leadership Productivity Bundle",
    courses: ["Leadership", "Transformational", "Peak Performance Accelerator"],
    discount: "15% OFF",
    link: "https://bright-leadership-consulting.thinkific.com/bundles/effective-leadership-productivity-accelerator-training-bundle",
  },
  {
    title: "Effective Management Bundle",
    courses: ["Leadership", "Transformational", "Peak Performance", "Future of Work"],
    discount: "15% OFF",
    link: "https://bright-leadership-consulting.thinkific.com/bundles/effective-management-training-bundle",
  },
  {
    title: "Complete Training Bundle",
    courses: ["Advanced Leadership", "Peak Performance", "Future of Work", "Employability Skills"],
    discount: "15% OFF",
    popular: true,
    link: "https://bright-leadership-consulting.thinkific.com/bundles/complete-training-bundle-for-transformational-leaders",
  },
  {
    title: "Ultimate Leadership Development Program",
    courses: ["All 7 Premium Courses in One Bundle"],
    discount: "BEST VALUE",
    link: "https://bright-leadership-consulting.thinkific.com/bundles/the-ultimate-leadership-development-program-for-leaders-managers",
  },
];

const Courses = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <CoursesHero />

      {/* Watch Preview Video Section */}
      <section className="section-padding relative overflow-hidden bg-muted/20">
        <div className="container-narrow relative">
          <AnimatedSection className="mx-auto mb-10 max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/15 to-secondary/15 px-5 py-2.5 border border-primary/20">
              <Play className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Course Preview</span>
            </div>
            <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
              Your Leadership <span className="text-primary">Blueprint</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              See how 33 modules, 80+ hours of content, and 66 CPD points come together to transform your leadership career.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="relative mx-auto max-w-4xl">
              {/* Decorative glowing orbs */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-primary/20 rounded-full blur-3xl" />
              
              {/* Animated gradient border wrapper */}
              <div className="relative rounded-3xl p-[3px] bg-gradient-to-br from-secondary via-primary/50 to-secondary/80 shadow-2xl shadow-primary/20 hover:shadow-secondary/30 transition-shadow duration-700">
                {/* Inner glow ring */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-secondary/40 via-transparent to-primary/40 blur-lg opacity-60" />
                
                <div 
                  className="relative rounded-[calc(1.5rem-3px)] overflow-hidden cursor-pointer group bg-background"
                  onClick={() => setIsVideoOpen(true)}
                >
                  {/* YouTube Thumbnail */}
                  <img
                    src="https://img.youtube.com/vi/uEIw8uGi6Qo/maxresdefault.jpg"
                    alt="Course preview video thumbnail"
                    className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent flex items-center justify-center transition-all duration-500 group-hover:from-primary/40 group-hover:via-primary/10">
                    {/* Pulsing ring */}
                    <div className="absolute h-24 w-24 rounded-full bg-secondary/20 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                    <div className="relative h-18 w-18 rounded-full bg-secondary flex items-center justify-center shadow-xl shadow-secondary/50 transition-transform duration-300 group-hover:scale-110" style={{ height: '4.5rem', width: '4.5rem' }}>
                      <Play className="h-8 w-8 text-secondary-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>
                  {/* Bottom info bar */}
                  <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white/90 text-sm font-medium">▶ Watch the Course Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Video Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl w-[90vw] p-0 bg-black border-none overflow-hidden">
          <button
            onClick={() => setIsVideoOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <iframe
            src="https://www.youtube.com/embed/uEIw8uGi6Qo?autoplay=1&rel=0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full aspect-video"
            title="Course Preview - Bright Leadership Consulting"
          />
        </DialogContent>
      </Dialog>

      {/* Flagship Program */}
      <section className="section-padding relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container-narrow relative">
          <AnimatedSection>
            <div className="relative rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-primary/90 p-8 md:p-12 overflow-hidden shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
              
              <div className="relative grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2">
                    <Crown className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-semibold text-secondary">Flagship Program</span>
                  </div>
                  
                  <h2 className="mb-4 font-serif text-3xl font-semibold text-primary-foreground sm:text-4xl">
                    {flagshipProgram.title}
                  </h2>
                  <p className="mb-2 text-lg font-medium text-secondary">
                    {flagshipProgram.subtitle}
                  </p>
                  <p className="mb-8 text-primary-foreground/85 leading-relaxed">
                    {flagshipProgram.description}
                  </p>
                  
                  <Button 
                    variant="hero" 
                    size="xl" 
                    className="group shadow-xl shadow-secondary/30"
                    asChild
                  >
                    <a href={flagshipProgram.link} target="_blank" rel="noopener noreferrer">
                      Enroll Now
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {flagshipProgram.highlights.map((highlight, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                          <Star className="h-3 w-3 text-secondary" />
                        </div>
                      </div>
                      <span className="text-primary-foreground/90 text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Course Overview Lead Capture Section */}
      <CourseOverviewLeadCapture />

      {/* Individual Courses */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute top-20 -right-32 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container-narrow relative">
          <AnimatedSection className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/15 to-secondary/15 px-5 py-2.5 border border-primary/20">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Self-Paced Learning
              </span>
            </div>
            <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
              Individual <span className="text-primary">Training Courses</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose from our selection of specialized courses to develop specific leadership competencies at your own pace.
            </p>
          </AnimatedSection>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {individualCourses.map((course, index) => (
              <AnimatedSection key={course.title} delay={index * 100}>
                <div className="group relative h-full overflow-hidden rounded-2xl bg-card border border-border/50 p-6 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 flex flex-col">
                  {/* Icon */}
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 transition-transform duration-300 group-hover:scale-110">
                    <course.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="mb-1 font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="mb-3 text-sm font-medium text-secondary">
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
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Course Bundles */}
      <section className="section-padding relative overflow-hidden bg-muted/30">
        <div className="container-narrow relative">
          <AnimatedSection className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary/15 to-primary/15 px-5 py-2.5 border border-secondary/20">
              <Package className="h-4 w-4 text-secondary" />
              <span className="text-sm font-semibold text-secondary">
                Save with Bundles
              </span>
            </div>
            <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
              Discounted <span className="text-secondary">Course Bundles</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Maximize your learning and savings with our specially curated course bundles.
            </p>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bundles.map((bundle, index) => (
              <AnimatedSection key={bundle.title} delay={index * 100}>
                <div className={`group relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 flex flex-col ${
                  bundle.popular 
                    ? 'bg-gradient-to-br from-secondary/10 to-primary/10 border-2 border-secondary/30 shadow-lg' 
                    : 'bg-card border border-border/50 hover:border-secondary/30 hover:shadow-xl'
                }`}>
                  {bundle.popular && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
                        <Sparkles className="h-3 w-3" />
                        POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-bold">
                      {bundle.discount}
                    </span>
                  </div>
                  
                  <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">
                    {bundle.title}
                  </h3>
                  
                  <ul className="mb-6 space-y-2 flex-grow">
                    {bundle.courses.map((course, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                        {course}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={bundle.popular ? "default" : "outline"}
                    size="sm"
                    className="w-full group/btn mt-auto"
                    asChild
                  >
                    <a href={bundle.link} target="_blank" rel="noopener noreferrer">
                      Get Bundle
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </a>
                  </Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-background to-secondary/[0.08]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container-narrow relative">
          <AnimatedSection>
            <div className="relative rounded-3xl bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border/50 p-10 md:p-16 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-secondary/15 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary/15 rounded-full blur-2xl" />
              
              <div className="relative text-center max-w-3xl mx-auto">
                <div className="mb-8 inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 border border-primary/20 shadow-lg shadow-primary/10">
                  <Target className="h-10 w-10 text-primary" />
                </div>
                
                <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl leading-tight">
                  Not Sure Which Path is{" "}
                  <span className="relative">
                    <span className="text-primary">Right for You?</span>
                    <span className="absolute -bottom-2 left-0 right-0 h-3 bg-secondary/20 -skew-x-6 -z-10" />
                  </span>
                </h2>
                
                <p className="mb-10 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Book a free consultation and we'll help you find the perfect program for your leadership journey.
                </p>
                
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                  {['Free 30-min Call', 'Personalized Advice', 'No Obligation'].map((benefit) => (
                    <span 
                      key={benefit}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-sm font-medium text-foreground"
                    >
                      <Star className="h-3.5 w-3.5 text-secondary fill-secondary" />
                      {benefit}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Button 
                    variant="default" 
                    size="xl" 
                    className="group shadow-xl shadow-primary/20"
                    asChild
                  >
                    <Link to="/#contact">
                      Schedule Free Consultation
                      <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="xl" asChild>
                    <Link to="/">Back to Home</Link>
                  </Button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;
