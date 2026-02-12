import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollProgress from "@/components/ScrollProgress";
import AnimatedSection from "@/components/AnimatedSection";
import TiltCard from "@/components/TiltCard";
import AboutHero from "@/components/heroes/AboutHero";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Heart, Lightbulb, Users, Award, Globe, Linkedin, ArrowRight, Sparkles } from "lucide-react";
import cpdBadge from "@/assets/cpd-badge.png";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We pursue the highest standards in everything we do, delivering transformative results that exceed expectations.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "We operate with complete transparency and honesty, building trust through authentic relationships.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We continuously evolve our methodologies to stay at the forefront of leadership development.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We believe in the power of partnership, working alongside our clients to achieve shared success.",
  },
];

const teamMembers = [
  {
    name: "Irene Agunbiade",
    role: "Principal Consultant",
    bio: "With over 20 years of experience and a strong track record in organisational leadership across business and finance sectors, Irene drives transformational change at the highest levels.",
    credentials: ["BSc Engineering", "MBA (International)", "20+ Years Leadership Experience"],
  },
  {
    name: "Dr. Sarah Chen",
    role: "Head of Executive Programs",
    bio: "With extensive experience in executive coaching, Dr. Chen has transformed leadership practices at Fortune 500 companies across three continents.",
    credentials: ["PhD Organizational Psychology", "ICF Master Certified Coach", "CPD Accredited Trainer"],
  },
  {
    name: "Marcus Williams",
    role: "Senior Leadership Coach",
    bio: "Former C-suite executive turned leadership coach, Marcus brings real-world boardroom experience to every engagement.",
    credentials: ["MBA Harvard Business School", "15+ Years Executive Experience", "Certified Executive Coach"],
  },
  {
    name: "Priya Sharma",
    role: "Director of Corporate Training",
    bio: "Priya specializes in organizational transformation and has designed leadership curricula for global enterprises.",
    credentials: ["MSc Leadership Studies", "Change Management Specialist", "CPD Accredited Facilitator"],
  },
];

const credentials = [
  { icon: Award, label: "CPD Accredited Provider", detail: "Provider #50838" },
  { icon: Globe, label: "Global Reach", detail: "Clients in 25+ Countries" },
  { icon: Users, label: "Leaders Transformed", detail: "5,000+ Executives" },
  { icon: Target, label: "Success Rate", detail: "98% Client Satisfaction" },
];

const milestones = [
  { year: "2014", event: "Founded with a vision to transform leadership development" },
  { year: "2017", event: "Expanded to serve clients across 10+ countries" },
  { year: "2020", event: "Launched digital-first executive programs" },
  { year: "2023", event: "CPD accredited & 5,000+ leaders transformed" },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Header />
      <main>
        <AboutHero />

        {/* Our Story Section */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute top-20 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
          <div className="container-narrow relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <AnimatedSection>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-1 w-10 bg-secondary rounded-full" />
                  <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Our Journey</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                  A Decade of <span className="text-primary">Transforming Leaders</span>
                </h2>
                <div className="space-y-5 text-muted-foreground leading-relaxed text-lg">
                  <p>
                    Bright Leadership Consulting was founded with a simple yet powerful vision: to bridge the gap 
                    between leadership potential and exceptional performance.
                  </p>
                  <p>
                    We pioneered an approach that combines evidence-based methodologies with personalized coaching, 
                    creating transformative experiences that resonate long after the program ends.
                  </p>
                  <p>
                    Today, we're CPD accredited and recognized as a leading provider of executive coaching and 
                    leadership training worldwide.
                  </p>
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={200}>
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div 
                      key={milestone.year}
                      className="flex gap-6 items-start group"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 border border-primary/20 flex items-center justify-center group-hover:from-primary/25 group-hover:to-secondary/25 transition-all duration-300 shadow-sm">
                          <span className="text-sm font-bold text-primary">{milestone.year}</span>
                        </div>
                        {index < milestones.length - 1 && (
                          <div className="w-px h-8 bg-gradient-to-b from-primary/30 to-transparent mt-2" />
                        )}
                      </div>
                      <div className="pt-3">
                        <p className="text-foreground font-medium leading-relaxed">{milestone.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Mission & Values Section */}
        <section className="section-padding relative overflow-hidden bg-muted/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.04),transparent_60%)]" />
          <div className="container-narrow relative">
            <AnimatedSection className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 px-4 py-1.5">
                <Sparkles className="h-3 w-3 mr-1.5" />
                What Drives Us
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Our Mission & Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We exist to unlock human potential and create leaders who inspire positive change.
              </p>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <AnimatedSection key={value.title} delay={index * 100}>
                  <div className="h-full rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-8 text-center group hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="container-narrow relative">
            <AnimatedSection className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 px-4 py-1.5">
                <Users className="h-3 w-3 mr-1.5" />
                Meet Our Experts
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Leadership Team</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                World-class coaches and trainers with decades of combined experience.
              </p>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <AnimatedSection key={member.name} delay={index * 100}>
                  <TiltCard className="h-full">
                    <div className="h-full rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden group hover:border-primary/20 transition-all duration-500">
                      <div className="aspect-square bg-gradient-to-br from-primary/8 via-transparent to-secondary/8 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-primary/10 shadow-lg shadow-primary/10">
                            <span className="text-3xl font-bold text-primary">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
                        <button className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md border border-border/50 hover:bg-primary hover:text-primary-foreground">
                          <Linkedin className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold mb-1 text-foreground">{member.name}</h3>
                        <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {member.bio}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {member.credentials.slice(0, 2).map((cred) => (
                            <Badge 
                              key={cred} 
                              variant="secondary" 
                              className="text-xs font-normal bg-muted/80"
                            >
                              {cred}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Credentials Section */}
        <section className="section-padding relative overflow-hidden bg-muted/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--secondary)/0.04),transparent_60%)]" />
          <div className="container-narrow relative">
            <AnimatedSection className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 px-4 py-1.5">
                <Award className="h-3 w-3 mr-1.5" />
                Trust & Recognition
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Our Credentials</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Accredited excellence backed by industry recognition and proven results.
              </p>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {credentials.map((cred, index) => (
                <AnimatedSection key={cred.label} delay={index * 100}>
                  <div className="text-center p-8 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1 group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <cred.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div className="font-semibold mb-1 text-foreground">{cred.label}</div>
                    <div className="text-sm text-muted-foreground">{cred.detail}</div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection className="flex justify-center">
              <div className="bg-card rounded-2xl p-8 shadow-xl border border-border/50">
                <img
                  src={cpdBadge}
                  alt="CPD Standards Office Accredited - Provider 50838"
                  className="h-32 w-auto"
                />
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-secondary/[0.06]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="container-narrow relative">
            <AnimatedSection>
              <div className="relative rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-primary/90 p-10 md:p-16 text-center overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/15 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                <div className="relative max-w-2xl mx-auto">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primary-foreground leading-tight">
                    Ready to Transform Your Leadership?
                  </h2>
                  <p className="text-xl text-primary-foreground/80 mb-10 leading-relaxed">
                    Join thousands of executives who have elevated their leadership with Bright Leadership Consulting.
                  </p>
                  <Button variant="hero" size="xl" className="group shadow-xl shadow-secondary/30" asChild>
                    <Link to="/#contact">
                      Get in Touch
                      <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default AboutUs;
