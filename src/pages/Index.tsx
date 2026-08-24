import { SEO } from "@/components/seo/SEO";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ThreeWaysSection } from "@/components/landing/ThreeWaysSection";
import { IntroSection } from "@/components/landing/IntroSection";
import { PersonasSection } from "@/components/landing/PersonasSection";
import { IntroducingSection } from "@/components/landing/IntroducingSection";
import { SeamlessSection } from "@/components/landing/SeamlessSection";
import { PackagesSection } from "@/components/landing/PackagesSection";
import { ConnectSection } from "@/components/landing/ConnectSection";
import { Integrations } from "@/components/landing/Integrations";
import { PopUpStoresSection } from "@/components/landing/PopUpStoresSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="AI-Powered Company Store Software for Apparel Distributors | Brand-Shop.AI"
        description="Launch client company stores in minutes with every supplier in one catalog and automated order routing to any decorator. Calculate your savings or book a 15-minute demo today."
        path="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Brand-Shop.AI",
            url: "https://brand-shop.ai",
            description: "AI-powered platform for promotional product distributors and decorators.",
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Brand-Shop.AI",
            url: "https://brand-shop.ai",
          },
        ]}
      />
      <Navbar />
      <main>
        <Hero />
        <ThreeWaysSection />
        <IntroSection />
        <PersonasSection />
        <IntroducingSection />
        <PackagesSection />
        <SeamlessSection />
        <ConnectSection />
        <Integrations />
        <PopUpStoresSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
