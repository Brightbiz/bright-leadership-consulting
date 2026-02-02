import { motion } from "framer-motion";

interface AnimatedGradientProps {
  className?: string;
}

const AnimatedGradient = ({ className = "" }: AnimatedGradientProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
      
      {/* Animated mesh gradients */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, hsl(var(--secondary) / 0.4) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, hsl(var(--secondary) / 0.4) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, hsl(var(--secondary) / 0.4) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, hsl(var(--secondary) / 0.4) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-secondary/20 blur-[100px]"
        animate={{
          x: [0, 100, 50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary-foreground/10 blur-[80px]"
        animate={{
          x: [0, -80, 40, 0],
          y: [0, 60, -40, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full bg-secondary/15 blur-[120px]"
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -80, 40, 0],
          scale: [1.1, 0.9, 1.2, 1.1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Grain overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};

export default AnimatedGradient;
