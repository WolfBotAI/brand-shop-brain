import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { AISuggestionsDemo } from "@/components/features/AISuggestionsDemo";
import { Sparkles, TrendingUp, Users, ShoppingCart, Lightbulb, Target } from "lucide-react";

const AISuggestions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <FeatureHero
        icon={Sparkles}
        badge="AI Suggestions"
        title="AI That Knows —"
        highlight="What Sells Next"
        description="Let AI analyze sales patterns and recommend the right products to your clients. Stop guessing, start growing."
      />

      <AISuggestionsDemo />

      <FeatureSection
        title="Smart Recommendations"
        description="AI-powered insights that help you and your clients make better product decisions."
        features={[
          {
            icon: TrendingUp,
            title: "Trend Detection",
            description: "AI spots trending products before they peak, helping you stock up at the right time.",
          },
          {
            icon: Target,
            title: "Client Matching",
            description: "Get product suggestions tailored to each client's industry and customer base.",
          },
          {
            icon: Lightbulb,
            title: "Seasonal Insights",
            description: "Receive timely recommendations based on seasonal demand patterns.",
          },
        ]}
      />

      <FeatureSection
        title="Growth Engine"
        description="Turn AI insights into revenue with actionable recommendations."
        features={[
          {
            icon: Users,
            title: "Distributor Insights",
            description: "Know which products to pitch to which clients based on their sales history.",
          },
          {
            icon: ShoppingCart,
            title: "Client Upsells",
            description: "AI suggests complementary products to end customers at checkout.",
          },
          {
            icon: Sparkles,
            title: "Confidence Scores",
            description: "Each recommendation comes with a confidence score so you know what to prioritize.",
          },
        ]}
        reversed
      />

      <FeatureCTA
        title="Ready to Let AI Drive Growth?"
        description="See how AI-powered suggestions can help you recommend the right products to the right clients."
      />

      <Footer />
    </div>
  );
};

export default AISuggestions;
