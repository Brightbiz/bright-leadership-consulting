import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  },
];

const ProgramsSection = () => {
  return (
    <section className="section-padding bg-muted/50">
      <div className="container-narrow">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-secondary">
            Choose Your Path
          </span>
          <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Executive Leadership{" "}
            <span className="text-primary">Mastery</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Which leadership journey is right for you? Our programs are designed 
            to meet the unique needs of individual leaders and organizations.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {programs.map((program) => (
            <div
              key={program.title}
              className={`relative overflow-hidden rounded-3xl border p-8 lg:p-10 transition-all duration-300 ${
                program.highlighted
                  ? "border-primary/30 bg-card shadow-xl"
                  : "border-border bg-card hover:border-primary/20 hover:shadow-lg"
              }`}
            >
              {program.highlighted && (
                <div className="absolute right-0 top-0 rounded-bl-2xl bg-secondary px-4 py-1.5">
                  <span className="text-sm font-semibold text-secondary-foreground">
                    Popular
                  </span>
                </div>
              )}

              <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wider text-primary">
                {program.badge}
              </span>
              <h3 className="mb-2 font-serif text-2xl font-semibold text-foreground lg:text-3xl">
                {program.title}
              </h3>
              <p className="mb-4 text-lg font-medium text-secondary">
                {program.subtitle}
              </p>
              <p className="mb-8 text-muted-foreground leading-relaxed">
                {program.description}
              </p>

              <ul className="mb-8 grid gap-3 sm:grid-cols-2">
                {program.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={program.highlighted ? "hero" : "teal"}
                size="lg"
                className="w-full sm:w-auto"
              >
                {program.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Image Section */}
        <div className="mt-20 overflow-hidden rounded-3xl">
          <div className="relative">
            <img
              src={corporateRetreat}
              alt="Corporate training retreat"
              className="h-80 w-full object-cover lg:h-96"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
              <h3 className="mb-2 font-serif text-2xl font-semibold text-primary-foreground lg:text-3xl">
                Corporate Training Retreats
              </h3>
              <p className="mb-6 max-w-2xl text-primary-foreground/80">
                Join us for an immersive retreat designed for leaders striving for excellence. 
                Through tailored workshops and actionable strategies, transform your leadership.
              </p>
              <Button variant="hero" size="lg">
                Request Free Consultation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;