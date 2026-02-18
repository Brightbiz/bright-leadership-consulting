import { useState, useEffect } from "react";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const StickyMobileCTA = () => {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem("stickyCTADismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      // Show after scrolling past first section (about 500px)
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("stickyCTADismissed", "true");
  };

  const handleClick = () => {
    window.location.href = "/contact";
  };

  // Only show on mobile, after scroll, and if not dismissed
  if (!isMobile || !isVisible || isDismissed) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      {/* Gradient overlay for smooth blend */}
      <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="bg-background/95 backdrop-blur-lg border-t border-border/50 shadow-2xl px-4 py-3 safe-area-inset-bottom">
        <div className="flex items-center gap-3">
          <Button
            onClick={handleClick}
            variant="hero"
            size="lg"
            className="flex-1 shadow-lg shadow-secondary/30"
          >
            Start Your Transformation
            <ArrowRight className="h-4 w-4" />
          </Button>
          <button
            onClick={handleDismiss}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
