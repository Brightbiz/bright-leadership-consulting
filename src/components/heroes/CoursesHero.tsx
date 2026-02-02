import { useRef } from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, GraduationCap, Star } from "lucide-react";
import TextReveal from "@/components/TextReveal";
import { useMouseParallax, ParallaxLayer } from "@/hooks/useMouseParallax";

const CoursesHero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const parallax = useMouseParallax(containerRef, { sensitivity: 0.025, maxMovement: 35 });

  return (
    <section ref={containerRef} className="relative min-h-[80vh] overflow-hidden flex items-center">
      {/* Deep teal gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/85" />
      
      {/* Animated mesh gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 0% 50%, hsl(var(--secondary) / 0.3) 0%, transparent 50%)",
            "radial-gradient(ellipse at 100% 50%, hsl(var(--secondary) / 0.3) 0%, transparent 50%)",
            "radial-gradient(ellipse at 50% 100%, hsl(var(--secondary) / 0.3) 0%, transparent 50%)",
            "radial-gradient(ellipse at 0% 50%, hsl(var(--secondary) / 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating orbs with parallax */}
      <ParallaxLayer parallax={parallax} depth={0.7} className="absolute top-20 right-[10%]">
        <motion.div
          className="w-[500px] h-[500px] rounded-full bg-secondary/25 blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>
      <ParallaxLayer parallax={parallax} depth={0.5} className="absolute -bottom-20 left-[5%]">
        <motion.div
          className="w-[400px] h-[400px] rounded-full bg-white/10 blur-[80px]"
          animate={{
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>

      {/* Floating icons with parallax */}
      <ParallaxLayer parallax={parallax} depth={1.3} className="absolute top-32 left-[12%] hidden lg:block">
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-secondary" />
          </div>
        </motion.div>
      </ParallaxLayer>
      <ParallaxLayer parallax={parallax} depth={1.1} className="absolute bottom-40 right-[8%] hidden lg:block">
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-14 h-14 rounded-xl bg-secondary/20 backdrop-blur-sm border border-secondary/30 flex items-center justify-center">
            <GraduationCap className="h-7 w-7 text-secondary" />
          </div>
        </motion.div>
      </ParallaxLayer>
      <ParallaxLayer parallax={parallax} depth={1.5} className="absolute top-[60%] left-[8%] hidden lg:block">
        <motion.div
          animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center">
            <Star className="h-5 w-5 text-secondary fill-secondary" />
          </div>
        </motion.div>
      </ParallaxLayer>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="container-narrow relative py-24 pt-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-3 rounded-full bg-secondary/20 backdrop-blur-sm px-6 py-3 border border-secondary/30 shadow-lg shadow-secondary/20"
          >
            <Award className="h-5 w-5 text-secondary" />
            <span className="text-sm font-bold text-secondary uppercase tracking-wider">
              CPD Accredited Programs
            </span>
          </motion.div>

          <h1 className="mb-8 font-serif text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            <TextReveal delay={0.2}>
              Transform Your
            </TextReveal>
            <span className="block mt-2 relative inline-block text-secondary">
              <TextReveal delay={0.4}>
                Leadership Journey
              </TextReveal>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1.5 bg-secondary/60 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg text-primary-foreground/80 leading-relaxed sm:text-xl max-w-2xl mx-auto mb-12"
          >
            Explore our comprehensive range of CPD-accredited courses designed to develop 
            exceptional leaders and accelerate professional growth.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {[
              { icon: BookOpen, label: "7+ Courses" },
              { icon: Award, label: "CPD Certified" },
              { icon: GraduationCap, label: "Self-Paced" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <item.icon className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium text-primary-foreground">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default CoursesHero;
