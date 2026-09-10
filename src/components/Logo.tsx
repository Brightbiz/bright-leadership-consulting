import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  isCompact?: boolean;
  variant?: "stacked" | "horizontal" | "light";
}

const ALT = "Bright Leadership Consulting";

const Logo = forwardRef<HTMLAnchorElement, LogoProps>(
  ({ className = "", isCompact = false, variant = "stacked" }, ref) => {
    if (variant === "light") {
      return (
        <a ref={ref} href="/" className={cn("inline-flex items-center", className)}>
          <img
            src="/logo-wordmark-light.svg"
            alt={ALT}
            width={384}
            height={60}
            className="h-9 w-auto"
          />
        </a>
      );
    }

    if (variant === "horizontal") {
      return (
        <a ref={ref} href="/" className={cn("inline-flex items-center", className)}>
          {/* Horizontal wordmark: primary header lock-up on light backgrounds */}
          <img
            src="/logo-wordmark.svg"
            alt={ALT}
            width={384}
            height={60}
            className={cn(
              "w-auto transition-all duration-300 max-[380px]:hidden",
              isCompact ? "h-7" : "h-9"
            )}
          />
          {/* Stacked fallback only where the horizontal lock-up would be too small to read */}
          <img
            src="/logo-stacked.svg"
            alt={ALT}
            width={214}
            height={82}
            
            className="hidden w-auto max-[380px]:block h-10"
          />
        </a>
      );
    }

    return (
      <a ref={ref} href="/" className={cn("inline-flex items-center", className)}>
        <img
          src="/logo-stacked.svg"
          alt={ALT}
          width={214}
          height={82}
          className="h-12 w-auto"
        />
      </a>
    );
  }
);

Logo.displayName = "Logo";

export default Logo;
