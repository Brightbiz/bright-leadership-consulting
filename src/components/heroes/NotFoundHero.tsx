import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, AlertCircle, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMouseParallax, ParallaxLayer } from "@/hooks/useMouseParallax";

const NotFoundHero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const parallax = useMouseParallax(containerRef, { sensitivity: 0.015, maxMovement: 20 });

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-background" />
      
      {/* Animated lost particles with parallax */}
      {[...Array(15)].map((_, i) => (
        <ParallaxLayer 
          key={i} 
          parallax={parallax} 
          depth={0.5 + Math.random()}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          } as React.CSSProperties}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-primary/20"
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        </ParallaxLayer>
      ))}

      {/* Central glowing orb with parallax */}
      <ParallaxLayer parallax={parallax} depth={0.3} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </ParallaxLayer>

      {/* Broken grid lines */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full">
          <defs>
            <pattern id="broken-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 15" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#broken-grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="container-narrow relative text-center py-24">
        {/* Animated 404 with parallax */}
        <ParallaxLayer parallax={parallax} depth={0.2} className="mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <div className="relative inline-block">
              {/* Glitch effect layers */}
              <motion.span
                className="absolute inset-0 font-serif text-[12rem] md:text-[16rem] font-bold text-primary/20 select-none"
                animate={{ x: [-2, 2, -2], opacity: [0.5, 0.3, 0.5] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              >
                404
              </motion.span>
              <motion.span
                className="absolute inset-0 font-serif text-[12rem] md:text-[16rem] font-bold text-secondary/20 select-none"
                animate={{ x: [2, -2, 2], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 0.3, repeat: Infinity, delay: 0.1 }}
              >
                404
              </motion.span>
              <span className="relative font-serif text-[12rem] md:text-[16rem] font-bold text-foreground/10">
                404
              </span>
            </div>
          </motion.div>
        </ParallaxLayer>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 border border-destructive/20"
        >
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span className="text-sm font-medium text-destructive">Page Not Found</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-4 font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
        >
          Oops! You've wandered off the path
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-10 text-lg text-muted-foreground max-w-lg mx-auto"
        >
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track to your leadership journey.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button variant="default" size="lg" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/courses">
              <Search className="mr-2 h-4 w-4" />
              Browse Courses
            </Link>
          </Button>
        </motion.div>

        {/* Helpful links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <p className="text-sm text-muted-foreground mb-4">Or try one of these:</p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: "About Us", href: "/about" },
              { label: "Leadership Assessment", href: "/leadership-checklist" },
              { label: "Contact", href: "/#contact" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NotFoundHero;
