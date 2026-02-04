import { cn } from "@/lib/utils";
import bbsLogo from "@/assets/bbs-logo.png";

interface LogoProps {
  className?: string;
  isCompact?: boolean;
}

const Logo = ({ className = "", isCompact = false }: LogoProps) => {
  return (
    <a href="/" className={cn("flex items-center", className)}>
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
};

export default Logo;
