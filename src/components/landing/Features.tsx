import { motion } from "framer-motion";
import { 
  Store, 
  MessageSquare, 
  Route, 
  Eye, 
  Users, 
  BarChart3,
  Phone,
  Mail,
  MessageCircle,
  Globe,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const standaloneProducts = [
  {
    icon: MessageSquare,
    title: "AI Chat & Voice Agent",
    tagline: "Works on Any Website",
    description: "Deploy our 24/7 AI assistant on your existing website, app, or platform. No migration needed.",
    features: ["Embeddable widget", "Voice + text support", "Any tech stack", "Custom branding"],
    link: "/features/ai-support",
  },
  {
    icon: Eye,
    title: "AI Vision Agent",
    tagline: "Standalone Solution",
    description: "Eliminate manual data entry. Our AI reads handwriting, PDFs, emails, and images — integrates with any system.",
    features: ["No platform change", "API integration", "Learns formats", "99%+ accuracy"],
    link: "/features/ai-vision",
  },
];

const platformFeatures = [
  {
    icon: Store,
    title: "AI Store Builder",
    description: "Clients build stores themselves — guided by AI",
    link: "/features/store-builder",
  },
  {
    icon: Route,
    title: "Smart Order Routing",
    description: "One order, infinite routing options",
    link: "/features/order-routing",
  },
  {
    icon: Users,
    title: "Acquisition Engine",
    description: "Find buyers. Learn personalities. Convert.",
    link: "/features/acquisition",
  },
  {
    icon: BarChart3,
    title: "Distributor Dashboard",
    description: "Complete visibility into every store",
    link: "/features/dashboard",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Standalone Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">Works Anywhere</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            AI That Goes Where You Are
          </h2>
          <p className="text-xl text-muted-foreground">
            Don't want the full platform? Our AI Chat, Voice, and Vision agents work as 
            standalone solutions on <strong>any website or system</strong>.
          </p>
        </motion.div>

        {/* Standalone Products Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20"
        >
          {standaloneProducts.map((product) => (
            <motion.div key={product.title} variants={itemVariants}>
              <Link to={product.link} className="block h-full">
                <div className="rounded-2xl p-8 h-full bg-card border border-border hover:border-primary/30 transition-colors">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    {product.tagline}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-6">
                    <product.icon className="w-7 h-7 text-secondary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {product.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    {product.description}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {product.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <span className="inline-flex items-center text-primary font-medium">
                    Explore {product.title} <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Multi-Channel Support Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-24"
        >
          <div className="rounded-2xl p-8 md:p-12 text-center bg-muted border border-border">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              One AI Brain. Every Channel.
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether on our platform or yours, the AI maintains unified memory across all channels. 
              Your customers get consistent, intelligent support everywhere.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {[
                { icon: MessageCircle, label: "Chat Widget", desc: "Any website" },
                { icon: Phone, label: "Voice Calls", desc: "Phone support" },
                { icon: Mail, label: "Email", desc: "Auto-responses" },
                { icon: MessageSquare, label: "SMS", desc: "Text support" },
              ].map((channel) => (
                <div key={channel.label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background border border-border">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <channel.icon className="w-6 h-6 text-accent" />
                  </div>
                  <span className="font-semibold text-foreground">{channel.label}</span>
                  <span className="text-xs text-muted-foreground">{channel.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Platform Features Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Or Get the Complete Solution
          </h2>
          <p className="text-xl text-muted-foreground">
            For distributors who want everything — acquisition, store creation, 
            order routing, and AI support in one unified platform.
          </p>
        </motion.div>

        {/* Platform Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {platformFeatures.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Link to={feature.link} className="block h-full">
                <div className="rounded-2xl p-6 h-full bg-card border border-border hover:border-primary/30 transition-colors">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-secondary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {feature.description}
                  </p>

                  <span className="inline-flex items-center text-primary text-sm font-medium">
                    Explore {feature.title} <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
