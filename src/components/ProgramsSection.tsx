import { Check, ArrowRight, Crown, Building, Zap, Users, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import corporateRetreat from "@/assets/corporate-retreat.jpg";

const programs = [
  {
    badge: "For Executives",
    title: "Executive Leadership Mastery Program",
    subtitle: "Step into the C-Suite with Confidence",
    duration: "8-12 Weeks",
    description:
      "This CPD-accredited program is designed to help senior executives and high-potential leaders master the skills they need to lead with impact.",
    features: [
      { text: "Build trust and collaboration within teams", icon: Users },
      { text: "Enhance your executive presence and influence", icon: Crown },
      { text: "Make confident, high-pressure decisions", icon: Target },
      { text: "33 comprehensive modules", icon: null },
      { text: "Personalized one-on-one coaching", icon: null },
      { text: "Real-world capstone project", icon: null },
    ],
    cta: "Start Your Journey",
    highlighted: true,
    icon: Crown,
    accentColor: "primary",
    stats: [
      { value: "33", label: "Modules" },
      { value: "8-12", label: "Weeks" },
      { value: "1:1", label: "Coaching" },
    ],
  },
  {
    badge: "For Organizations",
    title: "Organizational Leadership Transformation",
    subtitle: "Build a Leadership Culture That Drives Results",
    duration: "3-6 Months",
    description:
      "A customizable program designed to align leadership development with your business goals and create a sustainable leadership pipeline.",
    features: [
      { text: "Organisational Leadership Audit", icon: Target },
      { text: "Custom Training Modules", icon: null },
      { text: "Team Coaching & Collaboration", icon: Users },
      { text: "Leadership Metrics Dashboard", icon: TrendingUp },
      { text: "Track progress and measure ROI", icon: null },
      { text: "Industry-tailored approach", icon: null },
    ],
    cta: "Request Proposal",
    highlighted: false,
    icon: Building,
    accentColor: "secondary",
    stats: [
      { value: "100%", label: "Custom" },
      { value: "3-6", label: "Months" },
      { value: "ROI", label: "Focused" },
    ],
  },
];

const ProgramsSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/50" />
      
      {/* Decorative shapes */}
      <div className="absolute top-40 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 -left-32 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/3 to-transparent rounded-full blur-3xl" />
      
      <div className="container-narrow relative">
        {/* Section Header */}
        <AnimatedSection className="mx-auto mb-20 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/15 to-primary/5 px-5 py-2.5 border border-primary/20">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Choose Your Path
            </span>
          </div>
          <h2 className="mb-6 font-serif text-4xl font-semibold text-foreground sm:text-5xl lg:text-6xl">
            Executive Leadership{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-secondary">Mastery</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-primary/20 -z-0 rotate-1" />
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Which leadership journey is right for you? Our programs are designed 
            to meet the unique needs of individual leaders and organizations.
          </p>
        </AnimatedSection>

        {/* Programs Grid */}
        <div className="grid gap-10 lg:grid-cols-2">
          {programs.map((program, index) => (
            <AnimatedSection key={program.title} delay={index * 200}>
              <div
                className={`group relative overflow-hidden rounded-[2rem] transition-all duration-500 hover:-translate-y-3 ${
                  program.highlighted
                    ? "bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground shadow-2xl shadow-primary/25"
                    : "bg-card border-2 border-border/50 hover:border-secondary/40 hover:shadow-2xl hover:shadow-secondary/15"
                }`}
              >
                {/* Background pattern for highlighted card */}
                {program.highlighted && (
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                  }} />
                )}
                
                {/* Header section with stats */}
                <div className={`relative p-8 pb-0 ${program.highlighted ? '' : ''}`}>
                  {/* Badge ribbon */}
                  <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 ${
                    program.highlighted 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : 'bg-secondary/10 border border-secondary/20'
                  }`}>
                    <program.icon className={`h-4 w-4 ${program.highlighted ? 'text-secondary' : 'text-secondary'}`} />
                    <span className={`text-sm font-bold uppercase tracking-wider ${
                      program.highlighted ? 'text-white' : 'text-secondary'
                    }`}>
                      {program.badge}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-6 mb-8">
                    {program.stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className={`font-serif text-3xl font-bold ${
                          program.highlighted ? 'text-secondary' : 'text-primary'
                        }`}>
                          {stat.value}
                        </div>
                        <div className={`text-xs font-medium uppercase tracking-wider ${
                          program.highlighted ? 'text-white/70' : 'text-muted-foreground'
                        }`}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content section */}
                <div className="relative p-8 pt-0">
                  <h3 className={`mb-3 font-serif text-2xl font-semibold lg:text-3xl ${
                    program.highlighted ? 'text-white' : 'text-foreground group-hover:text-primary transition-colors'
                  }`}>
                    {program.title}
                  </h3>
                  <p className={`mb-2 text-lg font-semibold ${
                    program.highlighted ? 'text-secondary' : 'text-secondary'
                  }`}>
                    {program.subtitle}
                  </p>
                  <p className={`mb-8 leading-relaxed ${
                    program.highlighted ? 'text-white/80' : 'text-muted-foreground'
                  }`}>
                    {program.description}
                  </p>

                  {/* Features grid */}
                  <div className="grid gap-4 sm:grid-cols-2 mb-8">
                    {program.features.map((feature, i) => (
                      <div 
                        key={i} 
                        className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                          program.highlighted 
                            ? 'bg-white/10 hover:bg-white/15' 
                            : 'bg-muted/50 hover:bg-muted'
                        }`}
                      >
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                          program.highlighted ? 'bg-secondary/20' : 'bg-primary/10'
                        }`}>
                          <Check className={`h-3.5 w-3.5 ${
                            program.highlighted ? 'text-secondary' : 'text-primary'
                          }`} strokeWidth={3} />
                        </div>
                        <span className={`text-sm font-medium ${
                          program.highlighted ? 'text-white' : 'text-foreground'
                        }`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant={program.highlighted ? "hero" : "teal"}
                    size="lg"
                    className={`w-full sm:w-auto group/btn ${
                      program.highlighted ? 'bg-white text-primary hover:bg-white/90' : ''
                    }`}
                  >
                    {program.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
                
                {/* Decorative corner accent */}
                {program.highlighted && (
                  <div className="absolute -right-16 -top-16 h-48 w-48 bg-secondary/20 rounded-full blur-2xl" />
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Corporate Retreat Section - Premium design */}
        <AnimatedSection delay={400} className="mt-24">
          <div className="relative overflow-hidden rounded-[2.5rem] group">
            {/* Image with parallax-like effect */}
            <div className="relative h-[550px] overflow-hidden">
              <img
                src={corporateRetreat}
                alt="Corporate training retreat"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* Multi-layer gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
              
              {/* Animated decorative elements */}
              <div className="absolute top-12 right-12 w-32 h-32 border-2 border-secondary/30 rounded-full animate-pulse" />
              <div className="absolute top-20 right-20 w-20 h-20 border-2 border-secondary/20 rounded-full" />
              <div className="absolute bottom-20 right-40 w-24 h-24 bg-secondary/10 rounded-full blur-xl" />
            </div>
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="p-10 lg:p-20 max-w-2xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/20 backdrop-blur-md px-5 py-2.5 border border-secondary/30">
                  <Building className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-bold text-secondary uppercase tracking-wider">
                    Immersive Experience
                  </span>
                </div>
                
                <h3 className="mb-6 font-serif text-4xl font-semibold text-primary-foreground lg:text-5xl leading-tight">
                  Corporate Training{" "}
                  <span className="text-secondary">Retreats</span>
                </h3>
                
                <p className="mb-8 text-lg text-primary-foreground/85 leading-relaxed">
                  Join us for an immersive retreat designed for leaders striving for excellence. 
                  Through tailored workshops and actionable strategies, transform your leadership 
                  and build lasting connections with fellow executives.
                </p>
                
                {/* Retreat highlights */}
                <div className="flex flex-wrap gap-4 mb-10">
                  {["3-5 Day Programs", "Custom Workshops", "Team Building", "Strategic Planning"].map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-white border border-white/10">
                      <Check className="h-3.5 w-3.5 text-secondary" />
                      {item}
                    </span>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Button variant="hero" size="lg" className="group/btn shadow-lg shadow-secondary/30">
                    Request Free Consultation
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                  <Button variant="heroOutline" size="lg" className="backdrop-blur-sm">
                    View Past Retreats
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ProgramsSection;
