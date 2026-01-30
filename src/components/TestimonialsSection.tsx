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
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-muted/60 via-muted/40 to-muted/20">
      
      <div className="container-narrow relative">
        {/* Section Header */}
        <AnimatedSection className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary/15 to-primary/15 px-5 py-2.5 border border-secondary/20">
            <Star className="h-4 w-4 text-secondary fill-secondary" />
            <span className="text-sm font-bold text-secondary uppercase tracking-wider">
              Success Stories
            </span>
          </div>
          <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            Real Results, <span className="text-primary">Real Impact</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Discover how our coaching programs have propelled leaders and 
            businesses to new heights of success.
          </p>
        </AnimatedSection>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.name} delay={index * 100}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  {/* Quote icon */}
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10">
                    <Quote className="h-5 w-5 text-primary" />
                  </div>
                  
                  {/* Rating */}
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                    ))}
                  </div>

                  <p className="mb-6 text-foreground leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 font-serif text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/20">
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
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
