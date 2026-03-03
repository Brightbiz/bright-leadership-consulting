import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ExecutiveAlignmentBrief = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const { toast } = useToast();

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({ title: "Please enter your email address.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      await supabase.from("lead_magnet_downloads").insert({
        name: name || null,
        email,
        lead_magnet_name: "Executive Alignment Brief",
      });
    } catch {
      // Non-blocking — download proceeds regardless
    }

    // Open the brief
    window.open("/downloads/executive-alignment-brief.html", "_blank");
    setIsDownloaded(true);
    setIsSubmitting(false);
  };

  const handleDirectDownload = () => {
    window.open("/downloads/executive-alignment-brief.html", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Executive Alignment Brief"
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
                Executive Alignment Brief™
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                A governance-level overview of how structural alignment is measured, 
                diagnosed, and sustained across executive teams.
              </p>
            </motion.div>

            {/* What's inside */}
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
                  "The Executive Alignment Index™ — six diagnostic dimensions",
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

            {/* Download form */}
            {!isDownloaded ? (
              <motion.div
                className="border-t border-border pt-12"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              >
                <form onSubmit={handleDownload} className="space-y-5 max-w-sm">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium tracking-wider text-muted-foreground uppercase mb-2">
                      Name <span className="normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border-b border-border text-foreground text-sm py-2.5 focus:outline-none focus:border-primary transition-colors"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium tracking-wider text-muted-foreground uppercase mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-b border-border text-foreground text-sm py-2.5 focus:outline-none focus:border-primary transition-colors"
                      placeholder=""
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors duration-300 tracking-wide pt-4 disabled:opacity-50"
                  >
                    {isSubmitting ? "Opening…" : "Download the Brief"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </form>

                <button
                  onClick={handleDirectDownload}
                  className="mt-8 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors tracking-wide"
                >
                  Or download without providing details
                </button>
              </motion.div>
            ) : (
              <motion.div
                className="border-t border-border pt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-sm text-muted-foreground">
                  The Brief has been opened in a new tab. You can save it as PDF from there.
                </p>
                <button
                  onClick={handleDirectDownload}
                  className="inline-flex items-center gap-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors duration-300 tracking-wide mt-4"
                >
                  Open again
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExecutiveAlignmentBrief;
