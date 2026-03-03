import { forwardRef } from "react";
import { ArrowRight, Shield } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedGradient from "./AnimatedGradient";
import TextReveal from "./TextReveal";
import MagneticButton from "./MagneticButton";

const CTASection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative overflow-hidden rounded-3xl">
            {/* Animated gradient background */}
            <AnimatedGradient className="rounded-3xl" />
            
            {/* Content */}
            <div className="relative p-10 lg:p-16">
              <div className="mx-auto max-w-3xl text-center">
                <motion.div 
                  className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-5 py-2.5 border border-white/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Shield className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                    Enquire Confidentially
                  </span>
                </motion.div>
                
                <h2 className="mb-6 font-serif text-3xl font-semibold text-primary-foreground sm:text-4xl lg:text-5xl text-balance">
                  <TextReveal delay={0.3}>
                    The Right Conversation Starts Here
                  </TextReveal>
                </h2>
                
                <motion.p 
                  className="mb-10 text-lg text-primary-foreground/80 lg:text-xl leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  Whether you're navigating a leadership transition, preparing for growth, 
                  or strengthening executive alignment — we'd welcome a conversation about 
                  how we can help.
                </motion.p>
                
                <motion.div 
                  className="flex flex-wrap justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <MagneticButton variant="hero" size="xl" className="group shadow-xl shadow-secondary/30" href="https://calendly.com/bbs-consulting/30min" target="_blank" rel="noopener noreferrer">
                    Schedule a Conversation
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </MagneticButton>
                  <MagneticButton variant="heroOutline" size="xl" href="/contact">
                    Contact Us Directly
                  </MagneticButton>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

CTASection.displayName = "CTASection";

export default CTASection;