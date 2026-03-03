import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LogoMarquee from "@/components/LogoMarquee";
import StructuralProblemSection from "@/components/StructuralProblemSection";
import OfferSequencingSection from "@/components/OfferSequencingSection";
import ServicesSection from "@/components/ServicesSection";
import BenefitsSection from "@/components/BenefitsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ProcessSection from "@/components/ProcessSection";
import ContactSection from "@/components/ContactSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollProgress from "@/components/ScrollProgress";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead path="/" />
      <ScrollProgress />
      <Header />
      <main>
        <HeroSection />
        <LogoMarquee />
        <StructuralProblemSection />
        <OfferSequencingSection />
        <ServicesSection />
        <BenefitsSection />
        <TestimonialsSection />
        <ProcessSection />
        <ContactSection />
        <CTASection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;