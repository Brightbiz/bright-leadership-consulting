import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicesHero from "@/components/heroes/ServicesHero";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Sparkles, Users, Target, Award, Globe } from "lucide-react";

const serviceDetails = [
  {
    id: "coaching",
    title: "Executive Coaching",
    subtitle: "1-on-1 Leadership Development",
    description: "Our personalized coaching programs are designed for senior executives and emerging leaders who want to accelerate their growth, enhance their leadership presence, and achieve breakthrough results.",
    features: [
      "Personalized development plan",
      "Weekly 60-minute sessions",
      "360-degree feedback assessment",
      "Goal setting & accountability",
      "Confidential safe space",
      "Unlimited email support",
    ],
    stats: [
      { value: "95%", label: "Client satisfaction" },
      { value: "6-12", label: "Month programs" },
      { value: "500+", label: "Leaders coached" },
    ],
    gradient: "from-primary to-primary/70",
  },
  {
    id: "training",
    title: "Executive Training",
    subtitle: "CPD Accredited Programs",
    description: "Our comprehensive training programs combine cutting-edge leadership theory with practical application. All programs are CPD accredited and designed to create lasting behavioral change.",
    features: [
      "CPD accredited certification",
      "Interactive workshops",
      "Real-world case studies",
      "Peer learning groups",
      "Post-training support",
      "Digital resource library",
    ],
    stats: [
      { value: "7+", label: "Course offerings" },
      { value: "33", label: "Training modules" },
      { value: "2,500+", label: "Graduates" },
    ],
    gradient: "from-secondary to-secondary/70",
  },
  {
    id: "retreats",
    title: "Corporate Retreats",
    subtitle: "Immersive Team Experiences",
    description: "Transform your leadership team through immersive retreat experiences. Our carefully designed programs combine strategic planning, team building, and personal development in inspiring settings.",
    features: [
      "Custom program design",
      "Luxury venue selection",
      "Expert facilitation",
      "Team diagnostics",
      "Action planning sessions",
      "Follow-up coaching",
    ],
    stats: [
      { value: "25+", label: "Countries served" },
      { value: "3-5", label: "Day programs" },
      { value: "100%", label: "Tailored content" },
    ],
    gradient: "from-primary to-secondary",
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <ServicesHero />

        {/* Detailed Service Sections */}
        <section id="comparison" className="section-padding relative overflow-hidden">
          <div className="absolute top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
          <div className="container-narrow relative">
            <AnimatedSection className="text-center mb-20">
              <Badge variant="outline" className="mb-4 px-4 py-1.5">
                <Sparkles className="h-3 w-3 mr-1.5" />
                Our Expertise
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Comprehensive Leadership Solutions
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Each service is designed to meet you where you are and take you where you want to go.
              </p>
            </AnimatedSection>

            <div className="space-y-32">
              {serviceDetails.map((service, index) => (
                <AnimatedSection 
                  key={service.id}
                  animation={index % 2 === 0 ? "slide-right" : "slide-left"}
                >
                  <div className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      <Badge className={`mb-4 bg-gradient-to-r ${service.gradient} text-primary-foreground`}>
                        {service.subtitle}
                      </Badge>
                      <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                        {service.description}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-4 mb-10">
                        {service.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-3 group">
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                              <Check className="h-3.5 w-3.5 text-primary-foreground" />
                            </div>
                            <span className="text-foreground text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button variant="teal" size="lg" className="group" asChild>
                        <a href="#contact">
                          Learn More
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </a>
                      </Button>
                    </div>

                    {/* Stats card */}
                    <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                      <div className="relative rounded-3xl bg-card/90 backdrop-blur-sm border border-border/50 overflow-hidden shadow-xl">
                        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.gradient}`} />
                        <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
                        <div className="relative p-10">
                          <div className="grid grid-cols-3 gap-8">
                            {service.stats.map((stat) => (
                              <div key={stat.label} className="text-center">
                                <div className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                                  {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {stat.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="section-padding relative overflow-hidden bg-muted/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.04),transparent_60%)]" />
          <div className="container-narrow relative">
            <AnimatedSection className="text-center mb-16">
              <Badge variant="outline" className="mb-4 px-4 py-1.5">
                <Award className="h-3 w-3 mr-1.5" />
                Why Us
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Why Leaders Choose Us
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Our unique approach combines proven methodologies with personalized attention.
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Award, title: "CPD Accredited", description: "All programs meet rigorous professional standards" },
                { icon: Users, title: "Expert Faculty", description: "Learn from seasoned leadership practitioners" },
                { icon: Target, title: "Results-Driven", description: "Measurable outcomes and accountability" },
                { icon: Globe, title: "Global Reach", description: "Serving leaders across 25+ countries" },
              ].map((item, index) => (
                <AnimatedSection key={item.title} delay={index * 100}>
                  <div className="h-full rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-8 text-center group hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <ProcessSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Services;
