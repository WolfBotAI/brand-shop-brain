import { Navbar } from "@/components/landing/Navbar";
import { SEO } from "@/components/seo/SEO";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { AISuggestionsDemo } from "@/components/features/AISuggestionsDemo";
import { Sparkles, CloudSun, DollarSign, Palette, ShoppingBag, MessageSquare } from "lucide-react";

const AISuggestions = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="AI Product Suggestions | Brand-Shop.AI" description="Smart product recommendations and upsells that boost average order value automatically." path="/features/ai-suggestions"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "AI Product Suggestions",
          description: "Smart product recommendations and upsells that boost average order value automatically.",
          provider: { "@type": "Organization", name: "Brand-Shop.AI", url: "https://brand-shop.ai" },
        }} />
      <Navbar />

      <FeatureHero
        icon={Sparkles}
        badge="AI Merch Advisor"
        title="Your Clients Tell AI What They Need —"
        highlight="It Finds the Perfect Merch"
        description="End customers describe their event, budget, and style preferences. AI searches your connected catalogs and recommends the best apparel — ready to add to their store with mockups."
      />

      <AISuggestionsDemo />

      <FeatureSection
        title="Smart Merchandise Selection"
        description="AI that understands what your clients actually need — not just what's popular."
        features={[
          {
            icon: MessageSquare,
            title: "Conversational Discovery",
            description: "Clients describe their goals — team uniforms, fundraiser gear, corporate swag — and AI asks the right follow-up questions.",
          },
          {
            icon: DollarSign,
            title: "Budget-Aware Picks",
            description: "Set a per-item or total budget and AI filters the catalog to show only what fits, with the best value options highlighted.",
          },
          {
            icon: CloudSun,
            title: "Weather & Season Smart",
            description: "AI factors in event timing, location weather, and seasonal trends to recommend the right weight, material, and style.",
          },
        ]}
      />

      <FeatureSection
        title="From Recommendation to Storefront"
        description="AI doesn't just suggest — it helps clients build their store around the perfect products."
        features={[
          {
            icon: ShoppingBag,
            title: "Add to Store with Mockups",
            description: "Clients with an existing store can add recommended items instantly — products appear with AI-generated mockups in their branding.",
          },
          {
            icon: Palette,
            title: "AI-Assisted Store Creation",
            description: "First-time clients describe their brand colors, style, and vertical — AI creates a themed storefront with their selected products.",
          },
          {
            icon: Sparkles,
            title: "Catalog-Connected Intelligence",
            description: "Recommendations pull from your actual connected catalogs — real inventory, real pricing, real availability.",
          },
        ]}
        reversed
      />

      <FeatureCTA
        title="Let AI Sell for Your Clients"
        description="Give every end customer a personal merch advisor that knows your catalog inside and out."
      />

      <Footer />
    </div>
  );
};

export default AISuggestions;
