import { FileText, Download, ArrowRight, Crown, BookOpen, Zap, Users, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";

const brochures = [
  {
    icon: Crown,
    title: "Executive Leadership Mastery Program",
    subtitle: "33 Modules | 80+ Hours | 66 CPD Points",
    description: "The ultimate CPD-accredited leadership program. From foundational principles to executive excellence across 4 phases.",
    accent: "secondary" as const,
    featured: true,
    url: "/brochures/executive-leadership-mastery-brochure.html",
  },
  {
    icon: BookOpen,
    title: "Advanced Leadership Skills Training",
    subtitle: "33 Modules | 33 Hours",
    description: "Comprehensive training covering everything from operational management to project management and coaching skills.",
    accent: "primary" as const,
    featured: false,
    url: "/brochures/advanced-leadership-skills-brochure.html",
  },
  {
    icon: Briefcase,
    title: "The Future of Work & Workplace Strategy",
    subtitle: "10 Modules | 10+ Hours",
    description: "Master the 10 essential drivers of change shaping the future workplace. Prepare your organisation for what's next.",
    accent: "primary" as const,
    featured: false,
    url: "/brochures/future-of-work-brochure.html",
  },
  {
    icon: Zap,
    title: "Advanced Productivity & Peak Performance Accelerator",
    subtitle: "7 Modules | 21 Hours",
    description: "Overcome barriers to effectiveness and efficiency. A firm favourite with organisations seeking maximum output and impact.",
    accent: "primary" as const,
    featured: false,
    url: "/brochures/peak-performance-brochure.html",
  },
  {
    icon: Users,
    title: "Enhanced Employability Skills Training",
    subtitle: "11 Modules | 20 Hours",
    description: "Develop the critical thinking, communication, and leadership abilities that employers value most.",
    accent: "primary" as const,
    featured: false,
    url: "/brochures/enhanced-employability-skills-brochure.html",
  },
];

const Brochures = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 pt-32 pb-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3" />
        <div className="container-narrow relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-5 py-2.5">
              <FileText className="h-4 w-4 text-secondary" />
              <span className="text-sm font-semibold text-secondary">Course Brochures</span>
            </div>
            <h1 className="mb-6 font-serif text-4xl font-semibold text-primary-foreground sm:text-5xl lg:text-6xl">
              Download Our <span className="text-secondary">Programme Brochures</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80">
              Explore detailed course information, module breakdowns, and learning outcomes for each of our professional development programmes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brochure Cards */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {brochures.map((brochure, index) => (
              <AnimatedSection key={brochure.title} delay={index * 100}>
                <div
                  className={`group relative h-full overflow-hidden rounded-2xl p-6 flex flex-col transition-all duration-500 hover:-translate-y-1 ${
                    brochure.featured
                      ? "bg-gradient-to-br from-secondary/10 to-primary/10 border-2 border-secondary/30 shadow-lg"
                      : "bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl"
                  }`}
                >
                  {brochure.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
                        <Crown className="h-3 w-3" /> Flagship
                      </span>
                    </div>
                  )}

                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 transition-transform duration-300 group-hover:scale-110">
                    <brochure.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                  </div>

                  <h3 className="mb-1 font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {brochure.title}
                  </h3>
                  <p className="mb-2 text-xs font-medium text-secondary">{brochure.subtitle}</p>
                  <p className="mb-5 text-sm text-muted-foreground leading-relaxed flex-grow">
                    {brochure.description}
                  </p>

                  <div className="flex gap-3">
                    <Button
                      variant={brochure.featured ? "default" : "outline"}
                      size="sm"
                      className="flex-1 group/btn"
                      asChild
                    >
                      <a href={brochure.url} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        View Brochure
                        <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-transform group-hover/btn:translate-x-1" />
                      </a>
                    </Button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Tip */}
          <AnimatedSection delay={500}>
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 rounded-xl bg-muted/50 px-6 py-4 border border-border/50">
                <Download className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Tip:</strong> Open a brochure, then use{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-xs font-mono">Ctrl+P</kbd>{" "}
                  or{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-xs font-mono">Cmd+P</kbd>{" "}
                  to save as PDF.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Brochures;
