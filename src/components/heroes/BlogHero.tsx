import { useRef } from "react";
import { motion } from "framer-motion";
import { Newspaper, BookOpen, TrendingUp, Users, Sparkles } from "lucide-react";
import TextReveal from "@/components/TextReveal";
import { useMouseParallax, ParallaxLayer } from "@/hooks/useMouseParallax";

const BlogHero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const parallax = useMouseParallax(containerRef, { sensitivity: 0.025, maxMovement: 30 });

  const categories = [
    { label: "Leadership", count: 12 },
    { label: "Management", count: 8 },
    { label: "Growth", count: 15 },
    { label: "Strategy", count: 6 },
  ];

  return (
    <section ref={containerRef} className="relative min-h-[70vh] overflow-hidden flex items-center">
      {/* Editorial gradient - warm cream to teal tints */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background to-primary/5" />
      
      {/* Newspaper texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            hsl(var(--foreground) / 0.1) 2px,
            hsl(var(--foreground) / 0.1) 3px
          )`,
        }}
      />

      {/* Floating editorial elements with parallax */}
      <ParallaxLayer parallax={parallax} depth={0.9} className="absolute top-16 right-[18%]">
        <motion.div
          className="w-32 h-40 bg-gradient-to-br from-card to-card/80 rounded-lg border border-border/50 shadow-xl"
          animate={{ rotate: [3, 6, 3], y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="p-3 space-y-2">
            <div className="h-2 w-full bg-primary/20 rounded" />
            <div className="h-2 w-3/4 bg-primary/15 rounded" />
            <div className="h-8 w-full bg-secondary/10 rounded mt-2" />
            <div className="h-2 w-full bg-muted rounded" />
            <div className="h-2 w-2/3 bg-muted rounded" />
          </div>
        </motion.div>
      </ParallaxLayer>

      <ParallaxLayer parallax={parallax} depth={1.2} className="absolute bottom-32 left-[12%]">
        <motion.div
          className="w-24 h-32 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg border border-secondary/30 shadow-lg"
          animate={{ rotate: [-5, -2, -5], y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="p-2 space-y-1.5">
            <div className="h-1.5 w-full bg-secondary/30 rounded" />
            <div className="h-1.5 w-2/3 bg-secondary/25 rounded" />
            <div className="h-6 w-full bg-primary/10 rounded mt-1" />
          </div>
        </motion.div>
      </ParallaxLayer>

      {/* Large ambient blobs */}
      <ParallaxLayer parallax={parallax} depth={0.5} className="absolute -top-20 left-[30%]">
        <motion.div
          className="w-[600px] h-[600px] rounded-full bg-secondary/10 blur-[150px]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>
      <ParallaxLayer parallax={parallax} depth={0.7} className="absolute -bottom-40 right-[10%]">
        <motion.div
          className="w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>

      {/* Floating decorative icons */}
      <ParallaxLayer parallax={parallax} depth={1.4} className="absolute top-[45%] right-[8%] hidden lg:block">
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
        </motion.div>
      </ParallaxLayer>
      <ParallaxLayer parallax={parallax} depth={1.1} className="absolute top-32 left-[6%] hidden lg:block">
        <motion.div
          animate={{ y: [0, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="w-10 h-10 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-secondary" />
          </div>
        </motion.div>
      </ParallaxLayer>

      {/* Content */}
      <div className="container-narrow relative py-24 pt-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-secondary/15 to-primary/10 backdrop-blur-sm px-5 py-2.5 border border-secondary/25"
          >
            <Newspaper className="h-4 w-4 text-secondary" />
            <span className="text-sm font-semibold text-secondary">
              Insights & Resources
            </span>
          </motion.div>

          <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            <TextReveal delay={0.2}>
              Leadership Insights &
            </TextReveal>
            <span className="block mt-2 text-primary">
              <TextReveal delay={0.4}>
                Expert Perspectives
              </TextReveal>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg text-muted-foreground leading-relaxed sm:text-xl max-w-2xl mb-10"
          >
            Discover actionable strategies, industry trends, and expert advice to elevate 
            your leadership journey and drive organizational success.
          </motion.p>

          {/* Category pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap gap-3"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                className="group flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {category.label}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {category.count}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};

export default BlogHero;
