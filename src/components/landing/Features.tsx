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
  Zap
} from "lucide-react";

const features = [
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
    icon: MessageSquare,
    title: "Multi-Channel AI Support",
    description: "Your clients get 24/7 support. You focus on growth.",
    details: [
      "Chat, Phone, Email, SMS — one brain",
      "Real-time shipment tracking",
      "Instant customer support",
      "DISC personality-aware responses"
    ],
    gradient: "from-accent to-accent/60",
    channels: [
      { icon: MessageCircle, label: "Chat" },
      { icon: Phone, label: "Phone" },
      { icon: Mail, label: "Email" },
      { icon: MessageSquare, label: "SMS" },
    ]
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
    gradient: "from-primary to-accent",
  },
  {
    icon: Eye,
    title: "AI Vision PO Processing",
    description: "Stop paying humans to type. Let AI read anything.",
    details: [
      "Reads emails, PDFs, images, handwriting",
      "Extracts order data automatically",
      "Integrates with Printavo, DecoNetwork",
      "Learns and improves over time"
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
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Everything You Need</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            One Platform.{" "}
            <span className="text-primary">Complete Solution.</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Replace spreadsheets, chaos, and disconnected tools with the most intelligent 
            e-commerce ecosystem for apparel distributors.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="glass-card rounded-2xl p-8 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-primary font-medium mb-4">
                  {feature.description}
                </p>

                {/* Channel Icons (for Multi-Channel feature) */}
                {feature.channels && (
                  <div className="flex gap-3 mb-4">
                    {feature.channels.map((channel) => (
                      <div 
                        key={channel.label}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <channel.icon className="w-5 h-5 text-accent" />
                        </div>
                        <span className="text-xs text-muted-foreground">{channel.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Details */}
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
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
