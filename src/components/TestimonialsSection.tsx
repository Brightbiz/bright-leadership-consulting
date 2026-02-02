import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import TiltCard from "./TiltCard";
import TextReveal from "./TextReveal";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-muted/80 via-muted/50 to-muted/30">
      {/* Subtle animated orbs */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-primary/[0.05] rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-64 h-64 bg-secondary/[0.05] rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="container-narrow relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary/15 to-primary/15 px-5 py-2.5 border border-secondary/20">
            <Star className="h-4 w-4 text-secondary fill-secondary" />
            <span className="text-sm font-bold text-secondary uppercase tracking-wider">
              Success Stories
            </span>
          </div>
          <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
            <TextReveal>Real Results, Real Impact</TextReveal>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Discover how our coaching programs have propelled leaders and 
            businesses to new heights of success.
          </p>
        </motion.div>

        {/* Featured Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <TiltCard maxTilt={3} glareEnabled>
                <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 p-8 md:p-12 shadow-xl">
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                  
                  <div className="relative">
                    {/* Large quote icon */}
                    <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 border border-primary/10">
                      <Quote className="h-8 w-8 text-primary" />
                    </div>
                    
                    {/* Rating */}
                    <div className="mb-6 flex gap-1.5">
                      {Array.from({ length: testimonials[activeIndex].rating }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="h-6 w-6 fill-secondary text-secondary" />
                        </motion.div>
                      ))}
                    </div>

                    <blockquote className="mb-8 font-serif text-2xl md:text-3xl text-foreground leading-relaxed">
                      "{testimonials[activeIndex].content}"
                    </blockquote>

                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 font-serif text-xl font-semibold text-primary-foreground shadow-lg shadow-primary/20">
                        {testimonials[activeIndex].name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-lg text-foreground">
                          {testimonials[activeIndex].name}
                        </div>
                        <div className="text-muted-foreground">
                          {testimonials[activeIndex].role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-card border border-border/50 text-foreground shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveIndex(index);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'w-8 bg-primary' 
                      : 'w-2.5 bg-border hover:bg-primary/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={handleNext}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-card border border-border/50 text-foreground shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
