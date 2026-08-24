import { Navbar } from "@/components/landing/Navbar";
import { SEO } from "@/components/seo/SEO";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { StoreBuilderJourney } from "@/components/features/StoreBuilderJourney";
import { FeatureSection } from "@/components/features/FeatureSection";
import { Store, Settings, Shield, BarChart3, Palette, Lock, Sparkles, Users, Plug } from "lucide-react";
import { motion } from "framer-motion";

const storeOptions = [
  {
    icon: Sparkles,
    title: "AI-Powered Templates",
    description: "You create store templates using AI, then assign them to your clients. Full control over branding, products, and pricing.",
    badge: "Most Popular",
    color: "from-primary to-primary/70",
  },
  {
    icon: Users,
    title: "Client Self-Build",
    description: "Your clients build their own stores guided by AI — within the boundaries you set. No hand-holding required.",
    badge: "Self-Serve",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Plug,
    title: "Bring Your Own Store",
    description: "Connect existing WooCommerce, Shopify, or other 3rd-party ecommerce solutions. We integrate seamlessly.",
    badge: "Integration",
    color: "from-emerald-500 to-emerald-600",
  },
];

const StoreBuilder = () => {
  return (
    <div className="min-h-screen">
      <SEO title="AI Store Builder | Brand-Shop.AI" description="Spin up branded client stores in minutes with Brand-Shop.AI's AI-powered store builder." path="/features/store-builder"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "AI Store Builder",
          description: "Spin up branded client stores in minutes with Brand-Shop.AI's AI-powered store builder.",
          provider: { "@type": "Organization", name: "Brand-Shop.AI", url: "https://brand-shop.ai" },
        }} />
      <Navbar />
      <main>
        <FeatureHero
          icon={Store}
          badge="AI Store Builder"
          title="AI Store Builder: Three Ways to Launch —"
          highlight="You Choose"
          description="Let AI build it, curate it yourself, or let your client self-build within your rules. Every path is powered by AI — no coding, no design skills, no hand-holding required."
        />

        {/* 3 Distributor Options */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Three Ways to Launch Stores
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose the approach that fits your workflow. Mix and match across your client base.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {storeOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                >
                  {option.badge && (
                    <span className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      {option.badge}
                    </span>
                  )}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-5`}>
                    <option.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-3">{option.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{option.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Journey Demo */}
        <StoreBuilderJourney />

        {/* Distributor Controls Section */}
        <FeatureSection
          title="You Stay in Control"
          description="Pre-configure everything. Your clients customize within the boundaries you set."
          features={[
            {
              icon: Palette,
              title: "Theme Presets",
              description: "Create approved themes clients can choose from. Lock fonts, layouts, and brand elements.",
            },
            {
              icon: Settings,
              title: "Product Catalog",
              description: "Define which products are available. Set margins, pricing rules, and decoration options.",
            },
            {
              icon: Lock,
              title: "Lock Settings",
              description: "Prevent clients from changing critical settings while giving them creative freedom.",
            },
            {
              icon: Shield,
              title: "Brand Compliance",
              description: "Ensure every store meets your brand standards automatically.",
            },
            {
              icon: BarChart3,
              title: "Performance Tracking",
              description: "Monitor all stores from one dashboard. See sales, orders, and client activity.",
            },
            {
              icon: Store,
              title: "Unlimited Stores",
              description: "Scale to hundreds of client stores without additional management overhead.",
            },
          ]}
        />

        <FeatureCTA
          title="Ready to Simplify Store Creation?"
          description="Let your clients build their own stores while you focus on growing your business."
        />
      </main>
      <Footer />
    </div>
  );
};

export default StoreBuilder;
