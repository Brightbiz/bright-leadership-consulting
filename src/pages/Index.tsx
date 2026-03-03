import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StructuralProblemSection from "@/components/StructuralProblemSection";
import OfferSequencingSection from "@/components/OfferSequencingSection";
import CommissionedBySection from "@/components/CommissionedBySection";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead path="/" />
      <ScrollProgress />
      <Header />
      <main>
        <HeroSection />
        <StructuralProblemSection />
        <OfferSequencingSection />
        <CommissionedBySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
