import {
  TrendingUp,
  Heart,
  Award,
  Zap,
  Scale,
  Sparkles,
  Target,
  Building,
} from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const benefits = [
  { icon: TrendingUp, title: "Enhanced Leadership Skills", description: "Master the art of inspiring and guiding teams" },
  { icon: Heart, title: "Job Satisfaction Boost", description: "Find deeper meaning and fulfillment in your role" },
  { icon: Award, title: "Financial Rewards", description: "Unlock career advancement and growth opportunities" },
  { icon: Zap, title: "Productivity Surge", description: "Achieve more with focused, effective leadership" },
  { icon: Scale, title: "Work-Life Harmony", description: "Balance professional success with personal wellbeing" },
  { icon: Sparkles, title: "Holistic Growth", description: "Develop as a complete leader and person" },
  { icon: Target, title: "Career Acceleration", description: "Fast-track your path to executive positions" },
  { icon: Building, title: "Organisational Flourishing", description: "Create lasting positive impact on your organization" },
];

const BenefitsSection = () => {
  return (
    <section id="coaching" className="section-padding relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
      
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/15 rounded-full blur-3xl" />
      
      <div className="container-narrow relative">
        {/* Section Header */}
        <AnimatedSection className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-5 py-2.5 border border-white/20">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              Why Choose Us
            </span>
          </div>
          <h2 className="mb-6 font-serif text-3xl font-semibold text-primary-foreground sm:text-4xl lg:text-5xl">
            Benefits of Executive Coaching
          </h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            Unlock your leadership potential and experience transformative growth 
            across all areas of your professional and personal life.
          </p>
        </AnimatedSection>

        {/* Benefits Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <AnimatedSection key={benefit.title} delay={index * 50}>
              <div className="group h-full rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-secondary/10">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-lg shadow-secondary/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <benefit.icon className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 font-serif text-lg font-semibold text-primary-foreground">
                  {benefit.title}
                </h3>
                <p className="text-sm text-primary-foreground/70 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
