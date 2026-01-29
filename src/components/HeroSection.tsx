import { ArrowRight, Play, ClipboardCheck, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-coaching.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Executive coaching session"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-primary/20" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-[100px]" />
      <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-secondary/10 blur-[80px]" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      {/* Content */}
      <div className="container-narrow relative flex min-h-screen items-center pt-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center py-16">
          <div className="max-w-2xl animate-fade-up">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-5 py-2.5 border border-white/20 shadow-lg">
              <Award className="h-4 w-4 text-secondary" />
              <span className="text-sm font-semibold text-primary-foreground">
                CPD Accredited Programs
              </span>
            </div>

            <h1 className="mb-6 font-serif text-4xl font-semibold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl text-balance">
              Empower Your{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Leadership</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <path
                    d="M2 8C50 4 150 4 198 8"
                    stroke="hsl(38 92% 55%)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              Excellence
            </h1>

            <p className="mb-8 text-lg leading-relaxed text-primary-foreground/85 sm:text-xl animate-fade-up-delay">
              Transform your leadership potential into extraordinary results. 
              Our executive coaching programs help senior leaders build confidence, 
              inspire teams, and drive lasting impact.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up-delay">
              <Button variant="hero" size="xl" className="group shadow-xl shadow-secondary/30">
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="heroOutline" size="xl" className="group backdrop-blur-sm">
                <Play className="h-5 w-5" />
                Watch Video
              </Button>
            </div>

            {/* Leadership Checklist CTA */}
            <div className="mt-8 animate-fade-up-delay">
              <Link to="/leadership-checklist">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="border-2 border-secondary/60 bg-secondary/10 text-secondary hover:bg-secondary/20 hover:border-secondary hover:text-secondary font-semibold group backdrop-blur-sm"
                >
                  <ClipboardCheck className="h-5 w-5 mr-2" />
                  Take the Free Leadership Assessment
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/20 pt-8">
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
          <div className="hidden lg:block relative">
            <div className="glass-card rounded-2xl p-8 max-w-md ml-auto animate-scale-in backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20">
                <Award className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-white mb-4">
                Ready to Transform Your Leadership?
              </h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Book a complimentary 30-minute consultation to discuss your leadership goals.
              </p>
              <Button variant="hero" className="w-full shadow-lg shadow-secondary/30">
                Schedule Free Consultation
              </Button>
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
