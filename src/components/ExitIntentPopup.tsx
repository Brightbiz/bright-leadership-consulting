import { useState, useEffect } from "react";
import { Download, BookOpen, CheckCircle, X, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if already shown in this session
    const alreadyShown = sessionStorage.getItem("exitIntentShown");
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from the top of the viewport
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    };

    // Delay adding the listener to avoid triggering immediately
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address to download the guide.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("lead_magnet_downloads").insert({
        email: email.trim(),
        name: name.trim() || null,
        lead_magnet_name: "5-leadership-secrets-exit-intent",
      });

      if (error) throw error;

      // Trigger download
      const link = document.createElement("a");
      link.href = "/downloads/5-leadership-secrets.pdf";
      link.download = "5-Leadership-Secrets-Bright-Leadership-Consulting.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsDownloaded(true);
      toast({
        title: "Download started!",
        description: "Your free guide is downloading now.",
      });

      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving lead:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const secrets = [
    "Strategic decision-making",
    "High-performing teams",
    "Executive presence",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-1.5 text-white hover:bg-white/20 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-primary via-primary to-primary/90 p-6 text-center relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-secondary/20 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-secondary/10 blur-xl" />

          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 border border-white/20">
              <Sparkles className="h-3 w-3 text-secondary" />
              <span className="text-xs font-semibold text-primary-foreground uppercase tracking-wider">
                Wait! Don't Go
              </span>
            </div>

            <h2 className="font-serif text-xl font-semibold text-primary-foreground mb-2">
              Get Your Free Leadership Guide
            </h2>
            <p className="text-primary-foreground/80 text-sm">
              5 secrets every executive needs to know
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isDownloaded ? (
            <div className="text-center py-4">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20">
                <CheckCircle className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                Download Started!
              </h3>
              <p className="text-muted-foreground text-sm">
                Check your downloads folder.
              </p>
            </div>
          ) : (
            <>
              {/* Social proof badge */}
              <div className="flex items-center justify-center gap-2 mb-4 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5 text-secondary" />
                <span><span className="font-semibold text-foreground">2,300+</span> leaders downloaded this guide</span>
              </div>
              
              <ul className="space-y-2 mb-5">
                {secrets.map((secret, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                    <span>{secret}</span>
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                />
                <Input
                  type="email"
                  placeholder="Your Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full shadow-lg shadow-secondary/30"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download Free Guide
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  No spam. Unsubscribe anytime.
                </p>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
