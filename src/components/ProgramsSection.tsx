import { Check, ArrowRight, Crown, Building, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import corporateRetreat from "@/assets/corporate-retreat.jpg";

const programs = [
  {
    badge: "For Executives",
    title: "Executive Leadership Mastery Program",
    subtitle: "Step into the C-Suite with Confidence",
    description:
      "This 8–12 week CPD-accredited program is designed to help senior executives and high-potential leaders master the skills they need to lead with impact.",
    features: [
      "Build trust and collaboration within teams",
      "Enhance your executive presence and influence",
      "Make confident, high-pressure decisions",
      "33 comprehensive modules",
      "Personalized one-on-one coaching",
      "Real-world capstone project",
    ],
    cta: "Start Your Journey",
    highlighted: true,
    icon: Crown,
    gradient: "from-primary via-primary/90 to-primary/80",
  },
  {
    badge: "For Organizations",
    title: "Organizational Leadership Transformation",
    subtitle: "Build a Leadership Culture That Drives Results",
    description:
      "A 3–6 month customizable program designed to align leadership development with your business goals and create a sustainable leadership pipeline.",
    features: [
      "Organisational Leadership Audit",
      "Custom Training Modules",
      "Team Coaching & Collaboration",
      "Leadership Metrics Dashboard",
      "Track progress and measure ROI",
      "Industry-tailored approach",
    ],
    cta: "Request Proposal",
    highlighted: false,
    icon: Building,
    gradient: "from-secondary via-secondary/90 to-secondary/80",
  },
];

const ProgramsSection = () => {
  return (
    <section className="section-padding bg-muted/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container-narrow relative">
        {/* Section Header */}
        <AnimatedSection className="mx-auto mb-20 max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Choose Your Path
            </span>
          </div>
          <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Executive Leadership{" "}
            <span className="relative">
              Mastery
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 8C50 4 150 4 198 8"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Which leadership journey is right for you? Our programs are designed 
            to meet the unique needs of individual leaders and organizations.
          </p>
        </AnimatedSection>

        {/* Programs Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {programs.map((program, index) => (
            <AnimatedSection key={program.title} delay={index * 150}>
              <div
                className={`group relative overflow-hidden rounded-3xl border p-8 lg:p-10 transition-all duration-500 hover:-translate-y-2 ${
                  program.highlighted
                    ? "border-primary/40 bg-card shadow-2xl shadow-primary/10"
                    : "border-border/50 bg-card hover:border-secondary/40 hover:shadow-2xl hover:shadow-secondary/10"
                }`}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${program.highlighted ? 'from-primary/5 via-transparent to-secondary/5' : 'from-secondary/5 via-transparent to-primary/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Popular badge */}
                {program.highlighted && (
                  <div className="absolute right-0 top-0 overflow-hidden">
                    <div className="absolute right-[-35px] top-[32px] w-[170px] rotate-45 bg-gradient-to-r from-secondary to-secondary/90 py-2 text-center shadow-lg">
                      <span className="text-sm font-bold text-secondary-foreground tracking-wider">
                        POPULAR
                      </span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="relative">
                  {/* Icon and badge row */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${program.highlighted ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'} transition-transform duration-300 group-hover:scale-110`}>
                      <program.icon className="h-7 w-7" strokeWidth={1.5} />
                    </div>
                    <span className={`inline-block text-sm font-bold uppercase tracking-wider ${program.highlighted ? 'text-primary' : 'text-secondary'}`}>
                      {program.badge}
                    </span>
                  </div>

                  <h3 className="mb-3 font-serif text-2xl font-semibold text-foreground lg:text-3xl group-hover:text-primary transition-colors duration-300">
                    {program.title}
                  </h3>
                  <p className={`mb-4 text-lg font-semibold ${program.highlighted ? 'text-secondary' : 'text-primary'}`}>
                    {program.subtitle}
                  </p>
                  <p className="mb-8 text-muted-foreground leading-relaxed">
                    {program.description}
                  </p>

                  {/* Features grid with enhanced styling */}
                  <ul className="mb-8 grid gap-4 sm:grid-cols-2">
                    {program.features.map((feature, i) => (
                      <li 
                        key={feature} 
                        className="flex items-start gap-3 text-sm text-foreground group/item"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${program.highlighted ? 'bg-primary/10' : 'bg-secondary/10'}`}>
                          <Check className={`h-3 w-3 ${program.highlighted ? 'text-primary' : 'text-secondary'}`} strokeWidth={3} />
                        </div>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={program.highlighted ? "hero" : "teal"}
                    size="lg"
                    className="w-full sm:w-auto group/btn"
                  >
                    {program.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Corporate Retreat Section - Enhanced */}
        <AnimatedSection delay={300} className="mt-20">
          <div className="relative overflow-hidden rounded-3xl group">
            <img
              src={corporateRetreat}
              alt="Corporate training retreat"
              className="h-[450px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Multi-layer gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
            
            {/* Decorative elements */}
            <div className="absolute top-8 right-8 h-24 w-24 rounded-full border-2 border-secondary/30 opacity-50" />
            <div className="absolute top-12 right-12 h-16 w-16 rounded-full border-2 border-secondary/20 opacity-50" />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="p-8 lg:p-16 max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/20 backdrop-blur-sm px-4 py-2">
                  <Building className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-semibold text-secondary">
                    Immersive Experience
                  </span>
                </div>
                <h3 className="mb-4 font-serif text-3xl font-semibold text-primary-foreground lg:text-4xl">
                  Corporate Training Retreats
                </h3>
                <p className="mb-8 text-lg text-primary-foreground/85 leading-relaxed">
                  Join us for an immersive retreat designed for leaders striving for excellence. 
                  Through tailored workshops and actionable strategies, transform your leadership 
                  and build lasting connections with fellow executives.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="hero" size="lg" className="group/btn">
                    Request Free Consultation
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                  <Button variant="heroOutline" size="lg">
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
