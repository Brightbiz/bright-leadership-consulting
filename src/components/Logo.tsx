import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  isCompact?: boolean;
  variant?: "stacked" | "horizontal" | "light";
}

const Logo = forwardRef<HTMLAnchorElement, LogoProps>(
  ({ className = "", isCompact = false, variant = "stacked" }, ref) => {
    if (variant === "horizontal") {
      return (
        <a ref={ref} href="/" className={cn("flex items-baseline gap-[0.4em]", className)}>
          <span
            className={cn(
              "font-serif font-bold text-foreground leading-none transition-all duration-300",
              isCompact ? "text-[1.15rem]" : "text-[1.35rem]"
            )}
            style={{ letterSpacing: "0.035em" }}
          >
            Bright
          </span>
          <span
            className={cn(
              "font-serif font-normal text-foreground/70 leading-none transition-all duration-300",
              isCompact ? "text-[0.78rem]" : "text-[0.88rem]"
            )}
            style={{ letterSpacing: "0.025em" }}
          >
            Leadership Consulting
          </span>
        </a>
      );
    }

    return (
      <a ref={ref} href="/" className={cn("flex flex-col", className)}>
        <span
          className="font-serif font-bold text-foreground leading-none text-[1.35rem]"
          style={{ letterSpacing: "0.035em" }}
        >
          Bright
        </span>
        <span
          className="font-serif font-normal text-foreground/70 leading-none text-[0.78rem] mt-[0.35em]"
          style={{ letterSpacing: "0.025em" }}
        >
          Leadership Consulting
        </span>
      </a>
    );
  }
);

Logo.displayName = "Logo";

export default Logo;
