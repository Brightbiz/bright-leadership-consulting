import { Badge } from "@/components/ui/badge";
import AnimatedSection from "@/components/AnimatedSection";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type HeroVariant = "default" | "about" | "courses" | "checklist" | "error";

interface PageHeroProps {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: string;
  titleHighlight?: string;
  description?: string;
  variant?: HeroVariant;
  children?: React.ReactNode;
}

const variantStyles: Record<HeroVariant, {
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  accentColor: string;
  blob1Class: string;
  blob2Class: string;
  blob3Class: string;
  patternOpacity: string;
  badgeGradient: string;
}> = {
  default: {
    gradientFrom: "from-primary/8",
    gradientVia: "via-background",
    gradientTo: "to-secondary/8",
    accentColor: "primary",
    blob1Class: "top-10 right-[15%] w-80 h-80 bg-primary/15",
    blob2Class: "bottom-0 left-[10%] w-72 h-72 bg-secondary/12",
    blob3Class: "-top-20 left-[40%] w-64 h-64 bg-accent/20",
    patternOpacity: "opacity-30",
    badgeGradient: "from-primary/15 to-secondary/15 border-primary/25",
  },
  about: {
    gradientFrom: "from-secondary/10",
    gradientVia: "via-background",
    gradientTo: "to-primary/10",
    accentColor: "secondary",
    blob1Class: "top-0 left-[20%] w-96 h-96 bg-secondary/20",
    blob2Class: "-bottom-10 right-[15%] w-80 h-80 bg-primary/15",
    blob3Class: "top-[30%] right-[5%] w-48 h-48 bg-secondary/25",
    patternOpacity: "opacity-40",
    badgeGradient: "from-secondary/20 to-primary/15 border-secondary/30",
  },
  courses: {
    gradientFrom: "from-primary/12",
    gradientVia: "via-muted/30",
    gradientTo: "to-secondary/10",
    accentColor: "primary",
    blob1Class: "top-5 right-0 w-[500px] h-[500px] bg-secondary/15",
    blob2Class: "bottom-0 -left-20 w-96 h-96 bg-primary/12",
    blob3Class: "top-[20%] left-[30%] w-40 h-40 bg-accent/30",
    patternOpacity: "opacity-25",
    badgeGradient: "from-secondary/15 to-primary/15 border-secondary/25",
  },
  checklist: {
    gradientFrom: "from-primary/10",
    gradientVia: "via-muted/40",
    gradientTo: "to-secondary/10",
    accentColor: "primary",
    blob1Class: "-top-10 right-[30%] w-72 h-72 bg-primary/18",
    blob2Class: "bottom-5 left-[15%] w-80 h-80 bg-secondary/15",
    blob3Class: "top-[40%] right-[10%] w-56 h-56 bg-accent/20",
    patternOpacity: "opacity-35",
    badgeGradient: "from-primary/15 to-accent/20 border-primary/25",
  },
  error: {
    gradientFrom: "from-muted/50",
    gradientVia: "via-background",
    gradientTo: "to-muted/30",
    accentColor: "muted-foreground",
    blob1Class: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/8",
    blob2Class: "top-[20%] right-[20%] w-48 h-48 bg-secondary/10",
    blob3Class: "bottom-[20%] left-[20%] w-40 h-40 bg-muted/50",
    patternOpacity: "opacity-20",
    badgeGradient: "from-muted to-muted/80 border-border",
  },
};

const PageHero = ({
  badge,
  badgeIcon: BadgeIcon,
  title,
  titleHighlight,
  description,
  variant = "default",
  children,
}: PageHeroProps) => {
  const styles = variantStyles[variant];

  return (
    <section className="relative pt-32 pb-20 md:pb-24 overflow-hidden">
      {/* Base gradient background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br",
        styles.gradientFrom,
        styles.gradientVia,
        styles.gradientTo
      )} />

      {/* Animated decorative pattern */}
      <div className={cn(
        "absolute inset-0",
        styles.patternOpacity
      )}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,hsl(var(--primary)/0.06)_1px,transparent_1px)] bg-[length:32px_32px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,hsl(var(--secondary)/0.04)_1px,transparent_1px)] bg-[length:48px_48px]" />
      </div>

      {/* Animated floating blobs */}
      <motion.div
        className={cn("absolute rounded-full blur-3xl", styles.blob1Class)}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={cn("absolute rounded-full blur-3xl", styles.blob2Class)}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className={cn("absolute rounded-full blur-2xl", styles.blob3Class)}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />

      {/* Decorative line accents */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container-narrow relative">
        <AnimatedSection className="text-center max-w-3xl mx-auto">
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="outline"
                className={cn(
                  "mb-6 px-4 py-2 text-sm font-medium",
                  "bg-gradient-to-r backdrop-blur-sm",
                  "inline-flex items-center gap-2",
                  "shadow-sm",
                  styles.badgeGradient
                )}
              >
                {BadgeIcon && <BadgeIcon className="h-4 w-4" />}
                {badge}
              </Badge>
            </motion.div>
          )}
          
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-foreground">{title}</span>
            {titleHighlight && (
              <>
                {" "}
                <span className="relative">
                  <span className="text-primary">{titleHighlight}</span>
                  {/* Decorative underline */}
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-secondary/80 to-primary/60 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </span>
              </>
            )}
          </motion.h1>

          {description && (
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {description}
            </motion.p>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatedSection>
      </div>

      {/* Bottom decorative gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default PageHero;
