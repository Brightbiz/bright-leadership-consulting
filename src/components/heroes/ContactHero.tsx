import { useRef } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import TextReveal from "@/components/TextReveal";
import { useMouseParallax, ParallaxLayer } from "@/hooks/useMouseParallax";

const ContactHero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const parallax = useMouseParallax(containerRef, { sensitivity: 0.02, maxMovement: 30 });

  const contactMethods = [
    { icon: Phone, label: "Call Us", value: "0333 335 5045" },
    { icon: Mail, label: "Email", value: "hello@bbsconsulting.co.uk" },
    { icon: Clock, label: "Hours", value: "Mon-Fri 9am-6pm" },
  ];

  return (
    <section ref={containerRef} className="relative min-h-[85vh] overflow-hidden flex items-center">
      {/* Gradient background with warm tones */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background to-primary/5" />
      
      {/* Animated wave patterns */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-30"
        animate={{
          background: [
            "radial-gradient(ellipse 120% 60% at 0% 100%, hsl(var(--secondary) / 0.3) 0%, transparent 50%)",
            "radial-gradient(ellipse 120% 60% at 50% 100%, hsl(var(--secondary) / 0.25) 0%, transparent 50%)",
            "radial-gradient(ellipse 120% 60% at 100% 100%, hsl(var(--secondary) / 0.3) 0%, transparent 50%)",
            "radial-gradient(ellipse 120% 60% at 0% 100%, hsl(var(--secondary) / 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Decorative envelope lines pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.04]">
        <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M0,50 Q25,30 50,50 T100,50"
            stroke="currentColor"
            strokeWidth="0.3"
            fill="none"
            className="text-primary"
            animate={{ d: [
              "M0,50 Q25,30 50,50 T100,50",
              "M0,50 Q25,70 50,50 T100,50",
              "M0,50 Q25,30 50,50 T100,50",
            ]}}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,30 Q25,10 50,30 T100,30"
            stroke="currentColor"
            strokeWidth="0.2"
            fill="none"
            className="text-secondary"
            animate={{ d: [
              "M0,30 Q25,10 50,30 T100,30",
              "M0,30 Q25,50 50,30 T100,30",
              "M0,30 Q25,10 50,30 T100,30",
            ]}}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,70 Q25,90 50,70 T100,70"
            stroke="currentColor"
            strokeWidth="0.2"
            fill="none"
            className="text-primary"
            animate={{ d: [
              "M0,70 Q25,90 50,70 T100,70",
              "M0,70 Q25,50 50,70 T100,70",
              "M0,70 Q25,90 50,70 T100,70",
            ]}}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Floating gradient orbs */}
      <ParallaxLayer parallax={parallax} depth={0.6} className="absolute top-20 right-[10%]">
        <motion.div
          className="w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>
      <ParallaxLayer parallax={parallax} depth={0.8} className="absolute -bottom-20 left-[5%]">
        <motion.div
          className="w-[400px] h-[400px] rounded-full bg-secondary/15 blur-[100px]"
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>

      {/* Floating contact icons with parallax */}
      <ParallaxLayer parallax={parallax} depth={1.4} className="absolute top-32 left-[8%] hidden lg:block">
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-14 h-14 rounded-2xl bg-secondary/20 backdrop-blur-sm border border-secondary/30 flex items-center justify-center shadow-lg">
            <Mail className="h-6 w-6 text-secondary" />
          </div>
        </motion.div>
      </ParallaxLayer>
      <ParallaxLayer parallax={parallax} depth={1.2} className="absolute bottom-40 right-[12%] hidden lg:block">
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-12 h-12 rounded-xl bg-primary/15 backdrop-blur-sm border border-primary/20 flex items-center justify-center shadow-lg">
            <Phone className="h-5 w-5 text-primary" />
          </div>
        </motion.div>
      </ParallaxLayer>
      <ParallaxLayer parallax={parallax} depth={1.6} className="absolute top-[55%] left-[15%] hidden lg:block">
        <motion.div
          animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="w-10 h-10 rounded-full bg-secondary/25 flex items-center justify-center">
            <MessageCircle className="h-4 w-4 text-secondary" />
          </div>
        </motion.div>
      </ParallaxLayer>

      {/* Floating send icon animation */}
      <ParallaxLayer parallax={parallax} depth={2} className="absolute top-[30%] right-[25%] hidden lg:block">
        <motion.div
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Send className="h-8 w-8 text-primary/40" />
        </motion.div>
      </ParallaxLayer>

      {/* Content */}
      <div className="container-narrow relative py-24 pt-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-3 rounded-full bg-primary/10 backdrop-blur-sm px-5 py-2.5 border border-primary/20"
            >
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Let's Start a Conversation
              </span>
            </motion.div>

            <h1 className="mb-6 font-serif text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
              <TextReveal delay={0.1}>
                Get in Touch
              </TextReveal>
              <span className="block mt-2 text-primary">
                <TextReveal delay={0.3}>
                  With Our Team
                </TextReveal>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10"
            >
              Ready to transform your leadership journey? We'd love to hear from you. 
              Reach out for a complimentary consultation and discover how we can help 
              you achieve your goals.
            </motion.p>

            {/* Quick contact methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="space-y-4"
            >
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <method.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block">{method.label}</span>
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {method.value}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Decorative card with map pin */}
          <div className="relative hidden lg:block">
            <ParallaxLayer parallax={parallax} depth={0.4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* Glowing backdrop */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl scale-110" />
                
                <div className="relative bg-card/90 backdrop-blur-xl rounded-3xl border border-border p-8 shadow-2xl">
                  {/* Map pin decoration */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
                    >
                      <MapPin className="h-6 w-6 text-primary-foreground" />
                    </motion.div>
                  </div>

                  <div className="pt-6 text-center">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                      Our Location
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      United Kingdom
                    </p>

                    {/* Response time indicator */}
                    <div className="bg-muted/50 rounded-2xl p-6 mb-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-3 h-3 rounded-full bg-green-500"
                        />
                        <span className="text-sm font-medium text-foreground">Online Now</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Average response time: <span className="font-semibold text-foreground">2 hours</span>
                      </p>
                    </div>

                    {/* Social proof */}
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <div className="text-center">
                        <div className="font-serif text-2xl font-bold text-foreground">500+</div>
                        <div>Consultations</div>
                      </div>
                      <div className="w-px h-10 bg-border" />
                      <div className="text-center">
                        <div className="font-serif text-2xl font-bold text-foreground">98%</div>
                        <div>Satisfaction</div>
                      </div>
                    </div>
                  </div>
                </div>
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

export default ContactHero;
