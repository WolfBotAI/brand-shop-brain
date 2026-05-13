import { Navbar } from "@/components/landing/Navbar";
import { SEO } from "@/components/seo/SEO";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { MultiStoreDemo } from "@/components/features/MultiStoreDemo";
import { LayoutGrid, Settings, Globe, Layers, RefreshCw, Database } from "lucide-react";

const MultiStoreManagement = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Multi-Store Management | Brand-Shop.AI" description="Manage every client store from a single dashboard. Bulk pricing, sync, and theming included." path="/features/multi-store"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Multi-Store Management",
          description: "Manage every client store from a single dashboard. Bulk pricing, sync, and theming included.",
          provider: { "@type": "Organization", name: "Brand-Shop.AI", url: "https://brand-shop.ai" },
        }} />
      <Navbar />

      <FeatureHero
        icon={LayoutGrid}
        badge="Multi-Store Management"
        title="One Dashboard —"
        highlight="Every Store"
        description="Manage all your client websites from a single, centralized command center. No more switching between accounts or losing track of orders."
      />

      <MultiStoreDemo />

      <FeatureSection
        title="Centralized Control"
        description="Everything you need to manage multiple client stores, all in one place."
        features={[
          {
            icon: Settings,
            title: "Unified Settings",
            description: "Manage themes, products, and pricing across all stores from one dashboard.",
          },
          {
            icon: Globe,
            title: "Site Migration",
            description: "Connect existing client sites or create new ones with our guided migration tools.",
          },
          {
            icon: Layers,
            title: "Template Library",
            description: "Apply pre-built themes and layouts to new stores in seconds.",
          },
        ]}
      />

      <FeatureSection
        title="Bulk Operations"
        description="Save hours by updating multiple stores at once instead of one by one."
        features={[
          {
            icon: RefreshCw,
            title: "Bulk Pricing",
            description: "Update pricing across all stores or specific categories with a single action.",
          },
          {
            icon: Database,
            title: "Product Sync",
            description: "Push new products to multiple stores simultaneously while maintaining custom catalogs.",
          },
          {
            icon: LayoutGrid,
            title: "Settings Sync",
            description: "Apply shipping, tax, and policy changes across your entire store network.",
          },
        ]}
        reversed
      />

      <FeatureCTA
        title="Ready to Simplify Store Management?"
        description="See how Brand-Shop.AI can help you manage all your client stores from one place."
      />

      <Footer />
    </div>
  );
};

export default MultiStoreManagement;
