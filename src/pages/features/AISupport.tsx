import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { MessageSquare, Phone, Globe, Zap, Brain, Code } from "lucide-react";

const AISupport = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <FeatureHero
          icon={MessageSquare}
          badge="Works on Any Website"
          title="24/7 AI Support Agent —"
          highlight="Deployed Anywhere"
          description="Add our AI chat and voice assistant to any website, app, or platform. No migration needed — just embed and go."
        />

        <FeatureSection
          title="Standalone Deployment"
          description="Use our AI support without switching platforms. Works with your existing tech stack."
          features={[
            {
              icon: Globe,
              title: "Any Website",
              description: "Simple embed code works on Shopify, WordPress, custom sites, or any platform with HTML access.",
            },
            {
              icon: Code,
              title: "Easy Integration",
              description: "Copy-paste installation or use our API for deeper integrations with your systems.",
            },
            {
              icon: Zap,
              title: "Instant Activation",
              description: "Go live in minutes. No complex setup, no IT department required.",
            },
          ]}
        />

        <FeatureSection
          title="Multi-Channel AI"
          description="One AI brain powers every customer touchpoint with unified memory."
          features={[
            {
              icon: MessageSquare,
              title: "Chat Widget",
              description: "Embedded chat that matches your brand. Handles inquiries, order status, and support 24/7.",
            },
            {
              icon: Phone,
              title: "Voice Support",
              description: "Phone and voice calls handled by the same AI. Real-time tracking lookups during conversations.",
            },
            {
              icon: Brain,
              title: "Unified Memory",
              description: "The AI remembers every interaction across channels. No repetition for your customers.",
            },
          ]}
          reversed
        />

        <FeatureCTA
          title="Add AI Support to Your Website Today"
          description="Deploy 24/7 intelligent customer support without changing your platform."
        />
      </main>
      <Footer />
    </div>
  );
};

export default AISupport;
