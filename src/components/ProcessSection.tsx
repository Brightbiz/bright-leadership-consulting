import teamImage from "@/assets/team-collaboration.jpg";

const steps = [
  {
    number: "01",
    title: "Initial Assessment",
    description: "We begin by understanding your unique needs, aspirations, and challenges.",
  },
  {
    number: "02",
    title: "Personalized Plan",
    description: "A coaching plan crafted just for you, aligned with your goals and growth areas.",
  },
  {
    number: "03",
    title: "Coaching Sessions",
    description: "Dive into dynamic one-on-one sessions with our seasoned coaches.",
  },
  {
    number: "04",
    title: "Ongoing Support",
    description: "Continued support and resources beyond the sessions for lasting transformation.",
  },
];

const ProcessSection = () => {
  return (
    <section id="about" className="section-padding bg-muted/50">
      <div className="container-narrow">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-3xl">
              <img
                src={teamImage}
                alt="Leadership team collaboration"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Floating accent card */}
            <div className="absolute -bottom-6 -right-6 rounded-2xl bg-secondary p-6 shadow-xl lg:-right-8">
              <div className="font-serif text-3xl font-bold text-secondary-foreground">15+</div>
              <div className="text-sm font-medium text-secondary-foreground/80">Years of Excellence</div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-secondary">
              Our Process
            </span>
            <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
              Your Coaching Journey
            </h2>
            <p className="mb-10 text-lg text-muted-foreground leading-relaxed">
              Our structured yet flexible approach ensures you receive the personalized 
              guidance needed to unlock your full leadership potential.
            </p>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex gap-6 group">
                  <div className="relative flex flex-col items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-lg font-semibold text-primary-foreground transition-transform group-hover:scale-110">
                      {step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="mt-2 h-full w-0.5 bg-border" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;