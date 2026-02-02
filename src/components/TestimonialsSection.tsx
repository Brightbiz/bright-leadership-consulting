import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import TiltCard from "./TiltCard";
import TextReveal from "./TextReveal";
import { Skeleton } from "@/components/ui/skeleton";
import testimonialSophia from "@/assets/testimonial-sophia.jpg";
import testimonialDavid from "@/assets/testimonial-david.jpg";
import testimonialEmily from "@/assets/testimonial-emily.jpg";

const testimonials = [
  {
    name: "Sophia Chen",
    role: "CEO, TechVenture Inc",
    content:
      "Through the coaching program, I revamped my leadership approach, optimized team engagement, and expanded our impact. Within months, our results surged dramatically.",
    rating: 5,
    image: testimonialSophia,
  },
  {
    name: "David Patel",
    role: "Founder, InnovateLab",
    content:
      "The guidance helped me pivot my leadership style, streamline operations, and build strategic partnerships. Our company gained significant traction and attracted top talent.",
    rating: 5,
    image: testimonialDavid,
  },
  {
    name: "Emily Rodriguez",
    role: "VP Operations, GlobalCorp",
    content:
      "The coaching sessions empowered me to trust my instincts, communicate effectively, and lead with conviction. Today, I'm driving organizational success with confidence.",
    rating: 5,
    image: testimonialEmily,
  },
];

interface TestimonialImageProps {
  src: string;
  alt: string;
}

const TestimonialImage = ({ src, alt }: TestimonialImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative h-14 w-14">
      {/* Skeleton shown while loading */}
      {!isLoaded && !hasError && (
        <Skeleton className="absolute inset-0 h-14 w-14 rounded-full" />
      )}
      
      {/* Fallback for error */}
      {hasError && (
        <div className="absolute inset-0 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center font-serif text-xl font-semibold text-primary-foreground shadow-lg ring-2 ring-primary/20">
          {alt.charAt(0)}
        </div>
      )}
      
      {/* Actual image */}
      <motion.img 
        src={src} 
        alt={alt}
        className={`h-14 w-14 rounded-full object-cover shadow-lg ring-2 ring-primary/20 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0, 
          scale: isLoaded ? 1 : 0.8 
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </div>
  );
};

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
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-muted/80 via-muted/50 to-background">
      {/* Premium animated background orbs */}
      <motion.div
        className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-primary/[0.08] to-secondary/[0.04] rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1], 
          opacity: [0.4, 0.6, 0.4],
          x: [0, 30, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-secondary/[0.08] to-primary/[0.04] rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2], 
          opacity: [0.5, 0.3, 0.5],
          x: [0, -20, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/[0.03] to-transparent rounded-full blur-3xl pointer-events-none"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="container-narrow relative">
        {/* Section Header with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <motion.div 
            className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/80 dark:bg-card/80 backdrop-blur-sm px-6 py-3 shadow-lg shadow-secondary/10 border border-secondary/20"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-secondary/80">
              <Star className="h-4 w-4 text-secondary-foreground fill-secondary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground uppercase tracking-widest">
              Success Stories
            </span>
          </motion.div>
          
          <h2 className="mb-8 font-serif text-4xl font-semibold text-foreground sm:text-5xl lg:text-6xl leading-tight">
            <TextReveal>Real Results, Real Impact</TextReveal>
          </h2>
          
          <motion.p 
            className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Discover how our coaching programs have propelled leaders and 
            businesses to new heights of success.
          </motion.p>
        </motion.div>

        {/* Featured Testimonial Carousel with premium card */}
        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.98 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <TiltCard maxTilt={4} glareEnabled>
                <div className="relative overflow-hidden rounded-3xl bg-card/90 backdrop-blur-sm border border-border/50 p-10 md:p-14 shadow-2xl">
                  {/* Decorative gradient mesh background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-secondary/[0.08]" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                  
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                    }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                  />
                  
                  <div className="relative grid md:grid-cols-[1fr,auto] gap-10 items-center">
                    <div>
                      {/* Large quote icon with glow */}
                      <motion.div 
                        className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 shadow-lg shadow-primary/10"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Quote className="h-10 w-10 text-primary" />
                      </motion.div>
                      
                      {/* Rating with staggered animation */}
                      <div className="mb-8 flex gap-2">
                        {Array.from({ length: testimonials[activeIndex].rating }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0, rotate: -30 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: i * 0.08, type: "spring", stiffness: 400 }}
                          >
                            <Star className="h-7 w-7 fill-secondary text-secondary drop-shadow-sm" />
                          </motion.div>
                        ))}
                      </div>

                      <motion.blockquote 
                        className="mb-10 font-serif text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        "{testimonials[activeIndex].content}"
                      </motion.blockquote>

                      {/* Author info with enhanced styling */}
                      <motion.div 
                        className="flex items-center gap-5"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-br from-primary to-secondary rounded-full opacity-50 blur-sm" />
                          <TestimonialImage 
                            src={testimonials[activeIndex].image} 
                            alt={testimonials[activeIndex].name}
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-xl text-foreground">
                            {testimonials[activeIndex].name}
                          </div>
                          <div className="text-muted-foreground font-medium">
                            {testimonials[activeIndex].role}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Decorative vertical accent */}
                    <div className="hidden md:flex flex-col items-center gap-4">
                      <div className="w-px h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                        <span className="font-serif text-lg font-bold text-primary">
                          {activeIndex + 1}
                        </span>
                      </div>
                      <div className="w-px h-32 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />
                    </div>
                  </div>
                  
                  {/* Bottom accent line */}
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  />
                </div>
              </TiltCard>
            </motion.div>
          </AnimatePresence>

          {/* Enhanced Navigation */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <motion.button
              onClick={handlePrev}
              className="group flex h-14 w-14 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm border border-border/50 text-foreground shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              aria-label="Previous testimonial"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
            </motion.button>
            
            {/* Premium dots indicator */}
            <div className="flex gap-3 px-6 py-3 rounded-full bg-card/50 backdrop-blur-sm border border-border/30">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveIndex(index);
                  }}
                  className={`relative h-3 rounded-full transition-all duration-500 ${
                    index === activeIndex 
                      ? 'w-10 bg-gradient-to-r from-primary to-secondary' 
                      : 'w-3 bg-border hover:bg-primary/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {index === activeIndex && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary"
                      layoutId="activeDot"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
            
            <motion.button
              onClick={handleNext}
              className="group flex h-14 w-14 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm border border-border/50 text-foreground shadow-lg hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              aria-label="Next testimonial"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          </div>
          
          {/* Auto-play indicator */}
          <motion.div 
            className="flex justify-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <span className={`inline-block w-2 h-2 rounded-full transition-colors ${isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
              {isAutoPlaying ? 'Auto-playing' : 'Paused'}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;