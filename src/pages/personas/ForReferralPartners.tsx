import { motion } from "framer-motion";
import { SEO } from "@/components/seo/SEO";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import {
  Users, Store, Tag, DollarSign, ArrowRight, Megaphone, Palette, TrendingUp,
  Rocket, Globe, Phone, MessageSquare, Share2, Search, Star, Repeat
} from "lucide-react";

const whoThisIsFor = [
  { icon: Rocket, label: "Entrepreneurs" },
  { icon: Megaphone, label: "Agencies" },
  { icon: Users, label: "Micro & Macro Influencers" },
  { icon: TrendingUp, label: "Industry Leaders with an Audience" },
];

const valueProps = [
  {
    icon: Store,
    title: "B2B Merch Stores for Any Vertical",
    description: "Offer branded online stores to your clients and audience — corporate, schools, sports, nonprofits, and more.",
  },
  {
    icon: Palette,
    title: "Decorated Apparel at Case Pricing",
    description: "One-off items and decorated apparel at wholesale case pricing. No minimums headaches.",
  },
  {
    icon: Tag,
    title: "White-Label Under Your Brand",
    description: "Full white-label access to the platform — your logo, your domain, your client relationship. We stay invisible.",
  },
  {
    icon: DollarSign,
    title: "Up to 40% Commissions",
    description: "Earn up to 40% on all apparel sold through your stores.",
  },
  {
    icon: Repeat,
    title: "Recurring Monthly Revenue",
    description: "Earn up to 40% on the monthly subscriptions your clients pay — income that keeps arriving after the sale.",
  },
  {
    icon: Users,
    title: "Zero Inventory, Zero Fulfillment",
    description: "We source, decorate, and ship. You keep the relationship and the commission.",
  },
];

const acquisitionStack = [
  {
    icon: Globe,
    title: "Custom Acquisition Website",
    description: "A full website built for you and branded to you — designed to bring in and convert your own clients.",
  },
  {
    icon: Phone,
    title: "AI Voice",
    description: "Answers your calls and texts, books appointments, tracks orders, takes messages, and transfers calls when needed.",
  },
  {
    icon: MessageSquare,
    title: "AI Chat",
    description: "24/7 chat on your site and stores that answers questions and captures leads while you sleep.",
  },
  {
    icon: Share2,
    title: "AI Social",
    description: "Content and inbound Facebook and Instagram Messenger handled for you, so your channels stay active.",
  },
  {
    icon: Search,
    title: "AI SEO",
    description: "Ongoing search optimization so the clients looking for branded merch find you first.",
  },
  {
    icon: Star,
    title: "AI Reputation",
    description: "Review requests and responses managed automatically to build the trust that closes deals.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const ForReferralPartners = () => {
  return (
    <div className="min-h-screen">
      <SEO title="Referral Partner Program: Up to 40% on Merch & Subscriptions | Brand-Shop.AI" description="Entrepreneurs, agencies, and influencers get white-label B2B merch stores, up to 40% commissions on apparel and recurring subscriptions, plus a full AI acquisition stack." path="/for/referral-partners" />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              White-Label B2B Merch Storefront Software for Partners.{" "}
              <span className="text-primary">Earn Up to 40% While You Grow.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg md:text-xl text-secondary-foreground/70 max-w-2xl mx-auto mb-8"
            >
              Entrepreneurs, agencies, and influencers get white-label access to our platform — offer B2B merch
              stores to your clients and earn up to 40% on apparel and monthly recurring subscriptions.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button asChild size="lg" className="text-base">
                <Link to="/assessment">See How Much You Can Save <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Who This Is For */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-12"
            >
              Who This Is For
            </motion.h2>
            <div className="flex flex-wrap justify-center gap-6 max-w-2xl mx-auto">
              {whoThisIsFor.map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-center gap-3 bg-muted rounded-full px-6 py-3"
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-4"
            >
              Why <span className="text-primary">Partner</span> With Us
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
            >
              Everything you need to offer branded stores — nothing to manage.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {valueProps.map((prop, i) => (
                <motion.div
                  key={prop.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="border border-border rounded-xl p-6 bg-card"
                >
                  <prop.icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{prop.title}</h3>
                  <p className="text-muted-foreground text-sm">{prop.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Acquisition Stack */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-4"
            >
              We Help You <span className="text-primary">Win the Clients</span>, Too
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
            >
              Every partner gets the full acquisition stack — branded to you, working for your clients.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {acquisitionStack.map((item, i) => (
                <motion.div
                  key={item.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="border border-border rounded-xl p-6 bg-card"
                >
                  <item.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>



        {/* CTA */}
        <section className="py-20 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Ready to Start Earning?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-secondary-foreground/70 mb-8 max-w-lg mx-auto"
            >
              Take a quick assessment and see how the referral partner program works for you.
            </motion.p>
            <Button asChild size="lg" className="text-base">
              <Link to="/assessment">See How Much You Can Save <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ForReferralPartners;
