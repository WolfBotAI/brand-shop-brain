import { Navbar } from "@/components/landing/Navbar";
import { SEO } from "@/components/seo/SEO";
import { Footer } from "@/components/landing/Footer";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { FeatureCTA } from "@/components/features/FeatureCTA";
import { motion } from "framer-motion";
import {
  Zap, Calendar, Palette, Clock, ShoppingBag, Rocket,
  GraduationCap, Building2, Trophy, Megaphone, ArrowRight, Store
} from "lucide-react";

const eventTypes = [
  { icon: GraduationCap, label: "Fundraisers", description: "Schools, churches, nonprofits" },
  { icon: Building2, label: "Corporate", description: "Company events & swag" },
  { icon: Trophy, label: "Team Sports", description: "Leagues, clubs, tournaments" },
  { icon: Megaphone, label: "Campaigns", description: "Launches, promos, causes" },
];

const howItWorks = [
  {
    step: "01",
    title: "Select Your Event Type",
    description: "Choose from fundraiser, corporate, team sport, or campaign templates. Each comes pre-configured with the right layout and product categories.",
  },
  {
    step: "02",
    title: "Upload Logo or Let AI Create One",
    description: "Drop in your logo or describe your brand — AI generates a polished logo and applies it across the store, mockups, and splash pages.",
  },
  {
    step: "03",
    title: "Set Dates & Launch",
    description: "Pick your start and end dates. AI builds the store instantly. When the event expires, customers see a branded splash page directing them to the main store.",
  },
];

const PopUpStores = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO title="Pop-Up Stores | Brand-Shop.AI" description="Launch time-bound branded pop-up stores for events, fundraisers, and team orders." path="/features/popup-stores"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Pop-Up Stores",
          description: "Launch time-bound branded pop-up stores for events, fundraisers, and team orders.",
          provider: { "@type": "Organization", name: "Brand-Shop.AI", url: "https://brand-shop.ai" },
        }} />
      <Navbar />

      <FeatureHero
        icon={Zap}
        badge="Pop-Up Stores"
        title="Launch Pop-Up Stores"
        highlight="in Minutes"
        description="Fundraisers, team events, corporate campaigns — spin up a branded store with a few clicks. Set it and forget it. When the event ends, customers are redirected to the main store."
        primaryCta="See How Much You Can Save"
      />

      {/* Event Types */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              A Store for <span className="text-primary">Every Event</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pre-built templates for the most common use cases — or customize your own.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {eventTypes.map((event, i) => (
              <motion.div
                key={event.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border border-border"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <event.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{event.label}</h3>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Three Steps. One Store.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From event idea to live storefront in under five minutes.
            </p>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-8">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-6 items-start"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expired Store Splash Mockup */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              When the Event Ends, <span className="text-primary">Sales Don't Stop</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expired pop-up stores show a branded splash page that redirects customers to your main store.
            </p>
          </motion.div>

          {/* Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
              <div className="bg-muted px-5 py-3 border-b border-border flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border" />
                </div>
                <span className="text-xs text-muted-foreground">lincolnhigh-fundraiser.brand-shop.ai</span>
              </div>
              <div className="p-10 text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">This Event Has Ended</h3>
                <p className="text-muted-foreground">
                  The Lincoln High Fall Fundraiser store has closed. Thank you for your support!
                </p>
                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium text-sm">
                    <Store className="w-4 h-4" />
                    Visit Our Main Store
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <FeatureSection
        title="Built for Speed & Scale"
        description="Everything you need to launch, manage, and close pop-up stores — automatically."
        features={[
          {
            icon: Zap,
            title: "Event-Type Templates",
            description: "Pre-configured layouts for fundraisers, corporate events, team sports, and campaigns.",
          },
          {
            icon: Palette,
            title: "AI Logo Generation",
            description: "No logo? No problem. Describe your brand and AI creates one instantly.",
          },
          {
            icon: Calendar,
            title: "Auto-Expiration",
            description: "Set start and end dates. The store goes live and closes automatically.",
          },
          {
            icon: ShoppingBag,
            title: "Full Catalog Access",
            description: "Products from S&S, SanMar, and your connected suppliers — available instantly.",
          },
          {
            icon: Rocket,
            title: "Instant Deployment",
            description: "AI builds the store in seconds. Share the link and start selling.",
          },
          {
            icon: Store,
            title: "Branded Splash Redirect",
            description: "When the event ends, customers see a branded page directing them to your main store.",
          },
        ]}
        reversed
      />

      <FeatureCTA
        title="Launch Your First Pop-Up Store"
        description="Give your clients time-limited branded stores for any event — with zero effort."
      />

      <Footer />
    </div>
  );
};

export default PopUpStores;
