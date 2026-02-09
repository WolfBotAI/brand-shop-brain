import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { SiteMigrationDemo } from "@/components/features/SiteMigrationDemo";
import { ArrowRightLeft, Package, Users, FileText, PlayCircle, Globe, RotateCcw } from "lucide-react";

const seamlessDataFeatures = [
  {
    icon: Package,
    title: "Product Import",
    description: "Bulk import products with images, pricing, and variants intact. No manual data entry required.",
  },
  {
    icon: Users,
    title: "Customer Migration",
    description: "Transfer customer accounts, order history, and preferences to maintain relationships.",
  },
  {
    icon: FileText,
    title: "Order History",
    description: "Keep historical order data for reporting, analytics, and customer reordering.",
  },
];

const zeroDowntimeFeatures = [
  {
    icon: PlayCircle,
    title: "Parallel Running",
    description: "Test your new store while the old one stays live. No rush, no pressure.",
  },
  {
    icon: Globe,
    title: "DNS Cutover",
    description: "One-click domain switching when you're ready. We handle the technical details.",
  },
  {
    icon: RotateCcw,
    title: "Rollback Safety",
    description: "Instant rollback if anything goes wrong. Your data is always protected.",
  },
];

const SiteMigration = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <FeatureHero
        icon={ArrowRightLeft}
        badge="Site Migration"
        title="Migrate Your Sites —"
        highlight="Without the Headache"
        description="Bring your existing client stores to Brand-Shop.AI with our guided migration tools. We handle the complexity so you can focus on growing."
      />

      {/* Interactive Demo Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              See How Easy Migration Can Be
            </h2>
            <p className="text-lg text-muted-foreground">
              Our guided process takes you from your current platform to a fully operational Brand-Shop.AI store in minutes, not weeks.
            </p>
          </div>
          <SiteMigrationDemo />
        </div>
      </section>

      <FeatureSection
        title="Seamless Data Transfer"
        description="Everything you need migrates with you — products, customers, and complete order history."
        features={seamlessDataFeatures}
      />

      <FeatureSection
        title="Zero Downtime Migration"
        description="Switch when you're ready with our parallel running approach and instant rollback protection."
        features={zeroDowntimeFeatures}
        reversed
      />

      <FeatureCTA
        title="Ready to Migrate?"
        description="Let us handle the heavy lifting. Schedule a migration consultation and we'll map out your transition plan."
      />

      <Footer />
    </div>
  );
};

export default SiteMigration;
