import { useState } from "react";
import { ArrowRight, Play, ClipboardCheck, Award, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import heroVideo from "@/assets/hero-video.mp4";
import AnimatedGradient from "./AnimatedGradient";
import TextReveal from "./TextReveal";
import MagneticButton from "./MagneticButton";

const HeroSection = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <AnimatedGradient />

      {/* Content */}
      <div className="container-narrow relative flex min-h-screen items-center pt-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center py-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-5 py-2.5 border border-white/20 shadow-lg animate-fade-up">
              <Award className="h-4 w-4 text-secondary" />
              <span className="text-sm font-semibold text-primary-foreground">
                CPD Accredited Programs
              </span>
            </div>

            <h1 className="mb-6 font-serif text-3xl font-semibold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              <TextReveal delay={0.2}>
                Empower Your Leadership Excellence
              </TextReveal>
            </h1>

            <p className="mb-8 text-base leading-relaxed text-primary-foreground/85 sm:text-xl animate-fade-up" style={{ animationDelay: '0.4s' }}>
              Transform your leadership potential into extraordinary results. 
              Our executive coaching programs help senior leaders build confidence, 
              inspire teams, and drive lasting impact.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.6s' }}>
              <MagneticButton variant="hero" size="xl" className="group shadow-xl shadow-secondary/30" href="#executive-program">
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
              <MagneticButton 
                variant="heroOutline" 
                size="xl" 
                className="group backdrop-blur-sm"
                onClick={() => setIsVideoOpen(true)}
              >
                <Play className="h-5 w-5" />
                Watch Video
              </MagneticButton>
            </div>

            {/* Leadership Checklist CTA */}
            <div className="mt-8 animate-fade-up" style={{ animationDelay: '0.8s' }}>
              <Link to="/leadership-checklist">
                <MagneticButton 
                  variant="ghost" 
                  size="lg" 
                  className="border-2 border-secondary/60 bg-secondary/10 text-secondary hover:bg-secondary/20 hover:border-secondary hover:text-secondary font-semibold group backdrop-blur-sm"
                >
                  <ClipboardCheck className="h-5 w-5 mr-2" />
                  Take the Free Leadership Assessment
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </MagneticButton>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/20 pt-8 animate-fade-up" style={{ animationDelay: '1s' }}>
              {[
                { value: "500+", label: "Leaders Coached" },
                { value: "95%", label: "Success Rate" },
                { value: "15+", label: "Years Experience" },
              ].map((stat) => (
                <div key={stat.label} className="group cursor-default">
                  <div className="font-serif text-2xl font-semibold text-secondary sm:text-3xl transition-transform group-hover:scale-105">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side floating card */}
          <div className="hidden lg:block relative animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="glass-card rounded-2xl p-8 max-w-md ml-auto backdrop-blur-xl bg-background/90 border border-white/20 shadow-2xl hover:shadow-secondary/20 transition-all duration-500">
              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-secondary via-primary to-secondary opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
              
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20">
                <Award className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                Ready to Transform Your Leadership?
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Book a complimentary 30-minute consultation to discuss your leadership goals.
              </p>
              <MagneticButton variant="hero" className="w-full shadow-lg shadow-secondary/30" href="#contact">
                Schedule Free Consultation
              </MagneticButton>
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

export default HeroSection;
