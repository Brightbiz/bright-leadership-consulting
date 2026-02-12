import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactHero from "@/components/heroes/ContactHero";
import MultiStepContactForm from "@/components/MultiStepContactForm";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Clock, MessageCircle, Users, Award, Sparkles } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    value: "0333 335 5045",
    description: "Mon-Fri from 9am to 6pm",
    action: "tel:03333355045",
  },
  {
    icon: Mail,
    title: "Email",
    value: "info@brightleadershipconsulting.com",
    description: "We'll respond within 24 hours",
    action: "mailto:info@brightleadershipconsulting.com",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "United Kingdom",
    description: "Serving clients globally",
    action: null,
  },
  {
    icon: Clock,
    title: "Business Hours",
    value: "9:00 AM - 6:00 PM",
    description: "Monday to Friday (GMT)",
    action: null,
  },
];

const faqs = [
  {
    question: "How do I book a consultation?",
    answer: "Simply fill out the contact form below or call us directly. We'll schedule a complimentary 30-minute discovery call to understand your needs.",
  },
  {
    question: "What is your typical response time?",
    answer: "We aim to respond to all inquiries within 2 business hours during office hours, and within 24 hours for weekend or after-hours messages.",
  },
  {
    question: "Do you offer virtual consultations?",
    answer: "Yes! We work with clients globally via video conferencing. All our coaching and many training programs can be delivered virtually.",
  },
  {
    question: "What areas do you cover?",
    answer: "We serve clients throughout the UK and internationally. Our corporate retreats can be arranged at premium locations worldwide.",
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <ContactHero />

        {/* Contact Methods Grid */}
        <section className="py-20 relative overflow-hidden bg-muted/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(var(--primary)/0.04),transparent_60%)]" />
          <div className="container-narrow relative">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((item, index) => (
                <AnimatedSection key={item.title} delay={index * 100}>
                  <div className="h-full rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-8 text-center group hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    {item.action ? (
                      <a 
                        href={item.action}
                        className="text-primary font-medium hover:underline block mb-1 text-sm"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-foreground font-medium mb-1 text-sm">{item.value}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Multi-Step Contact Form Section */}
        <section id="contact-form" className="section-padding relative overflow-hidden">
          <div className="absolute top-20 -right-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="container-narrow relative">
            <AnimatedSection className="text-center mb-12">
              <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 px-4 py-1.5">
                <Sparkles className="h-3 w-3 mr-1.5" />
                Get in Touch
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Complete the quick form below and we'll get back to you within 24 hours.
              </p>
            </AnimatedSection>

            <AnimatedSection>
              <div className="relative rounded-3xl bg-card/90 backdrop-blur-sm border border-border/50 p-8 md:p-12 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-secondary/8 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary/8 rounded-full blur-3xl" />
                <div className="relative">
                  <MultiStepContactForm />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding relative overflow-hidden bg-muted/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--secondary)/0.04),transparent_60%)]" />
          <div className="container-narrow relative">
            <AnimatedSection className="text-center mb-12">
              <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 px-4 py-1.5">
                <MessageCircle className="h-3 w-3 mr-1.5" />
                Quick Answers
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Quick answers to common questions about getting in touch.
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <AnimatedSection key={faq.question} delay={index * 100}>
                  <div className="h-full rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-7 group hover:border-primary/20 hover:shadow-lg transition-all duration-500">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <MessageCircle className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-transparent to-secondary/[0.03]" />
          <div className="container-narrow relative">
            <div className="flex flex-wrap justify-center gap-10 md:gap-20">
              {[
                { icon: Users, value: "5,000+", label: "Leaders Trained" },
                { icon: Award, value: "CPD", label: "Accredited Programs" },
                { icon: MapPin, value: "25+", label: "Countries Served" },
              ].map((stat, index) => (
                <AnimatedSection key={stat.label} delay={index * 100}>
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center shadow-sm">
                      <stat.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <div className="font-serif text-3xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
