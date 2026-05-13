import { Navbar } from "@/components/landing/Navbar";
import { SEO } from "@/components/seo/SEO";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { KPIReportsDemo } from "@/components/features/KPIReportsDemo";
import { PieChart, TrendingUp, DollarSign, BarChart3, Filter, FileText } from "lucide-react";

const KPIReports = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="KPI Reports & Analytics | Brand-Shop.AI" description="Track best sellers, margins, and trends across all stores with detailed KPI reports." path="/features/kpi-reports"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "KPI Reports & Analytics",
          description: "Track best sellers, margins, and trends across all stores with detailed KPI reports.",
          provider: { "@type": "Organization", name: "Brand-Shop.AI", url: "https://brand-shop.ai" },
        }} />
      <Navbar />

      <FeatureHero
        icon={PieChart}
        badge="KPI Reports"
        title="Know Your Numbers —"
        highlight="Down to Every Detail"
        description="Track best sellers, analyze margins, and drill down into performance by product, store, or category. Data-driven decisions made easy."
      />

      <KPIReportsDemo />

      <FeatureSection
        title="Performance Tracking"
        description="See what's working across all your stores with clear, actionable metrics."
        features={[
          {
            icon: TrendingUp,
            title: "Best Sellers",
            description: "Track top-performing products across all stores and identify what drives sales.",
          },
          {
            icon: DollarSign,
            title: "Margin Analysis",
            description: "See profitability per product, store, or category to optimize your pricing.",
          },
          {
            icon: BarChart3,
            title: "Trend Charts",
            description: "Visualize performance over time with interactive charts and graphs.",
          },
        ]}
      />

      <FeatureSection
        title="Custom Reports"
        description="Filter and export exactly the data you need, when you need it."
        features={[
          {
            icon: Filter,
            title: "Advanced Filters",
            description: "Slice data by date range, store, category, product type, or custom tags.",
          },
          {
            icon: FileText,
            title: "Export Options",
            description: "Download reports as PDF, CSV, or Excel for sharing with stakeholders.",
          },
          {
            icon: PieChart,
            title: "Scheduled Reports",
            description: "Set up automated reports delivered to your inbox on a weekly or monthly basis.",
          },
        ]}
        reversed
      />

      <FeatureCTA
        title="Ready to Master Your Metrics?"
        description="See how detailed KPI reports can help you make smarter business decisions."
      />

      <Footer />
    </div>
  );
};

export default KPIReports;
