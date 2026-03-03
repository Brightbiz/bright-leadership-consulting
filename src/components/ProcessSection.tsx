import { Layers } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import teamImage from "@/assets/team-collaboration.jpg";
import TiltCard from "./TiltCard";
import TextReveal from "./TextReveal";

const steps = [
  {
    number: "01",
    title: "Discovery & Scoping",
    description: "We begin with a confidential conversation to understand the governance context, organisational complexity, and strategic objectives.",
  },
  {
    number: "02",
    title: "Diagnostic & Assessment",
    description: "Structured assessment across critical dimensions — identifying where executive alignment creates or constrains organisational performance.",
  },
  {
    number: "03",
    title: "Board-Ready Reporting",
    description: "A concise, data-led report with actionable recommendations — designed for executive teams and governance committees.",
  },
  {
    number: "04",
    title: "Advisory & Implementation",
    description: "Ongoing strategic advisory to support execution, recalibration, and sustained leadership capability development.",
  },
];

const ProcessSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.2, 0.8], ["0%", "100%"]);

  return (
    <section id="about" className="section-padding relative overflow-hidden bg-gradient-to-br from-secondary/[0.08] via-secondary/[0.05] to-secondary/[0.02]">
      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/3 right-0 w-80 h-80 bg-secondary/[0.1] rounded-full blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 left-0 w-64 h-64 bg-primary/[0.08] rounded-full blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="container-narrow relative" ref={containerRef}>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <TiltCard maxTilt={5} glareEnabled>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-primary/10">
                <img
                  src={teamImage}
                  alt="Executive advisory engagement"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
              </div>
            </TiltCard>
            
            {/* Floating accent card */}
            <motion.div
              className="absolute -bottom-6 -right-6 lg:-right-10 rounded-2xl bg-gradient-to-br from-secondary to-secondary/90 p-6 shadow-xl shadow-secondary/30"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring" }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="font-serif text-3xl font-bold text-secondary-foreground">15+</div>
              <div className="text-sm font-medium text-secondary-foreground/80">Years of Experience</div>
            </motion.div>
            
            {/* Additional floating element */}
            <motion.div
              className="absolute -top-4 -left-4 lg:-left-8 rounded-xl bg-white dark:bg-card p-4 shadow-lg border border-border/50"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring" }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">Board-Ready</div>
                  <div className="text-xs text-muted-foreground">Governance Reporting</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-secondary/15 to-primary/15 px-5 py-2.5 border border-secondary/20">
              <Layers className="h-4 w-4 text-secondary" />
              <span className="text-sm font-bold text-secondary uppercase tracking-wider">
                How We Work
              </span>
            </div>
            
            <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
              <TextReveal>Our Advisory Engagement</TextReveal>
            </h2>
            <p className="mb-10 text-lg text-muted-foreground leading-relaxed">
              A structured yet flexible approach — calibrated to organisational 
              complexity, governance requirements, and strategic context.
            </p>

            <div className="relative space-y-6">
              {/* Animated progress line */}
              <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-border">
                <motion.div
                  className="w-full bg-gradient-to-b from-primary via-secondary to-primary"
                  style={{ height: lineHeight }}
                />
              </div>

              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  className="flex gap-5 group"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <div className="relative flex flex-col items-center z-10">
                    <motion.div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 font-serif text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20"
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {step.number}
                    </motion.div>
                  </div>
                  <div className="pb-6">
                    <h3 className="mb-2 font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;