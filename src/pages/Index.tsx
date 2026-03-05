import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StructuralProblemSection from "@/components/StructuralProblemSection";
import InstrumentSection from "@/components/InstrumentSection";
import OfferSequencingSection from "@/components/OfferSequencingSection";
import CommissionedBySection from "@/components/CommissionedBySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead path="/" />
      <Header />

      <main>
        <HeroSection />
        <StructuralProblemSection />
        <InstrumentSection />
        <OfferSequencingSection />
        <CommissionedBySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
