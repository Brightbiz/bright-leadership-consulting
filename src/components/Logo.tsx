import { Layers } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo = ({ className = "", showText = true }: LogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center">
        <div className="absolute inset-0 rounded-lg bg-secondary shadow-md" />
        <Layers className="relative h-5 w-5 text-secondary-foreground" strokeWidth={2.5} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-serif text-lg font-semibold leading-tight text-foreground">
            Bright Leadership
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Consulting
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;