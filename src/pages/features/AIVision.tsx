import { Navbar } from "@/components/landing/Navbar";
import { SEO } from "@/components/seo/SEO";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { VisionAgentFlow } from "@/components/features/VisionAgentFlow";
import { FeatureSection } from "@/components/features/FeatureSection";
import { Eye, FileText, Mail, Image, AlertTriangle, Zap, ExternalLink } from "lucide-react";

const AIVision = () => {
  return (
    <div className="min-h-screen">
      <SEO title="AI Vision for Artwork QA | Brand-Shop.AI" description="Automated artwork inspection, proofing, and quality checks powered by AI vision." path="/features/ai-vision"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "AI Vision for Artwork QA",
          description: "Automated artwork inspection, proofing, and quality checks powered by AI vision.",
          provider: { "@type": "Organization", name: "Brand-Shop.AI", url: "https://brand-shop.ai" },
        }} />
      <Navbar />
      <main>
        <FeatureHero
          icon={Eye}
          badge="Standalone Solution"
          title="AI Vision Agent —"
          highlight="Reads Everything"
          description="Eliminate manual data entry. Our AI extracts order data from handwritten notes, PDFs, emails, and images with 99%+ accuracy."
        />

        {/* Interactive Extraction Demo */}
        <VisionAgentFlow />

        {/* Document Types */}
        <FeatureSection
          title="Handles Any Input"
          description="No matter how your customers send orders, the AI Vision agent can process them."
          features={[
            {
              icon: Mail,
              title: "Email Attachments",
              description: "Connect to your inbox and let AI extract orders from incoming emails and attachments automatically.",
            },
            {
              icon: FileText,
              title: "PDFs & Documents",
              description: "Purchase orders, invoices, and contracts in any PDF format are parsed with high accuracy.",
            },
            {
              icon: Image,
              title: "Handwritten Notes",
              description: "Photos of handwritten POs, faxes, and scribbled orders are read with surprising accuracy.",
            },
          ]}
        />

        {/* Error Detection & Integration */}
        <FeatureSection
          title="Catches Errors Before They Cost You"
          description="The AI doesn't just extract — it validates and verifies."
          features={[
            {
              icon: AlertTriangle,
              title: "Error Detection",
              description: "Unusual quantities, mismatched prices, and potential typos are flagged before processing.",
            },
            {
              icon: Mail,
              title: "Auto-Response",
              description: "AI can email customers directly to clarify issues, resolving problems before they reach your decorator.",
            },
            {
              icon: ExternalLink,
              title: "Printavo Integration",
              description: "Verified orders flow directly into Printavo as new orders with all details pre-filled.",
            },
            {
              icon: Zap,
              title: "DecoNetwork Sync",
              description: "Seamless sync with DecoNetwork for decorator and supplier management.",
            },
          ]}
          reversed
        />

        <FeatureCTA
          title="Stop Typing. Start Extracting."
          description="Let AI handle your data entry while you focus on growing your business."
        />
      </main>
      <Footer />
    </div>
  );
};

export default AIVision;
