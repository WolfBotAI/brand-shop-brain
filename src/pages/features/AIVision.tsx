import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { Eye, FileText, Mail, Image, CheckCircle, Zap } from "lucide-react";

const AIVision = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <FeatureHero
          icon={Eye}
          badge="Standalone Solution"
          title="AI Vision Agent —"
          highlight="Reads Everything"
          description="Eliminate manual data entry. Our AI extracts order data from handwritten notes, PDFs, emails, and images with 99%+ accuracy."
        />

        <FeatureSection
          title="Document Types Supported"
          description="The AI Vision agent handles any format your customers or suppliers send."
          features={[
            {
              icon: FileText,
              title: "PDFs & Documents",
              description: "Purchase orders, invoices, and contracts in any PDF format are parsed automatically.",
            },
            {
              icon: Mail,
              title: "Email Attachments",
              description: "Connect to your inbox and let AI extract orders from incoming emails and attachments.",
            },
            {
              icon: Image,
              title: "Handwritten Notes",
              description: "Photos of handwritten POs, faxes, and scribbled orders are read with surprising accuracy.",
            },
          ]}
        />

        <FeatureSection
          title="Works With Your Systems"
          description="Push extracted data directly to your existing tools — no manual copying."
          features={[
            {
              icon: Zap,
              title: "Printavo Integration",
              description: "Orders flow directly into Printavo for production scheduling and tracking.",
            },
            {
              icon: Zap,
              title: "DecoNetwork Sync",
              description: "Seamless sync with DecoNetwork for decorator and supplier management.",
            },
            {
              icon: CheckCircle,
              title: "Review Before Commit",
              description: "AI extracts the data, you approve it. Full control with minimal effort.",
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
