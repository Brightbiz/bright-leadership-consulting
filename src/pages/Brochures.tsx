import { FileText, Download, ArrowRight, Crown, BookOpen, Zap, Users, Briefcase, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 pt-32 pb-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
        <div className="container-narrow relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-5 py-2.5 backdrop-blur-sm border border-secondary/10">
              <FileText className="h-4 w-4 text-secondary" />
              <span className="text-sm font-semibold text-secondary">Course Brochures</span>
            </div>
            <h1 className="mb-6 font-serif text-4xl font-semibold text-primary-foreground sm:text-5xl lg:text-6xl leading-tight">
              Download Our <span className="text-secondary">Programme Brochures</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80 leading-relaxed">
              Explore detailed course information, module breakdowns, and learning outcomes for each of our professional development programmes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brochure Cards */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="container-narrow relative">
          {/* Featured brochure - full width */}
          {brochures.filter(b => b.featured).map((brochure) => (
            <AnimatedSection key={brochure.title} className="mb-10">
              <div className="relative rounded-3xl bg-gradient-to-br from-secondary/10 via-card to-primary/10 border-2 border-secondary/30 p-8 md:p-12 overflow-hidden shadow-xl group hover:-translate-y-1 transition-all duration-500">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary via-primary to-secondary" />
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-secondary text-secondary-foreground font-bold">
                    <Crown className="h-3 w-3 mr-1" /> Flagship Programme
                  </Badge>
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary/25 to-primary/15 flex items-center justify-center shadow-lg">
                      <brochure.icon className="h-10 w-10 text-secondary" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {brochure.title}
                    </h3>
                    <p className="text-sm font-medium text-secondary mb-3">{brochure.subtitle}</p>
                    <p className="text-muted-foreground leading-relaxed mb-6">{brochure.description}</p>
                    <Button variant="default" size="lg" className="group/btn shadow-lg" asChild>
                      <a href={brochure.url} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        View Brochure
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}

          {/* Other brochures grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {brochures.filter(b => !b.featured).map((brochure, index) => (
              <AnimatedSection key={brochure.title} delay={index * 100}>
                <div className="group relative h-full overflow-hidden rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-7 flex flex-col transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 transition-transform duration-300 group-hover:scale-110 shadow-sm">
                    <brochure.icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
                  </div>

                  <h3 className="mb-2 font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {brochure.title}
                  </h3>
                  <p className="mb-2 text-xs font-medium text-secondary">{brochure.subtitle}</p>
                  <p className="mb-6 text-sm text-muted-foreground leading-relaxed flex-grow">
                    {brochure.description}
                  </p>

                  <Button variant="outline" size="sm" className="w-full group/btn" asChild>
                    <a href={brochure.url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-3.5 w-3.5 mr-1.5" />
                      View Brochure
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-transform group-hover/btn:translate-x-1" />
                    </a>
                  </Button>

                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Tip */}
          <AnimatedSection delay={500}>
            <div className="mt-14 text-center">
              <div className="inline-flex items-center gap-3 rounded-2xl bg-muted/50 px-7 py-5 border border-border/50 backdrop-blur-sm">
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
