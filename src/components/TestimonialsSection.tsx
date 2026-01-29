import { Star, Quote } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const testimonials = [
  {
    name: "Sophia Chen",
    role: "CEO, TechVenture Inc",
    content:
      "Through the coaching program, I revamped my leadership approach, optimized team engagement, and expanded our impact. Within months, our results surged dramatically.",
    rating: 5,
  },
  {
    name: "David Patel",
    role: "Founder, InnovateLab",
    content:
      "The guidance helped me pivot my leadership style, streamline operations, and build strategic partnerships. Our company gained significant traction and attracted top talent.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "VP Operations, GlobalCorp",
    content:
      "The coaching sessions empowered me to trust my instincts, communicate effectively, and lead with conviction. Today, I'm driving organizational success with confidence.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        {/* Section Header */}
        <AnimatedSection className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-secondary">
            Success Stories
          </span>
          <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Real Results, <span className="text-primary">Real Impact</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover how our coaching programs have propelled leaders and 
            businesses to new heights of success.
          </p>
        </AnimatedSection>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.name} delay={index * 100}>
              <div className="group relative h-full rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-xl">
                <Quote className="mb-4 h-10 w-10 text-primary/20" />
                
                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>

                <p className="mb-6 text-foreground leading-relaxed">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent font-serif text-lg font-semibold text-primary">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;