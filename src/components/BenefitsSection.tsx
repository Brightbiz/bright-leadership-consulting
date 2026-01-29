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
    <section id="coaching" className="section-padding bg-primary text-primary-foreground">
      <div className="container-narrow">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-secondary">
            Why Choose Us
          </span>
          <h2 className="mb-6 font-serif text-3xl font-semibold sm:text-4xl lg:text-5xl">
            Benefits of Executive Coaching
          </h2>
          <p className="text-lg text-primary-foreground/80">
            Unlock your leadership potential and experience transformative growth 
            across all areas of your professional and personal life.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/10 hover:border-primary-foreground/20"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-serif text-lg font-semibold">
                {benefit.title}
              </h3>
              <p className="text-sm text-primary-foreground/70 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;