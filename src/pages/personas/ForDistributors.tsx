import { motion } from "framer-motion";
import { SEO } from "@/components/seo/SEO";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import {
  Store, ArrowRightLeft, MessageSquare, Phone, ShieldCheck,
  BarChart3, Layout, Bot, ArrowRight, AlertTriangle, Globe, Bell,
  Tags, Boxes, Plug
} from "lucide-react";

const painPoints = [
  {
    icon: Store,
    title: "Too Many Stores, Too Many Platforms",
    description: "Your clients' websites live on a different platform each — Shopify here, WordPress there, a homegrown store somewhere else. There's no single place to see or manage them.",
  },
  {
    icon: Layout,
    title: "You Build and Maintain Them Yourself",
    description: "Every client site is yours to design, launch, and babysit. New logo, new landing page, broken checkout — it all lands on your desk.",
  },
  {
    icon: Tags,
    title: "Pricing and Catalog Upkeep Never Ends",
    description: "Supplier prices move, styles get discontinued, colors sell out. Keeping pricing and catalogs current across every store is a full-time job nobody wants.",
  },
  {
    icon: Boxes,
    title: "A Different Portal for Every Supplier",
    description: "Ordering means jumping between supplier sites and vendor portals, each with its own logins, formats, and lead times — then reconciling it all by hand.",
  },
  {
    icon: ArrowRightLeft,
    title: "Forwarding POs All Day",
    description: "Every order means creating and forwarding POs to the right supplier and decorator. It's tedious, error-prone, and eats your day.",
  },
  {
    icon: MessageSquare,
    title: "Drowning in Status Requests",
    description: "Customers call, email, and text asking 'Where's my order?' — then you chase decorators for updates you don't have.",
  },
  {
    icon: AlertTriangle,
    title: "Everyone's Frustrated",
    description: "Customers can't get answers. Decorators are overwhelmed. And you're stuck in the middle trying to hold it all together.",
  },
];

const solutions = [
  {
    icon: Layout,
    title: "AI-Managed Stores",
    description: "Centralize all client stores in one place. AI creates, updates, and manages them — or give clients access to preconfigured stores with your pricing, or let them build their own from catalogs like S&S, SanMar, and more.",
  },
  {
    icon: Tags,
    title: "Pricing & Catalog on Autopilot",
    description: "Catalogs and pricing stay current automatically across every store. Set your markup rules once and every client site reflects them — no manual updates, no stale styles.",
  },
  {
    icon: Plug,
    title: "Connected to Every Supplier & Decorator",
    description: "We connect to all the major suppliers and to virtually any decorator — including the ones still running their shop off spreadsheets. One workflow instead of a dozen portals.",
  },
  {
    icon: Globe,
    title: "AI Website Assistant",
    description: "Embedded chat on every store provides 24/7 support — tracking requests, return/refund info based on your guidelines, and product recommendations by price, brand, and material.",
  },
  {
    icon: Phone,
    title: "AI Voice Receptionist",
    description: "Answers calls and texts around the clock with order tracking and product info, resolves support issues like returns, takes messages, and transfers calls to the right person when it needs to.",
  },
  {
    icon: Bot,
    title: "AI Support Agent",
    description: "Handles the same requests via text, email, Facebook Messenger, and Instagram Messenger — all trained on your company, clients, brand, and goals. 24/7 omnichannel support.",
  },
  {
    icon: ArrowRightLeft,
    title: "Intelligent Order Routing",
    description: "Orders automatically route to the right suppliers and decorators — even splitting items from a single order across multiple vendors.",
  },
  {
    icon: Bell,
    title: "Proactive Status Updates",
    description: "Both AI agents proactively send order updates to you and your clients via the portal, dashboard, email, and text. If a decorator hasn't updated status, AI reaches out to them automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Certified Decorator Network",
    description: "Vetted decorators integrated into our systems. Reviewed and certified for communication, tracking, quality, and system integration — so AI can provide real-time updates.",
  },
];

const whatYouGet = [
  "White-labeled distributor agency account",
  "Agency-level reporting & analytics dashboard",
  "AI-managed web stores for all your clients",
  "AI Website Assistant + AI Support Agent for 24/7 omnichannel support",
  "Proactive order tracking and status updates",
];

const addOns = ["Order Routing", "AI Vision", "Site Migration"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const ForDistributors = () => {
  return (
    <div className="min-h-screen">
      <SEO title="Brand-Shop.AI for Distributors | Brand-Shop.AI" description="Win more B2B clients and automate fulfillment. Brand-Shop.AI gives distributors AI store building, order routing, and reporting in one platform." path="/for/distributors" />
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
              Centralize Your Stores.{" "}
              <span className="text-primary">Automate Everything Else.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg md:text-xl text-secondary-foreground/70 max-w-2xl mx-auto mb-8"
            >
              AI manages your client stores, routes orders to the right suppliers and decorators, 
              and provides 24/7 support across every channel — so you can focus on growing.
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

        {/* Pain Points */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-4"
            >
              Sound Familiar?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
            >
              These are the daily headaches distributors tell us about.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {painPoints.map((point, i) => (
                <motion.div
                  key={point.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="border border-border rounded-xl p-6 bg-card"
                >
                  <point.icon className="w-8 h-8 text-destructive mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                  <p className="text-muted-foreground text-sm">{point.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-4"
            >
              How We <span className="text-primary">Solve It</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
            >
              AI agents that work 24/7 so you don't have to.
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {solutions.map((sol, i) => (
                <motion.div
                  key={sol.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="border border-border rounded-xl p-6 bg-card"
                >
                  <sol.icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{sol.title}</h3>
                  <p className="text-muted-foreground text-sm">{sol.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-12"
            >
              What You Get
            </motion.h2>
            <div className="space-y-4 mb-10">
              {whatYouGet.map((item, i) => (
                <motion.div
                  key={item}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-center gap-3 bg-muted rounded-lg p-4"
                >
                  <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Available Add-ons</p>
              <div className="flex flex-wrap justify-center gap-2">
                {addOns.map((a) => (
                  <span key={a} className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">{a}</span>
                ))}
              </div>
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
              Ready to Centralize & Automate?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-secondary-foreground/70 mb-8 max-w-lg mx-auto"
            >
              Take a quick assessment and see how Brand-Shop.AI can automate your distributor operations.
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

export default ForDistributors;
