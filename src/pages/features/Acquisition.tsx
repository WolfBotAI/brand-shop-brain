import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { Users, Target, Megaphone, Brain, Mail, TrendingUp } from "lucide-react";

const Acquisition = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <FeatureHero
          icon={Users}
          badge="Acquisition Engine"
          title="Find Buyers. Learn Personalities."
          highlight="Convert Automatically."
          description="AI-powered customer acquisition that creates buyer avatars, tests hundreds of ad variations, and nurtures leads with personality-aware messaging."
        />

        <FeatureSection
          title="Intelligent Targeting"
          description="AI discovers and profiles your ideal customers automatically."
          features={[
            {
              icon: Target,
              title: "Buyer Avatar Research",
              description: "AI analyzes demographics, behavior, and intent to build detailed buyer profiles.",
            },
            {
              icon: Brain,
              title: "DISC Profiling",
              description: "Understand personality types to communicate in ways that resonate with each lead.",
            },
            {
              icon: TrendingUp,
              title: "Continuous Learning",
              description: "The system gets smarter over time, refining targeting based on conversion data.",
            },
          ]}
        />

        <FeatureSection
          title="Multi-Channel Advertising"
          description="Reach buyers everywhere they spend time online."
          features={[
            {
              icon: Megaphone,
              title: "19+ Channels",
              description: "Facebook, Instagram, TikTok, Google, LinkedIn, and more — all from one platform.",
            },
            {
              icon: Users,
              title: "100s of Variations",
              description: "AI generates and tests hundreds of ad creatives to find the winning combinations.",
            },
            {
              icon: Mail,
              title: "Lead Nurturing",
              description: "Automated email and SMS sequences keep leads warm until they're ready to buy.",
            },
          ]}
          reversed
        />

        <FeatureCTA
          title="Start Acquiring Customers Today"
          description="Let AI find and convert your next wave of B2B clients."
        />
      </main>
      <Footer />
    </div>
  );
};

export default Acquisition;
