import { useRef } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Clock, Zap, ArrowUpRight } from "lucide-react";
import TextReveal from "@/components/TextReveal";
import { useMouseParallax, ParallaxLayer } from "@/hooks/useMouseParallax";

const ContactHero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const parallax = useMouseParallax(containerRef, { sensitivity: 0.02, maxMovement: 25 });

  const contactCards = [
    { icon: Phone, label: "Call Us", value: "0333 335 5045", color: "bg-primary" },
    { icon: Mail, label: "Email", value: "hello@bbsconsulting.co.uk", color: "bg-secondary" },
    { icon: Clock, label: "Response", value: "Within 2 hours", color: "bg-emerald-500" },
  ];

  return (
    <section ref={containerRef} className="relative min-h-[90vh] overflow-hidden flex items-center">
      {/* Vibrant gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary/80" />
      
      {/* Animated mesh gradient overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse 80% 50% at 20% 40%, hsl(var(--secondary) / 0.4) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 50% at 80% 60%, hsl(var(--secondary) / 0.4) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 50% at 40% 80%, hsl(var(--secondary) / 0.4) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 50% at 20% 40%, hsl(var(--secondary) / 0.4) 0%, transparent 60%)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Geometric shapes */}
      <ParallaxLayer parallax={parallax} depth={0.5} className="absolute top-[10%] left-[5%]">
        <motion.div
          className="w-64 h-64 border-2 border-background/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
      </ParallaxLayer>
      <ParallaxLayer parallax={parallax} depth={0.7} className="absolute bottom-[15%] right-[10%]">
        <motion.div
          className="w-48 h-48 border border-background/15 rounded-3xl"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </ParallaxLayer>
      <ParallaxLayer parallax={parallax} depth={0.9} className="absolute top-[30%] right-[25%]">
        <motion.div
          className="w-32 h-32 bg-background/5 backdrop-blur-sm rounded-2xl"
          animate={{ rotate: 180, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>

      {/* Floating connection nodes */}
      <ParallaxLayer parallax={parallax} depth={1.3} className="absolute top-[20%] right-[15%] hidden lg:block">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative"
        >
          <motion.div
            className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Zap className="h-7 w-7 text-primary" />
          </motion.div>
          {/* Connection lines */}
          <svg className="absolute -left-20 -top-12 w-40 h-32 pointer-events-none">
            <motion.path
              d="M 80 60 Q 40 30 10 50"
              stroke="hsl(var(--background) / 0.3)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5 5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1 }}
            />
          </svg>
        </motion.div>
      </ParallaxLayer>

      <ParallaxLayer parallax={parallax} depth={1.1} className="absolute bottom-[35%] left-[8%] hidden lg:block">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <motion.div
            className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shadow-xl"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Mail className="h-5 w-5 text-secondary-foreground" />
          </motion.div>
        </motion.div>
      </ParallaxLayer>

      {/* Content */}
      <div className="container-narrow relative py-24 pt-32 z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-3 rounded-full bg-background/10 backdrop-blur-sm px-5 py-2.5 border border-background/20"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full bg-emerald-400"
              />
              <span className="text-sm font-semibold text-background">
                Available for consultation
              </span>
            </motion.div>

            <h1 className="mb-6 font-serif text-4xl font-bold leading-[1.1] text-background sm:text-5xl lg:text-6xl">
              <TextReveal delay={0.1}>
                Let's Create
              </TextReveal>
              <span className="block text-secondary-foreground">
                <TextReveal delay={0.3}>
                  Something
                </TextReveal>
              </span>
              <TextReveal delay={0.5}>
                Extraordinary
              </TextReveal>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-lg text-background/80 leading-relaxed max-w-md mb-10"
            >
              Ready to transform your leadership potential? Start a conversation 
              and discover how we can accelerate your growth.
            </motion.p>

            {/* Quick action button */}
            <motion.a
              href="#contact-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-background text-primary font-semibold hover:bg-background/90 transition-colors group shadow-xl"
            >
              <span>Start a Conversation</span>
              <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.a>
          </div>

          {/* Right: Contact cards stack */}
          <div className="relative hidden lg:block">
            <div className="relative h-[400px]">
              {contactCards.map((card, index) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 60, rotate: (index - 1) * 8 }}
                  animate={{ opacity: 1, y: 0, rotate: (index - 1) * 8 }}
                  transition={{ duration: 0.7, delay: 0.5 + index * 0.15 }}
                  className="absolute w-full max-w-sm"
                  style={{
                    top: `${index * 30}px`,
                    left: `${index * 20}px`,
                    zIndex: contactCards.length - index,
                  }}
                >
                  <ParallaxLayer parallax={parallax} depth={0.4 + index * 0.2}>
                    <motion.div
                      whileHover={{ y: -5, rotate: 0, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="bg-background/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-background/50 cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl ${card.color} flex items-center justify-center shadow-lg`}>
                          <card.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <span className="text-sm text-muted-foreground block mb-1">{card.label}</span>
                          <span className="font-semibold text-foreground text-lg">{card.value}</span>
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </motion.div>
                  </ParallaxLayer>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile contact cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:hidden"
        >
          {contactCards.map((card, index) => (
            <div 
              key={card.label}
              className="bg-background/20 backdrop-blur-sm rounded-xl p-4 border border-background/20"
            >
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs text-background/60 block">{card.label}</span>
              <span className="font-medium text-background text-sm">{card.value}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" 
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default ContactHero;
