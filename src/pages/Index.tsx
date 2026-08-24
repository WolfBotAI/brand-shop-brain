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
        title="Branded Merch Store Software for Apparel Distributors"
        description="Brand-Shop.AI runs company stores for apparel distributors and decorators: one catalog across every supplier, automated order routing, and AI voice, chat and vision agents. Book a demo."
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
