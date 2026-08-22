import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  isCompact?: boolean;
  variant?: "stacked" | "horizontal" | "light";
}

const Logo = forwardRef<HTMLAnchorElement, LogoProps>(
  ({ className = "", isCompact = false, variant = "stacked" }, ref) => {
    const isLight = variant === "light";
    const textColor = isLight ? "text-navy-foreground" : "text-foreground";
    const subColor = isLight ? "text-navy-foreground/70" : "text-foreground/70";

    if (variant === "horizontal") {
      return (
        <a ref={ref} href="/" className={cn("flex items-center gap-[0.7em]", className)}>
          <BrightMark size={isCompact ? "1.6rem" : "1.95rem"} isLight={isLight} />
          <span className="flex items-baseline gap-[0.4em]">
          <span
            className={cn(
              "font-serif font-bold leading-none transition-all duration-300",
              textColor,
              isCompact ? "text-[1.15rem]" : "text-[1.35rem]"
            )}
            style={{ letterSpacing: "0.035em" }}
          >
            Bright
          </span>
          <span
            className={cn(
              "font-serif font-normal leading-none transition-all duration-300",
              subColor,
              isCompact ? "text-[0.78rem]" : "text-[0.88rem]"
            )}
            style={{ letterSpacing: "0.025em" }}
          >
            Leadership Consulting
          </span>
          </span>
        </a>
      );
    }

    return (
      <a ref={ref} href="/" className={cn("flex items-center gap-[0.7em]", className)}>
        <BrightMark size="2.35rem" isLight={isLight} />
        <span className="flex flex-col">
        <span
          className={cn("font-serif font-bold leading-none text-[1.35rem]", textColor)}
          style={{ letterSpacing: "0.035em" }}
        >
          Bright
        </span>
        <span
          className={cn("font-serif font-normal leading-none text-[0.78rem] mt-[0.35em]", subColor)}
          style={{ letterSpacing: "0.025em" }}
        >
          Leadership Consulting
        </span>
        </span>
      </a>
    );
  }
);

Logo.displayName = "Logo";

export default Logo;