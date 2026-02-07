import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { DashboardDemo } from "@/components/features/DashboardDemo";
import { FeatureSection } from "@/components/features/FeatureSection";
import { BarChart3, Store, DollarSign, Settings, TrendingUp, Users } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <FeatureHero
          icon={BarChart3}
          badge="Distributor Dashboard"
          title="Complete Visibility Into —"
          highlight="Every Store"
          description="Monitor performance, manage settings, and control margins across all your client stores from one powerful dashboard."
        />

        {/* Interactive Dashboard Demo */}
        <DashboardDemo />

        <FeatureSection
          title="Analytics & Insights"
          description="Real-time data to help you make smarter business decisions."
          features={[
            {
              icon: TrendingUp,
              title: "Revenue Tracking",
              description: "See sales, orders, and revenue by store, product, or time period at a glance.",
            },
            {
              icon: Store,
              title: "Per-Store Metrics",
              description: "Drill down into individual store performance with detailed analytics.",
            },
            {
              icon: Users,
              title: "Customer Insights",
              description: "Understand buying patterns, repeat customers, and growth opportunities.",
            },
          ]}
        />

        <FeatureSection
          title="Management Controls"
          description="Centralized settings for efficient multi-store management."
          features={[
            {
              icon: DollarSign,
              title: "Margin Controls",
              description: "Set and adjust margins per product, store, or globally with instant updates.",
            },
            {
              icon: Settings,
              title: "Shipping Settings",
              description: "Configure shipping rules, carriers, and rates from one place.",
            },
            {
              icon: BarChart3,
              title: "Tax Integration",
              description: "TaxJar integration handles tax calculation and compliance automatically.",
            },
          ]}
          reversed
        />

        <FeatureCTA
          title="Take Control of Your Business"
          description="Get the visibility and control you need to scale your distribution operation."
        />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
