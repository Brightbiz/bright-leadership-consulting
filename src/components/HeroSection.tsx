import { ArrowRight, Play } from "lucide-react";
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
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-secondary/10 blur-2xl" />

      {/* Content */}
      <div className="container-narrow relative flex min-h-screen items-center pt-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center py-16">
          <div className="max-w-2xl animate-fade-up">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-sm font-medium text-primary-foreground/90">
                CPD Accredited Programs
              </span>
            </div>

            <h1 className="mb-6 font-serif text-4xl font-semibold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl text-balance">
              Empower Your{" "}
              <span className="relative">
                Leadership
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

            <p className="mb-8 text-lg leading-relaxed text-primary-foreground/80 sm:text-xl animate-fade-up-delay">
              Transform your leadership potential into extraordinary results. 
              Our executive coaching programs help senior leaders build confidence, 
              inspire teams, and drive lasting impact.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up-delay">
              <Button variant="hero" size="xl" className="group">
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="heroOutline" size="xl" className="group">
                <Play className="h-5 w-5" />
                Watch Video
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-primary-foreground/20 pt-8">
              {[
                { value: "500+", label: "Leaders Coached" },
                { value: "95%", label: "Success Rate" },
                { value: "15+", label: "Years Experience" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-serif text-2xl font-semibold text-secondary sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side floating card - hidden on mobile */}
          <div className="hidden lg:block relative">
            <div className="glass-card rounded-2xl p-8 max-w-md ml-auto animate-scale-in">
              <h3 className="font-serif text-xl font-semibold text-foreground mb-4">
                Ready to Transform Your Leadership?
              </h3>
              <p className="text-muted-foreground mb-6">
                Book a complimentary 30-minute consultation to discuss your leadership goals.
              </p>
              <Button variant="teal" className="w-full">
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
            fill="hsl(180 10% 99%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;