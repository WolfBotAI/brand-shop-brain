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
  Zap,
  Globe,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const standaloneProducts = [
  {
    icon: MessageSquare,
    title: "AI Chat & Voice Agent",
    tagline: "Add to Any Website",
    description: "Deploy our 24/7 AI assistant on your existing website, app, or platform. No migration needed.",
    features: ["Embeddable widget", "Voice + text support", "Works with any tech stack", "Custom branding"],
    gradient: "from-accent to-accent/60",
    cta: "Get the Widget",
  },
  {
    icon: Eye,
    title: "AI Vision Agent",
    tagline: "Standalone Solution",
    description: "Eliminate manual data entry. Our AI reads handwriting, PDFs, emails, and images — integrates with any system.",
    features: ["No platform change required", "API integration", "Learns your formats", "99%+ accuracy"],
    gradient: "from-primary to-primary/60",
    cta: "Try Vision AI",
  },
];

const platformFeatures = [
  {
    icon: Store,
    title: "AI-Powered Store Builder",
    description: "Your clients build stores themselves — guided by AI",
    details: [
      "Step-by-step guided onboarding with AI chat/voice",
      "Product selection, color/size customization",
      "Theme presets and custom branding",
      "Go live in minutes, not weeks"
    ],
    gradient: "from-primary to-primary/60",
  },
  {
    icon: Route,
    title: "Smart Order Routing",
    description: "One order, infinite routing options",
    details: [
      "Route to multiple decorators/suppliers",
      "Assign by product, region, or capacity",
      "Automatic or manual override",
      "Real-time sync status"
    ],
    gradient: "from-accent to-primary",
  },
  {
    icon: Users,
    title: "Customer Acquisition Engine",
    description: "Find buyers. Learn personalities. Convert automatically.",
    details: [
      "AI creates buyer avatars",
      "100s of ad variations testing",
      "19+ advertising channels",
      "DISC personality-based outreach"
    ],
    gradient: "from-primary to-primary/60",
  },
  {
    icon: BarChart3,
    title: "Distributor BI Dashboard",
    description: "Complete visibility into every store's performance",
    details: [
      "Revenue, orders, customer insights",
      "Per-store analytics",
      "Margin controls & shipping settings",
      "Tax integration with TaxJar"
    ],
    gradient: "from-accent to-accent/60",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const Features = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        {/* Standalone Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent mb-6">
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">Works Anywhere</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            AI That Goes{" "}
            <span className="text-accent">Where You Are</span>
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
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24"
        >
          {standaloneProducts.map((product) => (
            <motion.div
              key={product.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative rounded-2xl p-8 h-full bg-secondary text-secondary-foreground overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                
                {/* Badge */}
                <div className="relative inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                  <Sparkles className="w-3 h-3" />
                  {product.tagline}
                </div>

                {/* Icon */}
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <product.icon className="w-8 h-8 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="relative text-2xl font-bold text-secondary-foreground mb-3">
                  {product.title}
                </h3>
                <p className="relative text-secondary-foreground/80 mb-6 text-lg">
                  {product.description}
                </p>

                {/* Features */}
                <div className="relative grid grid-cols-2 gap-3 mb-8">
                  {product.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-secondary-foreground/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button 
                  className="relative bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 shadow-glow btn-glow"
                >
                  {product.cta}
                </Button>
              </div>
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
          <div className="glass-card rounded-2xl p-8 md:p-12 text-center">
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
                <div key={channel.label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
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
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Full Platform Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Or Get the{" "}
            <span className="text-primary">Complete Solution</span>
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
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="glass-card rounded-2xl p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-primary font-medium text-sm mb-3">
                  {feature.description}
                </p>

                {/* Details */}
                <ul className="space-y-1.5">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>

                {/* Hover gradient border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
