import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ExecutiveProgramSection from "@/components/ExecutiveProgramSection";
import CoursesSection from "@/components/CoursesSection";
import LeadMagnetSection from "@/components/LeadMagnetSection";
import ProgramComparison from "@/components/ProgramComparison";
import BenefitsSection from "@/components/BenefitsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ProcessSection from "@/components/ProcessSection";
import ContactSection from "@/components/ContactSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ExecutiveProgramSection />
        <CoursesSection />
        <LeadMagnetSection />
        <ProgramComparison />
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