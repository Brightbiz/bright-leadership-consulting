import { useRef } from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, GraduationCap, Play, Users, Clock, Sparkles } from "lucide-react";
import TextReveal from "@/components/TextReveal";
import { useMouseParallax, ParallaxLayer } from "@/hooks/useMouseParallax";
import cpdBadge from "@/assets/cpd-badge.png";

const CoursesHero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const parallax = useMouseParallax(containerRef, { sensitivity: 0.02, maxMovement: 30 });

  const floatingCourses = [
    { title: "Strategic Leadership", icon: Award, color: "from-secondary to-secondary/70", delay: 0 },
    { title: "Team Dynamics", icon: Users, color: "from-primary to-primary/70", delay: 0.2 },
    { title: "Executive Presence", icon: Sparkles, color: "from-accent to-accent/70", delay: 0.4 },
  ];

  return (
    <section ref={containerRef} className="relative min-h-[90vh] overflow-hidden flex items-center">
      {/* Dark sophisticated background using design tokens */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />
      
      {/* Animated spotlight effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse 80% 50% at 20% 40%, hsl(var(--secondary) / 0.2) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 50% at 80% 60%, hsl(var(--secondary) / 0.15) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 50% at 50% 30%, hsl(var(--secondary) / 0.2) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 50% at 20% 40%, hsl(var(--secondary) / 0.2) 0%, transparent 60%)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Animated gradient orbs */}
      <ParallaxLayer parallax={parallax} depth={0.5} className="absolute -top-40 -right-40">
        <motion.div
          className="w-[600px] h-[600px] rounded-full bg-secondary/20 blur-[120px]"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>
      <ParallaxLayer parallax={parallax} depth={0.7} className="absolute -bottom-40 -left-40">
        <motion.div
          className="w-[500px] h-[500px] rounded-full bg-primary-foreground/10 blur-[100px]"
          animate={{ scale: [1.1, 1, 1.1], rotate: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>

      {/* Dot matrix pattern */}
      <div 
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `radial-gradient(circle at center, hsl(var(--primary-foreground) / 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Diagonal lines accent */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 60px,
            hsl(var(--secondary) / 0.5) 60px,
            hsl(var(--secondary) / 0.5) 61px
          )`,
        }}
      />

      {/* Content */}
      <div className="container-narrow relative py-24 pt-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Text content */}
          <div className="text-left">
            {/* CPD Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-3"
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full bg-secondary/50 blur-lg"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <img src={cpdBadge} alt="CPD Accredited" className="relative h-14 w-14 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                  Officially Accredited
                </span>
                <span className="text-sm text-primary-foreground/70">
                  CPD Certified Programs
                </span>
              </div>
            </motion.div>

            <h1 className="mb-6 font-serif text-4xl font-bold leading-[1.1] text-primary-foreground sm:text-5xl lg:text-6xl">
              <TextReveal delay={0.1}>
                Master the Art of
              </TextReveal>
              <span className="block mt-2 relative text-secondary">
                <TextReveal delay={0.3}>
                  Modern Leadership
                </TextReveal>
                <motion.span
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-secondary to-transparent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg text-primary-foreground/80 leading-relaxed max-w-xl mb-10"
            >
              Advance your career with our comprehensive suite of accredited courses. 
              Learn at your own pace from world-class instructors and join thousands of 
              successful leaders.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-8 mb-10"
            >
              {[
                { value: "7+", label: "Courses" },
                { value: "2,500+", label: "Graduates" },
                { value: "4.9", label: "Rating" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-primary-foreground">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/60">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-wrap gap-4"
            >
              <motion.a
                href="#courses"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 transition-shadow"
              >
                <BookOpen className="h-5 w-5" />
                Browse Courses
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-primary-foreground/5 text-primary-foreground border border-primary-foreground/10 hover:bg-primary-foreground/10 hover:border-primary-foreground/20 transition-colors"
              >
                <Play className="h-5 w-5" />
                Watch Preview
              </motion.button>
            </motion.div>
          </div>

          {/* Right: Floating course cards in 3D perspective */}
          <div className="relative hidden lg:flex items-center justify-center min-h-[500px]">
            {/* Glowing center orb */}
            <motion.div
              className="absolute w-40 h-40 rounded-full bg-secondary/30 blur-[60px]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Floating course cards with 3D isometric effect */}
            {floatingCourses.map((course, index) => (
              <ParallaxLayer 
                key={course.title}
                parallax={parallax} 
                depth={1.2 + index * 0.3}
                className="absolute"
                style={{
                  top: `${15 + index * 28}%`,
                  left: index === 1 ? '55%' : index === 0 ? '10%' : '25%',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30, rotateY: -15 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 + course.delay }}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
                    className="relative group cursor-pointer"
                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                  >
                    {/* Card shadow */}
                    <div className="absolute inset-0 bg-background/30 rounded-2xl blur-xl translate-y-4 scale-95" />
                    
                    {/* Main card */}
                    <div 
                      className="relative bg-background/90 backdrop-blur-xl rounded-2xl p-5 border border-border shadow-2xl group-hover:border-primary/30 transition-colors"
                      style={{ transform: 'rotateX(5deg) rotateY(-5deg)' }}
                    >
                      {/* Gradient accent bar */}
                      <div className={`absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r ${course.color}`} />
                      
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center shadow-lg`}>
                          <course.icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-[140px]">
                          <h3 className="font-semibold text-foreground mb-1">{course.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              6 weeks
                            </span>
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              Certificate
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${course.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${60 + index * 15}%` }}
                          transition={{ duration: 1.5, delay: 1.2 + course.delay }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </ParallaxLayer>
            ))}

            {/* Additional floating elements */}
            <ParallaxLayer parallax={parallax} depth={1.8} className="absolute top-[10%] right-[10%]">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-dashed border-secondary/30 rounded-lg"
              />
            </ParallaxLayer>
            <ParallaxLayer parallax={parallax} depth={2} className="absolute bottom-[15%] left-[15%]">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-4 h-4 bg-primary-foreground/40 rounded-full blur-[2px]"
              />
            </ParallaxLayer>
            <ParallaxLayer parallax={parallax} depth={1.5} className="absolute bottom-[30%] right-[5%]">
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border border-primary-foreground/20 rotate-45"
              />
            </ParallaxLayer>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  );
};

export default CoursesHero;
