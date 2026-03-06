import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  isCompact?: boolean;
  variant?: "stacked" | "horizontal";
}

const Logo = forwardRef<HTMLAnchorElement, LogoProps>(
  ({ className = "", isCompact = false, variant = "stacked" }, ref) => {
    if (variant === "horizontal") {
      return (
        <a ref={ref} href="/" className={cn("flex items-baseline gap-2", className)}>
          <span
            className={cn(
              "font-serif font-bold text-foreground transition-all duration-300",
              isCompact ? "text-lg" : "text-xl"
            )}
            style={{ letterSpacing: "0.04em" }}
          >
            Bright
          </span>
          <span
            className={cn(
              "font-serif font-normal text-muted-foreground transition-all duration-300",
              isCompact ? "text-sm" : "text-[0.9rem]"
            )}
            style={{ letterSpacing: "0.03em" }}
          >
            Leadership Consulting
          </span>
        </a>
      );
    }

    return (
      <a ref={ref} href="/" className={cn("flex flex-col", className)}>
        <span
          className={cn(
            "font-serif font-bold text-foreground leading-none transition-all duration-300",
            isCompact ? "text-lg" : "text-xl"
          )}
          style={{ letterSpacing: "0.04em" }}
        >
          Bright
        </span>
        <span
          className={cn(
            "font-serif font-normal text-muted-foreground leading-none transition-all duration-300",
            isCompact ? "text-xs mt-0.5" : "text-[0.8rem] mt-1"
          )}
          style={{ letterSpacing: "0.03em" }}
        >
          Leadership Consulting
        </span>
      </a>
    );
  }
);

Logo.displayName = "Logo";

export default Logo;
