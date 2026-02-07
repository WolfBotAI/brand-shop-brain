import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { StoreBuilderJourney } from "@/components/features/StoreBuilderJourney";
import { FeatureSection } from "@/components/features/FeatureSection";
import { Store, Settings, Shield, BarChart3, Palette, Lock } from "lucide-react";

const StoreBuilder = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <FeatureHero
          icon={Store}
          badge="AI Store Builder"
          title="Your Clients Build Stores Themselves —"
          highlight="Guided by AI"
          description="AI-powered onboarding guides your clients through store creation step by step. No coding, no design skills, no hand-holding required."
        />

        {/* Interactive Journey Demo */}
        <StoreBuilderJourney />

        {/* Distributor Controls Section */}
        <FeatureSection
          title="You Stay in Control"
          description="Pre-configure everything. Your clients customize within the boundaries you set."
          features={[
            {
              icon: Palette,
              title: "Theme Presets",
              description: "Create approved themes clients can choose from. Lock fonts, layouts, and brand elements.",
            },
            {
              icon: Settings,
              title: "Product Catalog",
              description: "Define which products are available. Set margins, pricing rules, and decoration options.",
            },
            {
              icon: Lock,
              title: "Lock Settings",
              description: "Prevent clients from changing critical settings while giving them creative freedom.",
            },
            {
              icon: Shield,
              title: "Brand Compliance",
              description: "Ensure every store meets your brand standards automatically.",
            },
            {
              icon: BarChart3,
              title: "Performance Tracking",
              description: "Monitor all stores from one dashboard. See sales, orders, and client activity.",
            },
            {
              icon: Store,
              title: "Unlimited Stores",
              description: "Scale to hundreds of client stores without additional management overhead.",
            },
          ]}
        />

        <FeatureCTA
          title="Ready to Simplify Store Creation?"
          description="Let your clients build their own stores while you focus on growing your business."
        />
      </main>
      <Footer />
    </div>
  );
};

export default StoreBuilder;
