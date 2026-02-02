import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ClipboardCheck, CheckCircle2, Target, TrendingUp, Award } from "lucide-react";
import TextReveal from "@/components/TextReveal";
import { useMouseParallax, ParallaxLayer } from "@/hooks/useMouseParallax";

interface ChecklistHeroProps {
  isLoggedIn?: boolean;
  hasLastSaved?: boolean;
}

const ChecklistHero = ({ isLoggedIn, hasLastSaved }: ChecklistHeroProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const parallax = useMouseParallax(containerRef, { sensitivity: 0.02, maxMovement: 25 });

  return (
    <section ref={containerRef} className="relative min-h-[75vh] overflow-hidden flex items-center">
      {/* Light gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-muted/50 to-secondary/8" />
      
      {/* Animated concentric circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px]">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full border border-primary/10"
            style={{
              width: `${i * 25}%`,
              height: `${i * 25}%`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}
      </div>

      {/* Floating gradient blobs with parallax */}
      <ParallaxLayer parallax={parallax} depth={0.6} className="absolute top-20 right-[15%]">
        <motion.div
          className="w-80 h-80 rounded-full bg-primary/15 blur-[100px]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>
      <ParallaxLayer parallax={parallax} depth={0.8} className="absolute bottom-20 left-[10%]">
        <motion.div
          className="w-72 h-72 rounded-full bg-secondary/20 blur-[80px]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>

      {/* Floating checkmarks with parallax */}
      {[
        { top: "20%", left: "8%", delay: 0, depth: 1.2 },
        { top: "35%", right: "12%", delay: 0.5, depth: 1.4 },
        { bottom: "30%", left: "15%", delay: 1, depth: 1.0 },
        { top: "55%", right: "8%", delay: 1.5, depth: 1.3 },
      ].map((pos, i) => (
        <ParallaxLayer 
          key={i} 
          parallax={parallax} 
          depth={pos.depth}
          className="absolute hidden lg:block"
          style={{ top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom } as React.CSSProperties}
        >
          <motion.div
            className="flex w-10 h-10 rounded-full bg-primary/10 border border-primary/20 items-center justify-center"
            animate={{ 
              y: [0, -10, 0], 
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: pos.delay }}
          >
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </motion.div>
        </ParallaxLayer>
      ))}

      {/* Dot grid pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--primary) / 0.15) 1.5px, transparent 1.5px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="container-narrow relative py-24 pt-32">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-3 rounded-full bg-primary/10 backdrop-blur-sm px-5 py-2.5 border border-primary/25"
            >
              <ClipboardCheck className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Free Assessment
              </span>
            </motion.div>

            <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              <TextReveal delay={0.2}>
                The Ultimate Leadership
              </TextReveal>
              <span className="block mt-2 text-primary">
                <TextReveal delay={0.4}>
                  Skills Checklist
                </TextReveal>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg text-muted-foreground leading-relaxed sm:text-xl max-w-xl"
            >
              Honestly assess your current leadership strengths and areas for development. 
              Check each box where you feel confident, then view your score.
            </motion.p>

            {!isLoggedIn && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 text-sm text-muted-foreground"
              >
                <Link to="/admin/login" className="text-primary hover:underline font-medium">Sign in</Link> to save your progress and track improvements over time.
              </motion.p>
            )}

            {hasLastSaved && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-2 text-sm text-muted-foreground"
              >
                ✓ Progress loaded from your previous session.
              </motion.p>
            )}
          </div>

          {/* Score levels preview with parallax */}
          <ParallaxLayer parallax={parallax} depth={0.4} className="lg:col-span-2 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="relative">
                {/* Glow backdrop */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl scale-105" />
                
                <div className="relative bg-card/95 backdrop-blur-xl rounded-3xl border border-border/50 p-6 shadow-2xl">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">
                    Score Levels
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { icon: Award, label: "Leadership Master", range: "16-20", color: "score-master" },
                      { icon: TrendingUp, label: "Emerging Leader", range: "11-15", color: "score-emerging" },
                      { icon: Target, label: "Aspiring Leader", range: "0-10", color: "score-aspiring" },
                    ].map((level, index) => (
                      <motion.div
                        key={level.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                        className={`flex items-center gap-4 p-4 rounded-xl bg-${level.color}-bg border border-${level.color}-border`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${level.color}/20`}>
                          <level.icon className={`h-5 w-5 text-${level.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className={`font-semibold text-${level.color}-foreground`}>{level.label}</div>
                          <div className={`text-sm text-${level.color}`}>{level.range} checks</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </ParallaxLayer>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default ChecklistHero;
