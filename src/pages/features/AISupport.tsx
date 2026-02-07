import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { ChatDeploymentDemo } from "@/components/features/ChatDeploymentDemo";
import { FeatureSection } from "@/components/features/FeatureSection";
import { MessageSquare, Phone, Globe, Brain, Languages, Mail } from "lucide-react";

const AISupport = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <FeatureHero
          icon={MessageSquare}
          badge="AI-Powered Customer Support"
          title="24/7 AI Support Agent —"
          highlight="Voice, Chat & Social"
          description="AI handles every customer interaction across voice, chat, SMS, email, Facebook & Instagram. 20+ languages, shared memory, natural conversations."
        />

        {/* Interactive Deployment Demo */}
        <ChatDeploymentDemo />

        {/* Voice Features */}
        <FeatureSection
          title="AI Voice That Speaks Their Language"
          description="Phone calls handled by AI in 20+ languages. Natural-sounding, knows the customer, instant responses."
          features={[
            {
              icon: Phone,
              title: "Natural Voice Calls",
              description: "AI answers phone calls with natural speech. Customers think they're talking to a real person.",
            },
            {
              icon: Languages,
              title: "20+ Languages",
              description: "Spanish, Mandarin, French, and more. Automatically detects and responds in the caller's language.",
            },
            {
              icon: Brain,
              title: "Caller Recognition",
              description: "AI knows who's calling instantly. Order history, preferences, and past conversations at the ready.",
            },
          ]}
        />

        {/* All Channels */}
        <FeatureSection
          title="Every Channel, One Brain"
          description="Your customers can reach you anywhere. The AI remembers everything across all channels."
          features={[
            {
              icon: MessageSquare,
              title: "Facebook & Instagram",
              description: "AI handles DMs on Facebook and Instagram. Same knowledge, same memory as every other channel.",
            },
            {
              icon: Mail,
              title: "SMS & Email",
              description: "Text messages and emails handled automatically. Customers get instant responses 24/7.",
            },
            {
              icon: Globe,
              title: "Web Chat Widget",
              description: "Embedded chat on any website. Works on Shopify, WordPress, or custom sites with one line of code.",
            },
          ]}
          reversed
        />

        {/* Shared Memory */}
        <FeatureSection
          title="Shared Memory Across All Channels"
          description="Start on Instagram, continue on phone — the AI remembers everything. No repetition, no frustration."
          features={[
            {
              icon: Brain,
              title: "Unified Memory",
              description: "Every conversation, every channel, remembered. AI picks up right where you left off.",
            },
            {
              icon: Phone,
              title: "Seamless Handoffs",
              description: "Customer mentions their Instagram message on a phone call? AI already knows about it.",
            },
            {
              icon: MessageSquare,
              title: "Full Context",
              description: "Order history, preferences, past issues — AI has complete context for every interaction.",
            },
          ]}
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
