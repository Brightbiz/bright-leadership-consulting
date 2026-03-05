import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ExecutiveAlignmentBrief = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Executive Alignment Brief | Bright Leadership"
        description="A governance-level overview of how structural alignment is measured, diagnosed, and sustained across executive teams."
        path="/executive-alignment-brief"
      />
      <Header />

      <main className="pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="container-narrow">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <motion.div
              className="mb-16 lg:mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-6">
                Advisory Document
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-foreground leading-tight mb-6">
                Executive Alignment Brief
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                A concise overview of the Executive Alignment Index and its commissioning context.
              </p>
            </motion.div>

            {/* Contents */}
            <motion.div
              className="mb-16 border-t border-border pt-12"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            >
              <p className="text-xs font-medium tracking-widest text-muted-foreground/70 uppercase mb-6">
                Contents
              </p>
              <div className="space-y-4">
                {[
                  "The structural alignment problem in executive teams",
                  "The Executive Alignment Index — six diagnostic dimensions",
                  "Sample composite alignment dashboard",
                  "How engagements are structured — diagnostic, reporting, advisory",
                  "When organisations commission this work",
                ].map((item, i) => (
                  <p key={i} className="text-sm text-foreground leading-relaxed pl-5 relative">
                    <span className="absolute left-0 text-muted-foreground">—</span>
                    {item}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Download — open, quiet, no form */}
            <motion.div
              className="border-t border-border pt-12"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              <a
                href="/downloads/executive-alignment-brief.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
              >
                Download PDF
              </a>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExecutiveAlignmentBrief;
