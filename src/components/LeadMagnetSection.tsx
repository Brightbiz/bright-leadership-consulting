import { useState } from "react";
import { Download, FileText, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import AnimatedSection from "./AnimatedSection";

const LeadMagnetSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your business email to access this briefing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("lead_magnet_downloads")
        .insert({
          email: email.trim(),
          name: name.trim() || null,
          lead_magnet_name: "executive-alignment-briefing",
        });

      if (error) throw error;

      const link = document.createElement("a");
      link.href = "/downloads/5-leadership-secrets.pdf";
      link.download = "Executive-Alignment-Briefing-Bright-Leadership.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsDownloaded(true);
      toast({
        title: "Briefing paper downloading",
        description: "Your executive briefing is downloading now.",
      });
    } catch (error) {
      console.error("Error saving lead:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const insights = [
    "Why executive alignment drifts — and how boards can detect it early",
    "The governance cost of misaligned leadership teams",
    "Five structural interventions that restore strategic coherence",
    "How high-performing organisations sustain alignment at scale",
    "A diagnostic framework for your own leadership team",
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-secondary/[0.05] via-transparent to-secondary/[0.03]">
      <div className="container-narrow">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/90 p-6 sm:p-8 lg:p-12">
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary/5 blur-2xl" />
            
            <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left: Content */}
              <div className="min-w-0">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 border border-white/20">
                  <Shield className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-semibold text-primary-foreground uppercase tracking-wider">
                    Executive Briefing
                  </span>
                </div>

                <h2 className="mb-4 font-serif text-2xl font-semibold text-primary-foreground sm:text-4xl leading-tight">
                  Executive Alignment: Why It Drifts and What Boards Can Do
                </h2>

                <p className="mb-6 text-primary-foreground/80 text-base sm:text-lg leading-relaxed">
                  A concise briefing paper for senior leaders and board members examining the structural causes 
                  of leadership misalignment — and the governance-level interventions that restore strategic coherence.
                </p>

                <ul className="space-y-3 mb-8">
                  {insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-3 text-primary-foreground/90 text-sm sm:text-base">
                      <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-1" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Form */}
              <div className="bg-background/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-secondary/20">
                {isDownloaded ? (
                  <div className="text-center py-8">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
                      <CheckCircle className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                      Briefing Downloaded
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Your executive briefing paper is ready. Check your downloads folder.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = "/downloads/5-leadership-secrets.pdf";
                        link.download = "Executive-Alignment-Briefing-Bright-Leadership.pdf";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Again
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-semibold text-foreground">
                          Access This Briefing
                        </h3>
                        <p className="text-sm text-muted-foreground">Complimentary PDF · 12 pages</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Input
                          type="text"
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-12"
                        />
                      </div>
                      <div>
                        <Input
                          type="email"
                          placeholder="Business Email *"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        variant="hero" 
                        size="xl" 
                        className="w-full shadow-lg shadow-secondary/30"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Processing..."
                        ) : (
                          <>
                            <Download className="h-5 w-5 mr-2" />
                            Download Briefing Paper
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Confidential. No marketing emails. Unsubscribe anytime.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default LeadMagnetSection;
