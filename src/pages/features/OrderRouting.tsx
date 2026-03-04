import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import OrderRoutingDemo from "@/components/features/OrderRoutingDemo";
import { Route, Settings, Package, RefreshCw, Shield, SplitSquareVertical } from "lucide-react";

const OrderRouting = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <FeatureHero
          icon={Route}
          badge="Smart Order Routing"
          title="One Invoice —"
          highlight="Multiple Destinations"
          description="A single customer order can contain products from different suppliers needing different decoration methods. Our AI splits that one invoice and routes each line item to the right supplier and decorator automatically."
        />

        {/* Interactive Demo */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Watch One Invoice Split Across Suppliers & Decorators
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                One customer order with mixed products gets automatically split — each line item routed to the right supplier for fulfillment and the right decorator for finishing.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <OrderRoutingDemo />
            </div>
          </div>
        </section>

        <FeatureSection
          title="Intelligent Invoice Splitting"
          description="One order, multiple fulfillment paths — handled automatically by the routing engine."
          features={[
            {
              icon: SplitSquareVertical,
              title: "Multi-Supplier Split",
              description: "Products from different suppliers in one order get separated and sent to the correct fulfillment source automatically.",
            },
            {
              icon: Settings,
              title: "Decoration-Based Routing",
              description: "Embroidery goes to your embroidery specialist, DTG to your print house, screen print to your screen printer — all from one invoice.",
            },
            {
              icon: Package,
              title: "White-Label Fulfillment",
              description: "Your customers see one seamless order. Behind the scenes, products are sourced and decorated by the best-matched partners.",
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
              description: "Order status updates flow back from every supplier and decorator so you always know where things stand.",
            },
            {
              icon: Shield,
              title: "Manual Override",
              description: "Jump in and reassign line items manually whenever special situations require it.",
            },
            {
              icon: Route,
              title: "Unlimited Partners",
              description: "Work with any number of suppliers and decorators from one central dashboard — no limits on routing destinations.",
            },
          ]}
          reversed
        />

        <FeatureCTA
          title="Automate Your Order Flow"
          description="Stop manually splitting invoices. Let AI-powered routing handle multi-supplier, multi-decorator logistics."
        />
      </main>
      <Footer />
    </div>
  );
};

export default OrderRouting;
