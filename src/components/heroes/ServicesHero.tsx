import { useRef } from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Mountain, ArrowRight, Sparkles } from "lucide-react";
import TextReveal from "@/components/TextReveal";
import { useMouseParallax, ParallaxLayer } from "@/hooks/useMouseParallax";

const ServicesHero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const parallax = useMouseParallax(containerRef, { sensitivity: 0.02, maxMovement: 30 });

  const services = [
    { 
      icon: Briefcase, 
      title: "Executive Coaching", 
      description: "1-on-1 leadership development",
      gradient: "from-primary via-primary/80 to-primary/60"
    },
    { 
      icon: GraduationCap, 
      title: "Executive Training", 
      description: "CPD accredited programs",
      gradient: "from-secondary via-secondary/80 to-secondary/60"
    },
    { 
      icon: Mountain, 
      title: "Corporate Retreats", 
      description: "Immersive team experiences",
      gradient: "from-accent via-accent/80 to-accent/60"
    },
  ];

  return (
    <section ref={containerRef} className="relative min-h-[95vh] overflow-hidden flex items-center">
      {/* Split diagonal background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />
        <motion.div
          className="absolute top-0 right-0 w-[60%] h-full origin-top-right"
          style={{
            background: "linear-gradient(135deg, hsl(var(--secondary) / 0.15) 0%, transparent 60%)",
          }}
          animate={{
            clipPath: [
              "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)",
              "polygon(35% 0, 100% 0, 100% 100%, 5% 100%)",
              "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Animated circuit lines pattern */}
      <div className="absolute inset-0 opacity-[0.06]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50h40m10 0h50M50 0v40m0 10v50" stroke="currentColor" strokeWidth="1" fill="none" className="text-primary-foreground" />
              <circle cx="50" cy="50" r="3" fill="currentColor" className="text-secondary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Floating gradient orbs */}
      <ParallaxLayer parallax={parallax} depth={0.5} className="absolute top-20 left-[10%]">
        <motion.div
          className="w-[400px] h-[400px] rounded-full bg-secondary/20 blur-[100px]"
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>
      <ParallaxLayer parallax={parallax} depth={0.7} className="absolute bottom-20 right-[5%]">
        <motion.div
          className="w-[350px] h-[350px] rounded-full bg-primary-foreground/10 blur-[80px]"
          animate={{ scale: [1.1, 1, 1.1], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <ParallaxLayer 
          key={i}
          parallax={parallax} 
          depth={1.5 + i * 0.2}
          className="absolute hidden lg:block"
          style={{
            top: `${15 + i * 18}%`,
            left: `${5 + i * 12}%`,
          }}
        >
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            className="w-2 h-2 bg-secondary rounded-full"
          />
        </ParallaxLayer>
      ))}

      {/* Content */}
      <div className="container-narrow relative py-24 pt-32">
        <div className="text-center max-w-4xl mx-auto mb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-3 rounded-full bg-primary-foreground/10 backdrop-blur-sm px-6 py-3 border border-primary-foreground/20"
          >
            <Sparkles className="h-5 w-5 text-secondary" />
            <span className="text-sm font-semibold text-primary-foreground uppercase tracking-wider">
              Premium Leadership Solutions
            </span>
          </motion.div>

          <h1 className="mb-6 font-serif text-4xl font-bold leading-[1.1] text-primary-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            <TextReveal delay={0.1}>
              Three Paths to
            </TextReveal>
            <span className="block mt-2 text-secondary">
              <TextReveal delay={0.3}>
                Leadership Excellence
              </TextReveal>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto"
          >
            Whether you're seeking personal transformation, team development, or organizational change, 
            we have the expertise to guide your journey to exceptional leadership.
          </motion.p>
        </div>

        {/* Service Cards - Staggered Layout */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ParallaxLayer
              key={service.title}
              parallax={parallax}
              depth={1 + index * 0.2}
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 + index * 0.15 }}
                style={{ marginTop: index === 1 ? '2rem' : 0 }}
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
                  whileHover={{ scale: 1.03, y: -10 }}
                  className="group cursor-pointer"
                >
                  {/* Card shadow */}
                  <div className="absolute inset-0 bg-background/20 rounded-3xl blur-2xl translate-y-6 scale-95 group-hover:bg-secondary/20 transition-colors" />
                  
                  {/* Main card */}
                  <div className="relative bg-primary-foreground/[0.08] backdrop-blur-xl rounded-3xl p-8 border border-primary-foreground/10 group-hover:border-secondary/30 transition-all duration-500 overflow-hidden">
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl group-hover:shadow-secondary/20 transition-shadow`}
                    >
                      <service.icon className="h-8 w-8 text-primary-foreground" />
                    </motion.div>

                    <h3 className="font-serif text-2xl font-bold text-primary-foreground mb-2 group-hover:text-secondary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-primary-foreground/70 mb-6">
                      {service.description}
                    </p>

                    {/* Learn more link */}
                    <div className="flex items-center gap-2 text-secondary font-medium">
                      <span>Learn More</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                    </div>

                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden rounded-bl-[100px]">
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-20`} />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </ParallaxLayer>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <p className="text-primary-foreground/60 text-sm mb-4">
            Not sure which path is right for you?
          </p>
          <motion.a
            href="#comparison"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 transition-all"
          >
            Compare All Services
            <ArrowRight className="h-5 w-5" />
          </motion.a>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  );
};

export default ServicesHero;
