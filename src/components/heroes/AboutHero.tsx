import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Building, Users, Globe, Award, Play, X, ArrowRight } from "lucide-react";
import TextReveal from "@/components/TextReveal";
import MagneticButton from "@/components/MagneticButton";
import AnimatedGradient from "@/components/AnimatedGradient";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import cpdBadge from "@/assets/cpd-badge.png";
import heroVideo from "@/assets/hero-video.mp4";

const AboutHero = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const stats = [
    { icon: Users, value: "5,000+", label: "Leaders Transformed" },
    { icon: Globe, value: "25+", label: "Countries Served" },
    { icon: Award, value: "10+", label: "Years Excellence" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background - same premium feel as homepage */}
      <AnimatedGradient />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-[10%] w-64 h-64 border border-white/10 rounded-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-32 right-[15%] w-48 h-48 border border-secondary/20 rounded-full"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-[8%] w-4 h-4 bg-secondary/60 rounded-full"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-[20%] w-6 h-6 bg-primary-foreground/20 rounded-full blur-sm"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="container-narrow relative flex min-h-screen items-center pt-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center py-16">
          <div className="max-w-2xl">
            {/* Company Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-5 py-2.5 border border-white/20 shadow-lg"
            >
              <Building className="h-4 w-4 text-secondary" />
              <span className="text-sm font-semibold text-primary-foreground">
                Bright Leadership Consulting • Est. 2014
              </span>
            </motion.div>

            <h1 className="mb-6 font-serif text-4xl font-semibold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              <TextReveal delay={0.2}>
                Where Vision Meets
              </TextReveal>
              <span className="block text-secondary mt-2">
                <TextReveal delay={0.4}>
                  Transformation
                </TextReveal>
              </span>
            </h1>

            <p className="mb-8 text-lg leading-relaxed text-primary-foreground/85 sm:text-xl animate-fade-up" style={{ animationDelay: '0.5s' }}>
              For over a decade, we've partnered with leaders across the globe to unlock 
              their full potential. Our approach combines proven methodologies with 
              personalized strategies that create lasting impact.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.7s' }}>
              <Link to="/contact">
                <MagneticButton variant="hero" size="xl" className="group shadow-xl shadow-secondary/30">
                  Start Your Journey
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </MagneticButton>
              </Link>
              <MagneticButton 
                variant="heroOutline" 
                size="xl" 
                className="group backdrop-blur-sm"
                onClick={() => setIsVideoOpen(true)}
              >
                <Play className="h-5 w-5" />
                Our Story
              </MagneticButton>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/20 pt-8 animate-fade-up" style={{ animationDelay: '0.9s' }}>
              {stats.map((stat) => (
                <div key={stat.label} className="group cursor-default">
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="h-4 w-4 text-secondary/80" />
                    <div className="font-serif text-2xl font-semibold text-secondary sm:text-3xl transition-transform group-hover:scale-105">
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Premium Card */}
          <div className="hidden lg:block relative animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <div className="glass-card rounded-2xl p-8 max-w-md ml-auto backdrop-blur-xl bg-background/90 border border-white/20 shadow-2xl hover:shadow-secondary/20 transition-all duration-500">
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-secondary via-primary to-secondary opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
              
              {/* CPD Badge */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                <img src={cpdBadge} alt="CPD Accredited" className="h-16 w-16 object-contain" />
                <div>
                  <span className="block text-lg font-semibold text-foreground">CPD Accredited</span>
                  <span className="text-sm text-muted-foreground">Provider #50838</span>
                </div>
              </div>

              {/* Mission Statement */}
              <div className="mb-6">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                  Our Mission
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Empowering leaders to unlock their potential, inspire their teams, 
                  and drive meaningful change in their organizations and communities.
                </p>
              </div>

              {/* Values Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["Excellence", "Integrity", "Innovation", "Collaboration"].map((value) => (
                  <span
                    key={value}
                    className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                  >
                    {value}
                  </span>
                ))}
              </div>

              <Link to="/services">
                <MagneticButton variant="hero" className="w-full shadow-lg shadow-secondary/30">
                  Explore Our Services
                </MagneticButton>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" className="w-full">
          <path
            d="M0 50C360 100 720 0 1080 50C1260 75 1380 75 1440 50V100H0V50Z"
            className="fill-background"
          />
        </svg>
      </div>

      {/* Video Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl w-[90vw] p-0 bg-black border-none overflow-hidden">
          <button
            onClick={() => setIsVideoOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <video
            src={heroVideo}
            controls
            autoPlay
            className="w-full aspect-video"
          />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AboutHero;
