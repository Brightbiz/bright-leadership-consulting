import { Badge } from "@/components/ui/badge";
import AnimatedSection from "@/components/AnimatedSection";
import { LucideIcon } from "lucide-react";

interface PageHeroProps {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: string;
  titleHighlight?: string;
  description?: string;
  children?: React.ReactNode;
}

const PageHero = ({
  badge,
  badgeIcon: BadgeIcon,
  title,
  titleHighlight,
  description,
  children,
}: PageHeroProps) => {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

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
