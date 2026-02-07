import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { IntroSection } from "@/components/landing/IntroSection";
import { IntroducingSection } from "@/components/landing/IntroducingSection";
import { SeamlessSection } from "@/components/landing/SeamlessSection";
import { ConnectSection } from "@/components/landing/ConnectSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <IntroSection />
        <IntroducingSection />
        <SeamlessSection />
        <ConnectSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
