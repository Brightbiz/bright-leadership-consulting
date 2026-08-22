import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  isCompact?: boolean;
  variant?: "stacked" | "horizontal" | "light";
}

/**
 * Brand mark: serif "B" registered against a gold alignment axis.
 */
const BrightMark = ({ size, isLight }: { size: string; isLight: boolean }) => (
  <svg
    viewBox="0 0 200 200"
    width={size}
    height={size}
    aria-hidden="true"
    focusable="false"
    className="shrink-0 transition-all duration-300"
  >
    <rect
      x="0"
      y="0"
      width="200"
      height="200"
      rx="10"
      fill={isLight ? "hsl(var(--pearl))" : "hsl(var(--navy))"}
    />
    <text
      x="84"
      y="129"
      textAnchor="middle"
      fontSize="100"
      fontWeight="700"
      fill={isLight ? "hsl(var(--navy))" : "hsl(var(--pearl))"}
      style={{ fontFamily: "var(--font-serif, 'Libre Baskerville'), Georgia, serif" }}
    >
      B
    </text>
    <rect x="158" y="40" width="2.8" height="120" fill="hsl(var(--gold))" />
    <rect x="133" y="99" width="25" height="2" fill="hsl(var(--gold))" opacity="0.85" />
  </svg>
);

const Logo = forwardRef<HTMLAnchorElement, LogoProps>(
  ({ className = "", isCompact = false, variant = "stacked" }, ref) => {
    const isLight = variant === "light";
    const textColor = isLight ? "text-navy-foreground" : "text-foreground";
    const subColor = isLight ? "text-navy-foreground/70" : "text-foreground/70";

    if (variant === "horizontal") {
      return (
        <a ref={ref} href="/" className={cn("flex items-center gap-[0.7em]", className)}>
          <BrightMark size={isCompact ? "1.6rem" : "1.95rem"} isLight={isLight} />
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
        </a>
      );
    }

    return (
      <a ref={ref} href="/" className={cn("flex flex-col", className)}>
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
      </a>
    );
  }
);

Logo.displayName = "Logo";

export default Logo;