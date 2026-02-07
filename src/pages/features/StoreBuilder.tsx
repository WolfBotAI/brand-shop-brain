import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { Store, Palette, ShoppingBag, Sparkles, Clock, Settings } from "lucide-react";

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

        <FeatureSection
          title="How It Works"
          description="A simple, guided process that gets stores live in minutes instead of weeks."
          features={[
            {
              icon: Sparkles,
              title: "AI-Guided Setup",
              description: "Our AI assistant walks clients through every step with voice or chat guidance, answering questions in real-time.",
            },
            {
              icon: Palette,
              title: "Brand Customization",
              description: "Logo upload, color selection, and theme presets make each store feel unique to the client's brand.",
            },
            {
              icon: ShoppingBag,
              title: "Product Selection",
              description: "Clients choose from your catalog with size/color configurations already set up by you.",
            },
            {
              icon: Settings,
              title: "Distributor Controls",
              description: "Pre-configure themes, products, margins, and lock settings as needed for consistency.",
            },
            {
              icon: Clock,
              title: "Go Live Fast",
              description: "Stores launch in minutes. Clients can start selling same-day with zero setup fees.",
            },
            {
              icon: Store,
              title: "Scalable Architecture",
              description: "Support hundreds of client stores from one dashboard with centralized management.",
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
