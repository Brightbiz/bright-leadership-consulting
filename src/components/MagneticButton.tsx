import { useRef, useState, ReactNode, forwardRef } from "react";
import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends Omit<ButtonProps, 'asChild'> {
  children: ReactNode;
  magneticStrength?: number;
  href?: string;
  target?: string;
  rel?: string;
}

const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(({
  children,
  magneticStrength = 0.3,
  className,
  href,
  target,
  rel,
  ...props
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * magneticStrength;
    const deltaY = (e.clientY - centerY) * magneticStrength;
    
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const buttonContent = (
    <>
      {/* Shine effect */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );

  // If href is provided, render as a link
  if (href) {
    return (
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        className="inline-block"
      >
        <a href={href} target={target} rel={rel}>
          <Button className={cn("relative overflow-hidden group", className)} {...props}>
            {buttonContent}
          </Button>
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className="inline-block"
    >
      <Button ref={ref} className={cn("relative overflow-hidden group", className)} {...props}>
        {buttonContent}
      </Button>
    </motion.div>
  );
});

MagneticButton.displayName = "MagneticButton";

export default MagneticButton;
