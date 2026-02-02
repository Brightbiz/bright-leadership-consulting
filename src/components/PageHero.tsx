import { Badge } from "@/components/ui/badge";
import AnimatedSection from "@/components/AnimatedSection";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
  background: string;
  blob1: string;
  blob2: string;
  pattern?: string;
}> = {
  default: {
    background: "bg-gradient-to-br from-primary/5 via-transparent to-secondary/5",
    blob1: "top-20 right-20 w-72 h-72 bg-primary/10",
    blob2: "bottom-10 left-10 w-64 h-64 bg-secondary/10",
  },
  about: {
    background: "bg-gradient-to-tr from-secondary/8 via-transparent to-primary/8",
    blob1: "top-10 left-1/4 w-80 h-80 bg-secondary/15",
    blob2: "-bottom-20 right-10 w-96 h-96 bg-primary/10",
    pattern: "bg-[radial-gradient(circle_at_30%_70%,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[length:24px_24px]",
  },
  courses: {
    background: "bg-gradient-to-br from-primary/10 via-background to-secondary/5",
    blob1: "top-20 right-0 w-96 h-96 bg-secondary/10",
    blob2: "bottom-0 left-0 w-80 h-80 bg-primary/10",
  },
  checklist: {
    background: "bg-gradient-to-bl from-primary/8 via-muted/30 to-secondary/8",
    blob1: "-top-10 right-1/3 w-64 h-64 bg-primary/12",
    blob2: "bottom-0 left-20 w-72 h-72 bg-secondary/12",
    pattern: "bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:40px_40px]",
  },
  error: {
    background: "bg-gradient-to-b from-muted/50 via-background to-background",
    blob1: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5",
    blob2: "hidden",
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
    <section className="relative pt-32 pb-16 overflow-hidden">
      <div className={cn("absolute inset-0", styles.background)} />
      {styles.pattern && (
        <div className={cn("absolute inset-0 opacity-50", styles.pattern)} />
      )}
      <div className={cn("absolute rounded-full blur-3xl", styles.blob1)} />
      <div className={cn("absolute rounded-full blur-3xl", styles.blob2)} />

      <div className="container-narrow relative">
        <AnimatedSection className="text-center max-w-3xl mx-auto">
          {badge && (
            <Badge
              variant="outline"
              className="mb-6 border-primary/30 bg-primary/5 inline-flex items-center gap-2"
            >
              {BadgeIcon && <BadgeIcon className="h-4 w-4" />}
              {badge}
            </Badge>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {title}
            {titleHighlight && (
              <>
                {" "}
                <span className="text-gradient">{titleHighlight}</span>
              </>
            )}
          </h1>
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
          {children}
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PageHero;
