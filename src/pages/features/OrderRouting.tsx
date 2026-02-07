import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { Route, Settings, MapPin, Zap, RefreshCw, Shield } from "lucide-react";

const OrderRouting = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <FeatureHero
          icon={Route}
          badge="Smart Order Routing"
          title="One Order —"
          highlight="Infinite Routing Options"
          description="Automatically distribute orders to the right decorators and suppliers based on your rules. No manual assignment needed."
        />

        <FeatureSection
          title="Intelligent Distribution"
          description="Set up rules once and let the system handle order flow automatically."
          features={[
            {
              icon: Settings,
              title: "Custom Rules",
              description: "Route by product type, order size, turnaround time, or any criteria that matters to your business.",
            },
            {
              icon: MapPin,
              title: "Geographic Routing",
              description: "Send orders to the nearest decorator for faster delivery and lower shipping costs.",
            },
            {
              icon: Zap,
              title: "Capacity-Based",
              description: "Balance workload across decorators based on their current capacity and availability.",
            },
          ]}
        />

        <FeatureSection
          title="Complete Control"
          description="Automation with the flexibility to override when needed."
          features={[
            {
              icon: RefreshCw,
              title: "Real-Time Sync",
              description: "Order status updates flow back from decorators so you always know where things stand.",
            },
            {
              icon: Shield,
              title: "Manual Override",
              description: "Jump in and reassign orders manually whenever special situations require it.",
            },
            {
              icon: Route,
              title: "Multi-Supplier Support",
              description: "Work with any number of decorators and suppliers from one central dashboard.",
            },
          ]}
          reversed
        />

        <FeatureCTA
          title="Automate Your Order Flow"
          description="Stop manually assigning orders. Let smart routing handle the logistics."
        />
      </main>
      <Footer />
    </div>
  );
};

export default OrderRouting;
