import { Navbar } from "@/components/landing/Navbar";
import { SEO } from "@/components/seo/SEO";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { DashboardDemo } from "@/components/features/DashboardDemo";
import { FeatureSection } from "@/components/features/FeatureSection";
import { BarChart3, Store, DollarSign, Settings, TrendingUp, Users } from "lucide-react";

const Reporting = () => {
  return (
    <div className="min-h-screen">
      <SEO title="Advanced Reporting | Brand-Shop.AI" description="Custom reports, exports, and scheduled deliveries to share performance with your team." path="/features/reporting"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Advanced Reporting",
          description: "Custom reports, exports, and scheduled deliveries to share performance with your team.",
          provider: { "@type": "Organization", name: "Brand-Shop.AI", url: "https://brand-shop.ai" },
        }} />
      <Navbar />
      <main>
        <FeatureHero
          icon={BarChart3}
          badge="Reporting & Analytics"
          title="Distributor & Store-Level —"
          highlight="Reporting"
          description="Monitor performance across all stores or drill into individual store metrics. Real-time data to help you make smarter business decisions."
        />

        <DashboardDemo />

        <FeatureSection
          title="Distributor-Level Reports"
          description="See the big picture across your entire distribution operation."
          features={[
            {
              icon: TrendingUp,
              title: "Cross-Store Revenue",
              description: "Aggregate revenue, orders, and margins across all your client stores in one view.",
            },
            {
              icon: Store,
              title: "Top Performing Stores",
              description: "Rank stores by revenue, growth rate, or order volume to identify winners.",
            },
            {
              icon: Users,
              title: "Client Activity",
              description: "See which clients are most active and which need attention or re-engagement.",
            },
          ]}
        />

        <FeatureSection
          title="Store-Level Reports"
          description="Drill into individual store performance for granular insights."
          features={[
            {
              icon: DollarSign,
              title: "Per-Store Sales",
              description: "Revenue breakdowns by product, category, and time period for each store.",
            },
            {
              icon: Settings,
              title: "Product Performance",
              description: "See which products sell best in each store. Optimize catalogs based on data.",
            },
            {
              icon: BarChart3,
              title: "Order History",
              description: "Complete order timeline with status tracking and customer details per store.",
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

export default Reporting;
