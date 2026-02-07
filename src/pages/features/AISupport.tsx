import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { ChatDeploymentDemo } from "@/components/features/ChatDeploymentDemo";
import { FeatureSection } from "@/components/features/FeatureSection";
import { MessageSquare, Phone, Globe, Zap, Brain, Clock } from "lucide-react";

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

        {/* Interactive Deployment Demo */}
        <ChatDeploymentDemo />

        {/* Multi-Channel Features */}
        <FeatureSection
          title="Every Channel, One Brain"
          description="Your customers can reach you anywhere. The AI remembers everything across all channels."
          features={[
            {
              icon: MessageSquare,
              title: "Web Chat Widget",
              description: "Embedded chat that matches your brand. Handles inquiries, order status, and support 24/7.",
            },
            {
              icon: Phone,
              title: "Voice & Phone",
              description: "Phone and voice calls handled by the same AI. Real-time tracking lookups during conversations.",
            },
            {
              icon: Brain,
              title: "Unified Memory",
              description: "Start on chat, continue on phone — the AI remembers everything. No repetition for customers.",
            },
          ]}
        />

        {/* Deployment Benefits */}
        <FeatureSection
          title="Deploy in Minutes, Not Months"
          description="Works with your existing tech stack. No platform migration required."
          features={[
            {
              icon: Globe,
              title: "Any Website",
              description: "Works on Shopify, WordPress, custom sites, or any platform with HTML access.",
            },
            {
              icon: Zap,
              title: "Instant Activation",
              description: "Go live in minutes. No complex setup, no IT department required.",
            },
            {
              icon: Clock,
              title: "24/7 Availability",
              description: "Never miss a customer inquiry. AI handles support around the clock.",
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
