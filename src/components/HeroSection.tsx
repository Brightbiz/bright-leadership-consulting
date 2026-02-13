import { useState } from "react";
import { ArrowRight, Play, ClipboardCheck, Award } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedGradient from "./AnimatedGradient";
import TextReveal from "./TextReveal";
import MagneticButton from "./MagneticButton";

const HeroSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <AnimatedGradient />

      {/* Content */}
      <div className="container-narrow relative flex min-h-screen items-center pt-20 overflow-hidden">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center py-16 w-full">
          <div className="max-w-2xl min-w-0">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-5 py-2.5 border border-white/20 shadow-lg animate-fade-up">
              <Award className="h-4 w-4 text-secondary" />
              <span className="text-sm font-semibold text-primary-foreground">
                CPD Accredited Programs
              </span>
            </div>

            <h1 className="mb-6 font-serif text-2xl font-semibold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              <TextReveal delay={0.2}>
                Empower Your Leadership Excellence
              </TextReveal>
            </h1>

            <p className="mb-8 text-sm leading-relaxed text-primary-foreground/85 sm:text-xl animate-fade-up" style={{ animationDelay: '0.4s' }}>
              Transform your leadership potential into extraordinary results. 
              Our executive coaching programs help senior leaders build confidence, 
              inspire teams, and drive lasting impact.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.6s' }}>
              <MagneticButton variant="hero" size="xl" className="group shadow-xl shadow-secondary/30" href="#executive-program">
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
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
                  <ClipboardCheck className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="truncate">Free Leadership Assessment</span>
                  <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                </MagneticButton>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 border-t border-white/20 pt-8 animate-fade-up" style={{ animationDelay: '1s' }}>
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

          {/* Right side - Embedded Video Player */}
          <div className="hidden lg:block relative animate-fade-up" style={{ animationDelay: '0.5s' }}>
            {/* Decorative glowing orbs */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-primary/20 rounded-full blur-3xl" />

            {/* Animated gradient border wrapper */}
            <div className="relative rounded-3xl p-[3px] bg-gradient-to-br from-secondary via-primary-foreground/30 to-secondary/80 shadow-2xl shadow-black/30 hover:shadow-secondary/20 transition-shadow duration-700">
              {/* Inner glow ring */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-secondary/40 via-transparent to-primary-foreground/20 blur-lg opacity-60" />

              <div className="relative rounded-[calc(1.5rem-3px)] overflow-hidden bg-background">
                {isPlaying ? (
                  <iframe
                    src="https://www.youtube.com/embed/SosVIXorVq8?autoplay=1&rel=0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full aspect-video"
                    title="Bright Leadership Consulting"
                  />
                ) : (
                  <div 
                    className="relative cursor-pointer group"
                    onClick={() => setIsPlaying(true)}
                  >
                    <img
                      src="https://img.youtube.com/vi/SosVIXorVq8/maxresdefault.jpg"
                      alt="Watch our leadership video"
                      className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent flex items-center justify-center transition-all duration-500 group-hover:from-primary/40 group-hover:via-primary/10">
                      {/* Pulsing ring */}
                      <div className="absolute h-24 w-24 rounded-full bg-secondary/20 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                      <div className="relative h-[4.5rem] w-[4.5rem] rounded-full bg-secondary flex items-center justify-center shadow-xl shadow-secondary/50 transition-transform duration-300 group-hover:scale-110">
                        <Play className="h-8 w-8 text-secondary-foreground ml-1" fill="currentColor" />
                      </div>
                    </div>
                    {/* Bottom info bar */}
                    <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white/90 text-sm font-medium">▶ Watch Our Story</p>
                    </div>
                  </div>
                )}
              </div>
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
    </section>
  );
};

export default HeroSection;
