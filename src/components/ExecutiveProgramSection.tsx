import { Award, BookOpen, Users, Target, TrendingUp, Clock, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";

const programFeatures = [
  { icon: BookOpen, text: "33 Comprehensive Leadership Modules" },
  { icon: Users, text: "Personalized 1:1 Executive Coaching" },
  { icon: Award, text: "Internationally Recognized CPD Accreditation" },
  { icon: Target, text: "Strategic Decision-Making Frameworks" },
  { icon: TrendingUp, text: "Performance & Growth Mindset Training" },
  { icon: Clock, text: "Self-Paced Learning with Lifetime Access" },
];

const ExecutiveProgramSection = () => {
  return (
    <section id="executive-program" className="section-padding relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container-narrow relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <AnimatedSection animation="slide-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/15 to-secondary/15 px-5 py-2.5 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider">
                Flagship Program
              </span>
            </div>
            
            <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
              Executive Leadership <span className="text-primary">Mastery Program</span>
            </h2>
            
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              Transform from aspiring leader to exceptional executive with our comprehensive, internationally accredited program.
            </p>
            
            {/* Feature List */}
            <ul className="space-y-4 mb-10">
              {programFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-4 group">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <span className="text-foreground font-medium">{feature.text}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="teal" size="lg" className="group">
                Explore Full Program
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg">
                Download Brochure
              </Button>
            </div>
          </AnimatedSection>
          
          {/* Visual Card */}
          <AnimatedSection animation="slide-right" delay={200}>
            <div className="relative">
              {/* Main card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 lg:p-10 shadow-2xl">
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                  backgroundSize: '20px 20px'
                }} />
                
                <div className="relative text-center">
                  <div className="mb-6 inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm mx-auto">
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  
                  <h3 className="mb-4 font-serif text-2xl font-semibold text-primary-foreground lg:text-3xl">
                    CPD Accredited Excellence
                  </h3>
                  
                  <p className="mb-6 text-primary-foreground/90 leading-relaxed">
                    Join an elite cohort of leaders who have transformed their careers with internationally recognized credentials.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-3xl font-bold text-white mb-1">33</div>
                      <div className="text-xs text-primary-foreground/80 uppercase tracking-wider">Modules</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-3xl font-bold text-white mb-1">1:1</div>
                      <div className="text-xs text-primary-foreground/80 uppercase tracking-wider">Coaching</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-3xl font-bold text-white mb-1">CPD</div>
                      <div className="text-xs text-primary-foreground/80 uppercase tracking-wider">Certified</div>
                    </div>
                  </div>
                  
                  {/* Bonus highlight */}
                  <div className="bg-secondary rounded-xl p-4 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-secondary-foreground" />
                      <span className="font-bold text-secondary-foreground">Exclusive Bonus</span>
                    </div>
                    <p className="text-sm text-secondary-foreground/90">
                      Enroll and get <span className="font-bold">50% OFF</span> all individual training courses!
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-secondary text-secondary-foreground rounded-full px-4 py-2 shadow-lg animate-pulse">
                <span className="font-bold text-sm">BEST VALUE</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ExecutiveProgramSection;
