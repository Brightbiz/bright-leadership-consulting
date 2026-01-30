import { Award, BookOpen, Users, Target, TrendingUp, Clock, CheckCircle, ArrowRight, Sparkles, User, Building2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";

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
  bonus: "50% OFF all individual training courses as an exclusive bonus!",
  link: "https://bright-leadership-consulting.thinkific.com/courses/executive-leadership-mastery-program",
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
  link: "#contact",
};

const ExecutiveProgramSection = () => {
  return (
    <section id="executive-program" className="section-padding relative overflow-hidden bg-gradient-to-br from-primary/[0.06] via-background to-secondary/[0.06]">
      {/* Decorative accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.04] via-transparent to-secondary/[0.04]" />
      
      <div className="container-narrow relative">
        {/* Section Header */}
        <AnimatedSection className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/15 to-secondary/15 px-5 py-2.5 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              Flagship Programs
            </span>
          </div>
          
          <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Executive Leadership <span className="text-primary">Mastery</span>
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Choose the path that fits your journey—whether you're an individual leader ready to excel or an organization building a culture of leadership excellence.
          </p>
        </AnimatedSection>

        {/* Two Column Programs */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Individual Program */}
          <AnimatedSection animation="slide-left" delay={0}>
            <div className="relative overflow-hidden rounded-2xl bg-card border-2 border-secondary/30 h-full flex flex-col shadow-xl hover:shadow-2xl transition-shadow duration-500">
              {/* Header */}
              <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 p-6 border-b border-secondary/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20">
                    <User className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary">{individualProgram.title}</span>
                    <h3 className="font-serif text-xl font-semibold text-foreground">{individualProgram.subtitle}</h3>
                  </div>
                </div>
                <p className="text-secondary font-medium italic">{individualProgram.tagline}</p>
              </div>
              
              {/* Content */}
              <div className="p-6 flex-grow flex flex-col">
                <p className="mb-4 text-muted-foreground leading-relaxed">
                  {individualProgram.description}
                </p>
                
                <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Who It's For:</span> {individualProgram.audience}
                  </p>
                </div>
                
                {/* Highlights */}
                <ul className="space-y-3 mb-6 flex-grow">
                  {individualProgram.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Star className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5 fill-secondary" />
                      <span className="text-sm text-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Bonus */}
                <div className="bg-secondary/10 rounded-xl p-4 mb-6 border border-secondary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-5 w-5 text-secondary" />
                    <span className="font-bold text-secondary">Exclusive Bonus</span>
                  </div>
                  <p className="text-sm text-foreground">{individualProgram.bonus}</p>
                </div>
                
                <Button variant="hero" size="lg" className="w-full group" asChild>
                  <a href={individualProgram.link} target="_blank" rel="noopener noreferrer">
                    Enroll Now
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
              
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground rounded-full px-3 py-1 shadow-lg">
                <span className="font-bold text-xs uppercase">Most Popular</span>
              </div>
            </div>
          </AnimatedSection>
          
          {/* Organization Program */}
          <AnimatedSection animation="slide-right" delay={200}>
            <div className="relative overflow-hidden rounded-2xl bg-card border-2 border-primary/30 h-full flex flex-col shadow-xl hover:shadow-2xl transition-shadow duration-500">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6 border-b border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">{organizationProgram.title}</span>
                    <h3 className="font-serif text-xl font-semibold text-foreground">{organizationProgram.subtitle}</h3>
                  </div>
                </div>
                <p className="text-primary font-medium italic">{organizationProgram.tagline}</p>
              </div>
              
              {/* Content */}
              <div className="p-6 flex-grow flex flex-col">
                <p className="mb-4 text-muted-foreground leading-relaxed">
                  {organizationProgram.description}
                </p>
                
                <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Who It's For:</span> {organizationProgram.audience}
                  </p>
                </div>
                
                {/* Highlights */}
                <ul className="space-y-3 mb-6 flex-grow">
                  {organizationProgram.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Star className="h-4 w-4 text-primary flex-shrink-0 mt-0.5 fill-primary" />
                      <span className="text-sm text-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Bonus */}
                <div className="bg-primary/10 rounded-xl p-4 mb-6 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="font-bold text-primary">Included</span>
                  </div>
                  <p className="text-sm text-foreground">{organizationProgram.bonus}</p>
                </div>
                
                <Button variant="teal" size="lg" className="w-full group" asChild>
                  <a href={organizationProgram.link}>
                    Request Consultation
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
              
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full px-3 py-1 shadow-lg">
                <span className="font-bold text-xs uppercase">Enterprise</span>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* CPD Accreditation Note */}
        <AnimatedSection delay={400} className="mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/5 via-card to-secondary/5 border border-border/50">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
              <Award className="h-7 w-7 text-primary" />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold text-foreground">CPD Accredited Programs</p>
              <p className="text-sm text-muted-foreground">Internationally recognized certification to validate your leadership excellence</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ExecutiveProgramSection;
