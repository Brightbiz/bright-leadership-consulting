import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import bbsLogo from "@/assets/bbs-logo.png";

interface LogoProps {
  className?: string;
  isCompact?: boolean;
}

const Logo = forwardRef<HTMLAnchorElement, LogoProps>(({ className = "", isCompact = false }, ref) => {
  return (
    <a ref={ref} href="/" className={cn("flex items-center", className)}>
      <img
        src={bbsLogo}
        alt="Bright Leadership Consulting"
        className={cn(
          "w-auto object-contain transition-all duration-300",
          isCompact ? "h-10" : "h-14"
        )}
      />
    </a>
  );
});

Logo.displayName = "Logo";

export default Logo;
