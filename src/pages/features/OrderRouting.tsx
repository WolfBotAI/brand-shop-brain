import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import OrderRoutingDemo from "@/components/features/OrderRoutingDemo";
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
          description="AI analyzes each order and routes it to the right decorator based on your rules. Product type, supplier, decoration method — set it once, never think about it again."
        />

        {/* Interactive Demo */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Watch AI Route Orders in Real-Time
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Orders flow in, AI reads the product type, and instantly sends to the right decorator — no manual assignment needed.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <OrderRoutingDemo />
            </div>
          </div>
        </section>

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
          description="Stop manually assigning orders. Let AI-powered routing handle the logistics."
        />
      </main>
      <Footer />
    </div>
  );
};

export default OrderRouting;
