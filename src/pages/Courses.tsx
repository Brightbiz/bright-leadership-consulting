import { Zap, TrendingUp, Users, Lightbulb, Briefcase, ArrowRight, Award, Star, Target, Sparkles, Crown, GraduationCap, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

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
  link: "https://bright-leadership-consulting.thinkific.com/courses/executive-leadership-mastery-program",
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
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <PageHero
        variant="courses"
        badge="CPD Accredited Programs"
        badgeIcon={Award}
        title="Transform Your"
        titleHighlight="Leadership Journey"
        description="Explore our comprehensive range of CPD-accredited courses designed to develop exceptional leaders and accelerate professional growth."
      />

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
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-background to-secondary/[0.08]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container-narrow relative">
          <AnimatedSection>
            <div className="relative rounded-3xl bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border border-border/50 p-10 md:p-16 shadow-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-secondary/15 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary/15 rounded-full blur-2xl" />
              
              {/* Content */}
              <div className="relative text-center max-w-3xl mx-auto">
                {/* Icon badge */}
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
                  Book a free consultation and we'll help you find the perfect program for your leadership journey. Our experts will assess your goals and recommend the ideal path forward.
                </p>
                
                {/* Benefits pills */}
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
                    className="group shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
                    asChild
                  >
                    <Link to="/#contact">
                      Schedule Free Consultation
                      <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="xl" 
                    className="group hover:bg-card/80 transition-all duration-300"
                    asChild
                  >
                    <Link to="/">
                      <span>Back to Home</span>
                    </Link>
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
