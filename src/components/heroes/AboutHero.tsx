import { useRef } from "react";
import { motion } from "framer-motion";
import { Building, Users, Globe, Award, Target, Lightbulb, Heart, Zap } from "lucide-react";
import TextReveal from "@/components/TextReveal";
import { useMouseParallax, ParallaxLayer } from "@/hooks/useMouseParallax";
import cpdBadge from "@/assets/cpd-badge.png";

const AboutHero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const parallax = useMouseParallax(containerRef, { sensitivity: 0.025, maxMovement: 35 });

  const values = [
    { icon: Target, label: "Excellence", color: "from-primary to-primary/70" },
    { icon: Heart, label: "Integrity", color: "from-secondary to-secondary/70" },
    { icon: Lightbulb, label: "Innovation", color: "from-primary to-primary/70" },
    { icon: Users, label: "Collaboration", color: "from-secondary to-secondary/70" },
  ];

  return (
    <section ref={containerRef} className="relative min-h-[95vh] overflow-hidden flex items-center">
      {/* Rich dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/50 to-background" />
      
      {/* Animated aurora effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-60"
        animate={{
          background: [
            "radial-gradient(ellipse 100% 80% at 0% 0%, hsl(var(--primary) / 0.2) 0%, transparent 50%), radial-gradient(ellipse 80% 60% at 100% 100%, hsl(var(--secondary) / 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse 100% 80% at 100% 0%, hsl(var(--secondary) / 0.2) 0%, transparent 50%), radial-gradient(ellipse 80% 60% at 0% 100%, hsl(var(--primary) / 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse 100% 80% at 50% 0%, hsl(var(--primary) / 0.2) 0%, transparent 50%), radial-gradient(ellipse 80% 60% at 50% 100%, hsl(var(--secondary) / 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse 100% 80% at 0% 0%, hsl(var(--primary) / 0.2) 0%, transparent 50%), radial-gradient(ellipse 80% 60% at 100% 100%, hsl(var(--secondary) / 0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Hexagonal grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15L30 0z' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Large floating orbs with parallax */}
      <ParallaxLayer parallax={parallax} depth={0.6} className="absolute -top-20 -right-20">
        <motion.div
          className="w-[700px] h-[700px] rounded-full bg-primary/15 blur-[150px]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>
      <ParallaxLayer parallax={parallax} depth={0.8} className="absolute -bottom-40 -left-40">
        <motion.div
          className="w-[500px] h-[500px] rounded-full bg-secondary/20 blur-[120px]"
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>

      {/* Floating decorative elements with parallax */}
      <ParallaxLayer parallax={parallax} depth={1.3} className="absolute top-32 left-[8%] hidden lg:block">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border border-primary/20 rounded-xl"
        />
      </ParallaxLayer>
      <ParallaxLayer parallax={parallax} depth={1.6} className="absolute top-[60%] right-[5%] hidden lg:block">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-4 h-4 bg-secondary/50 rounded-full"
        />
      </ParallaxLayer>
      <ParallaxLayer parallax={parallax} depth={1.1} className="absolute bottom-32 left-[15%] hidden lg:block">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-6 bg-primary/40 rounded-full blur-sm"
        />
      </ParallaxLayer>

      {/* Content */}
      <div className="container-narrow relative py-24 pt-32">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div>
            {/* Company badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="block text-sm font-semibold text-primary">
                  BBS Consulting Group
                </span>
                <span className="text-xs text-muted-foreground">Est. 2014</span>
              </div>
            </motion.div>

            <h1 className="mb-6 font-serif text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
              <TextReveal delay={0.1}>
                Where Vision Meets
              </TextReveal>
              <span className="block mt-2 text-primary">
                <TextReveal delay={0.3}>
                  Transformation
                </TextReveal>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10"
            >
              For over a decade, we've partnered with leaders across the globe to unlock 
              their full potential. Our approach combines proven methodologies with 
              personalized strategies that create lasting impact.
            </motion.p>

            {/* Stats ribbon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-6 lg:gap-10 mb-10"
            >
              {[
                { icon: Users, value: "5,000+", label: "Leaders Transformed" },
                { icon: Globe, value: "25+", label: "Countries Served" },
                { icon: Award, value: "10+", label: "Years Excellence" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted border border-border">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-serif text-xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CPD Accreditation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="inline-flex items-center gap-4 px-5 py-3 rounded-2xl bg-muted/50 border border-border"
            >
              <img src={cpdBadge} alt="CPD Accredited" className="h-12 w-12 object-contain" />
              <div>
                <span className="block text-sm font-semibold text-foreground">CPD Accredited Provider</span>
                <span className="text-xs text-muted-foreground">Provider #50838</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Values Grid with 3D effect */}
          <div className="relative hidden lg:block">
            {/* Glow behind cards */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
            />

            {/* Values grid */}
            <div className="relative grid grid-cols-2 gap-4">
              {values.map((value, index) => (
                <ParallaxLayer
                  key={value.label}
                  parallax={parallax}
                  depth={1 + index * 0.15}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.15 }}
                  >
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
                      whileHover={{ scale: 1.03 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl p-6 border border-border shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-300">
                        {/* Gradient bar */}
                        <div className={`absolute top-0 left-4 right-4 h-1 rounded-b-full bg-gradient-to-r ${value.color}`} />
                        
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                          <value.icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold text-foreground text-lg">{value.label}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Core value driving our mission
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </ParallaxLayer>
              ))}
            </div>

            {/* Floating accent elements */}
            <ParallaxLayer parallax={parallax} depth={2} className="absolute -top-6 -right-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="h-8 w-8 text-secondary/40" />
              </motion.div>
            </ParallaxLayer>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default AboutHero;
