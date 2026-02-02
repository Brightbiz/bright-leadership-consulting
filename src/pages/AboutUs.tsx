import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollProgress from "@/components/ScrollProgress";
import AnimatedSection from "@/components/AnimatedSection";
import TiltCard from "@/components/TiltCard";
import AboutHero from "@/components/heroes/AboutHero";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Lightbulb, Users, Award, Globe, Linkedin } from "lucide-react";
import cpdBadge from "@/assets/cpd-badge.png";

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

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Header />
      <main>
        {/* Hero Section */}
        <AboutHero />

        {/* Our Story Section */}
        <section className="section-padding bg-muted/30">
          <div className="container-narrow">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <AnimatedSection>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    BBS Consulting Group was founded with a simple yet powerful vision: to bridge the gap 
                    between leadership potential and exceptional performance. What began as a boutique 
                    coaching practice has evolved into a comprehensive leadership development organization 
                    trusted by executives and organizations worldwide.
                  </p>
                  <p>
                    Our journey started when our founder recognized that traditional leadership training 
                    often failed to create lasting change. We pioneered an approach that combines 
                    evidence-based methodologies with personalized coaching, creating transformative 
                    experiences that resonate long after the program ends.
                  </p>
                  <p>
                    Today, we're proud to be CPD accredited and recognized as a leading provider of 
                    executive coaching and leadership training. Our programs have touched the lives of 
                    thousands of leaders, helping them unlock their potential and inspire those around them.
                  </p>
                </div>
              </AnimatedSection>
              
              <AnimatedSection delay={0.2}>
                <TiltCard className="relative overflow-hidden rounded-2xl">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="text-6xl font-bold text-primary mb-2">10+</div>
                      <div className="text-xl text-muted-foreground">Years of Excellence</div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-secondary text-secondary-foreground">Est. 2014</Badge>
                  </div>
                </TiltCard>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Mission & Values Section */}
        <section className="section-padding">
          <div className="container-narrow">
            <AnimatedSection className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
                What Drives Us
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission & Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We exist to unlock human potential and create leaders who inspire positive change in their 
                organizations and communities.
              </p>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <AnimatedSection key={value.title} delay={index * 0.1}>
                  <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                        <value.icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section-padding bg-muted/30">
          <div className="container-narrow">
            <AnimatedSection className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
                Meet Our Experts
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership Team</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our team of world-class coaches and trainers brings decades of combined experience in 
                executive development.
              </p>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <AnimatedSection key={member.name} delay={index * 0.1}>
                  <TiltCard className="h-full">
                    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
                      <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                            <span className="text-3xl font-bold text-primary">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <button className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Linkedin className="h-4 w-4 text-primary" />
                        </button>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-semibold mb-1">{member.name}</h3>
                        <p className="text-sm text-primary mb-3">{member.role}</p>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {member.bio}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {member.credentials.slice(0, 2).map((cred) => (
                            <Badge 
                              key={cred} 
                              variant="secondary" 
                              className="text-xs font-normal"
                            >
                              {cred}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Credentials Section */}
        <section className="section-padding">
          <div className="container-narrow">
            <AnimatedSection className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5">
                Trust & Recognition
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Credentials</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Accredited excellence backed by industry recognition and proven results.
              </p>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {credentials.map((cred, index) => (
                <AnimatedSection key={cred.label} delay={index * 0.1}>
                  <Card className="text-center p-6 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                    <cred.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="font-semibold mb-1">{cred.label}</div>
                    <div className="text-sm text-muted-foreground">{cred.detail}</div>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection className="flex justify-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
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
        <section className="section-padding bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
          <div className="container-narrow text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Leadership?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of executives who have elevated their leadership with BBS Consulting Group.
              </p>
              <a
                href="/#contact"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
              >
                Get in Touch
              </a>
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
