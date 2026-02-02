import { motion } from "framer-motion";
import { Building, Users, Globe, Sparkles } from "lucide-react";
import TextReveal from "@/components/TextReveal";

const AboutHero = () => {
  return (
    <section className="relative min-h-[85vh] overflow-hidden flex items-center">
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-primary/10 to-background" />
      
      {/* Animated diagonal stripes */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              hsl(var(--primary)) 20px,
              hsl(var(--primary)) 21px
            )`,
          }}
        />
      </div>

      {/* Large floating shapes */}
      <motion.div
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-secondary/15 blur-[150px]"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]"
        animate={{
          scale: [1, 1.15, 1],
          x: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Floating geometric accents */}
      <motion.div
        className="absolute top-32 right-[20%] w-20 h-20 border-2 border-secondary/30 rounded-2xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-40 left-[15%] w-16 h-16 bg-primary/10 rounded-full"
        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-48 left-[10%] w-3 h-3 bg-secondary rounded-full"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="container-narrow relative py-24 pt-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-3 rounded-full bg-secondary/15 backdrop-blur-sm px-5 py-2.5 border border-secondary/30"
            >
              <Building className="h-4 w-4 text-secondary" />
              <span className="text-sm font-semibold text-secondary">
                About BBS Consulting Group
              </span>
            </motion.div>

            <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              <TextReveal delay={0.2}>
                Transforming Leaders,
              </TextReveal>
              <span className="block mt-2 text-primary">
                <TextReveal delay={0.4}>
                  Shaping Futures
                </TextReveal>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg text-muted-foreground leading-relaxed sm:text-xl"
            >
              For over a decade, we've been at the forefront of executive leadership development, 
              empowering leaders to achieve extraordinary results and drive meaningful organizational change.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-10 flex gap-8"
            >
              {[
                { icon: Users, value: "5,000+", label: "Leaders Trained" },
                { icon: Globe, value: "25+", label: "Countries" },
              ].map((stat, index) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-serif text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main decorative card */}
            <div className="relative">
              {/* Glowing backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-3xl blur-2xl scale-110" />
              
              <div className="relative bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-10 shadow-2xl">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 mb-6"
                  >
                    <Sparkles className="h-12 w-12 text-secondary" />
                  </motion.div>
                  <div className="font-serif text-7xl font-bold text-gradient mb-4">10+</div>
                  <div className="text-xl text-muted-foreground">Years of Excellence</div>
                  <div className="mt-6 pt-6 border-t border-border">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                      Est. 2014
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full">
          <path
            d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
            className="fill-muted/30"
          />
        </svg>
      </div>
    </section>
  );
};

export default AboutHero;
