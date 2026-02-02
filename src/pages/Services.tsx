import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicesHero from "@/components/heroes/ServicesHero";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Sparkles, Users, Target, Award, Clock, Globe } from "lucide-react";
import { Link } from "react-router-dom";

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
        <section id="comparison" className="py-20 lg:py-32">
          <div className="container-narrow">
            <AnimatedSection className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Our Expertise
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Comprehensive Leadership Solutions
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Each service is designed to meet you where you are and take you where you want to go.
              </p>
            </AnimatedSection>

            <div className="space-y-24">
              {serviceDetails.map((service, index) => (
                <AnimatedSection 
                  key={service.id}
                  animation={index % 2 === 0 ? "slide-right" : "slide-left"}
                >
                  <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      <Badge className={`mb-4 bg-gradient-to-r ${service.gradient} text-primary-foreground`}>
                        {service.subtitle}
                      </Badge>
                      <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Features list */}
                      <div className="grid sm:grid-cols-2 gap-3 mb-8">
                        {service.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center flex-shrink-0`}>
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                            <span className="text-foreground">{feature}</span>
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
                      <Card className="relative overflow-hidden">
                        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${service.gradient}`} />
                        <CardContent className="p-8">
                          <div className="grid grid-cols-3 gap-6">
                            {service.stats.map((stat) => (
                              <div key={stat.label} className="text-center">
                                <div className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-1">
                                  {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {stat.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-muted/30">
          <div className="container-narrow">
            <AnimatedSection className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Leaders Choose Us
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
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
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <ProcessSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* CTA */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Services;
