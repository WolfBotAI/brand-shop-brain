import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { Route, Settings, Package, RefreshCw, Shield, Truck } from "lucide-react";

const OrderRouting = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <FeatureHero
          icon={Route}
          badge="Smart Order Routing"
          title="One Order —"
          highlight="Routed Automatically"
          description="Orders automatically flow to the right decorator or supplier based on your rules. Set it once, never think about it again."
        />

        <FeatureSection
          title="Product-Based Routing"
          description="Route orders based on what's being ordered. You define the rules, the system handles the rest."
          features={[
            {
              icon: Package,
              title: "By Product Type",
              description: "T-shirts go to Decorator A, embroidery to Decorator B. Each product category has its home.",
            },
            {
              icon: Settings,
              title: "By Supplier",
              description: "Brand X products automatically route to Supplier Y. Maintain vendor relationships effortlessly.",
            },
            {
              icon: Truck,
              title: "By Decoration Method",
              description: "Screen print, DTG, embroidery — each method routes to specialists who do it best.",
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
              title: "Multi-Decorator Support",
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
