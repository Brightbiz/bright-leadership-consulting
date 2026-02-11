import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactHero from "@/components/heroes/ContactHero";
import MultiStepContactForm from "@/components/MultiStepContactForm";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, MessageCircle, Users, Award } from "lucide-react";

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
        <section className="py-16 bg-muted/30">
          <div className="container-narrow">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((item, index) => (
                <AnimatedSection key={item.title} delay={index * 100}>
                  <Card className="h-full hover:shadow-lg transition-shadow group">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      {item.action ? (
                        <a 
                          href={item.action}
                          className="text-primary font-medium hover:underline block mb-1"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-foreground font-medium mb-1">{item.value}</p>
                      )}
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Multi-Step Contact Form Section */}
        <section id="contact-form" className="py-20">
          <div className="container-narrow">
            <AnimatedSection className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Complete the quick form below and we'll get back to you within 24 hours.
              </p>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-10 shadow-lg">
                <MultiStepContactForm />
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-muted/30">
          <div className="container-narrow">
            <AnimatedSection className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Quick answers to common questions about getting in touch.
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <AnimatedSection key={faq.question} delay={index * 100}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="h-4 w-4 text-secondary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16">
          <div className="container-narrow">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {[
                { icon: Users, value: "5,000+", label: "Leaders Trained" },
                { icon: Award, value: "CPD", label: "Accredited Programs" },
                { icon: MapPin, value: "25+", label: "Countries Served" },
              ].map((stat, index) => (
                <AnimatedSection key={stat.label} delay={index * 100}>
                  <div className="flex items-center gap-4 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-serif text-2xl font-bold text-foreground">{stat.value}</div>
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
