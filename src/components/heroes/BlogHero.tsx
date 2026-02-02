import { useRef } from "react";
import { motion } from "framer-motion";
import { Newspaper, BookOpen, TrendingUp, Feather, ArrowRight } from "lucide-react";
import TextReveal from "@/components/TextReveal";
import { useMouseParallax, ParallaxLayer } from "@/hooks/useMouseParallax";

const BlogHero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const parallax = useMouseParallax(containerRef, { sensitivity: 0.02, maxMovement: 25 });

  const featuredTopics = [
    { icon: TrendingUp, label: "Strategy", color: "from-emerald-500 to-teal-600" },
    { icon: BookOpen, label: "Learning", color: "from-amber-500 to-orange-600" },
    { icon: Feather, label: "Insights", color: "from-violet-500 to-purple-600" },
  ];

  return (
    <section ref={containerRef} className="relative min-h-[85vh] overflow-hidden flex items-center bg-foreground">
      {/* Dark editorial background with grain texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-primary/20" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--background)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Dramatic diagonal accent */}
      <motion.div 
        className="absolute top-0 right-0 w-[70%] h-full origin-top-right"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-secondary/20 via-secondary/5 to-transparent" 
          style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }} 
        />
      </motion.div>

      {/* Floating article previews */}
      <ParallaxLayer parallax={parallax} depth={0.8} className="absolute top-20 right-[8%] hidden xl:block">
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 8 }}
          animate={{ opacity: 1, y: 0, rotate: 8 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-48 h-64 bg-background/10 backdrop-blur-xl rounded-2xl border border-background/20 p-4 shadow-2xl"
        >
          <div className="h-20 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-lg mb-3" />
          <div className="space-y-2">
            <div className="h-2 w-full bg-background/20 rounded" />
            <div className="h-2 w-3/4 bg-background/15 rounded" />
            <div className="h-2 w-1/2 bg-background/10 rounded" />
          </div>
          <motion.div 
            className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Newspaper className="h-4 w-4 text-secondary-foreground" />
          </motion.div>
        </motion.div>
      </ParallaxLayer>

      <ParallaxLayer parallax={parallax} depth={1.2} className="absolute bottom-32 right-[18%] hidden lg:block">
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -5 }}
          animate={{ opacity: 1, y: 0, rotate: -5 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="w-40 h-52 bg-primary/20 backdrop-blur-xl rounded-2xl border border-primary/30 p-3 shadow-2xl"
        >
          <div className="h-16 bg-gradient-to-br from-primary/40 to-secondary/20 rounded-lg mb-2" />
          <div className="space-y-1.5">
            <div className="h-1.5 w-full bg-background/15 rounded" />
            <div className="h-1.5 w-2/3 bg-background/10 rounded" />
          </div>
        </motion.div>
      </ParallaxLayer>

      {/* Glowing orbs */}
      <ParallaxLayer parallax={parallax} depth={0.4} className="absolute -top-32 left-[20%]">
        <motion.div
          className="w-[500px] h-[500px] rounded-full bg-primary/30 blur-[180px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>
      <ParallaxLayer parallax={parallax} depth={0.6} className="absolute -bottom-20 right-[5%]">
        <motion.div
          className="w-[400px] h-[400px] rounded-full bg-secondary/40 blur-[150px]"
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>

      {/* Content */}
      <div className="container-narrow relative py-24 pt-32 z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-3"
          >
            <span className="w-12 h-px bg-secondary" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">
              The Journal
            </span>
          </motion.div>

          <h1 className="mb-8 font-serif text-5xl font-bold leading-[1.05] text-background sm:text-6xl lg:text-7xl">
            <TextReveal delay={0.2}>
              Ideas That
            </TextReveal>
            <span className="block text-secondary">
              <TextReveal delay={0.4}>
                Shape Leaders
              </TextReveal>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg text-background/70 leading-relaxed sm:text-xl max-w-xl mb-12"
          >
            Curated perspectives on leadership, strategy, and growth from 
            industry experts and thought leaders.
          </motion.p>

          {/* Topic pills with icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            {featuredTopics.map((topic, index) => (
              <motion.div
                key={topic.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                className="group flex items-center gap-3 px-5 py-3 rounded-full bg-background/10 border border-background/20 hover:bg-background/20 transition-all duration-300 cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${topic.color} flex items-center justify-center`}>
                  <topic.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-background group-hover:text-secondary transition-colors">
                  {topic.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <a 
              href="#articles" 
              className="inline-flex items-center gap-3 text-secondary font-semibold group"
            >
              <span>Explore Articles</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-background/30 to-transparent" />
    </section>
  );
};

export default BlogHero;
